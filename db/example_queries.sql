-- Query number of participants
SELECT COUNT(*) FROM participantStudyDatas;

-- Query number of validation datas
SELECT COUNT(*) FROM validationDatas;

-- Query number of gaze at target datas
SELECT COUNT(*) FROM gazeAtTargetDatas;

-- Query number of positions
SELECT COUNT(*) FROM positions;

-- Average participant age
SELECT avg(age) FROM participantStudyDatas;

-- Average Min Target Size
SELECT avg(x) FROM positions

-- Average x vals for minimum Target Size of all gazeAtTargetDatas
SELECT avg(x) FROM positions
WHERE position_id = (
  SELECT min_target_size_relative_id FROM gazeAtTargetDatas;
);
