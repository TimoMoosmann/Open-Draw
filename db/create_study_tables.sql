CREATE TABLE participantStudyDatas (
  participant_study_data_id INTEGER PRIMARY KEY,
  prename TEXT NOT NULL,
  age INTEGER NOT NULL,
  eye_color TEXT NOT NULL
);

CREATE TABLE validationDatas (
  validation_data_id INTEGER PRIMARY KEY,
  calibration_type TEXT NOT NULL,
  num_calibration_targets INTEGER NOT NULL,
  participant_study_data_id INTEGER NOT NULL,
  FOREIGN KEY (participant_study_data_id)
    REFERENCES participantStudyDatas (participant_study_data_id)
      ON DELETE CASCADE
);

CREATE TABLE gazeAtTargetDatas (
  gaze_at_target_data_id INTEGER PRIMARY KEY,
  target_pos_id INTEGER,
  target_pos_relative_id INTEGER,
  target_pos_name_id INTEGER,
  accuracy_id INTEGER,
  accuracy_relative_id INTEGER,
  min_target_size_id INTEGER,
  min_target_size_relative_id INTEGER,
  precision_id INTEGER,
  precision_relative_id INTEGER,
  recommended_fixation_size_id INTEGER,
  recommended_fixation_size_relative_id INTEGER,
  viewport_id INTEGER,
  num_gaze_estimations INTEGER NOT NULL,
  validation_data_id INTEGER NOT NULL,
  FOREIGN KEY (validation_data_id)
    REFERENCES validation_datas (validation_data_id)
      ON DELETE CASCADE
);

CREATE TABLE positions (
  position_id INTEGER PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  gaze_at_target_data_id INTEGER NOT NULL,
  FOREIGN KEY (gaze_at_target_data_id)
    REFERENCES gaze_at_target_datas (gaze_at_target_data_id)
      ON DELETE CASCADE
);

