/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addColumns('doctors', {
    qualification: { type: 'varchar' },
    license_number: { type: 'varchar', unique: true },
    credential_doc_url: { type: 'varchar' },
    verification_status: { type: 'varchar', default: 'pending' },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumns('doctors', ['qualification', 'license_number', 'credential_doc_url', 'verification_status']);
};
