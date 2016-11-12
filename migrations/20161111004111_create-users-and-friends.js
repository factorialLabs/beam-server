
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id').unsigned();
      table.timestamp('created_at').defaultTo('CURRENT_TIMESTAMP');
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
      table.timestamp('created_at').defaultTo('CURRENT_TIMESTAMP');
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
      table.boolean('accepted').notNullable();
      table.primary(['requestor', 'requestee']);
      table.foreign('reuqestor').references('users.id');
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
  return knex.schema.dropTable('users');
};
