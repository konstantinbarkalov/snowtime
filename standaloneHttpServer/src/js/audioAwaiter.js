'use strict';
function AudioAwaiter($audioAwaiter) {
  let that = this;
  const maxErrorsCount = 10;
  let errorsCount = 0;
  let $closeButton = null;
  let $message = null;
  let $header = null;
  let readyResolve = null;
  function init() {
    that.readyPromise = new Promise((resolve)=>{
      readyResolve = resolve;
    })

    $closeButton = $audioAwaiter.find('.audio-awaiter__close-button');
    $message = $audioAwaiter.find('.audio-awaiter__message');
    $header = $audioAwaiter.find('.audio-awaiter__header');
    $closeButton.on('click', hideAudioAwaiter);
    showAudioAwaiter();
  }
  function showAudioAwaiter() {
    $audioAwaiter.addClass('audio-awaiter--active');
  }

  function hideAudioAwaiter() {
    $audioAwaiter.removeClass('audio-awaiter--active');
    enableWebAudioOnIos();
    readyResolve();
  }
  function enableWebAudioOnIos() {
    // for iOS dirty workaround
    // create empty buffer
    let buffer = teplite.audioCtx.createBuffer(1, 1, 22050);
    let source = teplite.audioCtx.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(teplite.audioCtx.destination);

    // play the file
    source.start(0);
    // /for iOS dirty workaround
  }
  that.readyPromise = null;
  init();
}
module.exports = AudioAwaiter;