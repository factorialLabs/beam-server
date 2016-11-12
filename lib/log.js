const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'beam' });

module.exports = log;
