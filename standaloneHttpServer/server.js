'use strict';
const logger = require("./logger");
//// Module dependencies.

let http = require('http');
let os = require('os'); //TODO: check
let Sio = require('socket.io');
let app = require('./app');
let SioServer = require('./sioServer');

//// Get port from environment and store in Express.

let port = parseInt(process.env.PORT, 10) || 80;
app.set('port', port);

//// Create HTTP server.

let httpServer = http.createServer(app);

//// Socket.io plugging into server (not to an app)

let sio = Sio(httpServer);
let sioServer = SioServer(sio);

//// Listen on provided port, on all network interfaces.

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);
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
  let addr = httpServer.address().address;
  logger.info('Listening ' + bindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}
