var moreoptionareaState = false;
document.getElementById("moreoption").addEventListener("click", () => {
    moreoptionareaState = !moreoptionareaState;
    __cssChange__(head_moa, moreoptionareaState);
});

var loginiconState = false;
document.getElementById("loginicon").addEventListener("click", () => {
    loginiconState = !loginiconState;
    __cssChange__(head_lia, loginiconState);
});