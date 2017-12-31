'use strict';
function AleaRandom() {
  let that = this;
  let mashN = 4022871197;
  function resetMashN() {
    mashN = 4022871197;
  }
  function mash(r) {
    for(let t, s, u = 0, e = 0.02519603282416938; u < r.length; u++) {
      s = r.charCodeAt(u);
      let f = (e * (mashN += s) - (mashN*e|0));
      mashN = 4294967296 * ((t = f * (e*mashN|0)) - (t|0)) + (t|0);
    }
    return (mashN|0) * 2.3283064365386963e-10;
  }

  that.fromSeed = function(seed) {
    resetMashN();
    let a = mash(' ');
    let b = mash(' ');
    let c = mash(' ');
    let x = 1;
    let seedStr = seed.toString();
    a -= mash(seedStr);
    b -= mash(seedStr);
    c -= mash(seedStr);
    if (a < 0) { a++; }
    if (b < 0) { b++; }
    if (c < 0) { c++; }
    let y = x * 2.3283064365386963e-10 + a * 2091639;
    return c = y - (x = y|0);
  }
}
let alea = new AleaRandom();
function generateInts(count, mod, startSeed) {
  const roundEntropyBitsCount = 32;
  const stepEntropyBitsCount = Math.log2(mod);
  let stepsPerRound = Math.floor(roundEntropyBitsCount / stepEntropyBitsCount);
  let ints = [];
  let randomSourceRatio;
  for (let intIndex = 0; intIndex < count; intIndex++) {
    if (intIndex % stepsPerRound === 0) {
      randomSourceRatio = alea.fromSeed(startSeed);
      startSeed = randomSourceRatio;
    }
    let randomChop = randomSourceRatio * mod;
    ints[intIndex] = randomChop >> 0;
    randomSourceRatio = randomChop % 1;
  }

  return ints;
}
module.exports = {alea: alea, generateInts: generateInts};
