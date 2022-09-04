const express = require('express');                                               
const app = express();
const logger = require('morgan');                                                 
const fs = require('fs/promises');
const path = require('path');

const {body, validationResult} = require('express-validator');

const dbHelper = require('./db/helper.js');

const commonTags  = require('common-tags');
const stripIndent = commonTags.stripIndent;
const oneLine = commonTags.oneLine;

const protocolsFolder = './study_protocols';
const pathToStudyDB = './db/study_data.db';

app.use(logger('dev'));                                                         
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/create-study-protocol',
  body('name', 'invalid name').trim().isLength({min:1}).isAlpha(['de-DE'])
    .escape(),
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
      const studyDB = await dbHelper.open(pathToStudyDB);
      const participantStudyDataID = await dbHelper.insert({
        colNames: ['prename', 'age', 'eye_color'],
        db: studyDB,
        tableName: "participantStudyDatas",
        values: [req.body.name, req.body.age, req.body.eyeColor]
      });
      await dbHelper.close(studyDB);
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
    calibration with ${numCalibrationTargets} targets
  `;
  validationProtocol +=
    '\n================================================================' +
    '==================\n\n';

  validationData.forEach(gazeAtTargetData => {
    let gazeAtTargetProtocol = "";
    gazeAtTargetProtocol += oneLine`
      Target Position Name: ${gazeAtTargetData.targetPosName}
      (Realtive Position: ${posStr(gazeAtTargetData.targetPosRelative)})
    ` + '\n';
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
}) => {return oneLine`
  ${name}:  
  Absolute values: ${posStr(absoluteVal)},
  Relative values: ${posStr(relativeVal)}
` + '\n'};

const posStr = pos => `(${pos.x}|${pos.y})`;

const saveValidationDataInDB = async ({
  calibrationType,
  numCalibrationTargets,
  participantStudyDataID,
  validationData
}) => {
  const studyDB = await dbHelper.open(pathToStudyDB);
  const studyDBInsert =
    async ({colNames, tableName, values}) => await dbHelper.insert({
      colNames, db: studyDB, tableName, values
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
      colNames: [
        'num_gaze_estimations', 'validation_data_id', 'target_pos_name'
      ],
      tableName: 'gazeAtTargetDatas',
      values: [
        gazeAtTargetData.gazeEstimations.length,
        validationDataID,
        gazeAtTargetData.targetPosName
      ]
    });
    const studyDBInsertPos = getDBInsertPos({db: studyDB, gazeAtTargetDataID});
    const targetPosID = await studyDBInsertPos(gazeAtTargetData.targetPos);
    const targetPosRelativeID = await studyDBInsertPos(
      gazeAtTargetData.targetPosRelative
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
    const recommendedFixationSizeID = await studyDBInsertPos(
      gazeAtTargetData.recommendedFixationSize
    );
    const recommendedFixationSizeRelativeID = await studyDBInsertPos(
      gazeAtTargetData.recommendedFixationSizeRelative
    );
    const viewportID = await studyDBInsertPos(gazeAtTargetData.viewport);
    await dbHelper.update({
      colNames: [
        'target_pos_id', 'target_pos_relative_id',
        'accuracy_id', 'accuracy_relative_id',
        'min_target_size_id', 'min_target_size_relative_id',
        'precision_id', 'precision_relative_id',
        'recommended_fixation_size_id', 'recommended_fixation_size_relative_id',
        'viewport_id'
      ],
      db: studyDB,
      idColName: 'gaze_at_target_data_id',
      rowID: gazeAtTargetDataID,
      tableName: 'gazeAtTargetDatas',
      values: [
        targetPosID, targetPosRelativeID,
        accuracyID, accuracyRelativeID,
        minTargetSizeID, minTargetSizeRelativeID,
        precisionID, precisionRelativeID,
        recommendedFixationSizeID, recommendedFixationSizeRelativeID,
        viewportID
      ]
    })
  };
  await dbHelper.close(studyDB);;
};

getDBInsertPos = ({db, gazeAtTargetDataID}) => async pos => dbHelper.insert({
  colNames: ['x', 'y', 'gaze_at_target_data_id'],
  db,
  tableName: 'positions',
  values: [pos.x, pos.y, gazeAtTargetDataID]
});

function checkPassword (password, passwordPageName, res, next) {
  if (password === 'webcamdraw') {
    return next()
  } else {
    return res.sendFile(path.join(__dirname, '/password_prompts/' +
      passwordPageName + '.html'))
  }
}

app.get('/', (req, res, next) => {
  checkPassword(req.query.password, 'simple', res, next)
})

app.get('/hover', (req, res, next) => {
  checkPassword(req.query.password, 'hover', res, next)
})

app.get('/sophisticated', (req, res, next) => {
  checkPassword(req.query.password, 'sophisticated', res, next)
})

app.get('/sophisticated_hover', (req, res, next) => {
  checkPassword(req.query.password, 'sophisticated_hover', res, next)
})

app.get('/calibration-study', (req, res, next) => {
  checkPassword(req.query.password, 'calibration-study', res, next)
})

app.use(express.static('./public/'));

module.exports = app;

