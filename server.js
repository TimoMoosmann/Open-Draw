const express = require('express');                                               
const app = express();
const logger = require('morgan');                                                 
const fs = require('fs/promises');
const {body, validationResult} = require('express-validator');

const commonTags  = require('common-tags');
const stripIndent = commonTags.stripIndent;
const oneLine = commonTags.oneLine;
const sqlite3 = require('sqlite3').verbose();

const protocolsFolder = './study_protocols';

app.use(logger('dev'));                                                         
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('./public/'));

app.post('/create-study-protocol',
  body('name', 'invalid name').trim().isLength({min:1}).isAlpha().escape(),
  body('age').isNumeric().isLength({min:1, max:2}),
  body('eyeColor', 'invalid eye color').trim().isLength({min:1})
    .isAlpha(['de-DE']).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
    }

    protocolHeader = '\n' + stripIndent`
      Calibration Experiment Protocol
      ================================

      Participant Name: ${req.body.name}
      Age: ${req.body.age}
      Eye color: ${req.body.eyeColor}
      ` + '\n\n';
    const dateTimeString = (new Date).toLocaleString('de-DE',
      {dateStyle: 'short', timeStyle: 'short'}).replace(', ', '_');
    const protocolFileName = `${dateTimeString}_${req.body.name}`;
    try {
      await fs.appendFile(`${protocolsFolder}/${protocolFileName}`
        , protocolHeader);
      const db = await openStudyDB();
      const participantStudyDataID = await dbInsert({
        colNames: ['prename', 'age', 'eye_color'],
        db,
        tableName: "participantStudyDatas",
        values: [req.body.name, req.body.age, req.body.eyeColor]
      });
      await closeDB(db);
      return res.status(200).json({participantStudyDataID, protocolFileName});
    } catch (err) {
      return next(err);
    }
  }
);

app.post('/append-validation-data-to-protocol', async (req, res, next) => {

  const calibrationType = req.body.calibrationType;
  const numCalibrationTargets = req.body.numCalibrationTargets;
  const participantStudyDataID =
    req.body.serverProtocolData.participantStudyDataID;
  const protocolFileName = req.body.serverProtocolData.protocolFileName;
  const validationData = req.body.validationDataExtended;

  const validationProtocol = createProtocolStringForValidationEntry({
    calibrationType,
    numCalibrationTargets,
    validationData
  });
  try {
    await fs.appendFile(
      `${protocolsFolder}/${protocolFileName}`,
      validationProtocol
    );
    await saveValidationDataInDB({
      calibrationType,
      numCalibrationTargets,
      participantStudyDataID,
      validationData
    });
  } catch (err) {
    return next(err);
  }
  return res.status(200);
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

const createProtocolStringForValidationEntry = ({
  calibrationType,
  numCalibrationTargets,
  validationData
}) => {
  let validationProtocol = '\n' + oneLine`
    Important Features from the Validation Data for ${calibrationType}
    with ${numCalibrationTargets} targets
  `;
  validationProtocol +=
    '\n=================================================================\n\n';

  validationData.forEach(gazeAtTargetData => {
    let gazeAtTargetProtocol = "";
    gazeAtTargetProtocol += oneLine`
      Target Position Name: ${gazeAtTargetData.targetPosName}
      (Realtive Position: ${gazeAtTargetData.targetPosRelative})
    `;
    gazeAtTargetProtocol += createValidationValuesString ({
      name: 'Recommended Fixation Size',
      absoluteVal: gazeAtTargetData.recommendedFixationSize,
      relativeVal: gazeAtTargetData.recommendedFixationSizeRelative
    });
    gazeAtTargetProtocol += createValidationValuesString ({
      name: 'Minimum Target Size',
      absoluteVal: gazeAtTargetData.minTargetSize,
      relativeVal: gazeAtTargetData.minTargetSizeRelative
    });
    gazeAtTargetProtocol += `Viewport: ${posStr(gazeAtTargetData.viewport)}`
      + '\n';
    gazeAtTargetProtocol +=
      '\n-------------------------------------------------\n\n'
    validationProtocol += gazeAtTargetProtocol
  });
  return validationProtocol;
};

const createValidationValuesString = ({
  name,
  absoluteVal,
  relativeVal
}) => stripIndent`
  ${name}
  Absolute values: ${posStr(absoluteVal)},
  Relative values: ${posStr(relativeVal)}
`;

const posStr = pos => `(${pos.x}|${pos.y})`;

const saveValidationDataInDB = async ({
  calibrationType,
  numCalibrationTargets,
  participantStudyDataID,
  validationData
}) => {
  const db = await openStudyDB();
  const studyDBInsert =
    async ({colNames, tableName, values}) => await dbInsert({
      colNames, db, tableName, values
    });
  const validationDataID = await studyDBInsert({
    colNames: [
      'calibration_type',
      'num_calibration_targets',
      'participant_study_data_id'
    ],
    tableName: 'validationDatas',
    values: [
      calibrationType,
      numCalibrationTargets,
      participantStudyDataID
    ]
  });

  for (let i=0; i<validationData.length; i++) {
    const gazeAtTargetData = validationData[i];
    const gazeAtTargetDataID = await studyDBInsert({
      colNames: ['num_gaze_estimations', 'validation_data_id'],
      tableName: 'gazeAtTargetDatas',
      values: [gazeAtTargetData.gazeEstimations.length, validationDataID]
    });
    const studyDBInsertPos = getDBInsertPos({db, gazeAtTargetDataID});
    const targetPosID = await studyDBInsertPos(gazeAtTargetData.targetPos);
    const targetPosRelativeID = await studyDBInsertPos(
      gazeAtTargetData.targetPosRelative
    );
    const targetPosNameID = await studyDBInsertPos(
      gazeAtTargetData.targetName
    );
    const accuracyID = await studyDBInsertPos(gazeAtTargetData.accuracy);
    const accuracyRelativeID = await studyDBInsertPos(
      gazeAtTargetData.accuracyRelative
    );
    const minTargetSizeID = await studyDBInsertPos(
      gazeAtTargetData.minTargetSize
    );
    const minTargetSizeRelativeID = await studyDBInsertPos(
      gazeAtTargetData.minTargetSizeRelative
    );

    const precisionID = await studyDBInsertPos(
      gazeAtTargetData.precision
    );
    const precisionRelativeID = await studyDBInsertPos(
      gazeAtTargetData.precisionRelative
    );
    const recommendedTargetSizeID = await studyDBInsertPos(
      gazeAtTargetData.recommendedFixationSize
    );
    const recommendedTargetSizeRelativeID = await studyDBInsertPos(
      gazeAtTargetData.recommendedFixationSizeRelative
    );
    const viewportID = await studyDBInsertPos(gazeAtTargetData.viewport);
    await dbUpdate({
      colNames: [
        'target_pos_id', 'target_pos_relative_id', 'target_pos_name_id',
        'accuracy_id', 'accuracy_relative_id',
        'min_target_size_id', 'min_target_size_relative_id',
        'precision_id', 'precision_relative_id',
        'recommended_fixation_size_id', 'recommended_fixation_size_relative_id',
        'viewport_id'
      ],
      db,
      idColName: 'gaze_at_target_data_id',
      rowID: gazeAtTargetDataID,
      tableName: 'gazeAtTargetDatas',
      values: [
        targetPosID, targetPosRelativeID, targetPosNameID,
        accuracyID, accuracyRelativeID,
        minTargetSizeID, minTargetSizeRelativeID,
        precisionID, precisionRelativeID,
        recommendedFixationSizeID, recommendedFixationeSizeRelativeID,
        viewportID
      ]
    });
  };
};

const openStudyDB = () => new Promise((resolve, reject) => {
  new sqlite3.Database(
    './db/study_data.db',
    function(err) {
      if (err) {
        reject(err);
      }
      resolve(this);
    }
  )
});

const dbRunOnStudyTable = ({db, stmt, values}) => new Promise(
  (resolve, reject) => {
    db.run(
      stmt,
      values,
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  }
);

const insertStmt = ({colNames, tableName}) => stripIndent`
  INSERT INTO ${tableName} (${colNames})
  VALUES (${"?,".repeat(colNames.length -1)}?)
`;

const updateStmt = ({colNames, idColName, rowID, tableName}) => stripIndent`
  UPDATE ${tableName}
  SET ${colNames.map(colName => `${colName} = ?`)}
  WHERE ${idColName} = ${rowID};
`;

const dbInsert = async ({colNames, db, tableName, values}) => {
  return await dbRunOnStudyTable({
    db,
    stmt: insertStmt({colNames, tableName}),
    values,
  });
};

const dbUpdate = async ({
  colNames, db, idColName, rowID, tableName, values
}) => {
  return await dbRunOnStudyTable({
    db,
    stmt: updateStmt({colNames, idColName, rowID, tableName}),
    values,
  });
};

getDBInsertPos = ({db, gazeAtTargetDataID}) => async pos => dbInsert({
  colNames: ['x', 'y', 'gaze_at_target_data_id'],
  db,
  tableName: 'positions',
  values: [pos.x, pos.y, gazeAtTargetDataID]
});

const closeDB = db => new Promise((resolve, reject) => {
  db.close(err => {
    if (err) reject(err);
    resolve();
  });
});

module.exports = app;

