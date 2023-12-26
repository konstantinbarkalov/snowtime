'use strict';
const logger = require("./logger");
//// Module dependencies.

let http = require('https');
let https = require('https');
let fs = require('fs');
let path = require('path');
let os = require('os'); //TODO: check
let app = require('./app');

// Read the SSL certificate and private key files.
const keyPath = './secret/privkey.pem';
const certPath = './secret/fullchain.pem';
const key = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
const cert = fs.readFileSync(path.join(__dirname, certPath), 'utf8');
const options = { key, cert };

//// Get port from environment and store in Express.

let httpsPort = parseInt(process.env.HTTPS_PORT, 10) || 443;
let httpPort = parseInt(process.env.HTTP_PORT, 10) || 80;

app.set('port', httpsPort);

//// Create HTTPS server.

const httpsServer = https.createServer(options, app);

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
});

//// Listen on provided port, on all network interfaces.

httpServer.listen(httpPort);
httpServer.on('error', onHttpError);
httpServer.on('listening', onHttpListening);
httpsServer.listen(httpsPort);
httpsServer.on('error', onHttpsError);
httpsServer.on('listening', onHttpsListening);
//// Used in logging

let httpsBindName = (typeof httpsPort === 'string')
  ? 'pipe ' + httpsPort
  : 'port ' + httpsPort;

let httpBindName = (typeof httpPort === 'string')
  ? 'pipe ' + httpPort
  : 'port ' + httpPort;


//// Event listener for HTTPS httpsServer "error" event.

function onHttpsError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(httpsBindName + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(httpsBindName + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onHttpError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(httpBindName + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(httpBindName + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//// Event listener for HTTPS httpsServer "listening" event.

function onHttpListening() {
  let addr = httpServer.address().address;
  logger.info('Listening ' + httpBindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}
function onHttpsListening() {
  let addr = httpsServer.address().address;
  logger.info('Listening secure ' + httpsBindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}
