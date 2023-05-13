var __cssBasic__ = () => {
    moreoptionareaState = false;
    __cssChange__(head_moa, moreoptionareaState);
    loginiconState = false;
    __cssChange__(head_lia, loginiconState);
    document.getElementById("order-totalp").innerText = 0;
};

// HOME !! //

document.getElementById("back-to-home").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_idle);
    __cssBasic__();
});

// Sign Up Your Account !! //

document.getElementById("signup").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_signup);
    __cssBasic__();
});

// Order !! //

document.getElementById("go-to-orderpage").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_order);
    __cssBasic__();
});

// Check Order !! //

document.getElementById("go-to-checkorder").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_checkorder);
    __cssBasic__();
});

// [Admin] SetFish !! //

document.getElementById("admin-setfish-btn").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_admin_setfish);
    __cssBasic__();
});

// [Admin] Post Restaurant !! //

document.getElementById("admin-postrest-btn").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_admin_postrest);
    __cssBasic__();
});

// [Admin] Order And Call !! //

document.getElementById("admin-orderAndCall-btn").addEventListener("click", () => {
    __cssClear__();
    __cssDisplay__(main_admin_orderAndCall);
    __cssBasic__();
});