var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

const db = require('../../lib/db');
const TABLES = require('../constants/tables.json');

export default class User {

  // Example methods
  static get(selectParams) {
    return db.select(selectParams).from(TABLES.USERS)
            .then((rows) => {
              // Create a new User from each row
            })
            .catch((err) => {
              console.log(err);
              //Throw if desired
            });
  }
}

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method to add a friend (adds it into pending requests)
 */
userSchema.methods.addFriendInvite = function(toFriend, cb) {
  //cannot be self
  if(toFriend._id == this._id) {
    cb({error: 'cannot befriend self'});
  }
  //check if already existing
  var index = this.pending_friends.indexOf(toFriend._id);
  if(index == -1){
    this.pending_friends.push(toFriend.id);
    this.save();
    cb(null);
  }else{
    cb({error: 'existing pending request'});
  }
};

/**
 * Helper method to accept a friend request (adds it into friendlist)
 */
userSchema.methods.acceptFriendInvite = function(toAccept, cb) {
  //check if there is an outstanding friend invite
  var index = this.pending_friends.indexOf(toAccept._id);
  if(index != -1){
    cb({error: 'no such request'});
  }else{
    this.friends.push(toAccept._id);
    //remove pending invite
    this.pending_friends.splice(index, 1);
    cb(null);
  }
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
