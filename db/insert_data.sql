INSERT INTO participant_study_data
  (prename, age, eye_color, validation_datas_id)
  VALUES ('martin', 12, 'brown')
participant_study_id = last_id;

INSERT INTO validation_data
 (calibration_type, num_calibration_targets, participant_study_data_id)
VALUES
 ('gazeCalibration', 5, participant_study_id);
validation_data_id = last_id;

INSERT INTO positions (x, y) VALUES (1, 2):
target_pos_id = last_id;

INSERT INTO positions (x, y) VALUES (3, 4):
target_pos_relative_id = last_id;

--...
 
INSERT INTO gaze_at_target_data
  (validation_data_id, target_pos_id, target_pos_relative_id, ...)
VALUES
  (3, 4, 2, ...);

