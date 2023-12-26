'use strict';
// different name of executable file is just a fast and dirty hack to distinguish forever task
// sorry for that, i'm in hurry
process.env.SIO_PORT = 2023;
require("./standaloneSiosServer.js");
