const express = require('express');                                               
const app = express();
const logger = require('morgan');                                                 
const fs = require('fs/promises');
const {body, validationResult} = require('express-validator');

const commonTags  = require('common-tags');
const stripIndent = commonTags.stripIndent;
const oneLine = commonTags.oneLine;

const protocolsFolder = '../protocols';

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
      console.log(errors);
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
      return res.status(500).json(
        {errors: ["Could not write protocol header to file: " + err.message] });   
    }
    return res.status(200).json({protocolFileName});
  }
);

const posStr = pos => `(${pos.x}|${pos.y})`;

app.post('/append-validation-data-to-protocol',
  async (req, res) => {
    let protocolValidationEntry = '\n' + oneLine`
      Extended Validation Data for ${req.body.calibrationType}
      with ${req.body.numCalibrationTargets} targets
    `;
    protocolValidationEntry +=
      '\n=================================================\n\n';
    req.body.validationDataDetailedInformation.forEach(data => {
      protocolValidationEntry += oneLine`
        Target Position absolute: ${posStr(data.targetPos)},
        relative: ${posStr(data.targetPosRelative)}
      ` + '\n';
      protocolValidationEntry += oneLine`
        Target Accuracy absolute: ${posStr(data.accuracy)},
        relative: ${posStr(data.accuracyRelative)}
      ` + '\n';
      protocolValidationEntry += oneLine`
        Gaze Precision absolute: ${posStr(data.precision)},
        relative: ${posStr(data.precisionRelative)}
      ` + '\n';
      protocolValidationEntry += oneLine`
        Recommended Target Size absolute: ${posStr(data.recommendedTargetSize)},
        relative: ${posStr(data.recommendedTargetSizeRelative)}
      ` + '\n';
      protocolValidationEntry += `viewPort: ${posStr(data.viewPort)}` + '\n';

      protocolValidationEntry += 'Gaze Estimations: ';
      data.gazeEstimations.forEach((est, idx) => {
        protocolValidationEntry += posStr(est);
        if (idx === data.gazeEstimations.length - 1) {
          protocolValidationEntry += ', ';
        }
      });
      protocolValidationEntry +=
        '\n-------------------------------------------------\n\n'
    });
    try {
      await fs.appendFile(`${protocolsFolder}/${req.body.protocolFileName}`,
        protocolValidationEntry
      );
    } catch (err) {
      return res.status(500).json(
        {errors: ["Could not write validation data to file: " + err.message] });   
    }
    return res.status(200);
  }
);

module.exports = app;

