const fs = require("fs");
const actionsURL = './v2.3.2/JS/modules/$actions.js'
eval(fs.readFileSync(actionsURL, "utf-8"));

const timing = process.argv[2];
const raw_options = process.argv[3];
const options = raw_options.split(',');
const mode = process.argv[4];
// console.log(timing, options, mode);

backup(timing, options, mode);
// console.log("done");