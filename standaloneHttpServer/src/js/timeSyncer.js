'use strict';
function TimeSyncer() {
  let that = this;
  const timePingIterationsMaxCount = 30;
  const timePingIterationDelay = 10;
  const padSyncIterationsMaxCount = 30;
  const padSyncIterationDelay = 10;
  function init() {
    let ptime = performance.now();
    let dtime = Date.now();
    that.lagsStat = {
      csPtimeLagMean: 0,
      csDtimeLagMean: 0,
      netPtimeLagMean: 200,
      netDtimeLagMean: 200,
      csPtimeLagDeviation: Infinity,
      csDtimeLagDeviation: Infinity,
      netPtimeLagDeviation: Infinity,
      netDtimeLagDeviation: Infinity,
      lags: [],
      lastUpdatedDtime: dtime,
    }
    that.diffsStat = {
      diffs: [],
      pdDiffMean: ptime - dtime,
      paDiffMean: ptime - teplite.audioCtx.currentTime * 1000,
      pdDiffDeviation: 10,
      paDiffDeviation: 100,
      lastUpdatedDtime: dtime,
    }
  }
  function delay(msec) {
    if (!teplite.halt) {
      return new Promise(function(resolve) {
          setTimeout(resolve, msec);
      });
    } else {
      return Promise.reject(new Error('delay stopped, because general halt'));
    }
  }
  function mean(array, eachElementValueCallback) {
    let sum = 0;
    array.forEach((elem)=>{
      sum += eachElementValueCallback(elem);
    });
    return sum / array.length;
  }
  function deviation(array, mean, eachElementValueCallback) {
    let dispSum = 0;
    array.forEach((elem)=>{
      let diff = eachElementValueCallback(elem) - mean;
      dispSum += diff * diff;
    });
    let disp = dispSum / array.length;
    let deviation = Math.sqrt(disp);
    return deviation;
  }
  function timePingIteration(socket, lags, iterationsCount) {
    if (iterationsCount < timePingIterationsMaxCount) {
      return timePingRequest(socket).then((timeSet)=>{
        let netPtimeLag = timeSet.pongClientPtime - timeSet.pingClientPtime;
        let netAtimeLag = timeSet.pongClientAtime - timeSet.pingClientAtime;
        let netDtimeLag = timeSet.pongClientDtime - timeSet.pingClientDtime;
        let csDtimeLagBrutto = timeSet.pongClientDtime - timeSet.pongServerDtime;
        let csDtimeLag = csDtimeLagBrutto - netDtimeLag / 2;
        let csPtimeLagBrutto = timeSet.pongClientPtime - timeSet.pongServerPtime;
        let csPtimeLag = csPtimeLagBrutto - netPtimeLag / 2;
        let lag = {
          netPtimeLag: netPtimeLag,
          netAtimeLag: netAtimeLag,
          netDtimeLag: netDtimeLag,
          csPtimeLag: csPtimeLag,
          csDtimeLag: csDtimeLag,
        };
        lags[iterationsCount] = lag;
      }).catch((err)=>{
        throw(err);
      }).then(()=>{
        iterationsCount++;
        if (that.onTimePingUpdate) {that.onTimePingUpdate(iterationsCount / timePingIterationsMaxCount)}
        return delay(timePingIterationDelay).then(()=>{
          return timePingIteration(socket, lags, iterationsCount);
        });
      });
    } else {
      return Promise.resolve(lags);
    }
  }

  function timePingRequest(socket) {
    return new Promise((resolve, reject) => {
      let pingClientPtime;
      let pingClientAtime;
      let pingClientDtime;
      function pongCallback(pongServerPtime, pongServerDtime) {
      let pongClientPtime = performance.now();
      let pongClientAtime = teplite.audioCtx.currentTime;
      let pongClientDtime = Date.now();
        let timeSet = {
          pingClientPtime: pingClientPtime,
          pingClientAtime: pingClientAtime,
          pingClientDtime: pingClientDtime,
          pongClientPtime: pongClientPtime,
          pongClientAtime: pongClientAtime,
          pongClientDtime: pongClientDtime,
          pongServerPtime: pongServerPtime,
          pongServerDtime: pongServerDtime,
        };
        resolve(timeSet);
      }
      function pongTimeout() {
        reject(new Error('Server Response from timePing is too long (>5000ms), to sync.'))
      }
      pingClientPtime = performance.now();
      pingClientAtime = teplite.audioCtx.currentTime;
      pingClientDtime = Date.now();
      socket.emit('timePing', pongCallback);
      setTimeout(pongTimeout, 5000);
    });
  }
  function calcStatFromTimePingLags(lags) {
    lags.forEach((lag)=>{
      lag.unlisted = true;
    })
    let lagsSorted = lags.slice().sort((a, b)=> {
      return a.netPtimeLag - b.netPtimeLag;
    });
    let chopLongest = Math.floor(lags.length / 10);
    let chopShortest = Math.floor(lags.length / 10);
    let lagsSortedChoped = lagsSorted.slice(chopShortest, -chopLongest);

    lagsSortedChoped.forEach((lag)=>{
      delete lag.unlisted;
    })

    let csPtimeLagMean = mean(lagsSortedChoped, (elem)=>{
      return elem.csPtimeLag;
    });
    let csDtimeLagMean = mean(lagsSortedChoped, (elem)=>{
      return elem.csDtimeLag;
    });
    let netPtimeLagMean = mean(lagsSortedChoped, (elem)=>{
      return elem.netPtimeLag;
    });
    let netDtimeLagMean = mean(lagsSortedChoped, (elem)=>{
      return elem.netDtimeLag;
    });

    let csPtimeLagDeviation = deviation(lagsSortedChoped, csPtimeLagMean, (elem)=>{
      return elem.csPtimeLag;
    });
    let csDtimeLagDeviation = deviation(lagsSortedChoped, csDtimeLagMean, (elem)=>{
      return elem.csDtimeLag;
    });
    let netPtimeLagDeviation = deviation(lagsSortedChoped, netPtimeLagMean, (elem)=>{
      return elem.netPtimeLag;
    });
    let netDtimeLagDeviation = deviation(lagsSortedChoped, netDtimeLagMean, (elem)=>{
      return elem.netDtimeLag;
    });

    let lagsStat = {
      lags: lags,
      csPtimeLagMean: csPtimeLagMean,
      csDtimeLagMean: csDtimeLagMean,
      netPtimeLagMean: netPtimeLagMean,
      netDtimeLagMean: netDtimeLagMean,
      csPtimeLagDeviation: csPtimeLagDeviation,
      csDtimeLagDeviation: csDtimeLagDeviation,
      netPtimeLagDeviation: netPtimeLagDeviation,
      netDtimeLagDeviation: netDtimeLagDeviation,
      lastUpdatedDtime: Date.now(),
    }
    return lagsStat;
  }

  function padSyncIteration(diffs, iterationsCount) {
    if (iterationsCount < padSyncIterationsMaxCount) {
      let dtime = Date.now();
      let atime = teplite.audioCtx.currentTime;
      let ptime = performance.now();
      diffs[iterationsCount] = {
        pdDiff: ptime - dtime,
        paDiff: ptime - atime * 1000,
      }
      iterationsCount++;
      return delay(padSyncIterationDelay).then(()=>{
          if (that.onPadSyncUpdate) {that.onPadSyncUpdate(iterationsCount / padSyncIterationsMaxCount)}
          return padSyncIteration(diffs, iterationsCount);
      });
    } else {
      return Promise.resolve(diffs);
    }
  }
  function calcStatFromPadSync(diffs) {
    let pdDiffSum = 0;
    let paDiffSum = 0;
    diffs.forEach((padDiff)=>{
      pdDiffSum += padDiff.pdDiff;
      paDiffSum += padDiff.paDiff;
    });
    let pdDiffMean = mean(diffs, (elem)=>{
      return elem.pdDiff;
    });
    let paDiffMean = mean(diffs, (elem)=>{
      return elem.paDiff;
    });

    let pdDiffDeviation = deviation(diffs, pdDiffMean, (elem)=>{
      return elem.pdDiff;
    });
    let paDiffDeviation = deviation(diffs, paDiffMean, (elem)=>{
      return elem.paDiff;
    });

    let diffsStat = {
      diffs: diffs,
      pdDiffMean: pdDiffMean,
      paDiffMean: paDiffMean,
      pdDiffDeviation: pdDiffDeviation,
      paDiffDeviation: paDiffDeviation,
      lastUpdatedDtime: Date.now(),
    }
    return diffsStat;
  }
  that.lagsStat = null;
  that.diffsStat = null;
  that.onTimePingUpdate = null;
  that.onPadSyncUpdate = null;
  that.onTimePingEnd = null;
  that.onPadSyncEnd = null;

  that.timePingStartRoutine = function(socket) {
    let timePingLags = [];
    let timePingIterationsCount = 0;
    return timePingIteration(socket, timePingLags, timePingIterationsCount).then((timePingLags)=>{
      that.lagsStat = calcStatFromTimePingLags(timePingLags);
      if (that.onTimePingEnd) {that.onTimePingEnd();}
    });
  }
  that.padSyncStartRoutine = function() {
    let padSyncDiffs = [];
    let padSyncIterationsCount = 0;
    return padSyncIteration(padSyncDiffs, padSyncIterationsCount).then((padSyncDiffs)=>{
      that.diffsStat = calcStatFromPadSync(padSyncDiffs);
      if (that.onPadSyncEnd) {that.onPadSyncEnd();}
    })
  }
  init();
}
module.exports = TimeSyncer;