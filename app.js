/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiExamplesController = require('./controllers/api-examples');
var contactController = require('./controllers/contact');
var socketController = require('./controllers/socket');
/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Use JWT (tokens) as a way of doing auth
 */
var JwtStrategy = require('passport-jwt').Strategy;
passport.use(new JwtStrategy(secrets.jwt, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
      // or you could create a new account
    }
  });
}));

/**
 * Create Express server.
 */
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
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
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 *  Socket connection endpoints
 */
socketController.setIo(io);

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/apiEx', apiExamplesController.getApi);
app.get('/apiEx/lastfm', apiExamplesController.getLastfm);
app.get('/apiEx/nyt', apiExamplesController.getNewYorkTimes);
app.get('/apiEx/aviary', apiExamplesController.getAviary);
app.get('/apiEx/steam', apiExamplesController.getSteam);
app.get('/apiEx/stripe', apiExamplesController.getStripe);
app.post('/apiEx/stripe', apiExamplesController.postStripe);
app.get('/apiEx/scraping', apiExamplesController.getScraping);
app.get('/apiEx/twilio', apiExamplesController.getTwilio);
app.post('/apiEx/twilio', apiExamplesController.postTwilio);
app.get('/apiEx/clockwork', apiExamplesController.getClockwork);
app.post('/apiEx/clockwork', apiExamplesController.postClockwork);
app.get('/apiEx/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getFoursquare);
app.get('/apiEx/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getTumblr);
app.get('/apiEx/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getFacebook);
app.get('/apiEx/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getGithub);
app.get('/apiEx/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getTwitter);
app.post('/apiEx/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.postTwitter);
app.get('/apiEx/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getVenmo);
app.post('/apiEx/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.postVenmo);
app.get('/apiEx/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getLinkedin);
app.get('/apiEx/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiExamplesController.getInstagram);
app.get('/apiEx/yahoo', apiExamplesController.getYahoo);
app.get('/apiEx/paypal', apiExamplesController.getPayPal);
app.get('/apiEx/paypal/success', apiExamplesController.getPayPalSuccess);
app.get('/apiEx/paypal/cancel', apiExamplesController.getPayPalCancel);
app.get('/apiEx/lob', apiExamplesController.getLob);
app.get('/apiEx/bitgo', apiExamplesController.getBitGo);
app.post('/apiEx/bitgo', apiExamplesController.postBitGo);
app.get('/apiEx/bitcore', apiExamplesController.getBitcore);
app.post('/apiEx/bitcore', apiExamplesController.postBitcore);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});


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
