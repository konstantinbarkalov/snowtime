'use strict';
const generatePattern = require('./generatePattern.js');
const wc = 4;
const bc = 4;
const hc = 4;
let pattern = generatePattern(Math.random(), wc, bc, hc);
let str = generatePattern.debugPrint(pattern, wc, bc, hc);