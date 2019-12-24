'use strict';
function PreloadAwaiter($preloadAwaiter, $appLayer) {
  let that = this;
  let $message = null;
  let $header = null;
  function init() {
    $message = $preloadAwaiter.find('.preload-awaiter__message');
    $header = $preloadAwaiter.find('.preload-awaiter__header');
  }
  that.becomeReady = function() {
    $preloadAwaiter.addClass('preload-awaiter--app-ready');
    $appLayer.addClass('app__layer--app-ready');
  }
  init();
}
module.exports = PreloadAwaiter;