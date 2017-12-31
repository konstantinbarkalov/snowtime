'use strict';
const logger = require("./logger");
//// Module dependencies.

let os = require('os'); //TODO: check
let Sio = require('socket.io');
let SioServer = require('./sioServer');

let sio = Sio(null);
let sioServer = SioServer(sio);

let port = parseInt(process.env.PORT, 10) || 2018;

//// Listen on provided port, on all network interfaces.
sio.listen(port);
sio.on('error', onError);
sio.on('listening', onListening);
//// Used in logging

let bindName = (typeof port === 'string')
  ? 'pipe ' + port
  : 'port ' + port;

//// Event listener for HTTP httpServer "error" event.

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bindName + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bindName + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//// Event listener for HTTP httpServer "listening" event.

function onListening() {
  let addr = sio.address().address;
  logger.info('Listening ' + bindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}
