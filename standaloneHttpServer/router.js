const logger = require("./logger");
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
  res.render('view', { title: 'snowtime.fun' });
});

router.post('/reportError', jsonParser, urlencodedParser, function(req, res, next) {
  logger.warn('client reported an error', req.body.message);
});

module.exports = router;
