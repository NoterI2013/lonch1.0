var socket = io.connect();

var uuid = "";
var account = "";
var notadmin = true;

// restToday <- server.emit()
socket.on("connect", () => {
    uuid = socket.id;
    // console.log('uuid=', socket.id);

    socket.on('autoLog', (acc, role) => {
        // console.log("raw respond: ", acc, role);
        account = acc;
        __login.style.display = "none";
        __logout.style.display = "initial";
        __cssClear__();
        __cssDisplay__(main_idle);
        __cssBasic__();
        Swal.fire({
            icon: 'success',
            title: '自動登入',
            html: `帳號：<span class="embed-alert">${account}</span>`,
            confirmButtonText: '確定',
        });
        document.getElementById("logout-id").innerHTML = `登出 <span class="embed-alert">${account}<span>`;
        __cssBasic__();

        //isAdmin
        if (role == true) {
            __cssAdmin__();
            notadmin = false;
        }
    });

    //restaurantDB
    socket.on('restaurantDB', (res) => {
        restList = res;
        // console.log(restList);
    });

    // user fetch restaurant today
    socket.emit('fetchRestToday', (res) => {
        restToday = res;
        orderable = restToday["status"];
        // console.log(restToday);
    });

    // admin post menu
    socket.on("menu", (res) => {
        // alert("菜單已更新，將強制回到主頁");
        Swal.fire({
            icon: 'warning',
            title: '菜單更新',
            text: `已回到閒置頁面`,
            confirmButtonText: '確定'
        });
        __cssClear__();
        __cssDisplay__(main_idle);
        __cssBasic__();
        restToday = res;
        orderable = restToday["status"];
        // console.log("restd", restToday);
    });

    // admin depost menu
    socket.on("recall", (acc) => {
        if (acc != account) {
            // alert("菜單已撤銷，將強制回到主頁");
            Swal.fire({
                icon: 'warning',
                title: '菜單撤銷',
                text: `已回到閒置頁面`,
                confirmButtonText: '確定'
            });
            __cssClear__();
            __cssDisplay__(main_idle);
            __cssBasic__();
            orderable = "unpost";
            // console.log("client.js depost Event", restToday);
        }
    });

    socket.on("stopOrder", (acc) => {
        if (acc != account) {
            // alert("點餐已截止，將強制回到主頁");
            Swal.fire({
                icon: 'warning',
                title: '訂餐截止',
                text: `已回到閒置頁面`,
                confirmButtonText: '確定'
            });
            __cssClear__();
            __cssDisplay__(main_idle);
            __cssBasic__();
            orderable = "checkout";
            // console.log("client.js depost Event", restToday);
        }
    })

    socket.on("paid", (acc) => {
        if (notadmin === false) {
            // alert("已扣款，你想多收錢齁");
            Swal.fire({
                icon: 'warning',
                title: '管理員已結帳',
                text: `已回到閒置頁面`,
                confirmButtonText: `確定`
            });
            __cssClear__();
            __cssDisplay__(main_idle);
            __cssBasic__();
            orderable = "debit";
        }
    })
});


//login
document.getElementById("login-submit").addEventListener("click", () => {
    let liacc = document.getElementById("login-account");
    let lipsw = document.getElementById("login-password");
    let loginarea = document.getElementById("loginarea");
    let __login = document.getElementById("__login");
    let __logout = document.getElementById("__logout");
    // console.log("嘗試登入clientjs\n"); console.log("Account :", liacc.value); console.log("Password:", lipsw.value); console.log("uuid", uuid);
    socket.emit('login', liacc.value, lipsw.value, uuid, (res) => {
        if (res.status != 2 && res.status != -1) {
            account = liacc.value;
            __login.style.display = "none";
            __logout.style.display = "initial";
            liacc.value = "";
            lipsw.value = "";
            __cssClear__();
            __cssDisplay__(main_idle);
            __cssBasic__();
            account = res["account"];
            // alert(`登入成功 [ ${account} ] !`);
            Swal.fire({
                icon: 'success',
                title: '登入成功',
                html: `帳號：<span class="embed-alert">${account}</span>`,
                confirmButtonText: '確定',
            });
            document.getElementById("logout-id").innerHTML = `登出 <span class="embed-alert">${account}<span>`;
            __cssBasic__();

            //isAdmin
            if (res.status == true) {
                __cssAdmin__();
                notadmin = false;
            }
        } else if (res.status == 2) {
            // alert("密碼錯誤!");
            Swal.fire({
                icon: 'error',
                title: '登入失敗',
                text: `密碼輸入錯誤`,
                confirmButtonText: '確定'
            });
        } else {
            // alert("查無此帳號!");
            Swal.fire({
                icon: 'error',
                title: '登入失敗',
                text: `未查詢到此帳戶`,
                confirmButtonText: '確定'
            });
        }
    });
});

//logout
document.getElementById("logout").addEventListener("click", () => {
    //clear cookie uuid
    socket.emit('logout', account, (res) => {
        
    });
    account = "";
    __logout.style.display = "none";
    __login.style.display = "initial";
    __cssClear__();
    __cssDisplay__(main_idle);
    __cssBasic__();
    __cssDAdmin__();
});

//fish
document.getElementById("go-to-balance").addEventListener("click", () => {
    if (account == "") {
        __cssBasic__();
        // alert("請先登入!");
        Swal.fire({
            icon: 'warning',
            title: '查詢失敗',
            text: `尚未登入帳號`,
            confirmButtonText: '確定'
        });
    } else {
        socket.emit('fish', account, (res) => {
            __cssBasic__();
            // alert(`你的餘額: [ ${res["balance"]} ]`);
            Swal.fire({
                icon: 'info',
                title: '您的餘額',
                html: `<span class="embed-alert" style="color: ${res["balance"]<0 ? '#F39C12' : 'white'}">${res["balance"]}</span> NTD`,
                confirmButtonText: '確定'
            });
        });
    }
});


//register
document.getElementById("addacc").addEventListener("click", () => {
    let cracc = document.getElementById("signup-account");
    let crpsw = document.getElementById("signup-password");
    let crpwa = document.getElementById("signup-password-again");
    // console.log("trying sign up in client.js\n"); console.log("Account :", cracc.value); console.log("Password:", crpsw.value); console.log("Confirm:", crpwa.value);
    if (cracc.value != "" && crpsw.value != "") {
        if (crpsw.value != crpwa.value) {
            // alert("二次密碼輸入不相符!");
            Swal.fire({
                icon: 'error',
                title: '創建帳號失敗',
                text: `二次密碼不相符`,
                confirmButtonText: '確定'
            });
        } else {
            socket.emit('signup', cracc.value, crpsw.value, (res) => {
                if (res.status == 0) {
                    // alert("已成功註冊帳號 請重新登入!");
                    Swal.fire({
                        icon: 'success',
                        title: '創建帳號成功',
                        text: `請重新登入Lonch帳號`,
                        confirmButtonText: '確定'
                    });
                    cracc.value = "";
                    crpsw.value = "";
                    crpwa.value = "";
                } else if (res.status == 1) {
                    // alert("此帳號存在!");
                    Swal.fire({
                        icon: 'error',
                        title: '創建帳號失敗',
                        text: `Lonch帳號已存在`,
                        confirmButtonText: '確定'
                    });
                } else if (res.status == 2) {
                    // alert("帳號不能有空格！是在搞？");
                    Swal.fire({
                        icon: 'error',
                        title: '創建帳號失敗',
                        text: `帳號格式不能有空格`,
                        confirmButtonText: '確定'
                    });
                }
            });
        }
    }
});