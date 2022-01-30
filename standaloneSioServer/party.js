'use strict';
const logger = require("./logger");
const { performance } = require('perf_hooks');
let Party = function(sio, ownerSocket, partyName, password) {
  let that = this;

  let hazeBratios = [0, 0, 0];
  let powerBratios = [0, 0, 0];
  let devunoBratios = [0, 0, 0];
  let devdosBratios = [0, 0, 0];
  let devtreBratios = [0, 0, 0];
  let devquaBratios = [0, 0, 0];
  let devquiBratios = [0, 0, 0];
  let hazeIsAutopilot = false;
  let powerIsAutopilot = false;
  let devunoIsAutopilot = false;
  let devdosIsAutopilot = false;
  let devtreIsAutopilot = false;
  let devquaIsAutopilot = false;
  let devquiIsAutopilot = false;
  let rgbSeeds = [
    { r: 234 / 256, g: 12 / 256, b: 44 / 256},
    { r: 34 / 256, g: 212 / 256, b: 104 / 256},
  ];
  let isSyncingMetro = false;
  let autopilotSeed = Math.random();
  function init() {
    if (sio.sockets.adapter.rooms.has(partyName)) {
      throw new Error('Room already exist.');
    }
    startParty();
    join(ownerSocket).then(()=>{
      logger.info('Party is created, name: '+ partyName);
    })
  }

  function startParty() {
    that.partyStartedPtime = performance.now();
    sio.in(partyName).emit('partyStart', that.partyStartedPtime,
                                         hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
                                         hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
                                         rgbSeeds, autopilotSeed,
                                         isSyncingMetro);

  }
  function disconnectCallback(reason, socket) {
    let sockets = sio.sockets.adapter.rooms.get(partyName);
    if (!sockets || !sockets.size) {
      destroy();
    } else {
      if (socket === ownerSocket) {
        const otherSocket = sockets.values().next().value;
        setOwner(otherSocket); // hope, that previous owner is not in list now already
      }
    }
  }

  function setOwner(newOwnerSocket) {
    if (ownerSocket && ownerSocket !== newOwnerSocket) {
      logger.verbose('Owner changed in party, name: '+ partyName);
      ownerSocket.emit('youAreNotOwner');
    }
    ownerSocket = newOwnerSocket;
    ownerSocket.emit('youAreOwner');
  }
  function join(socket) {
    logger.info('Someone joins to party, name: '+ partyName);
    socket.on('disconnect', disconnectCallback);
    socket.on('isSyncingMetro', (newIsSyncingMetro) => {
      isSyncingMetro = newIsSyncingMetro;
      logger.verbose('isSyncingMetro is here', newIsSyncingMetro);
      socket.broadcast.to(partyName).emit('isSyncingMetro', newIsSyncingMetro);
    });
    socket.on('hazeBratios', (newHazeBratios) => {
      hazeBratios = newHazeBratios;
      //logger.verbose('hazeBratios is here', newHazeBratios);
      socket.broadcast.to(partyName).emit('hazeBratios', newHazeBratios);
    });
    socket.on('powerBratios', (newPowerBratios) => {
      powerBratios = newPowerBratios;
      //logger.verbose('powerBratios is here', newPowerBratios);
      socket.broadcast.to(partyName).emit('powerBratios', newPowerBratios);
    });
    socket.on('devunoBratios', (newDevunoBratios) => {
      devunoBratios = newDevunoBratios;
      //logger.verbose('devunoBratios is here', newDevunoBratios);
      socket.broadcast.to(partyName).emit('devunoBratios', newDevunoBratios);
    });
    socket.on('devdosBratios', (newDevdosBratios) => {
      devdosBratios = newDevdosBratios;
      //logger.verbose('devdosBratios is here', newDevdosBratios);
      socket.broadcast.to(partyName).emit('devdosBratios', newDevdosBratios);
    });
    socket.on('devtreBratios', (newDevtreBratios) => {
      devtreBratios = newDevtreBratios;
      //logger.verbose('devtreBratios is here', newDevtreBratios);
      socket.broadcast.to(partyName).emit('devtreBratios', newDevtreBratios);
    });
    socket.on('devquaBratios', (newDevquaBratios) => {
      devquaBratios = newDevquaBratios;
      //logger.verbose('devquaBratios is here', newDevquaBratios);
      socket.broadcast.to(partyName).emit('devquaBratios', newDevquaBratios);
    });
    socket.on('devquiBratios', (newDevquiBratios) => {
      devquiBratios = newDevquiBratios;
      //logger.verbose('devquiBratios is here', newDevquiBratios);
      socket.broadcast.to(partyName).emit('devquiBratios', newDevquiBratios);
    });

    socket.on('hazeIsAutopilot', (newHazeIsAutopilot) => {
      hazeIsAutopilot = newHazeIsAutopilot;
      //logger.verbose('hazeIsAutopilot is here', newHazeIsAutopilot);
      socket.broadcast.to(partyName).emit('hazeIsAutopilot', newHazeIsAutopilot);
    });
    socket.on('powerIsAutopilot', (newPowerIsAutopilot) => {
      powerIsAutopilot = newPowerIsAutopilot;
      //logger.verbose('powerIsAutopilot is here', newPowerIsAutopilot);
      socket.broadcast.to(partyName).emit('powerIsAutopilot', newPowerIsAutopilot);
    });
    socket.on('devunoIsAutopilot', (newDevunoIsAutopilot) => {
      devunoIsAutopilot = newDevunoIsAutopilot;
      //logger.verbose('devunoIsAutopilot is here', newDevunoIsAutopilot);
      socket.broadcast.to(partyName).emit('devunoIsAutopilot', newDevunoIsAutopilot);
    });
    socket.on('devdosIsAutopilot', (newDevdosIsAutopilot) => {
      devdosIsAutopilot = newDevdosIsAutopilot;
      //logger.verbose('devdosIsAutopilot is here', newDevdosIsAutopilot);
      socket.broadcast.to(partyName).emit('devdosIsAutopilot', newDevdosIsAutopilot);
    });
    socket.on('devtreIsAutopilot', (newDevtreIsAutopilot) => {
      devtreIsAutopilot = newDevtreIsAutopilot;
      //logger.verbose('devtreIsAutopilot is here', newDevtreIsAutopilot);
      socket.broadcast.to(partyName).emit('devtreIsAutopilot', newDevtreIsAutopilot);
    });
    socket.on('devquaIsAutopilot', (newDevquaIsAutopilot) => {
      devquaIsAutopilot = newDevquaIsAutopilot;
      //logger.verbose('devquaIsAutopilot is here', newDevquaIsAutopilot);
      socket.broadcast.to(partyName).emit('devquaIsAutopilot', newDevquaIsAutopilot);
    });
    socket.on('devquiIsAutopilot', (newDevquiIsAutopilot) => {
      devquiIsAutopilot = newDevquiIsAutopilot;
      //logger.verbose('devquiIsAutopilot is here', newDevquiIsAutopilot);
      socket.broadcast.to(partyName).emit('devquiIsAutopilot', newDevquiIsAutopilot);
    });

    return new Promise((resolve)=>{
      let sockets = sio.sockets.adapter.rooms.get(partyName);
      if (!sockets || !sockets.size) {
        setOwner(socket);
      }
      logger.verbose('preparing to join');
      socket.join(partyName, ()=>{
        logger.debug('joined');
        socket.emit('welcomeToParty', that.partyStartedPtime,
                                      hazeBratios, powerBratios, devunoBratios, devdosBratios, devtreBratios, devquaBratios, devquiBratios,
                                      hazeIsAutopilot, powerIsAutopilot, devunoIsAutopilot, devdosIsAutopilot, devtreIsAutopilot, devquaIsAutopilot, devquiIsAutopilot,
                                      rgbSeeds, autopilotSeed,
                                      isSyncingMetro);

        resolve();
      });
    })
  }
  function leave(socket) {
    return new Promise((resolve)=>{
      socket.emit('leave');
      socket.leave(partyName, ()=>{
        resolve();
      });
    })
  }
  function destroy() {
    if (that.onDestroy) { that.onDestroy(); }
    sio.in(partyName).emit('partyOver');
    let sockets = sio.sockets.adapter.rooms.get(partyName);
    if (sockets && sockets.size) {
      for (const socket of sockets.values()) {
        leave(socket);
      }
    }
  }
  that.partyStartedPtime = null;
  that.onDestroy = null;
  that.join = join;
  that.leave = leave;
  that.destroy = destroy;
  that.checkPassword = function (tryPassword) {
    return tryPassword === password;
  }
  init();
}
module.exports = Party;