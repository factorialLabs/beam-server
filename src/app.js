var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var path = require('path');
var passport = require('passport');
var expressValidator = require('express-validator');

var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var socketController = require('./controllers/socket');

var secrets = require('../config/secrets');
var passportConf = require('../config/passport');

/**
 * Create Express server.
 */
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
/**
 *  Socket connection endpoints
 */
socketController.setIo(io);

/**
 * Primary app routes.
 */
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout, socketController.logout);
app.post('/forgot', userController.postForgot);
app.post('/reset/:token', userController.postReset);
app.post('/signup', userController.postSignup);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

/**
 * API Routes
 */
app.post('/api/login', apiController.postLogin);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
http.listen(app.get('port'), function(){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
