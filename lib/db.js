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
const knexConfig = require('../config/knexfile');

const knex = require('knex')(knexConfig[env]);

module.exports = knex;
