const db = require('../../lib/db');
const TABLES = require('../constants/tables.json');

const log = require('../../lib/log').child({ module: 'models:friend' });

class Friend {
  static getFriends(id) {
    return db(TABLES.FRIENDS).select('requestee').where({ requestor: id, accepted: true }).union(function () {
      this.select('requestor').from(TABLES.FRIENDS).where({ requestee: id, accepted: true });
    });
  }

  static create({ requestor, requestee }) {
    return db(TABLES.FRIENDS).insert({ requestor, requestee, accepted: false })
      .catch((err) => {
        log.error({ error: err.stack, requestor, requestee }, 'Error creating friend request');
      });
  }

  static accept({ requestor, requestee }) {
    return db(TABLES.FRIENDS).update({ accepted: true })
      .catch((err) => {
        log.error({ error: err.stack, requestor, requestee }, 'Error accepting friend request');
      });
  }
}

module.exports = Friend;
