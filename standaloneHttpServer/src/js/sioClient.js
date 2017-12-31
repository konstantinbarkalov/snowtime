'use strict';
require('./teplite.js'); // global teplite singleton imported
const io = require('socket.io-client'); //because sio is standalone
function sioClient() {
  let that = this;
  let socket = null;

  function createOrJoinParty(roomname, password, username) {
    return new Promise((resolve, reject)=> {
      function createOrJoinPartyCallback(err, isCreatedNew) {
        if (err) {
          teplite.setEmit('stat.net.isConnected', false, that);
          if (err === 'wrong password') {
            teplite.gritter.addGrit('Комната уже существует, но пароль неверный.', 'warn');
          } else {
            teplite.gritter.addGrit(`Почему-то не удалось подключиться к комнате, официальная причина: ${err}`, 'warn');
          }
          reject(err);
        } else {
          teplite.setEmit('stat.net.isConnected', true, that);
          if (isCreatedNew) {
            teplite.gritter.addGrit('Создана новая комната', 'dev');
          } else {
            teplite.gritter.addGrit('Подключены к существующей комнате', 'dev');
          }
          resolve();
        }
      };
      socket.emit('createOrJoinParty', roomname, password, username, createOrJoinPartyCallback);
    })
  }
  function updateNetStatLastSignalPtime() {
    //teplite.setEmit('stat.net.lastSignalPtime', performance.now(), that);
    // let's do this silently, there is no need to broadcast it actually
    teplite.stat.net.lastSignalPtime =  performance.now();
  }
  function partyStart(partyStartedServerPtime,
    hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
    hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
    rgbSeeds, autopilotSeed,
    isSyncingMetro) {
    teplite.setEmit('squareTimer.partyStartedServerPtime', partyStartedServerPtime, that);
    teplite.setEmit('remoteHazeBratios', hazeBratios, that);
    teplite.setEmit('remotePowerBratios', powerBratios, that);
    teplite.setEmit('remoteDevunoBratios', devunoBratios, that);
    teplite.setEmit('remoteDevdosBratios', devdosBratios, that);
    teplite.setEmit('remoteDevtreBratios', devtreBratios, that);
    teplite.setEmit('remoteDevquaBratios', devquaBratios, that);
    teplite.setEmit('remoteDevquiBratios', devquiBratios, that);
    teplite.setEmit('remoteHazeIsAutopilot', hazeIsAutopilot, that);
    teplite.setEmit('remotePowerIsAutopilot', powerIsAutopilot, that);
    teplite.setEmit('remoteDevunoIsAutopilot', devunoIsAutopilot, that);
    teplite.setEmit('remoteDevdosIsAutopilot', devdosIsAutopilot, that);
    teplite.setEmit('remoteDevtreIsAutopilot', devtreIsAutopilot, that);
    teplite.setEmit('remoteDevquaIsAutopilot', devquaIsAutopilot, that);
    teplite.setEmit('remoteDevquiIsAutopilot', devquiIsAutopilot, that);
    teplite.setEmit('rgbSeeds', rgbSeeds, that);
    teplite.setEmit('autopilotSeed', autopilotSeed, that);
    teplite.setEmit('isSyncingMetro', isSyncingMetro, that);
  }
  function subscribeOnSioEvents() {
    socket.on('welcomeToParty', (partyStartedServerPtime,
      hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
      hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
      rgbSeeds, autopilotSeed,
      isSyncingMetro) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('welcomeToParty received', 'dev');
      partyStart(partyStartedServerPtime,
        hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
        hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
        rgbSeeds, autopilotSeed,
        isSyncingMetro);
    });
    socket.on('alive', (data) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('alive received', 'dev');
      socket.emit('alive', 'in reply to alive');
    });

    socket.on('partyStart', (partyStartedServerPtime,
      hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
      hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
      rgbSeeds, autopilotSeed,
      isSyncingMetro) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('partyStart received', 'dev');
      partyStart(partyStartedServerPtime,
        hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
        hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
        rgbSeeds, autopilotSeed,
        isSyncingMetro);
    });
    socket.on('partyOver', (data) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('partyOver received', 'dev');
    });
    socket.on('youAreOwner', (data) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('Вы — новый главарь!');
    });
    socket.on('youAreNotOwner', (data) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('Вы больше не главарь');
    });
    socket.on('inform', (informSet) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('inform received', 'dev');
      teplite.setEmit('inform', informSet, that);
    });
    socket.on('rgbSeeds', (rgbSeeds) => {
      updateNetStatLastSignalPtime();
      teplite.gritter.addGrit('rgbSeeds received', 'dev');
      teplite.setEmit('rgbSeeds', rgbSeeds, that);
    });
    socket.on('isSyncingMetro', (isSyncingMetro) => {
      teplite.gritter.addGrit('isSyncingMetro received', 'dev');
      teplite.setEmit('isSyncingMetro', isSyncingMetro, that);
    });
    socket.on('hazeBratios', (hazeBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteHazeBratios', hazeBratios, that);
    });

    socket.on('powerBratios', (powerBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remotePowerBratios', powerBratios, that);
    });

    socket.on('devunoBratios', (devunoBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevunoBratios', devunoBratios, that);
    });

    socket.on('devdosBratios', (devdosBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevdosBratios', devdosBratios, that);
    });

    socket.on('devtreBratios', (devtreBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevtreBratios', devtreBratios, that);
    });

    socket.on('devquaBratios', (devquaBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevquaBratios', devquaBratios, that);
    });

    socket.on('devquiBratios', (devquiBratios) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevquiBratios', devquiBratios, that);
    });


    socket.on('hazeIsAutopilot', (hazeIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteHazeIsAutopilot', hazeIsAutopilot, that);
    });

    socket.on('powerIsAutopilot', (powerIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remotePowerIsAutopilot', powerIsAutopilot, that);
    });

    socket.on('devunoIsAutopilot', (devunoIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevunoIsAutopilot', devunoIsAutopilot, that);
    });

    socket.on('devdosIsAutopilot', (devdosIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevdosIsAutopilot', devdosIsAutopilot, that);
    });

    socket.on('devtreIsAutopilot', (devtreIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevtreIsAutopilot', devtreIsAutopilot, that);
    });

    socket.on('devquaIsAutopilot', (devquaIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevquaIsAutopilot', devquaIsAutopilot, that);
    });

    socket.on('devquiIsAutopilot', (devquiIsAutopilot) => {
      updateNetStatLastSignalPtime();
      teplite.setEmit('remoteDevquiIsAutopilot', devquiIsAutopilot, that);
    });


    socket.on('disconnect', () => {
      that.disconnect();
    });
  }
  function subscribeOnTepliteEvents() {
    teplite.onSet('isSyncingMetro', () => {
      // without remote vars - beacuse no need of remotedCirpad functionality
      socket.emit('isSyncingMetro', teplite.isSyncingMetro);
    }, that);

    teplite.onSet('remoteHazeBratios', () => {
      socket.emit('hazeBratios', teplite.remoteHazeBratios);
    }, that);

    teplite.onSet('remotePowerBratios', () => {
      socket.emit('powerBratios', teplite.remotePowerBratios);
    }, that);

    teplite.onSet('remoteDevunoBratios', () => {
      socket.emit('devunoBratios', teplite.remoteDevunoBratios);
    }, that);

    teplite.onSet('remoteDevdosBratios', () => {
      socket.emit('devdosBratios', teplite.remoteDevdosBratios);
    }, that);

    teplite.onSet('remoteDevtreBratios', () => {
      socket.emit('devtreBratios', teplite.remoteDevtreBratios);
    }, that);

    teplite.onSet('remoteDevquaBratios', () => {
      socket.emit('devquaBratios', teplite.remoteDevquaBratios);
    }, that);

    teplite.onSet('remoteDevquiBratios', () => {
      socket.emit('devquiBratios', teplite.remoteDevquiBratios);
    }, that);

    teplite.onSet('remoteHazeIsAutopilot', () => {
      socket.emit('hazeIsAutopilot', teplite.remoteHazeIsAutopilot);
    }, that);

    teplite.onSet('remotePowerIsAutopilot', () => {
      socket.emit('powerIsAutopilot', teplite.remotePowerIsAutopilot);
    }, that);

    teplite.onSet('remoteDevunoIsAutopilot', () => {
      socket.emit('devunoIsAutopilot', teplite.remoteDevunoIsAutopilot);
    }, that);

    teplite.onSet('remoteDevdosIsAutopilot', () => {
      socket.emit('devdosIsAutopilot', teplite.remoteDevdosIsAutopilot);
    }, that);

    teplite.onSet('remoteDevtreIsAutopilot', () => {
      socket.emit('devtreIsAutopilot', teplite.remoteDevtreIsAutopilot);
    }, that);

    teplite.onSet('remoteDevquaIsAutopilot', () => {
      socket.emit('devquaIsAutopilot', teplite.remoteDevquaIsAutopilot);
    }, that);

    teplite.onSet('remoteDevquiIsAutopilot', () => {
      socket.emit('devquiIsAutopilot', teplite.remoteDevquiIsAutopilot);
    }, that);

  }

  that.timePingStartRoutine = function() {
    if (socket) {
      return teplite.timeSyncer.timePingStartRoutine(socket);
    } else {
      return Promise.reject(new Error('not sio socket to ping to'));
    }
  }

  that.connect = function(url, roomname, password, username) {
    teplite.gritter.addGrit('Подключаемся');
    let isFirstRun = !socket;
    if (url) {
    socket = io.connect(url);
    } else {
      socket = io();
    }
    subscribeOnSioEvents();
    if (isFirstRun) {
      subscribeOnTepliteEvents();
    }
    let welcomePromise = new Promise((resolve, reject)=>{
      socket.once('welcome', (data)=>{
        resolve();
      });
      setTimeout(()=>{
        let err = new Error('no welcome timeout');
        reject(err);
      }, 10000);
    });
    return welcomePromise.then(that.timePingStartRoutine).then(() => {return createOrJoinParty(roomname, password, username)});
  }
  that.disconnect = function() {
    teplite.setEmit('stat.net.isConnected', false, that);
    if (socket) {
      socket.disconnect();
    }
  }
}
module.exports = sioClient;