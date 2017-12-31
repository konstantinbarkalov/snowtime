'use strict';
function Grit(gritter, $gritter, message, mode, timeoutDuration) {
  let that = this;
  let $grit = null;
  let destroyTimeoutId = null;
  function init() {
    $grit = $('<div></div>').addClass('gritter__grit');
    if (mode) {
      $grit.addClass('gritter__grit--' + mode);
    }
    $grit.text(message);
    $gritter.append($grit);
    timeoutDuration = timeoutDuration || (mode==='warn') ? 10000 : 5000;
    destroyTimeoutId = setTimeout(that.destroy, timeoutDuration);
    for (let gritsIndex = gritter.grits.length - 10; gritsIndex >= 0; gritsIndex--) {
      let grit = gritter.grits[gritsIndex];
      grit.destroy();
    }
    gritter.grits.push(that);
  }
  that.destroy = function() {
    if (destroyTimeoutId) {
      clearTimeout(destroyTimeoutId);
    }
    $grit.remove();
    let gritsIndex = gritter.grits.findIndex((grit)=>{ return grit === that; });
    if (gritsIndex >= 0) {
      gritter.grits.splice(gritsIndex, 1);
    }
  }
  init();
}
function Gritter($gritter) {
  let that = this;
  that.grits = [];
  function init() {
    that.grits = [];
  }
  that.addGrit = function(message, mode) {
    if (mode !== 'dev') {
      new Grit(that, $gritter, message, mode);
    }
    //(un)binding to that.grits is inside Grit logic
  }
  init();
}
module.exports = Gritter;