'use strict';
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
module.exports = audioCtx;