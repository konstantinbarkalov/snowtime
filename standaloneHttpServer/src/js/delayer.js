'use strict';
const delayMetas = [
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
function Delayer() {
  let that=this;
  let delays=[];
  let currentDelayIndex = null;
  function init() {
    that.output = teplite.audioCtx.createGain();
    that.input = teplite.audioCtx.createGain();

    delayMetas.forEach((delayMeta)=>{
      let delaySecs = delayMeta.beat / teplite.optionset.bpm * 60;
      let filter = teplite.audioCtx.createDelay(delaySecs);
      filter.delayTime.value = delaySecs;
      let feedbackGain = teplite.audioCtx.createGain();
      feedbackGain.gain.value = 0.67;
      let outputGain = teplite.audioCtx.createGain();
      outputGain.gain.value = 0;
      that.input.connect(filter);
      filter.connect(feedbackGain);
      feedbackGain.connect(filter);
      feedbackGain.connect(outputGain);
      outputGain.connect(that.output);
      let delay = {
        filter: filter,
        feedbackGain: feedbackGain,
        outputGain: outputGain,
        meta: delayMeta
      }
      delays.push(delay);
    });
  }

  that.input = null;
  that.output = null;
  that.stepAudioSafeHexth = function(beatNum) {
    let delayRatio = (teplite.devunoBratios[0] + 1) / 2;
    currentDelayIndex = Math.round(delayRatio * (delays.length - 1));
  }
  function fourPointRatioFn(inputBratios, a, b, c, d) {
    let xRatio = Math.abs(inputBratios[0]);
    let yRatio = Math.abs(inputBratios[1]);
    let abRatio = a - (a - b) * xRatio;
    let cdRatio = c - (c - d) * xRatio;
    let ratio = abRatio - (abRatio - cdRatio) * yRatio;
    return ratio;
  }
  function delayFeedbackBaseRatioFn(hazeBratios) {
    const a = 0.25;
    const b = 0.8;
    const c = hazeBratios[2];
    const d = 1;
    return fourPointRatioFn(hazeBratios, a, b, c, d);
  }

  function delayLevelBaseRatioFn(hazeBratios) {
    const a = 0.25;
    const b = 0.5;
    const c = 0;
    const d = 0.6;
    return fourPointRatioFn(hazeBratios, a, b, c, d);
  }
  function updateFeedback() {
    if (currentDelayIndex !== null) {
      let feedbackBaseRatio = delayFeedbackBaseRatioFn(teplite.hazeBratios);
      let feedbackRatio = Math.pow(feedbackBaseRatio, delays[currentDelayIndex].meta.beat);
      delays.forEach((delay)=>{
        delay.feedbackGain.gain.value = feedbackRatio; // TODO rework to an audio event
      })
    }
  }
  function updateLevel() {
    if (currentDelayIndex !== null) {
      let levelBaseRatio = delayLevelBaseRatioFn(teplite.hazeBratios);
      let levelRatio = levelBaseRatio * Math.pow(0.9, 1 / delays[currentDelayIndex].meta.beat);

      delays.forEach((delay, delayIndex)=>{
        delay.outputGain.gain.value = (delayIndex === currentDelayIndex) ? levelRatio : 0; // TODO rework to an audio event
      })
    }

  }
  that.stepTick = function(beatNum) { // TODO rework to an audio event
    updateFeedback();
    updateLevel();
  }
  init();
}

module.exports = Delayer;