var userFish = {};

function showBalance(balance) {
    fish = "";
    try {
        for (let usr in balance) {
            color = (balance[usr] >= 0) ? "white" : "#F39C12";
            fish += `
        <tr>
            <td class="setfish-user"> ${usr} </td>
            <td class="embed-alert" align="center"> <span class="setfish-balance" style="color: ${color};">${balance[usr]}</span> </td>
            <td> <input type="number" class="addfish" placeholder="±$" style="width:50px;"> </td>
            <td> <button class="setfish-button"> 修改 </button> </td>
        </tr>
    `;
        }
        // <td> <input type="number" min="0" class="rmvfish" placeholder="$" style="width:50px;"> </td>
        document.getElementById("admin-setfish-table").innerHTML = fish;
    } catch (err) {
        console.error(err);
    }
}

function changeFishDisplay(client, item) {
    document.getElementsByClassName("setfish-balance")[item].style.color = (userFish[client] >= 0) ? "white" : "red";
    document.getElementsByClassName("setfish-balance")[item].innerText = userFish[client];
}

function modifyUserFish(client, $$) {
    userFish[client] = parseInt($$);
    // console.log(userFish);
}

function setfish() {
    var setfishButton = document.getElementsByClassName("setfish-button");
    var addf = document.getElementsByClassName("addfish");
    // var rmvf = document.getElementsByClassName("rmvfish");
    for (let i = 0; i < setfishButton.length; i++) {
        setfishButton[i].addEventListener("click", () => {
            let ics = (addf[i].value == "") ? 0 : parseInt(addf[i].value);
            // let dcs = (rmvf[i].value == "")?0:parseInt(rmvf[i].value);
            let usr = document.getElementsByClassName("setfish-user")[i].innerText;
            // console.log("ics:", ics, "dcs:", dcs);
            $$$$ = parseInt(userFish[usr]) + ics;
            // console.log($$$$);
            addf[i].value = "";
            // rmvf[i].value = "";
            // 把(ics-dcs)傳給server修改user.js && 回傳user.js資料
            socket.emit('setfish', usr, $$$$, (res) => {
                if (res.status == 0) {
                    modifyUserFish(usr, $$$$);
                    changeFishDisplay(usr, i);
                } else {
                    // alert("錯誤！請聯繫管理員！");
                    Swal.fire({
                        icon: 'error',
                        title: '修改失敗',
                        text: `請重整頁面以確認`,
                        confirmButtonText: '確定'
                    });
                }
            });

            // 修改介面上顯示
            // 注意! 請務必先修改資料再回傳以保證資料與伺服器端是同步的
            // 一方面是為了安全 一方面是為了一隻帳號多個裝置

            // client在登入時出現
            // userFish[client] = server傳過來的資料

        });
    }
}

//main
document.getElementById("admin-setfish-btn").addEventListener("click", () => {
    if (account == "") alert("你是如何走到這的？");
    socket.emit('showUsr', account, (res) => {
        userFish = res;
        // console.log(userFish);
        showBalance(userFish);
        setfish();
    });
});

/*
// userFish <- user.json
// 26~42為執行"顯示"的功能
fish = "";
for(let i in userFish){
    color = (userFish[i].balance>=0)?"white":"red";
    fish += `
        <tr>
            <td class="setfish-user"> ${i} </td>
            <td> [<span class="setfish-balance" style="color: ${color};">${userFish[i].balance}</span>] </td>
            <td> <input type="number" min="0" class="addfish" placeholder="+ $" style="width:50px;"> </td>
            <td> <input type="number" min="0" class="rmvfish" placeholder="- $" style="width:50px;"> </td>
            <td> <button class="setfish-button"> submit </button> </td>
        </tr>
    `;
}
document.getElementById("admin-setfish-table").innerHTML = fish;
*/

/*
var setfishButton = document.getElementsByClassName("setfish-button");
var addf = document.getElementsByClassName("addfish");
var rmvf = document.getElementsByClassName("rmvfish");
for(let i=0; i<setfishButton.length; i++){
    setfishButton[i].addEventListener("click", () => {
        let ics = (addf[i].value == "")?0:parseInt(addf[i].value);
        let dcs = (rmvf[i].value == "")?0:parseInt(rmvf[i].value);
        console.log("ics:", ics, "dcs:", dcs);
        $$$$ = parseInt(userFish[document.getElementsByClassName("setfish-user")[i].innerText].balance) + ics - dcs;
        console.log($$$$);
        addf[i].value = "";
        rmvf[i].value = "";
        // 把(ics-dcs)傳給server修改user.js
        // 回傳user.js資料
        // 修改介面上顯示
        // 注意! 請務必先修改資料再回傳以保證資料與伺服器端是同步的
        // 一方面是為了安全 一方面是為了一隻帳號多個裝置

        // client在登入時出現
        // userFish[client] = server傳過來的資料
        modifyUserFish(document.getElementsByClassName("setfish-user")[i].innerText, $$$$);
        changeFishDisplay(document.getElementsByClassName("setfish-user")[i].innerText, i);
    });
}
*/