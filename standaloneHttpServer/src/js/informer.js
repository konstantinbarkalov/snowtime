'use strict';
function Informer($informer) {
  let that = this;
  let $closeButton = null;
  let $message = null;
  let $header = null;

  function init() {
    $closeButton = $informer.find('.informer__close-button');
    $message = $informer.find('.informer__message');
    $header = $informer.find('.informer__header');
    $closeButton.on('click', hideInformer);
    teplite.on('inform', showInformer);
  }
  function showInformer(informSet) {
    $informer.addClass('informer--active');
    $message.text(informSet.messageText);
    $header.text(informSet.headerText || 'Тынц');
  }

  function hideInformer() {
    $informer.removeClass('informer--active');
  }
  init();
  that.showInformer = function(informSet) {
    showInformer(informSet);
  }
}
module.exports = Informer;