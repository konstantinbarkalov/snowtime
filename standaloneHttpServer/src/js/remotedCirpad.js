'use strict';
const Cirpad = require('./cirpad.js');

function RemotedCirpad($container, mode, stepsCount, autopilot) {
  let that = this;
  let remoteIsAutopilot = false;
  let remoteBratios = null;
  let bratios = null;
  let $cirad = $container.find('.cirpad');
  let $buttonAutopilot = $container.find('.remoted-cirpad__button--autopilot');
  let $buttonSend = $container.find('.remoted-cirpad__button--send');
  let $buttonReceive = $container.find('.remoted-cirpad__button--receive');
  $buttonAutopilot.on('click', toggleAutopilot);
  $buttonSend.on('click', toggleSend);
  $buttonReceive.on('click', toggleReceive);
  let isInput = false;
  let isAutopilot = false;
  let isSend = true;
  let isReceive = true;
  function init() {
    updateStyles();
  }
  function toggleAutopilot() {
    isAutopilot = !isAutopilot;
    //if (isAutopilot) {
    //  isReceive = false;
    //}
    if (isSend) {
      remoteIsAutopilot = isAutopilot;
      that.onUpdateRemoteIsAutopilot(remoteIsAutopilot);
    }
    updateStyles();
  }
  function toggleSend() {
    isSend = !isSend;
    if (isSend && bratios) {
      remoteBratios = bratios;
      that.onUpdateRemoteBratios(remoteBratios);
    }
    updateStyles();
  }
  function toggleReceive() {
    isReceive = !isReceive;
    if (isReceive) {
      isAutopilot = remoteIsAutopilot;
      if (remoteBratios) {
        bratios = remoteBratios;
        cirpad.setBratios(bratios);
        that.onUpdateBratios(bratios);
      }
    }
    updateStyles();
  }
  function setIsInput(newIsInput) {
    if (isInput != newIsInput) {
      isInput = newIsInput;
      if (!isInput && isReceive && remoteBratios) {
        cirpad.setBratios(remoteBratios);
        // will fire that.onUpdateBratios(); in outer function (cirpad.onInput)
      }
      updateStyles();
    }
  }
  function updateStyles() {
    $buttonAutopilot.toggleClass('remoted-cirpad__button--active', isAutopilot && ! isInput);
    $buttonReceive.toggleClass('remoted-cirpad__button--active', isReceive && !isInput);
    $buttonSend.toggleClass('remoted-cirpad__button--active', isSend);
  }

  let cirpad = new Cirpad($cirad, mode, stepsCount);
  cirpad.onInput = function(newBratios) {
    bratios = newBratios;
    setIsInput(bratios[2] === 1);
    if (that.onUpdateBratios) {
      that.onUpdateBratios(bratios);
    }
    if (isSend) {
      remoteBratios = bratios;
      if (that.onUpdateRemoteBratios) {
        that.onUpdateRemoteBratios(remoteBratios);
      }
    }
  }
  autopilot.onAutopilotUpdate = function(newAutopilotBratios) {
    let remoteIsInput = isReceive && remoteBratios && remoteBratios[2] === 1;
    if (isAutopilot && !isInput && !remoteIsInput) {
      bratios = newAutopilotBratios;
      cirpad.setBratios(bratios);
      if (that.onUpdateBratios) {
        that.onUpdateBratios(bratios);
      }
      //if (isSend) { // TODO: rework as a isAutopilot sio event
      //  remoteBratios = bratios;
      //  if (that.onUpdateRemoteBratios) {
      //    that.onUpdateRemoteBratios(remoteBratios);
      //  }
      //}
    }
  }
  that.onUpdateBratios = null;
  that.onUpdateRemoteBratios = null;
  that.onUpdateRemoteIsAutopilot = null;
  that.setRemoteBratios = function(newRemoteBratios) {
    remoteBratios = newRemoteBratios;
    if (isReceive && !isInput) {
      bratios = remoteBratios;
      cirpad.setBratios(bratios);
      that.onUpdateBratios(bratios);
    }
  }
  that.setRemoteIsAutopilot = function(newRemoteIsAutopilot) {
    remoteIsAutopilot = newRemoteIsAutopilot;
    if (isReceive && !isInput) {
      isAutopilot = remoteIsAutopilot;
      updateStyles();
    }
  }
  // only AudioLaglessBeat and AudioSafeHexth is need for autopilot
  that.stepAudioLaglessBeat = function(beatNum) {
    if (isAutopilot && autopilot.stepAudioLaglessBeat) {
      autopilot.stepAudioLaglessBeat(beatNum);
    }
  }
  that.stepAudioSafeHexth = function(beatNum) {
    if (isAutopilot && autopilot.stepAudioSafeHexth) {
      autopilot.stepAudioSafeHexth(beatNum);
    }
  }
  that.tick = function() {
    if (isAutopilot) {
      autopilot.tick();
    }
  }
  init();

}
module.exports = RemotedCirpad;