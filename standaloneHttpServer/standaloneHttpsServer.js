'use strict';
const logger = require("./logger");
//// Module dependencies.

let http = require('http');
let os = require('os'); //TODO: check
let app = require('./app');

// Read the SSL certificate and private key files.
const privateKeyPath = '/secret/private-key.pem';
const certificatePath = '/secret/certificate.pem';
const privateKey = fs.readFileSync(path.resolve(__dirname, privateKeyPath), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath), 'utf8');
const credentials = { key: privateKey, cert: certificate };

//// Get port from environment and store in Express.

let port = parseInt(process.env.HTTPS_PORT, 10) || 443;
app.set('port', port);

//// Create HTTP server.

const httpsServer = https.createServer(credentials, app);

//// Listen on provided port, on all network interfaces.

httpsServer.listen(port);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);
//// Used in logging

let bindName = (typeof port === 'string')
  ? 'pipe ' + port
  : 'port ' + port;

//// Event listener for HTTP httpsServer "error" event.

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

//// Event listener for HTTP httpsServer "listening" event.

function onListening() {
  let addr = httpsServer.address().address;
  logger.info('Listening ' + bindName + ' on ' + addr + ' (with os.hostname=' + os.hostname() + ')');
}