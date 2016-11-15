const db = require('../../lib/db');
const TABLES = require('../constants/tables.json');

const log = require('../../lib/log').child({ module: 'models:friend' });

class Friend {
  static get({ requestor, requestee }) {

  }

  static create({ requestor, requestee }) {
    return db(TABLES.FRIENDS).insert({ requestor, requestee, accepted: false })
      .catch((err) => {
        log.error({ error: err.stack, requestor, requestee }, 'Error creating friend request');
      });
  }
}
