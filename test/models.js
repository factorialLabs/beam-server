var chai = require('chai');
var assert = chai.assert;
var User = require('../src/models/user');
var mockKnex = require('mock-knex');
const db = require('../lib/db');
const tracker = mockKnex.getTracker();

// TODO: File for each model
// TODO: Wrapper for mockKnex
describe('User Model', () => {
  describe('User Model Creation', () => {
    let users = [];
    // TODO: put this into a beforeEach sometime
    before(() => {
      mockKnex.mock(db, 'knex@0.12');
      tracker.install();
      tracker.on('query', (query) => {
        if(query.method === 'insert') {
          console.log(query);
          users.push({ username: query.bindings[2], email: query.bindings[0], password: query.bindings[1] })
        }
        query.response(users);
      });
    });

    it('should create a new user', (done) => {
      User.create({username: "test", email: "test@test.com", password: "test"}).then((user)=>{
        User.first(['id', 'username', 'email'], {username : "test"}).then((user) => {
          assert.typeOf(user, 'object');
          assert.equal(user.username, "test");
          done();
        });
      });
    });

    it('should hash password when creating user', (done) => {
      User.create({username: "test2", email: "test2@test.com", password: "test2"}).then((user)=>{
        User.first(['password'], {username : "test2"}).then((user) => {
          assert.typeOf(user, 'object');
          assert.notEqual(user.password, "test2");
          // check for bcrypt password header
          assert.equal(user.password.slice(0,4), "$2a$")
          done();
        });
      });
    });

    after(() => {
      tracker.uninstall();
      mockKnex.unmock(db);
    });
  });

  describe('User Model Queries', () => {
    before(() => {
      mockKnex.mock(db, 'knex@0.12');
      tracker.install();
      const results = [
        {
          id:        1,
          username: 'A',
          email:     'a@mail.com'
        },
        {
          id:        2,
          username: 'B',
          email:     'b@mail.com'
        },
        {
          id:        3,
          username: 'C',
          email:     'c@mail.com'
        }
      ];
      tracker.on('query', (query) => {
        if(query.method === 'first') {
          query.response(results[0]);
        } else {
          query.response(results);
        }
      });
    });

    it('should find users by id', (done) => {
      User.getBulkById([1,2,3]).then((users) => {
        assert.lengthOf(users, 3);
        done();
      });
    });

    it('should find first user by query', (done) => {
      User.first(['id', 'username', 'email'], {id : 1}).then((user) => {
        assert.typeOf(user, 'object');
        assert.equal(user.id, 1);
        done();
      });
    });

    after(() => {
      tracker.uninstall();
      mockKnex.unmock(db);
    });
  });
});

describe('Friendship', () => {
});
