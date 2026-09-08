/**

* @type {import('node-pg-migrate').MigrationBuilder}
  */

export const up = (pgm) => {
// Google users don't have a password.
pgm.alterColumn('users', 'password_hash', {
notNull: false,
});

// Add Google authentication fields.
pgm.addColumns('users', {
google_id: {
type: 'varchar',
unique: true,
notNull: false,
},


auth_provider: {
  type: 'varchar',
  notNull: true,
  default: 'local',
},


});
};

export const down = (pgm) => {
pgm.dropColumns('users', ['google_id', 'auth_provider']);

// Restore the original requirement.
pgm.alterColumn('users', 'password_hash', {
notNull: true,
});
};
