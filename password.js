/**
 * 1. 在tab區按'+'號
 * 2. 選擇 Shell
 * 3. 輸入 node password.js <密碼>
 * 4. 輸出結果即為系統可辨識之密碼，請按右鍵複製，Linux不能用control+C，那是KeyBoardInterrupt
 * 5. 把user.js的密碼改成輸出的字串
 **/

const fs = require("fs");
const sha256URL = './v2.3.2/JS/modules/sha256.js'
eval(fs.readFileSync(sha256URL, "utf-8"));

const parameter = process.argv[2];

console.log(sha256(parameter));