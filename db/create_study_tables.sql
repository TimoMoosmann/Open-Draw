CREATE TABLE participant_study_datas (
  participant_study_data_id INTEGER PRIMARY KEY,
  prename TEXT NOT NULL,
  age INTEGER NOT NULL,
  eye_color TEXT NOT NULL,
);

CREATE TABLE validation_datas (
  validation_data_id INTEGER PRIMARY KEY,
  calibration_type TEXT NOT NULL,
  num_calibration_targets INTEGER NOT NULL,
  gaze_at_target_data_id INTEGER NOT NULL,
  participant_study_datas_id INTEGER NOT NULL,
  FOREIGN KEY (participant_study_data_id)
    REFERENCES participant_study_datas (participant_study_data_id)
      ON DELETE CASCADE;
);

CREATE TABLE gaze_at_target_datas (
  gaze_at_target_data_id INTEGER PRIMARY KEY,
  target_pos_id INTEGER NOT NULL,
  target_pos_relative_id INTEGER NOT NULL,
  accuracy_id INTEGER NOT NULL,
  accuracy_relative_id INTEGER NOT NULL,
  precision_id INTEGER NOT NULL,
  precision_relative_id INTEGER NOT NULL,
  recommended_target_size_id INTEGER NOT NULL,
  recommended_target_size_relative_id INTEGER NOT NULL,
  view_port_id INTEGER NOT NULL,
  num_gaze_estimations INTEGER NOT NULL,
  validation_data_id INTEGER NOT NULL,
  FOREIGN KEY (validation_data_id)
    REFERENCES validation_datas (validation_data_id)
      ON DELETE CASCADE;
);

CREATE TABLE positions (
  position_id INTEGER PRIMARY KEY,
  gaze_at_target_data_id,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  FOREIGN KEY (gaze_at_target_data_id)
    REFERENCES gaze_at_target_datas (gaze_at_target_data_id)
      ON DELETE CASCADE;
);

