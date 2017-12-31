'use strict';
const random = require('./random.js');
let forthes = [
  [0, 1, 2, 3],
  [0, 1, 0, 1],
  [0, 1, 2, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 1, 1, 1],
  [0, 0, 1, 1],
  [0, 0, 1, 0],
  [0, 0, 1, 2],
  [0, 1, 2, 2],
]
// samples: (each is some random value (or random xy position maybe))
// 4 +
// 4 * 4 +
// 4 * 4 * 4 = 84
// need 84 random samples to seed square by hexthes
//
// variants: (each is id from 0 to forthes.length)
// 1 +
// 4 +
// 4 * 4  = 21
// need 21 variants to seed square by hexthes

function generatePattern(startSeed, wc, bc, hc) {
  wc = wc || 4;
  bc = bc || 4;
  hc = hc || 4;
  let randomForthIndexes = random.generateInts((1 + wc + wc * bc), forthes.length, startSeed);
  let pattern = [];
  for (let w = 0; w < wc; w++) {
    let wholeRandomForthIndexesIndex = 0;
    let wholeForthIndex = randomForthIndexes[wholeRandomForthIndexesIndex];
    let wholeForth = forthes[wholeForthIndex];
    let wholeForthNum = wholeForth[w];

    for (let b = 0; b < bc; b++) {
      let beatRandomForthIndexesIndex = 1 + wholeForthNum;
      let beatForthIndex = randomForthIndexes[beatRandomForthIndexesIndex];
      let beatForth = forthes[beatForthIndex];
      let beatForthNum = beatForth[b];
      for (let h = 0; h < hc; h++) {
        let hexthRandomForthIndexesIndex = 1 + wc + wholeForthNum * bc + beatForthNum;
        let hexthForthIndex = randomForthIndexes[hexthRandomForthIndexesIndex];
        let hexthForth = forthes[hexthForthIndex];
        let hexthForthNum = hexthForth[h];

        let outputIndex = w * bc * hc + b * hc + h * 1;
        pattern[outputIndex] = wholeForthNum * bc * hc + beatForthNum * hc + hexthForthNum * 1;
      }
    }
  }
  let refrenedPattern = refrenPattern(startSeed, pattern, wc, bc, hc);
  return refrenedPattern;
}
let refrens = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, 15, -1, -1, -1, 15, -1, -1, -1, 15, -1, -1, -1, 15],
  [-1, -1, 14, 15, -1, -1, 14, 15, -1, -1, 14, 15, -1, -1, 14, 15],
  [-1, -1, 10, 11, -1, -1, 14, 15, -1, -1, 10, 11, -1, -1, 14, 15],
  [-1, -1, 14, -1, -1, -1, 14, -1, -1, -1, 14, -1, -1, -1, 14, -1],
  [-1, 13, 14, 15, -1, 13, 14, 15, -1, 13, 14, 15, -1, 13, 14, 15],
  [-1, -1, -1,  7, -1, -1, -1,  7, -1, -1, -1, 15, -1, -1, -1, 15],
  [-1, -1,  6,  7, -1, -1,  6,  7, -1, -1, 14, 15, -1, -1, 14, 15],
  [ 0,  1, -1, -1,  0,  1, -1, -1,  0,  1, -1, -1,  0,  1, -1, -1],
  [ 0,  1,  2, -1,  0,  1,  2, -1,  0,  1,  2, -1,  0,  1,  2, -1],
  [ 0, -1,  2, -1,  0, -1,  2, -1,  0, -1,  2, -1,  0, -1,  2, -1],
  [-1, -1, -1, -1, -1, -1, 14, 15, -1, -1, -1, -1, -1, -1, 14, 15],
  [-1, -1, -1, 15, -1, -1, -1, 15, -1, 15, -1, 15, -1, 15, -1, 15],
  [-1, 13, -1, 15, -1, 13, -1, 15, -1, 13, -1, 15, -1, 13, -1, 15],
  [-1, 15, -1, 15, -1, 15, -1, 15, -1, 15, -1, 15, -1, 15, -1, 15],
  [-1,  5, -1,  7, -1,  5, -1,  7, -1, 13, -1, 15, -1, 13, -1, 15],
  [-1, 15, -1, 15, -1, 15, -1, 15, 14, 15, 14, 15, 14, 15, 14, 15],
  [-1, -1, 14, -1, -1, -1, 14, -1, 14, 15, 14, 15, 15, 15, 15, 15],
  [-1,  5, -1, 15, -1,  5, -1, 15, -1, 15, 14, 15, -1, 15, 14, 15],
  [-1, 13, -1, 15, -1, 13, -1, 15, -1, 13, 14, 15, -1, 13, 14, 15],
  [-1,  5,  6,  7, -1,  5,  6,  7, -1, 13, 14, 15, -1, 13, 14, 15],
  [-1,  5,  6,  7, -1,  5,  6,  7, -1,  5,  6,  7, -1,  5,  6, 15],
  [-1,  5,  6,  7, -1,  5,  6,  7, -1,  5,  6,  7, -1,  5, 14, 15],
]
function refrenPattern(startSeed, pattern, wc, bc, hc) {
  wc = wc || 4;
  bc = bc || 4;
  hc = hc || 4;
  let refrenedPattern = [];
  let randomRefrensIndex = random.generateInts(1, refrens.length, startSeed)[0];
  let refren = refrens[randomRefrensIndex];
  for (let w = 0; w < wc; w++) {
    for (let b = 0; b < bc; b++) {
      for (let h = 0; h < hc; h++) {
        let outputIndex = w * bc * hc + b * hc + h;
        let refrenIndex = w * bc + b;
        let refrenBeatId = refren[refrenIndex];
        if (refrenBeatId !== -1) {
          let remapedIndex = refrenBeatId * hc + h;
          refrenedPattern[outputIndex] = pattern[remapedIndex];
        } else {
          refrenedPattern[outputIndex] = pattern[outputIndex];
        }
      }
    }
  }
  return refrenedPattern;
}


generatePattern.debugPrint = function (pattern, wc, bc, hc) {
  wc = wc || 4;
  bc = bc || 4;
  hc = hc || 4;
  let str= '';
  for (let w = 0; w < wc; w++) {
    for (let b = 0; b < bc; b++) {
      for (let h = 0; h < hc; h++) {
        let index = w * bc * hc + b * hc + h * 1;
        let val = pattern[index];
        str += (h===0)?'|':' ';
        if (val < 10) {
          str += ' ';
        }
        str += val;
      }
    }
    str += '\n';
  }
  return str;
}
module.exports = generatePattern;
