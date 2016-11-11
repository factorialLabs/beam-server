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

// TODO: REFACTOR THIS
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'beam_development',
    debug: true
  }
});

module.exports = knex;
