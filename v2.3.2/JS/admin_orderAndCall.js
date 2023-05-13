var orderToday = {};
var noword = "";
var isclick = false;
var temptemp = 0;

function showDetails(lonch) {
    noword = "";
    const menu_order = Object.keys(restToday["menu"]);
    const sorted = Object.keys(lonch["order"]).sort((a,b) => menu_order.indexOf(a) - menu_order.indexOf(b))
    for (let name of sorted) {
        noword += `
      <tr>
        <td> ${name} </td>
        <td class="embed-st2" align="center"> ${lonch["order"][name]} </td>
      </tr>
    `;
    }
}

function displayOAC_CO() {
    document.getElementById("admin-oacAggregate").style.display = "none";
    document.getElementById("admin-oacCheckout").style.display = "initial";
}

function displayOAC_EP() {
    isclick = false;
    document.getElementById("admin-oacCheckout").style.display = "none";
    document.getElementById("admin-oacAggregate").style.display = "initial";
    document.getElementById("admin-oac-AGbtn").style.display = "initial";
    document.getElementById("admin-oac-ag-restname").innerText = restToday["name"];
    document.getElementById("admin-oac-ag-phone").innerText = restToday["phone"];

    socket.emit("adminCount", account, (res) => {
        // console.log("raw respond: ", res);
        // console.log("isclick = ", isclick);
        showDetails(res);
        document.getElementById("admin-oac-ag-totalorder").innerHTML = noword;
        document.getElementById("admin-oac-ag-price").innerText = res["sum"];
        document.getElementById("admin-oac-AGbtn").addEventListener("dblclick", () => {
            // console.log(temptemp++);
            if (!isclick) {
                isclick = true;
                socket.emit("debit", account, (res) => {
                    orderable = "debit";
                    document.getElementById("admin-oac-AGbtn").style.display = "none";
                    isclick = false;
                });
            }
        });
    });
}

function displayOAC_AG() {
    isclick = false;
    document.getElementById("admin-oacCheckout").style.display = "none";
    document.getElementById("admin-oacAggregate").style.display = "initial";
    document.getElementById("admin-oac-AGbtn").style.display = "initial";
    document.getElementById("admin-oac-ag-restname").innerText = restToday["name"];
    document.getElementById("admin-oac-ag-phone").innerText = restToday["phone"];

    socket.emit("showDetail", account, (res) => {
        // console.log("raw respond: ", res);
        // console.log("isclick = ", isclick);
        showDetails(res);
        document.getElementById("admin-oac-ag-totalorder").innerHTML = noword;
        document.getElementById("admin-oac-ag-price").innerText = res["sum"];
        document.getElementById("admin-oac-AGbtn").addEventListener("dblclick", () => {
            // console.log(temptemp++);
            if (!isclick) {
                isclick = true;
                socket.emit("debit", account, (res) => {
                    orderable = "debit";
                    document.getElementById("admin-oac-AGbtn").style.display = "none";
                    isclick = false;
                });
            }
        });
    });
}

document.getElementById("admin-orderAndCall-btn").addEventListener("click", () => {
    // console.log("orderable = " + orderable);
    displayOAC_CO();
    if (orderable === "unpost") {
        document.getElementById("admin-oac-restname").innerText = "還沒選擇餐廳";
    } else if (orderable === "post") {

        noword = "";
        document.getElementById("admin-oac-restname").innerText = restToday["name"];
        socket.emit('export', account, (res) => {
            // console.log(res);
            orderToday = res;
            showDetails(res);
            document.getElementById("admin-oac-noworder").innerHTML = noword;
            document.getElementById("admin-oac-price").innerText = res["sum"];
            //彙整
            document.getElementById("admin-oac-CObtn").addEventListener("click", () => {
                if (!isclick) {
                    isclick = true;
                    orderable = "checkout";
                    displayOAC_EP();
                }
            });
        });
    } else if (orderable === "checkout") {
        displayOAC_AG();
    } else if (orderable === "debit") {
        document.getElementById("admin-oac-AGbtn").style.display = "none";
        document.getElementById("admin-oacCheckout").style.display = "none";
        document.getElementById("admin-oacAggregate").style.display = "initial";
        socket.emit("showDetail", account, (res) => {
            showDetails(res);
            document.getElementById("admin-oac-ag-totalorder").innerHTML = noword;
        });
    } /*else if (orderable === "denoument") {
        document.getElementById("admin-oacCheckout").style.display = "none";
        document.getElementById("admin-oacAggregate").style.display = "initial";
        socket.emit("showDetail", account, (res) => {
            showDetails(res);
            document.getElementById("admin-oac-ag-totalorder").innerHTML = noword;
            document.getElementById("admin-oac-AGbtn").style.display = "none";
        });
        紀念 2023/3/10 靈異事件 （加了console log 就好了）
    }*/
});