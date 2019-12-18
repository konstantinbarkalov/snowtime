'use strict';
function Faq($container) {
  let that = this;
  let $expander = null;
  let $toggle = null;
  let isExpanded = null;
  let $toggleShow = null;
  let $toggleHide = null;
  function init() {
    isExpanded = false;
    $expander = $container.find('.faq__expander');
    $toggle = $container.find('.faq__expander-toggle');
    $toggleShow = $container.find('.faq__expander-toggle-text.faq__expander-toggle-text--show');
    $toggleHide = $container.find('.faq__expander-toggle-text.faq__expander-toggle-text--hide');

    $toggle.on('click', toggle);
  }
  function toggle() {
    isExpanded = !isExpanded;
    $expander.toggleClass('faq__expander--expanded', isExpanded);
    $toggleShow.toggleClass('faq__expander-toggle-text--expanded', isExpanded);
    $toggleHide.toggleClass('faq__expander-toggle-text--expanded', isExpanded);

  }

  init();
}
module.exports = Faq;
