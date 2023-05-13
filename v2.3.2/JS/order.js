
var orderDefault = () => {
    var orderCheckbox = document.getElementsByClassName("order-checkbox");
    for (let i = 0; i < orderCheckbox.length; i++) {
        orderCheckbox[i].checked = false;
    }
    document.getElementById("order-totalp").innerText = "0";
};

document.getElementById("go-to-orderpage").addEventListener("click", () => {
    // console.log(orderable);
    // restToday["name"] <- 餐廳名稱

    if (orderable == "post") {
        meal = "";
        for (let i in restToday["menu"]) {
            meal += `
      <tr>
        <td> <input type="checkbox" value="${i}" class="order-checkbox"> </td>
        <td> ${i} </td>
        <td class="order-price embed-st1" align="center"> ${restToday["menu"][i]} </td>
      </tr>
      `;
        }
        document.getElementById("order-restname").innerHTML = `${restToday["name"]}`;
        document.getElementById("order-table").innerHTML = meal;
        document.getElementById("price-bar").style.display = "flex";
        var orderCheckbox = document.getElementsByClassName("order-checkbox");
        for (let i = 0; i < orderCheckbox.length; i++) {
            orderCheckbox[i].addEventListener("change", () => {
                p = parseInt(restToday.menu[orderCheckbox[i].value]);
                totalp = document.getElementById("order-totalp");
                totalp.innerText = orderCheckbox[i].checked ? parseInt(totalp.innerText) + p : parseInt(totalp.innerText) - p;
            });
        }
    } else if (orderable == "checkout" || orderable == "debit") {
        document.getElementById("order-table").innerHTML = `
      <tr>
        <td style="color:yellow; font-size: xx-large; opacity: 0.5;"> 已彙整 請聯繫管理員 </td>
      </tr>
    `;
        document.getElementById("price-bar").style.display = "none";
    } else if (orderable == "unpost") {
        document.getElementById("order-table").innerHTML = `
        <tr>
          <td style="color:yellow; font-size: xx-large; opacity: 0.5;"> 管理員尚未發布菜單 </td>
        </tr>
      `;
        document.getElementById("price-bar").style.display = "none";
    }
});

//order(cuisine[menu, price], usr)
document.getElementById("order-submit").addEventListener("click", () => {
    var orderCheckbox = document.getElementsByClassName("order-checkbox");
    myorder = [];
    let price = 0;
    if (account != "") {
        for (let i = 0; i < orderCheckbox.length; i++) {
            if (orderCheckbox[i].checked) {
                myorder.push([orderCheckbox[i].value, restToday.menu[orderCheckbox[i].value]]);
                price += restToday.menu[orderCheckbox[i].value]
            }
        }
        socket.emit('order', myorder, account, (res) => {
            if (!res.status) {
                // alert(`成功！總計金額 ${price} 元`);
                Swal.fire({
                    icon: 'success',
                    title: '訂購價錢總計',
                    html: `<span class="embed-alert">${price}</span> NTD`,
                    confirmButtonText: '確定'
                });
                orderDefault();
                // pushOrder(myorder);
            } else {
                // alert("錯誤！請聯繫管理員！");
                Swal.fire({
                    icon: 'error',
                    title: '訂購失敗',
                    text: `請聯繫管理員確認`,
                    confirmButtonText: '確定'
                });
            }
        });
    } else {
        // alert("尚未登入!");
        Swal.fire({
            icon: 'warning',
            title: '尚未登入',
            text: `請確認登入狀況`,
            confirmButtonText: '確定'
        });
    }
});

// [order it] -> server.js modify orderP & orderO -> callback orderP checkorder.js