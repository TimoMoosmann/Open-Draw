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
  body('eyeColor', 'invalid eye color').trim().isLength({min:1}).isAlpha()
    .escape(),
  async (req, res) => {
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
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(
        {errors: ["Could not write protocol header to file: " + err.message] });   
    }

    const db = openStudyDBReadWrite();
    const participantStudyDataID = dbInsert({
      colNames: ['prename', 'age', 'eye_color'],
      db,
      tableName: "participantStudyDatas",
      values: [req.body.name, req.body.age, req.body.eyeColor]
    });
    closeDB(db);
    return res.status(200).json({participantStudyDataID, protocolFileName});
  }
);

app.post('/append-validation-data-to-protocol', async (req, res) => {

  const calibrationType = req.body.clibrationType;
  const numCalibrationTargets = req.body.numCalibrationTargets;
  const participantStudyDataID =
    req.body.serverPrtocolData.participantStudyDataID;
  const protocolFileName = req.body.serverPrtocolData.protocolFileName;
  const validationData = req.body.validationDataExtended;

  await appendProtocolWithValidationEntry({
    calibrationType,
    numCalibrationTargets,
    protocolFileName,
    validationData
  });

  saveValidationDataInDB({
    calibrationType,
    numCalibrationTargets,
    participantStudyDataID,
    validationData
  });

  return res.status(200);
});

const appendProtocolWithValidationEntry = async ({
  calibrationType,
  numCalibrationTargets,
  protocolFileName,
  validationData
}) => {
  let validationProtocol = '\n' + oneLine`
    Extended Validation Data for ${calibrationType}
    with ${numCalibrationTargets} targets
  `;
  validationProtocol +=
    '\n=================================================\n\n';

  validationData.forEach(gazeAtTargetData => {
    let gazeAtTargetDataProtocol = "";
    gazeAtTargetProtocol += createValidationValuesString = ({
      name: 'Target Position',
      absoluteVal: gazeAtTargetData.targetPos,
      relativeVal: gazeAtTargetData.targetPosRelative
    });
    gazeAtTargetProtocol += createValidationValuesString = ({
      name: 'Target Accuracy',
      absoluteVal: gazeAtTargetData.accuracy,
      relativeVal: gazeAtTargetData.accuracyRelative
    });
    gazeAtTargetProtocol += createValidationValuesString = ({
      name: 'Gaze Precision',
      absoluteVal: gazeAtTargetData.precision,
      relativeVal: gazeAtTargetData.precisionRelative
    });
    gazeAtTargetProtocol += createValidationValuesString = ({
      name: 'Recommended Target Size',
      absoluteVal: gazeAtTargetData.recommendedTargetSize,
      relativeVal: gazeAtTargetData.recommendedTargetSizeRelative
    });
    gazeAtTargetProtocol += `Viewport: ${posStr(gazeAtTargetData.viewPort)}`
      + '\n';
    gazeAtTargetProtocol += 'Gaze Estimations: ';
    gazeAtTargetData.gazeEstimations.forEach((est, idx) => {
      gazeAtTargetProtocol += posStr(est);
      if (idx === data.gazeEstimations.length - 1) {
        protocolValidationEntry += ', ';
      }
    });
    gazeAtTargetProtocol +=
      '\n-------------------------------------------------\n\n'
    validationProtocol += gazeAtTargetProtocol
  });
  try {
    await fs.appendFile(`${protocolsFolder}/${protocolFileName}`,
      protocolValidationEntry
    );
  } catch (err) {
    return res.status(500).json(
      {errors: ["Could not write validation data to file: " + err.message] });   
  }
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

const saveValidationDataInDB = ({
  calibrationType,
  numCalibrationTargets,
  participantStudyDataID
}) => {
  const db = openStudyDBReadWrite();
  const dbInsert = ({colNames, tableName, values}) => dbInsert({
    colNames, db, tableName, values
  });
  const validationDataID = dbInsert({
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

  validationData.forEach(gazeAtTargetData => {
    const gazeAtTargetDataID = dbInsert({
      colNames: ['num_gaze_estimations', 'validation_data_id'],
      tableName: 'gazeAtTargetDatas',
      values: [gazeAtTargetData.gazeEstimations.length, validationDataID]
    });
    const dbInsertPos = getDBInsertPos({db, gazeAtTargetDataID});
    const targetPosID = dbInsertPos(gazeAtTargetData.targetPos);
    const targetPosRelativeID = dbInsertPos(gazeAtTargetData.targetPosRelative);
    const accuracyID = dbInsertPos(gazeAtTargetData.accuracy);
    const accuracyRelativeID = dbInsertPos(gazeAtTargetData.accuracyRelative);
    const precisionID = dbInsertPos(gazeAtTargetData.precision);
    const precisionRelativeID = dbInsertPos(gazeAtTargetData.precisionRelative);
    const recommendedTargetSizeID = dbInsertPos(
      gazeAtTargetData.recommendedTargetSize
    );
    const recommendedTargetSizeRelativeID = dbInsertPos(
      gazeAtTargetData.recommendedTargetSizeRelative
    );
    const viewportID = dbInsertPos(gazeAtTargetData.viewport);
    dbInsert({
      colNames: [
        'target_pos_id', 'target_pos_relative_id',
        'accuracy_id', 'accuracy_relative_id',
        'precision_id', 'precision_relative_id',
        'recommended_target_size_id', 'recommended_target_size_relative_id',
        'viewport_id'
      ],
      tableName: 'gazeAtTargetDatas',
      values: [
        targetPosID, targetPosRelativeID,
        accuracyID, accuracyRelativeID,
        precisionID, precisionRelativeID,
        recommendedTargetSizeID, recommendedTargetSizeRelativeID,
        viewportID
      ]
    });
  });
};

const openStudyDB = mode => new sqlite3.Database(
  './db/study_data.db',
  mode,
  err => {if (err) console.error(err.message)}
);

const openStudyDBReadWrite = () => openStudyDB(sqlite3.OPEN_READWRITE);

const dbInsert = ({colNames, db, tableName, values}) => db.serialize(function() {
  if (!(colNames.length && colNames.length > 1)) {
    throw new Error(stripIndent`
      Parameter colNames needs to be an array of strings with at least
      one Element.
    `);
  }
  db.run(stripIndent`
    INSERT INTO ${tableName} (${colNames})
    VALUES (${"?,".repeat(colNames.length -1)}?)`,
    values,
    function (err) {
      if (err) console.error(err.message);
      return this.lastID;
    }
  );
});

getDBInsertPos = ({db, gazeAtTargetDataID}) => pos => dbInsert({
  colNames: ['x', 'y', 'gaze_at_target_data_id'],
  db,
  tableName: 'positions',
  values: [pos.x, pos.y, gazeAtTargetDataID]
});

const closeDB = db => db.close(err => {if (err) console.error(err.message)});

module.exports = app;

