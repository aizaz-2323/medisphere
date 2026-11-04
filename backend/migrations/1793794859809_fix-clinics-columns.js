export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS owner_id integer REFERENCES users(id);
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS name varchar;
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS logo_url varchar;
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS working_hours jsonb;
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS consultation_fee numeric;
    ALTER TABLE doctors ADD COLUMN IF NOT EXISTS clinic_id integer REFERENCES clinics(id);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE clinics DROP COLUMN IF EXISTS owner_id;
  `);
};