var myOrder = {
  "order": [],
  "price": []
};

// let meal = "";

function checkorderDefault () {
  document.getElementById("checkorder-table").innerHTML = `
    <tr>
      <td style="color:yellow; font-size: xx-large; opacity: 0.5;"> 你還沒點餐 </td>
    </tr>
  `;
}

function checkorderUnlog () {
  document.getElementById("checkorder-table").innerHTML = `
    <tr>
      <td style="color:white; font-size: xx-large; opacity: 0.5;"> 請先登入 </td>
    </tr>
  `;
}

function checkorderUnpost(){
  document.getElementById("checkorder-table").innerHTML = `
    <tr>
      <td style="color:yellow; font-size: xx-large; opacity: 0.5;"> Admin尚未發布菜單 </td>
    </tr>
  `;
}

function setmeal(orderObj){
  meal = "";
  try {
    let x = orderObj["order"];
    for (let i = 0; i < x.length; i++) {
      meal += `
      <tr>
        <td class="checkorder-item"> ${orderObj.order[i]} </td>
        <td class="embed-st1" align="center"> <span class="checkorder-price">${orderObj.price[i]}</span>
      </td>
      `;
      if(orderable == "post") meal += `<td> <button class="checkorder-delete"> 刪除 </button> </td>`
      meal += `</tr>`;
      document.getElementById("checkorder-table").innerHTML = meal;
    }
  } catch (err) {
    checkorderDefault()
  };
}

function deOrder(item, price){
  queue = [];
  queue.push(item);
  queue.push(price);
  socket.emit('dorder', queue, account, (res) => {
    if(res.status == -1) {
        // alert("無此項目!");
        Swal.fire({
            icon: 'error',
            title: '修改失敗',
            text: `請重整頁面以確認`,
            confirmButtonText: '確定'
        });
    } else if(res.status == 1) {
        // alert("請勿點擊過快！");
        Swal.fire({
            icon: 'error',
            title: '手速過快',
            text: `請重整頁面以確認`,
            confirmButtonText: '確定'
        });
    } else {
      myOrder = res.status;
      setmeal(myOrder);
      checkorderButton = document.getElementsByClassName("checkorder-delete");
      for (let i = 0; i < checkorderButton.length; i++) {
        checkorderButton[i].addEventListener("click", () => {
          item  = document.getElementsByClassName("checkorder-item")[i].innerText;
          price = document.getElementsByClassName("checkorder-price")[i].innerText;
          deOrder(item, price);
        });
      }
    }
  });
}

document.getElementById("go-to-checkorder").addEventListener("click", () => {
  if (restToday["name"] == -1) checkorderUnpost();
  else if (account != ""){
    socket.emit('checkorder', account, (res) => {
      if (res.order == -1 || res.order == 2) checkorderDefault();
      else{
        myOrder = res;
        try {
          if (myOrder.order.length == 0) checkorderDefault();
          else {
            setmeal(myOrder);
            document.getElementById("checkorder-table").innerHTML = meal;
          }
          
          // 39~51 is a district of Add_Event_Listener
          // after line 47 finish, 
          let checkorderButton = document.getElementsByClassName("checkorder-delete");
          for (let i = 0; i < checkorderButton.length; i++) {
            checkorderButton[i].addEventListener("click", () => {
              let item = document.getElementsByClassName("checkorder-item")[i].innerText;
              let price = document.getElementsByClassName("checkorder-price")[i].innerText;
              // console.log(item, price);
              deOrder(item, price);
            });
          }
        } catch (err) {
          checkorderDefault();
        }
      }
    });
  }else checkorderUnlog();
});