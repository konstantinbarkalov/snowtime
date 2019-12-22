'use strict';
const lfoDelayMetas = [ // TODO link with same in lfoDelayer.js
  {
    beat: 0.25 / 2,
  },
  {
    beat: 0.25 * 1,
  },
  {
    beat: 0.25 * 2,
  },
  {
    beat: 0.25 * 3,
  },
  {
    beat: 0.25 * 4,
  },
  {
    beat: 0.25 * 6,
  },
  {
    beat: 0.25 * 8,
  }
]

function PassFilter(destination) {
  let that = this;
  let lowpassFilter = null;
  let highpassFilter = null;
  let inputLowpassFilter = null;
  let inputHighpassFilter = null;
  let compressor = null;
  let bypass = null;
  function init() {
    that.input = teplite.audioCtx.createGain();
    that.output = teplite.audioCtx.createGain();
    bypass = teplite.audioCtx.createGain();
    compressor = teplite.audioCtx.createDynamicsCompressor();
    compressor.ratio.value = 20;
    compressor.threshold.value = -44;
    inputLowpassFilter = teplite.audioCtx.createGain();
    lowpassFilter = teplite.audioCtx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    that.input.connect(inputLowpassFilter);
    inputLowpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(compressor);

    inputHighpassFilter = teplite.audioCtx.createGain();
    highpassFilter = teplite.audioCtx.createBiquadFilter();
    highpassFilter.type = 'highpass';
    that.input.connect(inputHighpassFilter);
    inputHighpassFilter.connect(highpassFilter);
    highpassFilter.connect(compressor);
    compressor.connect(that.output);
    that.input.connect(bypass);
    bypass.connect(that.output);

    that.tick(0, [0, 0]);

  }
  function ratioToExpRatio(ratio, q) {
    if (q === 1) { return ratio; }
    let p = Math.pow(q, ratio);
    return (p - 1) / (q - 1);
  }
  function clampHz(value) {
    const limit = 22050;
    return Math.max(0, Math.min(limit, value));
  }
  that.input = null;
  that.output = null;
  const maxFreq = 1000 * 24;
  that.tick = function(beatNum, filterBratios) {
    let lfoDelayRatio = (teplite.devunoBratios[0] + 1) / 2;
    let lfoDelayIndex = Math.round(lfoDelayRatio * (lfoDelayMetas.length - 1));
    let lfoMixBratio = 1 - filterBratios[0];
    let lfoMixRatio = lfoMixBratio / 2 + 0.5;
    let lfoImpactBratio = Math.pow(lfoMixRatio, 1) * Math.sin(beatNum / lfoDelayMetas[lfoDelayIndex].beat * Math.PI * 2 / 4);
    let lfoImpactFactor = Math.pow(1.25, lfoImpactBratio);

    //  freq part
    let freqBratio = filterBratios[1] * lfoImpactFactor;
    let absFreqBratio = Math.abs(freqBratio);
    let qFreqImpactRatio = Math.min(1, absFreqBratio * 20);              // -1  """"""\/""""""  1
    let gainFreqImpactRatio = Math.min(1, (1 - absFreqBratio) * 20);     // -1  _/""""""""""\_  1
    const maxQ = 5;
    const minQ = -5;
    let q =  minQ - (minQ - maxQ) * qFreqImpactRatio;
    // /freq part
    // rez part
    let rezBratio = filterBratios[0];
    let rezRatio = rezBratio / 2 + 0.5;
    let rezSinedRatio = Math.sin(rezRatio * Math.PI / 2); //quater of pi
    let qRezImpactRatio = Math.pow(1 - rezSinedRatio, 20);
    let gainRezImpactRatio = 1.1 - Math.pow(1 - rezSinedRatio, 5);
    const extraQ = 60; // for wierd (mass lfoDelayed) swirl effect
    q += qRezImpactRatio * extraQ;
    // /rez part
    if (freqBratio > 0) {
      highpassFilter.frequency.value = clampHz(maxFreq * ratioToExpRatio(freqBratio, 100)); // TODO refactor as a Math.pow
      lowpassFilter.frequency.value = clampHz(maxFreq);
      highpassFilter.Q.value = q;
      lowpassFilter.Q.value = -5;
      inputHighpassFilter.gain.value = qFreqImpactRatio; // * gainRezImpactRatio;
      inputLowpassFilter.gain.value = 0;
    } else {
      lowpassFilter.frequency.value = clampHz(maxFreq * ratioToExpRatio(1 + freqBratio, 100)); // TODO refactor as a Math.pow
      highpassFilter.frequency.value = clampHz(0);
      lowpassFilter.Q.value = q;
      highpassFilter.Q.value = -5;
      inputLowpassFilter.gain.value = qFreqImpactRatio; // * gainRezImpactRatio;
      inputHighpassFilter.gain.value = 0;
    }
    bypass.gain.value = 1 - qFreqImpactRatio;
    that.input.gain.value = gainFreqImpactRatio;
    that.output.gain.value = gainRezImpactRatio;
  }
  init();
}
module.exports = PassFilter;