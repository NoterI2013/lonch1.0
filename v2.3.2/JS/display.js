__cssClear__ = () => {
    main_idle.style.display = "none";
    main_signup.style.display = "none";
    main_order.style.display = "none";
    main_checkorder.style.display = "none";
    main_admin_setfish.style.display = "none";
    main_admin_postrest.style.display = "none";
    main_admin_orderAndCall.style.display = "none";
};

__cssDisplay__ = (main_x) => {
    main_x.style.display = "initial";
};

__cssChange__ = (x, state) => {
    x.style.display = state?"initial":"none";
};

__cssAdmin__ = () => {
    document.getElementsByClassName("admin-only")[0].style.display = "flex";
    document.getElementsByClassName("admin-only")[1].style.display = "flex";
    document.getElementsByClassName("admin-only")[2].style.display = "flex";
};

__cssDAdmin__ = () => {
    document.getElementsByClassName("admin-only")[0].style.display = "none";
    document.getElementsByClassName("admin-only")[1].style.display = "none";
    document.getElementsByClassName("admin-only")[2].style.display = "none";
};