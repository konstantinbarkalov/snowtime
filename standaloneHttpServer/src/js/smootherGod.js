'use strict';
function SmootherGod() {
  let that = this;
  let smoothers = [];
  function init() {
    let intervalId = setInterval(iteration, 50);
    teplite.on('halt', (halt)=>{
      if (halt) { clearInterval(intervalId); }
    });
  };
  function iteration() {
    smoothers.forEach((smoother)=>{
      smoother.iteration();
    });
  };
  that.add = function(object, key, smoothRatio) {
    let smoother = new Smoother(object, key, smoothRatio);
    let smoothersIndex = smoothers.push(smoother);
    return smoothersIndex;
  };
  that.remove = function(smoothersIndex) {
    smoothers.splice(msmoothersIndex, 1);
  };
  init();
}

function Smoother(object, key, smoothRatio) {
  let that = this;
  let smoothKey = key + '_smooth';
  function init() {
  };
  that.iteration  = function() {
    let crispValue = object[key];
    let smoothValue = object[smoothKey];
    if (!smoothValue && smoothValue !== 0) {
      smoothValue = crispValue;
    }
    smoothValue = crispValue + (smoothValue - crispValue) * smoothRatio;
    object[smoothKey] = smoothValue;
  }
  init();
}
module.exports = SmootherGod;