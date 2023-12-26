'use strict';
const logger = require("./logger");
//// Module dependencies.


let https = require('https');
let fs = require('fs');
let path = require('path');
let os = require('os'); //TODO: check

let Sio = require('socket.io');
let SioServer = require('./sioServer');

// Read the SSL certificate and private key files.
const keyPath = './secret/privkey.pem';
const certPath = './secret/fullchain.pem';
const key = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
const cert = fs.readFileSync(path.join(__dirname, certPath), 'utf8');
const options = { key, cert };

//// Get port from environment and store in Express.

let httpsPort = parseInt(process.env.HTTPS_PORT, 10) || 443;
let sioPort = parseInt(process.env.SIO_PORT, 10) || 2023;

const httpsServer = https.createServer(options);


let sio = Sio(httpsServer, {
  maxHttpBufferSize: 1024 * 10, //10 kbytes
  serveClient: false,
  cors: {
    origin: "https://snowtime.live"
  },
});
let sioServer = SioServer(sio);



//// Listen on provided port, on all network interfaces.
httpsServer.listen(httpsPort);

//// Listen on provided port, on all network interfaces.
sio.listen(sioPort);




sio.on('error', onError);
sio.on('listening', onListening);
//// Used in logging

let bindName = (typeof sioPort === 'string')
  ? 'pipe ' + sioPort
  : 'port ' + sioPort;

//// Event listener for HTTPS httpServer "error" event.

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

//// Event listener for HTTPS httpServer "listening" event.

function onListening() {
  let addr = sio.address().address;
  logger.info('Listening ' + bindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}
