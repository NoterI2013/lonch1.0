chooseRestState = 'unchoosed';
restName = "";

function showRest(restaurant){
  restTable = "";
  for(let i in restaurant){
  restTable += `
    <tr class="restlist-tr">
        <td class="restlist-val"> <span class="restlist-container">${restaurant[i]}<span class="restlist-key">${i}</span></span></td>
    </tr>
    `;
  }
  document.getElementById("admin-postrest-table").innerHTML = restTable;
}

function showChoosed(name){
  document.getElementById("admin-postrest-table").innerHTML = `
    <tr class="restlist-tr">    
      <td style="font-size: xx-large; opacity:0.5;"> 今天的餐廳是 </td>
    </tr>
    <tr class="restlist-tr">    
      <td class="embed-alert" style="font-size: xx-large; opacity:0.5;" align="center"> ${name} </td>
    </tr>
    <tr style="display:flex; justify-content:space-around;">
      <td> <button id="rechoose"> 重新選擇 </button> </td>
    </tr>
  `;
}

function render(){
  switch(chooseRestState){
    case 'unchoosed':
      showRest(restList);
      let restval =  document.getElementsByClassName("restlist-val");
      let restkey =  document.getElementsByClassName("restlist-key");
      for(let i=0; i<restval.length; i++){
        restval[i].addEventListener("click", () => {
          let rest = restkey[i].innerText;
          socket.emit('post', rest);
            // console.log(res);
            chooseRestState = 'choosed';
            restName = restval[i].innerText;
            render();
          /*
            showChoosed(restName);
            document.getElementById("rechoose").addEventListener("click", () => {
              socket.emit("dechoose", account);
              chooseRestState = "unchoosed";
              restToday = {name : -1};
              render();
            });
          */
          
        }); 
      }
      break;
    case 'choosed':
        // orderable = "checkout";
        showChoosed(restName);
        // console.log("orderable", orderable);
        document.getElementById("rechoose").addEventListener("click", () => {
            if(orderable === "checkout"){
                Swal.fire({
                    icon: 'warning',
                    title: '已彙整但未扣款',
                    text: `你確定自己在做什麼齁？`,
                    confirmButtonText: '我再確認一下',
                    showDenyButton : true,
                    denyButtonText: '是的我要撤銷',
                    denyButtonColor: '#960000'
                }).then(function(result){
                    if(result.isDenied === true){
                        socket.emit("dechoose", account);
                        chooseRestState = "unchoosed";
                        orderable = "unpost";
                        render();
                    }
                });
            }else{
                socket.emit("dechoose", account);
                chooseRestState = "unchoosed";
                orderable = "unpost";
                render();
            }
          
        });break;
        
    default:
        alert("穩藏成就 [ 你是如何走到這步的 ]");
        break;
  }
}

document.getElementById("admin-postrest-btn").addEventListener("click", () => {
  if(orderable == "unpost") chooseRestState = 'unchoosed';
  else{
    chooseRestState = 'choosed';
    restName = restToday["name"];
  }
  // console.log(restList);
  render();
});

