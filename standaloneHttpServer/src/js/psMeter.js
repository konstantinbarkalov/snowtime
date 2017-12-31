'use strict';
function PsMeter(statObject) {
  let that = this;
  let lastStartPtime = null;
  let lastFinishPtime = null;
  function init() {
  };
  that.dutyIterationStart = function () {
    lastStartPtime = performance.now();
  }
  that.dutyIterationFinish = function () {
    let currentFinishPtime = performance.now();
    if (lastFinishPtime) {
      let dutyIterationPtime = (currentFinishPtime - lastStartPtime);
      // actually lastStartPtime is like *current*StartPrime (and must be already fine defined btw),
      // because that.dutyIterationStart must fired just before
      let wholeCyclePtime = (currentFinishPtime - lastFinishPtime);
      statObject.dutyRatio = dutyIterationPtime / wholeCyclePtime;
      statObject.ps = 1000 / wholeCyclePtime;
    }
    lastFinishPtime = currentFinishPtime;
  }
  init();
}
module.exports = PsMeter;