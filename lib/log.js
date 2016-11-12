const bunyan = require('bunyan');
const config = require('../config/bunyan');
const env = require('./environment').env;

const log = bunyan.createLogger(config[env]);

module.exports = log;
