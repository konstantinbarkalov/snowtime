'use strict';
const logger = require("./logger");

let path = require('path');
let express = require('express');
let sassMiddleware = require('node-sass-middleware');
let babelify = require('express-babelify-middleware');
let router = require('./router.js');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

// Note: you must place sass-middleware *before* `express.static` or else it will not work.
app.use('/css', sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'src', 'sass'),
    dest: path.join(__dirname, 'static', 'css'),
    debug: false,
    outputStyle: 'compressed',
}));
app.use('/js/app.js', babelify('src/js/app.js'));
const oneHour = 1000 * 60 * 60 * 0;
app.use(express.static(path.join(__dirname, 'static'), {immutable: true, maxAge: oneHour }));


app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = (req.app.get('env') === 'development') ? err : {};
  //res.locals.error = err;
  // render the error page
  res.status(err.status || 500);
  res.render('serversideError');
  //throw err;
});

module.exports = app;
