export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE clinics ADD COLUMN IF NOT EXISTS slot_duration_minutes integer DEFAULT 30;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE clinics DROP COLUMN IF EXISTS slot_duration_minutes;
  `);
};