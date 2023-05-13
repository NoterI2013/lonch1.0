const { create } = require("domain");
const fs = require("fs");

const restaurantURL = "./v2.3.2/JSON/restaurant.json";
const userURL =  "./v2.3.2/JSON/user.json";
const orderPURL = "./v2.3.2/JSON/orderP.json";
const orderOURL = "./v2.3.2/JSON/orderO.json";
const actStateURL = "./v2.3.2/JSON/actState.json";
const lonchURL = "./v2.3.2/JSON/lonch.json";
const sha256URL = "./v2.3.2/JS/modules/sha256.js";
var restaurants = JSON.parse(fs.readFileSync(restaurantURL, "utf-8"));
var users = JSON.parse(fs.readFileSync(userURL, "utf-8"));
var orderPs = JSON.parse(fs.readFileSync(orderPURL, "utf-8"));
var orderOs = JSON.parse(fs.readFileSync(orderOURL, "utf-8"));
var nowstate = JSON.parse(fs.readFileSync(actStateURL, "utf-8"));
var lonch = JSON.parse(fs.readFileSync(lonchURL, "utf-8"));
var debitFLAG = false;
eval(fs.readFileSync(sha256URL, "utf-8")); // sha256(string) : function

function saveJson (jsonF, data){
    let dataStr = JSON.stringify(data);
    fs.writeFileSync(jsonF, dataStr, "utf-8");
}

function $register (name, password) {
    try {
        users[name].balance;
        return 1;
    } catch (err) {
        if (name.includes(' ')) {
            return 2;
        }
        users[name] = {
            "balance": 0,
            "password": sha256(password),
            "admin": false
        }
        saveJson(userURL, users);
        return 0;
    }
}

function $logAs (name, password) {
    //    logAs [LinYoung | admin]
    try {
        // console.log(sha256(password));
        if(users[name].password == sha256(password) ){
            return users[name].admin;
        } else {
            // console.error("Invalid password!\n");
            return 2;
        }
    } catch (err) {
        // console.error("You don't have an account!\n");
        return -1;
    }
}

function $autoLogAs (name) {
    try {
        return users[name].admin;
    } catch (err) {
        return -1;
    }
}

function $restaurantDB () {
    try {
        let restList = {};
        
        for (const key in restaurants) {
            restList[key] = restaurants[key].name;
        }

        return restList;
    } catch (err) {}
}

function $fetchRestaurant () {
    try {
        return nowstate;
    } catch (err) {
        return { status: unpost };
    }
}

function $post(rest){
    try {
        nowstate = { status : "post" };
        nowstate = Object.assign(restaurants[rest], nowstate);
        saveJson(actStateURL, nowstate);
        // console.log(nowstate);
        return 0;
    }
    catch(err) { return -1; }
}

function order (cuisine, client) { 
  // cuisine is an array from html: ["cuisine_name", cuisine_price]
    try {
        orderOs[cuisine[0]].users.push(client);
        // console.log("outside:", orderOs);
        saveJson(orderOURL, orderOs);
    } catch (err) {
        orderOs[cuisine[0]] = {
            "users": [client],
            "price": cuisine[1]
        };
        // console.log("inside:", orderOs);
        saveJson(orderOURL, orderOs);
    }
    try {
        orderPs[client].order.push(cuisine[0]);
        orderPs[client].price.push(cuisine[1]);
        saveJson(orderPURL, orderPs);
    } catch (err) {
        orderPs[client] = {
            order: [cuisine[0]],
            price: [cuisine[1]]
        };
        saveJson(orderPURL, orderPs);
    }
}

function $order (queue, client) {
    try{
        for(let arr of queue) order(arr, client);
        return 0;
    } catch(err){
        return 1;
    }
}

function dorder (cuisine, client) { // cuisine is an array from html: ["cuisine_name", cuisine_price]
    try {
        let idx = orderOs[cuisine[0]].users.indexOf(client);
        if(idx == -1) {
            console.warn("orderO can't find", client, "in", cuisine[0]);
            return -1;
        }
        orderOs[cuisine[0]].users.splice(idx, 1);
        if(orderOs[cuisine[0]].users.length == 0) delete orderOs[cuisine[0]];
        saveJson(orderOURL, orderOs);
    } catch (err) {
        return 1;
    }
    try {
        let idx = orderPs[client].order.indexOf(cuisine[0]);
        if(idx == -1) {
            console.warn("orderP can't find", cuisine[0], "in", client);
            return -1;
        }
        orderPs[client].order.splice(idx, 1);
        orderPs[client].price.splice(idx, 1);
        if(orderPs[client].order.length == 0) delete orderPs[client];
        saveJson(orderPURL, orderPs);
        return orderPs[client];
    } catch (err) {
        return 1;
    }
}

function $dorder (queue, client) {
    try {
        for(let arr of queue) dorder(arr, client);
        return 0;
    } catch(err) {
        return 1;
    }
}

function $balance (client) {
    try{
        return users[client].balance;
    } catch(err) {
        return -1;
    }
}

function $addBalance (client, $$) {
    users[client].balance += $$;
    saveJson(userURL, users);
}

function $rmvBalance (client, $$) {
    users[client].balance -= $$;
    saveJson(userURL, users);
}

function $setBalance(client, amount){
    try{
        users[client].balance = amount;
        saveJson(userURL, users);
        return 0;
    } catch(err) {
        return -1;
    }
}

function $showUsrOrder (client){
    try{
        if(orderPs[client].order == []) return 2;
        return orderPs[client];
    } catch (err){
        return {"order" : -1};
    }
}

function $showUsrFish(){
    try{
        let res = {};
        for(let usr in users) res[usr] = users[usr].balance;
        return res;
    } catch(err) {
        return 1;
    }
}

function $isAdmin(client){
    try{
        if(users[client].admin == true) return true;
        else return false;
    } catch(err){
        return -1;
    }
}

function $export(){
    try{
        res = {};
        res["order"] = {};
        var total = 0;
        for(let obj in orderOs){
            res["order"][obj] = orderOs[obj].users.length;
            total += orderOs[obj].users.length * orderOs[obj].price;
        }
        res["sum"] = total;
        return res;
    }catch (err){
        console.warn('Export_Failed', err);
        return {"sum": -1};
    }
}

function $detail(){
    try{
        lonch = $export();
        lonch["details"] = {};
        for(let usr in orderPs){
            lonch["details"][usr] = [0];
            var totalOwe = 0;
            for(let i=1; i<=orderPs[usr].price.length; i++){
                totalOwe += parseInt(orderPs[usr].price[i-1]);
                lonch["details"][usr].push(orderPs[usr].order[i-1]);
            }
            lonch["details"][usr][0] = totalOwe;
        }
        saveJson(lonchURL, lonch);
        return lonch;
    }catch(err){
        console.warn('Detail_Failed', err);
        return {"sum": -1};
    }
}

function $stopOrder(){
    try{
        nowstate["status"] = "checkout";
        saveJson(actStateURL, nowstate);
    }catch(err){
        console.warn('Stop_order_Failed', err);
    }
}

async function backup (timing, options, mode)
{
    /**
     * @usage
     * 1. make a dir named with time stamp
     * 2. generate files in the folder
     * 3. delete old folder
     * 
     * @options
     * ["fileName1", "fileName2", ...]
     */

    const normaltimestamp = new Date();
    const timestamp = new Date(normaltimestamp.getTime() + 8*60*60*1000).toISOString().replace(/:/g, '.');
    const dataDir = './v2.3.2/JSON';
    const historyDir = './v2.3.2/JSON/history';
    const destinationDir = `${historyDir}/#${timing}-@${timestamp}`;
    await fs.promises.mkdir(destinationDir);
    options.forEach(async file => {
        const targetFile = await fs.promises.readFile(`${dataDir}/${file}.json`, 'utf-8');
    
        const fileName = `${destinationDir}/${file}.txt`;
        await fs.promises.writeFile(fileName, targetFile, 'utf-8');
    });
    if (["create", "Create", "CREATE", 0].includes(mode)) return;
    const historyList = await fs.promises.readdir(`${historyDir}/`);
    const removeTargetDir = `${historyDir}/${historyList.filter( dir => dir.startsWith(`#${timing}`))[0]}`;
    const fileList = await fs.promises.readdir(removeTargetDir);
    fileList.forEach(fileName => fs.unlinkSync(`${removeTargetDir}/${fileName}`));
    await fs.promises.rmdir(removeTargetDir);
}

// debitFLAG true => 正在執行扣款
function $debit(){
    if (!debitFLAG){
        debitFLAG = true;
        try{
            nowstate["status"] = "debit";
            for(let usr in lonch["details"]){
                users[usr].balance = parseInt(users[usr].balance) - parseInt(lonch["details"][usr][0]);
            }
            // console.log(nowstate);
            saveJson(actStateURL, nowstate);
            saveJson(userURL, users);
        }catch(err){
            console.error("FAILED");
            debitFLAG = false;
            return 1;
        }
        // console.log("before backup");
        backup("debit", ["user", "lonch"], "normal");
        // console.log("after backup");
        
    }
    debitFLAG = false;
    // console.log(5, debitFLAG);
    return 0;
}

async function $cleanOrder () {
    await backup("depost", ["user", "lonch", "orderO", "orderP"], "normal");
    orderOs = {};
    orderPs = {};
    lonch = {};
    nowstate = {status: "unpost"};
    saveJson(orderOURL, orderOs);
    saveJson(orderPURL, orderPs);
    saveJson(lonchURL, lonch);
    saveJson(actStateURL, nowstate);
}