'use strict';
const generatePattern = require('./generatePattern.js');
const random = require('./random.js');

function HazeAutopilot() {
  let that = this;

  let pastXBratio = 0;
  let futureXBratio = 0;
  let pastYBratio = 0;
  let futureYBratio = 0;

  let pastBeatNum = 0;
  let futureBeatNum = 0;

  let isTranslateFinised = true;
  that.onAutopilotUpdate = null;
  that.tick = function() { // TODO: refactor tick to be teplite-driven
    if (!isTranslateFinised) {
      let ptime = performance.now();
      let partyPtime = ptime - teplite.timeSyncer.lagsStat.csPtimeLagMean - teplite.squareTimer.partyStartedServerPtime + teplite.systemLag.audioPtime;
      let beatNum = partyPtime / 1000 / 60 * teplite.optionset.bpm;
      let translateRatio = (beatNum - pastBeatNum) / (futureBeatNum - pastBeatNum);
      translateRatio = Math.min(1, Math.max(0, translateRatio));
      let isTranslating = (translateRatio < 1);
      let xBratio = pastXBratio + (futureXBratio - pastXBratio) * translateRatio;
      let yBratio = pastYBratio + (futureYBratio - pastYBratio) * translateRatio;
      let zBratio = isTranslating ? 1 : 0;
      let newHazeBratios = [xBratio, yBratio, zBratio];
      if (that.onAutopilotUpdate) {
        that.onAutopilotUpdate(newHazeBratios);
      }
      if (!isTranslating) {
        isTranslateFinised = true;
      }
    }
  }

  // only AudioLaglessBeat and AudioSafeHexth is need for autopilot
  that.stepAudioLaglessBeat = function(beatNum){
    const wc = 4;
    const bc = 4;
    const hc = 4;
    //let nextBeatNum = Math.ceil((beatNum + 1) / 4) * 4;
    let nextBeatNum = beatNum + 1;
    let nextSquareNumFloor = Math.floor(nextBeatNum / 16);
    let pattern = generatePattern(teplite.autopilotSeed + nextSquareNumFloor, wc, bc, hc);
    let loudPercents = random.generateInts(wc * bc * hc, 100, teplite.autopilotSeed + nextSquareNumFloor * 3 + 0);
    let ratioXPercents = random.generateInts(wc * bc * hc, 100, teplite.autopilotSeed +nextSquareNumFloor * 3 + 1);
    let ratioYPercents = random.generateInts(wc * bc * hc, 100, teplite.autopilotSeed +nextSquareNumFloor * 3 + 2);

    let nextHexthNumFloor = Math.floor(nextBeatNum * 4);
    let patternId = nextHexthNumFloor % 64;
    let patternValue = pattern[patternId];

    //
    let extraLoudChance16 = beatNum % 16;
    let extraLoudChance8 = beatNum % 8;
    let extraLoudChance4 = beatNum % 4;
    let extraLoudChanceRatio = (extraLoudChance16 + extraLoudChance8 + extraLoudChance4) / (15 + 7 + 3);

    let loudChance = loudPercents[patternValue] / 100 * extraLoudChanceRatio;
    let ratioX = ratioXPercents[patternValue] / 100;
    let ratioY = ratioYPercents[patternValue] / 100;
    let bratioX = ratioX * 2 - 1;
    let bratioY = ratioY * 2 - 1;

    if (loudChance > 0.1) {
      isTranslateFinised = false;
      pastXBratio = teplite.hazeBratios[0];
      futureXBratio = Math.sign(bratioX) * Math.pow(Math.abs(bratioX), 5);
      pastYBratio = teplite.hazeBratios[1];
      futureYBratio = Math.sign(bratioY) * Math.pow(Math.abs(bratioY), 5);
      pastBeatNum = beatNum;
      futureBeatNum = nextBeatNum;
    }

  }

}
module.exports = HazeAutopilot;
