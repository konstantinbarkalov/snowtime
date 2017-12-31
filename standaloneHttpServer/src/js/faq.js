'use strict';
function Faq($container) {
  let that = this;
  let $expander = null;
  let $toggle = null;
  let isExpanded = null;
  function init() {
    isExpanded = false;
    $expander = $container.find('.faq__expander');
    $toggle = $container.find('.faq__expander-toggle');
    $toggle.on('click', toggle);
  }
  function toggle() {
    isExpanded = !isExpanded;
    $expander.toggleClass('faq__expander--expanded', isExpanded);
  }

  init();
}
module.exports = Faq;
