
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    /* id UNSIGNED INT AUTO INCREMENT,
    password CHAR(60),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    password_reset_token BINARY(32),
    password_reset_token_expiry TIMESTAMP,
    PRIMARY KEY(id) */
    table.increments('id');
    table.timestamps(true, true);
    table.string('password', 60);
    table.string('email', 255);
    table.string('username', 255);
    table.binary('password_reset_token');
    table.timestamp('password_reset_token_expiry');
    table.boolean('accepted');
  })
  .then((status) => {
    console.log(status);
  })
  .catch((err) => {
    console.log("error", err);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
