const http = require("http");
const { Server } = require("socket.io");
const express = require('express');
const session = require('express-session');
const fs = require("fs");
const FileStore = require('session-file-store')(session);

// console.log(process.env['SESSION_SECRET']);

// middleware declaration
const sessionMiddleware = session({
    secret: process.env['SESSION_SECRET'],
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800_000
    },
    store: new FileStore({
        path : "./v2.3.2/session/",
        ttl : 604800,
    }),
});

// server configuraion
const app = express();
app.use(express.static(__dirname + '/v2.3.2'));
app.use(sessionMiddleware);

// modules import
const $actionURL = "./v2.3.2/JS/modules/$actions.js";
eval(fs.readFileSync($actionURL, "utf-8"));

const io = new Server({});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/v2.3.2/HTML/index.html");
})

var server = http.createServer(app);
server.listen(5001, () => {
    console.log('\n伺服器已開啟 (Express success)\n');
})

var servIo = io.listen(server);

servIo.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

servIo.on('connection', function(socket) {

    // console.log("cookies\n", socket.request.headers.cookie);
    const sessionId = socket.request.sessionID;
    // console.log("session id:", sessionId);

    // login automatically via cookie
    var sessionPath = socket.request.session;
    if (sessionPath.hasOwnProperty('state')) {
        if(sessionPath["state"].hasOwnProperty('useracc')){
            var autoLogAcc = sessionPath.state.useracc
            // console.log("try to autoLog:", autoLogAcc);
            var autoLogAS = $autoLogAs (autoLogAcc);
            if (autoLogAS != -1){
                socket.emit('autoLog', autoLogAcc, autoLogAS);
            }
        }
    }
    
    // console.log(socket.request.session, '\n');

    socket.emit('restaurantDB', $restaurantDB());

    //login
    socket.on('login', (acc, pw, uuid, callback) => {
        // console.log("raw input:", acc, pw, uuid);
        var admin = $logAs(acc, pw);
        if(admin != 2 && admin != -1){
            // console.log(socket.request.sessionID);
            socket.request.session.state = {};
            socket.request.session.state.clientid = uuid;
            socket.request.session.state.useracc = acc;
            // cookie expires in half a day
            socket.request.session.state._expires = new Date(Date.now() + 604800_000);
            socket.request.session.save();
            // console.log(socket.request.session);
        }
        res = { status: admin, account: acc };
        callback(res);
    });

    //logout
    socket.on('logout', (acc, callback) => {
        // console.log("user logout", acc);
        // socket.request.session.state.useracc = null;
        // console.log(typeof(socket.request.session.state.useracc));
        // socket.request.session.cookie._expires = "Thu, 01 Jan 1970 00:00:00 UTC" ;
        delete socket.request.session.state;
        socket.request.session.save();
        // console.log(socket.request.session);
    });

    //checkorder
    socket.on('checkorder', (acc, callback) => { 
        var res = $showUsrOrder(acc);
        callback(res);
    });

    //fetch restaurant
    socket.on('fetchRestToday', (callback) => {
        var res = $fetchRestaurant();
        callback(res);
    });

    //order
    socket.on('order', (queue, usr, callback) => {
        var res = $order(queue, usr);
        callback({ status: res });
    });

    //dorder
    socket.on('dorder', (cuisine, usr, callback) => {
        var res = dorder(cuisine, usr);
        callback({ status: res });
    });

    //fish
    socket.on('fish', (acc, callback) => {
        var res = $balance(acc);
        callback({ balance: res });
    });

    //admin-show fish
    socket.on('showUsr', (acc, callback) => {
        if ($isAdmin(acc) == true) {
            var res = $showUsrFish();
            callback(res);
        }
    });

    //admin-set fish
    socket.on('setfish', (acc, amount, callback) => {
        var res = $setBalance(acc, amount);
        callback({ status: res });
    });

    //admin-export
    socket.on('export', (admin, callback) => {
        var res = $export();
        callback(res);
    })

    //admin count
    socket.on('adminCount', (admin, callback) => {
        var res = $detail();
        $stopOrder();
        callback(res);
        servIo.emit('stopOrder', admin);
    });

    //admin checkout
    socket.on('showDetail', (admin, callback) => {
        var res = $detail();
        // $stopOrder();
        callback(res);
        // servIo.emit('stopOrder', admin);
    });

    //admin pay
    socket.on('debit', (admin, callback) => {
        $debit();
        callback({ status: "debit" });
        servIo.emit('paid', admin);
    });

    //admin post
    socket.on('post', (rest) => {
        $post(rest);
        var res = $fetchRestaurant();
        servIo.emit('menu', res);
    });

    //admin dechoose
    socket.on('dechoose', (admin) => {
        $cleanOrder();
        servIo.emit('recall', admin);
    });

    //register
    socket.on('signup', (acc, pw, callback) => {
        var res = $register(acc, pw);
        callback({ status: res });
    });
});