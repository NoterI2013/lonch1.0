const fs = require("fs");

const $actionURL = "./modules/$actions.js";
eval(fs.readFileSync($actionURL, "utf-8"));

///////////////////////////////////////

$logAs("NoterI", "abc");
$cleanOrder();
// $order(Queue, _client_);
// $dorder(Queue, _client_);

// console.log(orderOs);
