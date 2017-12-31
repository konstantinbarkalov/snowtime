'use strict';
let Winston = require("winston");

let logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: process.env.MQUTIE_LOGLEVEL || "info",
      //handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});
logger.dbg = new Winston.Logger({ //secondary logger
  transports: [
    new Winston.transports.Console({
      level: "debug",
      //handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});
module.exports = logger.dbg;