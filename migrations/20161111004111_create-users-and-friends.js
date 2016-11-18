
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id').unsigned();
      table.timestamps();
      table.string('password', 60);
      table.string('email', 255);
      table.string('username', 255);
      table.binary('password_reset_token');
      table.timestamp('password_reset_token_expiry');
      table.boolean('accepted');
    }),
    knex.schema.createTable('friends', function (table) {
      table.integer('requestor').notNullable();
      table.integer('requestee').notNullable();
      table.timestamps();
      table.boolean('accepted').notNullable();
      table.primary(['requestor', 'requestee']);
      table.foreign('requestor').references('users.id');
      table.foreign('requestee').references('users.id');
    })])
    .then((status) => {
      console.log(status);
      console.log('Successful migration!');
    })
    .catch((err) => {
      console.log('Migration failed:', err);
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('friends')
    .then(() => {
      return knex.schema.dropTable('users');
    });
};
