
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('accepted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.boolean('accepted');
  });
};
