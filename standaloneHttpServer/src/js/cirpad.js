'use strict';
function Cirpad($container, mode, stepsCount) {
  let that = this;
  mode = mode || 'circle';
  let $handle = $container.find('.cirpad__handle');
  const handleWidth = 0;
  const handleHeight = 0;
  // now used 0 because handle is phisically thin and overshooted from center point
  // 0 in fact means there is no gap from borders for handle body
  // and no gaps in angles (to cover border-radius zone)
  let $padInner = $container.find('.cirpad__pad-inner');
  let $padOuter = $container.find('.cirpad__pad-outer');
  let width = null;
  let height = null;
  let bratios = [0,0];

    function init() {
    let $window = $(window);
    $padOuter.on('mousedown',(event)=>{
      handleOnMouseDown(event);
    });
    $padOuter.on('touchstart',(event)=>{
      handleOnTouchStart(event);
    });

    $window.on('mouseup',(event)=>{
      handleOnMouseUp(event);
    });
    $window.on('touchend',(event)=>{
      handleOnTouchEnd(event);
    });

    $window.on('mousemove',(event)=>{
      handleOnMouseMove(event);
    });
    $window.on('touchmove',(event)=>{
      handleOnTouchMove(event);
    });

    $window.on('resize',()=>{
      resize();
    });
    resize(); // updateHandlePosition() inside
  }
  function resize() {
    width = $padInner.innerWidth();
    height = $padInner.innerHeight();
    updateHandlePosition();
  }
  function updateHandlePosition() {
    //width = $padInner.innerWidth();
    //height = $padInner.innerHeight();

    let innerWidth = (width - handleWidth);
    let innerHeight = (height - handleHeight);


    let outerLeftRatio = ((bratios[0] + 1) / 2);
    let outerTopRatio = ((-bratios[1] + 1) / 2);
    if (stepsCount) {
      outerLeftRatio = Math.round(outerLeftRatio * (stepsCount - 1)) / (stepsCount - 1);
      outerTopRatio = Math.round(outerTopRatio * (stepsCount - 1)) / (stepsCount - 1);
    }

    let innerLeft = outerLeftRatio * innerWidth + handleWidth / 2;
    let innerTop = outerTopRatio * innerHeight + handleHeight / 2;
    switch (mode) {
      case 'hor':
        innerTop = 0.5 * innerHeight + handleHeight / 2;
        break;
      case 'vert':
        innerLeft = 0.5 * innerWidth + handleWidth / 2;
        break;
    } //u may also develop reverce-square-circle math here (in circle case)

    $handle.css({
      transform: `translate3d(${innerLeft}px, ${innerTop}px, 0)`,
    });
  }
  let isMouseOnHandleDown = false;

  let touchHandleIdentifier = false;
  let touchPadIdentifier= false;

  function handleOnTouchStart(event){
    touchHandleIdentifier = wrapTouchStartAsMouseDown(event, handleOnMouseDown);
  }
  function handleOnMouseDown(event){
    if (!isMouseOnHandleDown) {
      event.preventDefault();
      isMouseOnHandleDown = true;
      $container.addClass('cirpad--handle-active');
      bratios[2] = isMouseOnHandleDown?1:0;
      handleOnMouseMove(event);
    }
  }

  function handleOnTouchMove(event){
    wrapTouchMoveAsMouseMove(event, touchHandleIdentifier, handleOnMouseMove);
  }
  function handleOnMouseMove(event){
    if (isMouseOnHandleDown) {
      event.preventDefault();
      let padOffset = $padInner.offset();
      let topDiff = event.pageY - padOffset.top - handleWidth / 2;
      let leftDiff = event.pageX - padOffset.left - handleHeight / 2;
      let x = (leftDiff / (width - handleWidth)) * 2 - 1;
      let y = (topDiff / (height - handleHeight)) * 2 - 1;
      if (stepsCount) {
        x = Math.round(x * (stepsCount - 1)) / (stepsCount - 1);
        y = Math.round(y * (stepsCount - 1)) / (stepsCount - 1);
      }
      switch (mode) {
        case 'circle':
          let len = Math.sqrt(x*x + y*y);
          if (len > 1) {
            x /= len;
            y /= len;
          }
          break;
        case 'rect':
          x = Math.max(-1, Math.min(1, x));
          y = Math.max(-1, Math.min(1, y));
          break;
        case 'hor':
          x = Math.max(-1, Math.min(1, x));
          y = 0.5;
          break;
        case 'vert':
          x = 0.5;
          y = Math.max(-1, Math.min(1, y));
          break;
      }

      bratios[0] = x;
      bratios[1] = -y;
      bratios[2] = isMouseOnHandleDown?1:0;
      updateHandlePosition();
      if (that.onInput) { that.onInput(bratios); }
    }
  }
  function handleOnTouchEnd(event){
    wrapTouchEndAsMouseUp(event, touchHandleIdentifier, handleOnMouseUp);
  }
  function handleOnMouseUp(event){
    if (isMouseOnHandleDown) {
      event.preventDefault();
      isMouseOnHandleDown = false;
      $container.removeClass('cirpad--handle-active');
      bratios[2] = isMouseOnHandleDown?1:0;
      if (that.onInput) { that.onInput(bratios); }
    }
  }




  function wrapTouchStartAsMouseDown(event, callback) {
    let touchIndex = event.changedTouches.length - 1;
    let changedTouch = event.changedTouches[touchIndex];
    if (!changedTouch) { return false; }
    event.pageX = changedTouch.pageX;
    event.pageY = changedTouch.pageY;
    callback(event);
    return changedTouch.identifier;
  }
  function wrapTouchMoveAsMouseMove(event, identifier, callback) {
    let changedTouch;
    for (let i=0; i<event.changedTouches.length; i++) {
      let tryChangedTouch = event.changedTouches[i];
      if (tryChangedTouch.identifier === identifier) {
        changedTouch = tryChangedTouch;
        break;
      }
    };
    if (!changedTouch) { return false; }
    event.pageX = changedTouch.pageX;
    event.pageY = changedTouch.pageY;
    callback(event);
  }
  function wrapTouchEndAsMouseUp(event, identifier, callback) {
    let changedTouch;
    for (let i=0; i<event.changedTouches.length; i++) {
      let tryChangedTouch = event.changedTouches[i];
      if (tryChangedTouch.identifier === identifier) {
        changedTouch = tryChangedTouch;
        break;
      }
    };
    if (!changedTouch) { return false; }
    callback(event);
  }

  that.onInput = null;
  that.setBratios = function(newBratios) {
    bratios = newBratios;
    updateHandlePosition();
  }
  init();
}
module.exports = Cirpad;