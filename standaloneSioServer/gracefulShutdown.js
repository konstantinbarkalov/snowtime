'use strict';
const logger = require("./logger");
//// Module dependencies.
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}
function gracefulShutdown(callback) {
  process.on("SIGINT", function () {
    callback();
    process.exit();
  });
  process.on("SIGHUP", function () {
    callback();
    process.exit();
  });
  process.on("SIGHTERM", function () {
    callback();
    process.exit();
  });
}
module.exports = gracefulShutdown;