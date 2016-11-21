var _ = require('lodash');
var secrets = require('../../config/secrets');
var jwt = require('jwt-simple');
var passport = require('passport');
var User = require('../models/User');

/**
 * POST /api/login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json(errors); //return error and stop
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.json(401, { error: info.message });
        }

        //user has authenticated correctly thus we create a JWT token
        var token = jwt.encode({ email: user.email}, secrets.jwt.secretOrKey);
        res.json({ token : token });

    })(req, res, next);
};

/**
 * POST /api/signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('username', 'Username must be at least 4 characters long').len(4);
    req.assert('password', 'Password must be at least 4 characters long').len(4);

    var errors = req.validationErrors();

    if (errors) {
        res.json(errors); //return error and stop
        return;
    }

    User.first(['id', 'username', 'email'], { email : req.body.email }).then((user) => {
        if (user) {
            return res.json(401, { error: 'Account with that email address already exists.' });
        }

        User.create({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            }).then((user) => {
            if (!user) return res.status(500);
            return res.status(200);
            // auto login the user here
        });
    });
};
