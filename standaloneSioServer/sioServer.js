'use strict';
const logger = require("./logger");
const { performance } = require('perf_hooks');
const Party = require("./party");
const gracefulShutdown = require('./gracefulShutdown.js');
let SioServer = function(sio) {
  let parties = {};
  function onShutdown() {
    sio.emit('inform', {headerHtml: 'Сорян', messageHtml: 'Этот сервер отправлен в перезагрузку. Судя по всему накатывается обновление или что-то вроде того.'});
    sio.emit('partyOver');
    console.log('gracefully shutdown');
  }
  gracefulShutdown(onShutdown);
  function processConnection(socket) {
    socket.on('timePing', (pongCallback) => {
      let pongServerDtime = Date.now();
      let pongServerPtime = performance.now();
      if (pongCallback) { pongCallback(pongServerPtime, pongServerDtime); }
    });
    socket.on('createOrJoinParty', (partyName, password, username, createOrJoinPartyCallback) => {
      let party = parties[partyName];
      if (party) {
        logger.verbose('createOrJoinParty request received and party is exist already.');
        if (party.checkPassword(password)) {
          logger.verbose(`password ${password} is ok`);
          party.join(socket);
          if (createOrJoinPartyCallback) { createOrJoinPartyCallback(); }
          return;
        } else {
          logger.verbose(`password ${password} is NOT ok`);
          if (createOrJoinPartyCallback) { createOrJoinPartyCallback('wrong password'); }
          return;
        }
      } else {
        logger.verbose('createOrJoinParty request received and new party will be created.');
        logger.verbose(`password will be ${password}`);
        party = new Party(sio, socket, partyName, password, username);
        party.onDestroy = function() {
          delete parties[partyName];
        }
        parties[partyName] = party;
        if (createOrJoinPartyCallback) { createOrJoinPartyCallback(); }
        return;
      }
    });
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
  }
  sio.on('connection', function(socket) {
    logger.info('Socket io user connected: ', sio.sockets.sockets.size);
    processConnection(socket);
  });

  function aliveIteration() {
    for (const socket of sio.sockets.sockets.values()) {
      // yep, it's per each, not a loudcast, it's for debug
      socket.emit('alive', { message: 'still alive!', id: socket.id });
    }
  }
  setInterval(aliveIteration, 10000);

  function debugLoop() {
    let stat = buildStatObject();
    logger.debug('----------');
    let statKeys = Object.keys(stat);
    statKeys.forEach((statKey)=>{
      logger.debug(statKey + ': ' + JSON.stringify(stat[statKey], 2, true));
    })
    //  TODO remove if everything is OK
    let partyNames = Object.keys(parties);
    let notFoundRoomPartyName = partyNames.find((partyName)=>{
      return !sio.sockets.adapter.rooms.has(partyName);
    })

    if (notFoundRoomPartyName) {
      logger.error('no sioRoom found, but party present, name ' + notFoundRoomPartyName);
    } else {
      logger.debug('all sioRooms present');
    }
    // /TODO remove if everything is OK
    logger.debug('----------');
  }
  setInterval(debugLoop, 5000);
  function buildStatObject() {
    let partyKeys = Object.keys(parties);
    let nowPtime = performance.now();
    let timesum = 0;
    partyKeys.forEach((partyKey)=>{
      let party = parties[partyKey];
      timesum += nowPtime - party.partyStartedPtime;
    });
    let stat = {
      meanPartyTime: timesum / 1000 / partyKeys.length,
      partiesCount: partyKeys.length,
      clientsCount: sio.sockets.sockets.size,
      roomsCount: sio.sockets.adapter.rooms.size,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    }
    return stat;
  }

}
module.exports = SioServer;