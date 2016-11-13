const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const log = require('../../lib/log').child({ module: 'models:user' });
const db = require('../../lib/db');
const TABLES = require('../constants/tables.json');

class User {

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

  static insert() {

  }

  addFriend() {

  }

  acceptFriend() {

  }
  
}

/**
 * Password hash middleware.
 */
// userSchema.pre('save', function(next) {
//   var user = this;
//   if (!user.isModified('password')) return next();
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });
//
// /**
//  * Helper method for validating user's password.
//  */
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };
//
// /**
//  * Helper method to add a friend (adds it into pending requests)
//  */
// userSchema.methods.addFriendInvite = function(toFriend, cb) {
//   //cannot be self
//   if(toFriend._id == this._id) {
//     cb({error: 'cannot befriend self'});
//   }
//   //check if already existing
//   var index = this.pending_friends.indexOf(toFriend._id);
//   if(index == -1){
//     this.pending_friends.push(toFriend.id);
//     this.save();
//     cb(null);
//   }else{
//     cb({error: 'existing pending request'});
//   }
// };
//
// /**
//  * Helper method to accept a friend request (adds it into friendlist)
//  */
// userSchema.methods.acceptFriendInvite = function(toAccept, cb) {
//   //check if there is an outstanding friend invite
//   var index = this.pending_friends.indexOf(toAccept._id);
//   if(index != -1){
//     cb({error: 'no such request'});
//   }else{
//     this.friends.push(toAccept._id);
//     //remove pending invite
//     this.pending_friends.splice(index, 1);
//     cb(null);
//   }
// };

module.exports = User;
