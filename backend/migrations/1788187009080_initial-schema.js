export const up = (pgm) => {
  pgm.createTable('roles', {
    id: 'id',
    name: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
  });

  pgm.createTable('users', {
    id: 'id',
    email: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: 'varchar',
      notNull: true,
    },
    role_id: {
      type: 'integer',
      references: 'roles',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('doctors', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users',
    },
    specialisation: {
      type: 'varchar',
    },
  });

  pgm.createTable('patients', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'users',
    },
    dob: {
      type: 'date',
    },
    blood_group: {
      type: 'varchar',
    },
    allergies: {
      type: 'text',
    },
  });

  pgm.createTable('clinics', {
    id: 'id',
    doctor_id: {
      type: 'integer',
      references: 'doctors',
    },
    name: {
      type: 'varchar',
    },
    logo_url: {
      type: 'varchar',
    },
    working_hours: {
      type: 'jsonb',
    },
    consultation_fee: {
      type: 'numeric',
    },
  });

  pgm.createTable('appointments', {
    id: 'id',
    patient_id: {
      type: 'integer',
      references: 'patients',
    },
    doctor_id: {
      type: 'integer',
      references: 'doctors',
    },
    slot_time: {
      type: 'timestamp',
      notNull: true,
    },
    status: {
      type: 'varchar',
      default: 'pending',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('prescriptions', {
    id: 'id',
    appointment_id: {
      type: 'integer',
      references: 'appointments',
    },
    medicines: {
      type: 'jsonb',
    },
    notes: {
      type: 'text',
    },
  });

  pgm.createTable('payments', {
    id: 'id',
    appointment_id: {
      type: 'integer',
      references: 'appointments',
    },
    amount: {
      type: 'numeric',
    },
    status: {
      type: 'varchar',
      default: 'unpaid',
    },
  });

  pgm.createTable('medical_records', {
    id: 'id',
    patient_id: {
      type: 'integer',
      references: 'patients',
    },
    diagnosis: {
      type: 'text',
    },
    notes: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });

  pgm.createTable('audit_logs', {
    id: 'id',
    table_name: {
      type: 'varchar',
    },
    record_id: {
      type: 'integer',
    },
    changed_by: {
      type: 'integer',
      references: 'users',
    },
    old_value: {
      type: 'jsonb',
    },
    new_value: {
      type: 'jsonb',
    },
    changed_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('audit_logs');
  pgm.dropTable('medical_records');
  pgm.dropTable('payments');
  pgm.dropTable('prescriptions');
  pgm.dropTable('appointments');
  pgm.dropTable('clinics');
  pgm.dropTable('patients');
  pgm.dropTable('doctors');
  pgm.dropTable('users');
  pgm.dropTable('roles');
};