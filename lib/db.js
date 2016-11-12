/* Example usage
const db = require('./path/to/this/file');

db.select('email').from('users').where({ id: 1 })
  .then((rows) => {
    // Process
  })
  .catch((err) => {
    // handle
  });

NOTE: Knex uses Bluebird
*/
const env = require('./environment').env;
const log = require('./log');
const knexConfig = require('../knexfile');

log.debug(env);
log.debug(knexConfig);
log.debug(knexConfig[env]);
log.debug(knexConfig['development']);
const knex = require('knex')(knexConfig[env]);

module.exports = knex;
