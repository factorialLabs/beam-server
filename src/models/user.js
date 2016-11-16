const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const log = require('../../lib/log').child({ module: 'models:user' });
const db = require('../../lib/db');
const Friend = require('./friend');
const TABLES = require('../constants/tables.json');

function securePassword(password) {
  return bcrypt.genSaltAsync(10)
    .then((salt) => {
      return bcrypt.hashAsync(password, salt, null);
    })
    .catch((err) => {
      log.error({ error: err.stack }, 'Error hashing/salting password');
      throw err;
    });
}

class User {
  constructor(params) {
    this.id = params.id;
    this.password = params.password;
    this.email = params.email;
    this.username = params.username;
    this.password_reset_token = params.password_reset_token;
    this.password_reset_token_expiry = params.password_reset_token_expiry;
  }

  // Example methods
  static get(selectParams, whereParams) {
    return db.select(selectParams).from(TABLES.USERS).where(whereParams)
            .then((rows) => {
              if (!rows) {
                return [];
              }

              return rows.map(row => new User(row));
            })
            .catch((err) => {
              log.error({ error: err.stack }, 'Error getting User');
            });
  }

  static create({ username, email, password }) {
    return securePassword(password)
    .then((hashedPassword) => {
      return db(TABLES.USERS).insert({ username, email, password: hashedPassword })
    })
    .then((newUser) => {
      log.debug('User Created!');
      const user = new User({ id: newUser.rowCount, username, email });
      return user;
    });
  }


  addFriend(friendId) {
    return Friend.create({ requestor: this.id, requestee: friendId });
  }

  acceptFriend(friendId) {
    return Friend.accept({ requestor: friendId, requestee: this.id });
  }

  getFriends() {
    return Friend.getFriends(this.id)
      .then((ids) => {

      })
  }

  validatePassword(provided) {
    return bcrypt.compareAsync(provided, this.password)
      .catch((err) => {
        log.error({ error: err.stack }, 'Error validating password');
        throw err;
      });
  }
}

module.exports = User;
