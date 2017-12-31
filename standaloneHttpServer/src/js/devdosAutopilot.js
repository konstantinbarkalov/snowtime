'use strict';
const generatePattern = require('./generatePattern.js');
const random = require('./random.js');

function DevdosAutopilot() {
  let that = this;

  let currentXBratio = 0;
  let currentYBratio = 0;

  let isTranslateFinised = true;
  that.onAutopilotUpdate = null;
  that.tick = function() { // TODO: refactor tick to be teplite-driven
  }

  // only AudioLaglessBeat and AudioSafeHexth is need for autopilot

  that.stepAudioSafeHexth = function(beatNum){
    const wc = 4;
    const bc = 4;
    const hc = 4;
    let squareNumFloor = Math.floor(beatNum / 16);
    let pattern = generatePattern(teplite.autopilotSeed + squareNumFloor, wc, bc, hc);
    let loudPercents = random.generateInts(wc * bc * hc, 100, teplite.autopilotSeed + squareNumFloor * 2);
    let ratioPercents = random.generateInts(wc * bc * hc, 100, teplite.autopilotSeed + squareNumFloor * 2 + 1);
    //  dbg
    if (squareNumFloor * 16 === beatNum) {
      let str = generatePattern.debugPrint(pattern, wc, bc, hc);
    }
    // /dbg

    let hexthNumFloor = Math.floor(beatNum * 4);
    //let patternId = hexthNumFloor % 64;
    let beatNumFloor = Math.floor(beatNum);
    let patternId = (beatNumFloor * 4) % 64;
    let patternValue = pattern[patternId];
    let loudChance = loudPercents[patternValue] / 100;
    let ratio = ratioPercents[patternValue] / 100;
    ratio = Math.pow(ratio, 2);
    let bratio = ratio * 2 - 1;
    if (loudChance > 0.5) {
      currentXBratio = bratio;
      currentYBratio = 0;
      that.onAutopilotUpdate([currentXBratio, currentYBratio, 1]);
    } else {
      that.onAutopilotUpdate([currentXBratio, currentYBratio, 0]);
    }

  }

}
module.exports = DevdosAutopilot;
