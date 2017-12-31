'use strict';
const StatusinfoFrameStat = require('./statusinfoFrameStat.js');
const StatusinfoPhisicStat = require('./statusinfoPhisicStat.js');
const StatusinfoNetStat = require('./statusinfoNetStat.js');
const StatusinfoPaDiffDeviation = require('./statusinfoPaDiffDeviation.js');
const StatusinfoNetPtimeLagMean = require('./statusinfoNetPtimeLagMean.js');
const StatusinfoCsPtimeLagDeviation = require('./statusinfoCsPtimeLagDeviation.js');
function Statusbar($statusbar) {
  let that = this;
  let netPtimeLagMean = null;
  let csPtimeLagDeviation = null;
  let paDiffDeviation = null;

  let frameStat = {
    ps: null,
    dutyRatio: null,
  }
  let phisicStat = {
    ps: null,
    dutyRatio: null,
  };
  let netStat = {
    isConnected: null,
    lastSignalPtime: null,
  };
  let statusinfoFrameStat = null;
  let blockFrameStat = null;
  let $blockFrameStat = null;
  let $frameStat = null;

  let statusinfoPhisicStat = null;
  let blockPhisicStat = null;
  let $blockPhisicStat = null;
  let $phisicStat = null;

  let statusinfoNetStat = null;
  let blockNetStat = null;
  let $blockNetStat = null;
  let $netStat = null;


  let statusinfoPaDiffDeviation = null;
  let blockPaDiffDeviation = null;
  let $blockPaDiffDeviation = null;
  let $paDiffDeviation = null;

  let statusinfoNetPtimeLagMean = null;
  let blockNetPtimeLagMean = null;
  let $blockNetPtimeLagMean = null;
  let $netPtimeLagMean = null;

  let statusinfoCsPtimeLagDeviation = null;
  let blockCsPtimeLagDeviation = null;
  let $blockCsPtimeLagDeviation = null;
  let $csPtimeLagDeviation = null;

  let $$netblocks = null; // many __block (only those, who need to be hidden when offline)
  //let $blocks = null; // one __blocks (used just for styling on active)

  let $netPtimeLagMeanReadyRatio = null;
  let $csPtimeLagDeviationReadyRatio = null;
  let $paDiffDeviationReadyRatio = null;
  let $audiosamplesDownloadReadyRatio = null;
  let $VideotexturesDownloadReadyRatio = null;
  let $audiosamplesDownloadBar = null;
  let $VideotexturesDownloadBar = null;

  let netPtimeLagMeanReadyRatio = 0;
  let csPtimeLagDeviationReadyRatio = 0;
  let paDiffDeviationReadyRatio = 0;
  let audiosamplesDownloadReadyRatio = 0;
  let VideotexturesDownloadReadyRatio = 0;
  function init() {
    $blockNetPtimeLagMean = $statusbar.find('.statusbar__block--net-ptime-lag-mean');
    $netPtimeLagMean = $blockNetPtimeLagMean.find('.statusbar__block-value');

    $blockCsPtimeLagDeviation = $statusbar.find('.statusbar__block--cs-ptime-lag-deviation');
    $csPtimeLagDeviation = $blockCsPtimeLagDeviation.find('.statusbar__block-value');

    $blockPaDiffDeviation = $statusbar.find('.statusbar__block--pa-diff-deviation');
    $paDiffDeviation = $blockPaDiffDeviation.find('.statusbar__block-value');


    $blockFrameStat = $statusbar.find('.statusbar__block--frame-stat');
    $frameStat = $blockFrameStat.find('.statusbar__block-value');

    $blockPhisicStat = $statusbar.find('.statusbar__block--phisic-stat');
    $phisicStat = $blockPhisicStat.find('.statusbar__block-value');

    $blockNetStat = $statusbar.find('.statusbar__block--net-stat');
    $netStat = $blockNetStat.find('.statusbar__block-value');

    $$netblocks = $blockNetPtimeLagMean.add($blockNetStat).add($blockCsPtimeLagDeviation);
    //$blocks = $statusbar.find('.statusbar__blocks');

    $netPtimeLagMeanReadyRatio = $blockNetPtimeLagMean.find('.statusbar__block-ready-ratio');
    $csPtimeLagDeviationReadyRatio = $blockCsPtimeLagDeviation.find('.statusbar__block-ready-ratio');
    $paDiffDeviationReadyRatio = $blockPaDiffDeviation.find('.statusbar__block-ready-ratio');
    $audiosamplesDownloadReadyRatio = $statusbar.find('.statusbar__bar-ready-ratio--audiosamples-download');
    $audiosamplesDownloadBar = $statusbar.find('.statusbar__bar--audiosamples-download');

    $VideotexturesDownloadReadyRatio = $statusbar.find('.statusbar__bar-ready-ratio--textures-download');
    $VideotexturesDownloadBar = $statusbar.find('.statusbar__bar--textures-download');

    $blockFrameStat.on('click', ()=>{
      if (statusinfoFrameStat.isOpened) {
        statusinfoFrameStat.close();
      } else {
        statusinfoFrameStat.open();
      }
      updateFrameStat();
      updateActiveState();
    });
    statusinfoFrameStat = new StatusinfoFrameStat($statusbar.find('.statusinfo--frame-stat'));
    statusinfoFrameStat.onClose = function() {
      updateFrameStat();
      updateActiveState();
    }

    $blockPhisicStat.on('click', ()=>{
      if (statusinfoPhisicStat.isOpened) {
        statusinfoPhisicStat.close();
      } else {
        statusinfoPhisicStat.open();
      };
      updatePhisicStat();
      updateActiveState();
    });
    statusinfoPhisicStat = new StatusinfoPhisicStat($statusbar.find('.statusinfo--phisic-stat'));
    statusinfoPhisicStat.onClose = function() {
      updatePhisicStat();
      updateActiveState();
    }

    $blockNetStat.on('click', ()=>{
      if (statusinfoNetStat.isOpened) {
        statusinfoNetStat.close();
      } else {
        statusinfoNetStat.open();
      };
      updateNetStat();
      updateActiveState();
    });
    statusinfoNetStat = new StatusinfoNetStat($statusbar.find('.statusinfo--net-stat'));
    statusinfoNetStat.onClose = function() {
      updateNetStat();
      updateActiveState();
    }


    $blockCsPtimeLagDeviation.on('click', ()=>{
      if (statusinfoCsPtimeLagDeviation.isOpened) {
        statusinfoCsPtimeLagDeviation.close();
      } else {
        statusinfoCsPtimeLagDeviation.open();
      };
      updateCsPtimeLagDeviation();
      updateActiveState();
    });
    statusinfoCsPtimeLagDeviation = new StatusinfoCsPtimeLagDeviation($statusbar.find('.statusinfo--cs-ptime-lag-deviation'));
    statusinfoCsPtimeLagDeviation.onClose = function() {
      updateCsPtimeLagDeviation();
      updateActiveState();
    }

    $blockNetPtimeLagMean.on('click', ()=>{
      if (statusinfoNetPtimeLagMean.isOpened) {
        statusinfoNetPtimeLagMean.close();
      } else {
        statusinfoNetPtimeLagMean.open();
      };
      updateNetPtimeLagMean();
      updateActiveState();
    });
    statusinfoNetPtimeLagMean = new StatusinfoNetPtimeLagMean($statusbar.find('.statusinfo--net-ptime-lag-mean'));
    statusinfoNetPtimeLagMean.onClose = function() {
      updateNetPtimeLagMean();
      updateActiveState();
    }

    $blockPaDiffDeviation = $statusbar.find('.statusbar__block--pa-diff-deviation');
    $blockPaDiffDeviation.on('click', ()=>{
      if (statusinfoPaDiffDeviation.isOpened) {
        statusinfoPaDiffDeviation.close();
      } else {
        statusinfoPaDiffDeviation.open();
      }
      updatePaDiffDeviation();
      updateActiveState();
    });
    statusinfoPaDiffDeviation = new StatusinfoPaDiffDeviation($statusbar.find('.statusinfo--pa-diff-deviation'));
    statusinfoPaDiffDeviation.onClose = function() {
      updatePaDiffDeviation();
      updateActiveState();
    }


    updateAll();
    let updateStatLoopIntervalId = setInterval(updateStatLoop, 1500);
    teplite.on('halt', (halt)=>{
      if (halt) {
        clearInterval(updateStatLoopIntervalId);
      }
    })
  }

  function updateStatLoop() {
    that.setFrameStat(teplite.stat.frame);
    that.setPhisicStat(teplite.stat.phisic);
    that.setNetStat(teplite.stat.net);
  };

  function updateAll() {
    updateNetBlocksVisibility();
    updateActiveState();
    updateErrorLevelState();
    let beforePrewarm = teplite.websiteStartedPtime + teplite.prewarmMsec - performance.now();
    if (beforePrewarm > 0) {
      setTimeout(updateErrorLevelState, 1000); // do updateErrorLevelState again, because need some time to gather stats before some of statusinfo's errorLevel will raised
    }
    updateErrorLevelState();
    updateNetPtimeLagMean();
    updateCsPtimeLagDeviation();
    updatePaDiffDeviation();
    updateFrameStat();
    updatePhisicStat();
    updateNetStat();
    updateNetPtimeLagMeanReadyRatio();
    updateCsPtimeLagDeviationReadyRatio();
    updatePaDiffDeviationReadyRatio();
    updateAudiosamplesDownloadReadyRatio();
    updateVideotexturesDownloadReadyRatio();
  };
  function prettyFloat(float){
    if (!!float || float === 0) {
      return float.toPrecision(3);
    } else {
      return '?';
    }
  }
  function prettyPercent(percent){
    if (!!percent || percent === 0) {
      return percent.toFixed(0) + '%';
    } else {
      return '?';
    }
  }
  function prettyPs(ps){
    if (!!ps || ps === 0) {
      return ps.toFixed(0);
    } else {
      return '?';
    }
  }
  function prettyLastSignalPtime(ptime){
    if (!!ptime || ptime === 0) {
      let diff = performance.now() - ptime;
      if (diff < 15000) {
        return '';
      } else {
        return (diff / 1000).toFixed(0);
      }
    } else {
      return '?';
    }
  }
  function prettyIsConnected(isConnected){
    if (isConnected) {
      return 'онлайн';
    } else {
      return 'оффлайн';
    }
  }
  function updateNetBlocksVisibility() {
    if (netStat.isConnected) {
      $$netblocks.css({display: 'flex'}); // lack of jQuery.show for flex :(
    } else {
      $$netblocks.css({display: 'none'}); // lack of jQuery.hide for flex :(
    }
  }
  function updateActiveState() {
    let isActive = statusinfoCsPtimeLagDeviation.isOpened ||
                   statusinfoFrameStat.isOpened ||
                   statusinfoNetPtimeLagMean.isOpened ||
                   statusinfoNetStat.isOpened ||
                   statusinfoPaDiffDeviation.isOpened ||
                   statusinfoPhisicStat.isOpened;
    $statusbar.toggleClass('statusbar--active', isActive);
  }
  function updateErrorLevelState() {
    let isRed = statusinfoCsPtimeLagDeviation.errorLevel === 'red' ||
                statusinfoFrameStat.errorLevel === 'red' ||
                statusinfoNetPtimeLagMean.errorLevel === 'red' ||
                statusinfoNetStat.errorLevel === 'red' ||
                statusinfoPaDiffDeviation.errorLevel === 'red' ||
                statusinfoPhisicStat.errorLevel === 'red';

    let isYellow = statusinfoCsPtimeLagDeviation.errorLevel === 'yellow' ||
                   statusinfoFrameStat.errorLevel === 'yellow' ||
                   statusinfoNetPtimeLagMean.errorLevel === 'yellow' ||
                   statusinfoNetStat.errorLevel === 'yellow' ||
                   statusinfoPaDiffDeviation.errorLevel === 'yellow' ||
                   statusinfoPhisicStat.errorLevel === 'yellow';
    let errorLevel = isRed ? 'red' : isYellow ? 'yellow' : null;
    $statusbar.toggleClass('statusbar--red', errorLevel === 'red');
    $statusbar.toggleClass('statusbar--yellow', errorLevel === 'yellow');

  }
  function updateNetPtimeLagMean() {
    $netPtimeLagMean.text(prettyFloat(netPtimeLagMean));
    statusinfoNetPtimeLagMean.setMean(netPtimeLagMean);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockNetPtimeLagMean.toggleClass('statusbar__block--red', statusinfoNetPtimeLagMean.errorLevel === 'red');
    $blockNetPtimeLagMean.toggleClass('statusbar__block--yellow', statusinfoNetPtimeLagMean.errorLevel === 'yellow');
    $blockNetPtimeLagMean.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoNetPtimeLagMean.isOpened);
  }


  function updateCsPtimeLagDeviation() {
    $csPtimeLagDeviation.text(prettyFloat(csPtimeLagDeviation));
    statusinfoCsPtimeLagDeviation.setDeviation(csPtimeLagDeviation);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockCsPtimeLagDeviation.toggleClass('statusbar__block--red', statusinfoCsPtimeLagDeviation.errorLevel === 'red');
    $blockCsPtimeLagDeviation.toggleClass('statusbar__block--yellow', statusinfoCsPtimeLagDeviation.errorLevel === 'yellow');
    $blockCsPtimeLagDeviation.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoCsPtimeLagDeviation.isOpened);
  }


  function updatePaDiffDeviation() {
    $paDiffDeviation.text(prettyFloat(paDiffDeviation));
    statusinfoPaDiffDeviation.setDeviation(paDiffDeviation);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockPaDiffDeviation.toggleClass('statusbar__block--red', statusinfoPaDiffDeviation.errorLevel === 'red');
    $blockPaDiffDeviation.toggleClass('statusbar__block--yellow', statusinfoPaDiffDeviation.errorLevel === 'yellow');
    $blockPaDiffDeviation.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoPaDiffDeviation.isOpened);
  }


  function updateFrameStat() {
    $frameStat.text(prettyPs(frameStat.ps_smooth) + ' | ' + prettyPercent(frameStat.dutyRatio_smooth * 100));
    statusinfoFrameStat.setFrameStat(frameStat);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockFrameStat.toggleClass('statusbar__block--red', statusinfoFrameStat.errorLevel === 'red');
    $blockFrameStat.toggleClass('statusbar__block--yellow', statusinfoFrameStat.errorLevel === 'yellow');
    $blockFrameStat.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoFrameStat.isOpened);
  }


  function updatePhisicStat() {
    $phisicStat.text(prettyPs(phisicStat.ps_smooth) + ' | ' + prettyPercent(phisicStat.dutyRatio_smooth * 100));
    statusinfoPhisicStat.setPhisicStat(phisicStat);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockPhisicStat.toggleClass('statusbar__block--red', statusinfoPhisicStat.errorLevel === 'red');
    $blockPhisicStat.toggleClass('statusbar__block--yellow', statusinfoPhisicStat.errorLevel === 'yellow');
    $blockPhisicStat.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoPhisicStat.isOpened);
  }

  function updateNetStat() {
    let secStr = prettyIsConnected(netStat.isConnected) + prettyLastSignalPtime(netStat.lastSignalPtime);
    $netStat.text(secStr);
    statusinfoNetStat.setNetStat(netStat);
    updateActiveState(); // because statusinfo may open itself if errorLevel raised
    $blockNetStat.toggleClass('statusbar__block--red', statusinfoNetStat.errorLevel === 'red');
    $blockNetStat.toggleClass('statusbar__block--yellow', statusinfoNetStat.errorLevel === 'yellow');
    $blockNetStat.toggleClass('statusbar__block--with-statusinfo-shown', statusinfoNetStat.isOpened);
  }

  function updateNetPtimeLagMeanReadyRatio() {
    $netPtimeLagMeanReadyRatio.css({
      width: ((1 - netPtimeLagMeanReadyRatio) * 100) + '%',
      'will-change': (netPtimeLagMeanReadyRatio>0 && netPtimeLagMeanReadyRatio<1)?'width':'',
    });
  }
  function updateCsPtimeLagDeviationReadyRatio() {
    $csPtimeLagDeviationReadyRatio.css({
      width: ((1 - csPtimeLagDeviationReadyRatio) * 100) + '%',
      'will-change': (csPtimeLagDeviationReadyRatio>0 && csPtimeLagDeviationReadyRatio<1)?'width':'',
    });
  }
  function updatePaDiffDeviationReadyRatio() {
    $paDiffDeviationReadyRatio.css({
      width: ((1 - paDiffDeviationReadyRatio) * 100) + '%',
      'will-change': (paDiffDeviationReadyRatio>0 && paDiffDeviationReadyRatio<1)?'width':'',
    });
  }
  function updateAudiosamplesDownloadReadyRatio() {
    $audiosamplesDownloadReadyRatio.css({
      width: (audiosamplesDownloadReadyRatio * 100) + '%',
      'will-change': (audiosamplesDownloadReadyRatio>0 && audiosamplesDownloadReadyRatio<1)?'width':'',
    });
    $audiosamplesDownloadBar.css({
      height: (audiosamplesDownloadReadyRatio === 1 || audiosamplesDownloadReadyRatio === 0)?'0':'2px',
      'will-change': (audiosamplesDownloadReadyRatio>0 && audiosamplesDownloadReadyRatio<1)?'height':'',
    });
  }
  function updateVideotexturesDownloadReadyRatio() {
    $VideotexturesDownloadReadyRatio.css({
      width: (VideotexturesDownloadReadyRatio * 100) + '%',
      'will-change': (VideotexturesDownloadReadyRatio>0 && VideotexturesDownloadReadyRatio<1)?'width':'',
    });
    $VideotexturesDownloadBar.css({
      height: (VideotexturesDownloadReadyRatio === 1 || VideotexturesDownloadReadyRatio === 0)?'0':'2px',
      'will-change': (VideotexturesDownloadReadyRatio>0 && VideotexturesDownloadReadyRatio<1)?'height':'',
    });
  }

  that.setNetPtimeLagMean = function(newNetPtimeLagMean) {
    if (netPtimeLagMean !== newNetPtimeLagMean) {
      netPtimeLagMean = newNetPtimeLagMean;
      updateNetPtimeLagMean();
      updateErrorLevelState();
    }
  }
  that.setCsPtimeLagDeviation = function(newCsPtimeLagDeviation) {
    if (csPtimeLagDeviation !== newCsPtimeLagDeviation) {
      csPtimeLagDeviation = newCsPtimeLagDeviation;
      updateCsPtimeLagDeviation();
      updateErrorLevelState();
    }
  }
  that.setPaDiffDeviation = function(newPaDiffDeviation) {
    if (paDiffDeviation !== newPaDiffDeviation) {
      paDiffDeviation = newPaDiffDeviation;
      updatePaDiffDeviation();
      updateErrorLevelState();
    }
  }
  that.setFrameStat = function(newFrameStat) {
    if (frameStat === newFrameStat || // since we cannot check
        frameStat.ps_smooth !== newFrameStat.ps_smooth ||
        frameStat.dutyRatio_smooth !== newFrameStat.dutyRatio_smooth) {
      frameStat = newFrameStat;
      updateFrameStat();
      updateErrorLevelState();
    }
  }
  that.setPhisicStat = function(newPhisicStat) {
    if (phisicStat === newPhisicStat || // since we cannot check
        phisicStat.ps_smooth !== newPhisicStat.ps_smooth ||
        phisicStat.dutyRatio_smooth !== newPhisicStat.dutyRatio_smooth) {
      phisicStat = newPhisicStat;
      updatePhisicStat();
      updateErrorLevelState();
    }
  }
  that.setNetStat = function(newNetStat) {
    if (netStat === newNetStat || // since we cannot check
        netStat.isConnected !== newNetStat.isConnected ||
        netStat.lastSignalPtime !== newNetStat.lastSignalPtime) {
      netStat = newNetStat;
      updateNetStat();
      updateErrorLevelState();
      updateNetBlocksVisibility();
    }
  }
  that.setNetPtimeLagMeanReadyRatio = function(newNetPtimeLagMeanReadyRatio) {
    if (netPtimeLagMeanReadyRatio !== newNetPtimeLagMeanReadyRatio) {
      netPtimeLagMeanReadyRatio = newNetPtimeLagMeanReadyRatio;
      updateNetPtimeLagMeanReadyRatio();
    }
  }
  that.setCsPtimeLagDeviationReadyRatio = function(newCsPtimeLagDeviationReadyRatio) {
    if (csPtimeLagDeviationReadyRatio !== newCsPtimeLagDeviationReadyRatio) {
      csPtimeLagDeviationReadyRatio = newCsPtimeLagDeviationReadyRatio;
      updateCsPtimeLagDeviationReadyRatio();
    }
  }
  that.setPaDiffDeviationReadyRatio = function(newPaDiffDeviationReadyRatio) {
    if (paDiffDeviationReadyRatio !== newPaDiffDeviationReadyRatio) {
      paDiffDeviationReadyRatio = newPaDiffDeviationReadyRatio;
      updatePaDiffDeviationReadyRatio();
    }
  }
  that.setAudiosamplesDownloadReadyRatio = function(newAudiosamplesDownloadReadyRatio) {
    if (audiosamplesDownloadReadyRatio !== newAudiosamplesDownloadReadyRatio) {
      audiosamplesDownloadReadyRatio = newAudiosamplesDownloadReadyRatio;
      updateAudiosamplesDownloadReadyRatio();
    }
  }
  that.setVideotexturesDownloadReadyRatio = function(newVideotexturesDownloadReadyRatio) {
    if (VideotexturesDownloadReadyRatio !== newVideotexturesDownloadReadyRatio) {
      VideotexturesDownloadReadyRatio = newVideotexturesDownloadReadyRatio;
      updateVideotexturesDownloadReadyRatio();
    }
  }

  init();
}
module.exports = Statusbar;