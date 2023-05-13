// go-to-balance HTML查看餘額的按鈕id
document.getElementById("go-to-balance").addEventListener("click", () => {
  socket.emit('fish', account,  (res) => {
    // console.log("raw respond: ", res);
    // __cssBasic__();
  });
});