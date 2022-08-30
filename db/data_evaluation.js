const sqlite3 = require('sqlite3').verbose();
const dbHelper = require('./helper.js');

const readline = require('readline');
const process = require('process');
//import { stdin as input, stdout as output } from 'node:process';

const commonTags = require('common-tags');
const stripIndent = commonTags.stripIndent;
const oneLineTrim = commonTags.oneLineTrim;
const codeBlock = commonTags.codeBlock;

const pathToStudyDB = './study_data.db';

let validationDatasPerParticipant;
  validationDatasPerParticipant = 6;

(async () => {
  const db = await dbHelper.open(pathToStudyDB);

  // if too low, further investigation might be necasary.
  // But webgazer seems pretty consistent here.
  const minNumGazeEstimationsStmt = stripIndent`
    SELECT min(num_gaze_estimations) min_num_gaze_estimations
    FROM gazeAtTargetDatas
  `;
  const minNumGazeEstimations = (await dbHelper.getAll({
    db, stmt: minNumGazeEstimationsStmt
  }))[0]['min_num_gaze_estimations'];

  // Remove data from participants which not completed every task.
  await removeParticipantsWithIllegalValidationDatasCount({
    db, legalAmount: validationDatasPerParticipant});

  // Number of participants with valid amount of validation data.
  const numParticipantsStmt = stripIndent`
    SELECT COUNT(*) num_participants FROM participantStudyDatas
  `;
  const numParticipants = (await dbHelper.getAll({
    db, stmt: numParticipantsStmt
  }))[0]['num_participants'];
  const numEachCalibrationProcedureHasBeenConducted = numParticipants

  const getDifferentViewportsStmt = stripIndent`
      SELECT p.x, p.y
      FROM validationDatas v
      LEFT JOIN gazeAtTargetDatas g
        ON v.validation_data_id = g.validation_data_id
      INNER JOIN positions p ON p.position_id = g.viewport_id
      GROUP BY p.x, p.y
  `
  const viewports = await dbHelper.getAll({
    db, stmt: getDifferentViewportsStmt
  })

  // Per Calibration Procedure
  const avgPerCalibrationProcedureStmt = property => stripIndent`
    SELECT *
    FROM (
      SELECT calibration_type, num_calibration_targets,
        avg(p.x) x_avg, avg(p.y) y_avg
      FROM validationDatas v
      LEFT JOIN gazeAtTargetDatas g
        ON v.validation_data_id = g.validation_data_id
      INNER JOIN positions p ON p.position_id = g.${property}_id
      GROUP BY v.calibration_type, v.num_calibration_targets
    )
    ORDER BY (x_avg + y_avg) ASC
  `;
  const avgAccPerCalibrationProcedure = await dbHelper.getAll({
    db, stmt: avgPerCalibrationProcedureStmt('accuracy')
  });
  const avgAccPerCalibrationProcedureRelative = await dbHelper.getAll({
    db, stmt: avgPerCalibrationProcedureStmt('accuracy_relative')
  });

  const avgPrecPerCalibrationProcedure = await dbHelper.getAll({
    db, stmt: avgPerCalibrationProcedureStmt('precision')
  });
  const avgPrecPerCalibrationProcedureRelative = await dbHelper.getAll({
    db, stmt: avgPerCalibrationProcedureStmt('precision_relative')
  });

  const avgPerCalibrationProcedureTopResultsStmt = ({
    numTopResultsPerCategory, property
  }) => {
    return stripIndent`
      SELECT * FROM (
        SELECT calibration_type, num_calibration_targets,
          avg(x_avg_same_id) x_avg, avg(y_avg_same_id) y_avg
        FROM (
          SELECT calibration_type, num_calibration_targets,
            avg(p.x) x_avg_same_id, avg(p.y) y_avg_same_id,
            ROW_NUMBER() OVER (
              PARTITION BY v.calibration_type, v.num_calibration_targets
              ORDER BY (avg(p.x) + avg(p.y)) ASC
            ) rank_in_same_category
          FROM validationDatas v
          LEFT JOIN gazeAtTargetDatas g
            ON v.validation_data_id = g.validation_data_id
          INNER JOIN positions p ON p.position_id = g.${property}_id
          GROUP BY v.validation_data_id
        )
        WHERE rank_in_same_category <= ${numTopResultsPerCategory}
        GROUP BY calibration_type, num_calibration_targets
      )
      ORDER BY (x_avg + y_avg) ASC;
    `;
 };

  const twentyPctOfParticipantsAmount = Math.round(numParticipants / 5);
  const eightyPctOfParticipantsAmount = Math.round(numParticipants * (4/5));

  const avgAccPerCalibrationProcedureTopTwentyPct =
    await dbHelper.getAll({
      db, stmt: avgPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: twentyPctOfParticipantsAmount,
        property: 'accuracy_relative'
      })
    });
  const avgAccPerCalibrationProcedureTopEightyPct =
    await dbHelper.getAll({
      db, stmt: avgPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: eightyPctOfParticipantsAmount,
        property: 'accuracy_relative'
      })
    });
  const avgPrecPerCalibrationProcedureTopTwentyPct =
    await dbHelper.getAll({
      db, stmt: avgPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: twentyPctOfParticipantsAmount,
        property: 'precision_relative'
      })
    });
  const avgPrecPerCalibrationProcedureTopEightyPct =
    await dbHelper.getAll({
      db, stmt: avgPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: eightyPctOfParticipantsAmount,
        property: 'precision_relative'
      })
    });

  const avgWorstPerCalibrationProcedureStmt = property => stripIndent`
    SELECT * FROM (
      SELECT avg(max_x) avg_max_x, avg(max_y) avg_max_y, calibration_type,
        num_calibration_targets
      FROM (
        SELECT calibration_type, num_calibration_targets,
          Max(p.x) max_x, Max(p.y) max_y
        FROM validationDatas v
        LEFT JOIN gazeAtTargetDatas g
          ON v.validation_data_id = g.validation_data_id
        INNER JOIN positions p ON p.position_id = g.${property}_id
        GROUP BY v.validation_data_id
      )
      GROUP BY calibration_type, num_calibration_targets
    )
    ORDER BY avg_max_x + avg_max_y ASC
  `;
  const avgWorstAccPerCalibrationProcedure = await dbHelper.getAll({
    db, stmt: avgWorstPerCalibrationProcedureStmt('accuracy_relative')
  });
  const avgWorstPrecPerCalibrationProcedure = await dbHelper.getAll({
    db, stmt: avgWorstPerCalibrationProcedureStmt('precision_relative')
  });

  const avgWorstPerCalibrationProcedureTopResultsStmt = ({
    numTopResultsPerCategory, property
  }) => {
    return stripIndent`
      SELECT * FROM (
        SELECT calibration_type, num_calibration_targets,
          avg(x_max_same_id) worst_x_avg, avg(y_max_same_id) worst_y_avg
        FROM (
          SELECT calibration_type, num_calibration_targets,
            max(p.x) x_max_same_id, max(p.y) y_max_same_id,
            ROW_NUMBER() OVER (
              PARTITION BY v.calibration_type, v.num_calibration_targets
              ORDER BY (max(p.x) + max(p.y)) ASC
            ) rank_in_same_category
          FROM validationDatas v
          LEFT JOIN gazeAtTargetDatas g
            ON v.validation_data_id = g.validation_data_id
          INNER JOIN positions p ON p.position_id = g.${property}_id
          GROUP BY v.validation_data_id
        )
        WHERE rank_in_same_category <= ${numTopResultsPerCategory}
        GROUP BY calibration_type, num_calibration_targets
      )
      ORDER BY (worst_x_avg + worst_y_avg) ASC;
    `;
  };

  const avgWorstAccPerCalibrationProcedureTopTwentyPct =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: twentyPctOfParticipantsAmount,
        property: 'accuracy_relative'
      })
    });
  const avgWorstAccPerCalibrationProcedureTopEightyPct =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: eightyPctOfParticipantsAmount,
        property: 'accuracy'
      })
    });
  const avgWorstAccPerCalibrationProcedureRelative =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: numParticipants,
        property: 'accuracy_relative'
      })
    });
  const avgWorstAccPerCalibrationProcedureTopEightyPctRelative =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: eightyPctOfParticipantsAmount,
        property: 'accuracy_relative'
      })
    });
  const avgWorstPrecPerCalibrationProcedureTopTwentyPct =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: twentyPctOfParticipantsAmount,
        property: 'precision_relative'
      })
    });
  const  avgWorstPrecPerCalibrationProcedureRelative=
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: numParticipants,
        property: 'precision_relative'
      })
    });

  // Per Target
  const avgPerTargetStmt = ({numTopResultsPerTarget, property}) => codeBlock`
    SELECT * FROM (
      SELECT target_pos_name, avg(x) x_avg, avg(y) y_avg
      FROM (
        SELECT target_pos_name, p.x x, p.y y,
        ROW_NUMBER() OVER (
          PARTITION BY target_pos_name
          ORDER BY (p.x + p.y) ASC
        ) rank_in_same_category
        FROM gazeAtTargetDatas
        INNER JOIN positions p ON p.position_id = ${property}_id
      )
      WHERE rank_in_same_category <= ${numTopResultsPerTarget}
      GROUP BY target_pos_name
    )
    ORDER BY (x_avg + y_avg)
  `;
  const twentyPctOfSameTargetsAmount = Math.round(
    (numParticipants * validationDatasPerParticipant) / 5
  );
  const eightyPctOfSameTargetsAmount = Math.round(
    (numParticipants * validationDatasPerParticipant) * (4/5)
  );
  const hundredPctOfSameTargetsAmount =
    numParticipants * validationDatasPerParticipant;
  const avgAccPerTargetRel = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: hundredPctOfSameTargetsAmount,
      property: 'accuracy_relative'
    })
  });
  const avgAccPerTargetTopTwentyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: twentyPctOfSameTargetsAmount,
      property: 'accuracy'
    })
  });
  const avgAccPerTargetTopEightyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: eightyPctOfSameTargetsAmount,
      property: 'accuracy'
    })
  });
  const avgPrecPerTargetRel = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: hundredPctOfSameTargetsAmount,
      property: 'precision_relative'
    })
  });
  const avgPrecPerTargetTopTwentyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: twentyPctOfSameTargetsAmount,
      property: 'precision'
    })
  });
  const avgPrecPerTargetTopEightyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: eightyPctOfSameTargetsAmount,
      property: 'precision'
    })
  });

  // Per Participant
  const avgPerEyeColorStmt = property => codeBlock`
    SELECT eye_color,
      COUNT(DISTINCT p.participant_study_data_id) participant_count,
      avg(pos.x) x_avg, avg(pos.y) y_avg
    FROM participantStudyDatas p
    LEFT JOIN validationDatas v
      ON v.participant_study_data_id = p.participant_study_data_id
    LEFT JOIN gazeAtTargetDatas g
      ON v.validation_data_id = g.validation_data_id
    INNER JOIN positions pos ON pos.position_id = g.${property}_id
    GROUP BY eye_color
  `;
  avgAccuracyPerEyeColor = await dbHelper.getAll({
    db, stmt: avgPerEyeColorStmt('accuracy_relative')
  });

  const getPrettyStr = (name, val) => {
    return name + ':\n' + JSON.stringify(val, null, 4) + '\n'
  }

  // Per Calibration Procedure
  const averageAccPrettyString = getPrettyStr(
    'Average Accurcy', avgAccPerCalibrationProcedure
  )
  const averageAccRelPrettyString = getPrettyStr(
    'Average Relative Accurcy', avgAccPerCalibrationProcedureRelative
  )
  const averagePrecPrettyString = getPrettyStr(
    'Average Precision', avgPrecPerCalibrationProcedure
  )
  const averagePrecRelPrettyString = getPrettyStr(
    'Average Relative Precision', avgPrecPerCalibrationProcedureRelative
  )

  // Per Target Position
  const averageAccPerTargetPosRelPrettyString = getPrettyStr(
    'Average Accurcy', avgAccPerTargetRel
  )
  const averagePrecPerTargetPosRelPrettyString = getPrettyStr(
    'Average Precision', avgPrecPerTargetRel
  )

  // Avg per Calibration Procedure wors targets
  const avgWorstAccRelPrettyString = getPrettyStr(
    'Average of worst Accurcy per Target, Relative',
    avgWorstAccPerCalibrationProcedureRelative
  )
  const avgWorstPrecRelPrettyString = getPrettyStr(
    'Average of worst Precison per Target, Relative',
    avgWorstPrecPerCalibrationProcedureRelative
  )
  
  // Per Eye Color
  const averageAccPerEyeColorPrettyString = getPrettyStr(
    'Average Accuracy', avgAccuracyPerEyeColor
  )

  const outString = codeBlock`
    Minumum number of gaze Estimations on any target: ${minNumGazeEstimations}
    Number of participants with a valid amount of gaze data: ${numParticipants}

    Viewports:
    ${JSON.stringify(viewports, null, 4)}

     Per Calibration Procedure
    ----------------------------------------------
    ${averageAccPrettyString}
    ${averageAccRelPrettyString}
    ${averagePrecPrettyString}
    ${averagePrecRelPrettyString}

    Avg per Calibration Procedure Worst Targets relative
    ----------------------------------------------------
    ${avgWorstAccRelPrettyString}
    ${avgWorstPrecRelPrettyString}


    Per Target Position
    --------------------------------------
    ${averageAccPerTargetPosRelPrettyString}
    ${averagePrecPerTargetPosRelPrettyString}


    Data specific to participants individual properties
    ---------------------------------------------------
    Average Accuracy per Eye Color:
    ${averageAccPerEyeColorPrettyString}
  `

  console.log(outString);
})();

const removeParticipantsWithIllegalValidationDatasCount =
  async ({db, legalAmount}) =>
{
  const getValidationDatasCountStmt = stripIndent`
    SELECT p.participant_study_data_id, COUNT(v.participant_study_data_id)
    FROM participantStudyDatas p
    LEFT JOIN validationDatas v
    ON v.participant_study_data_id =
      p.participant_study_data_id
    GROUP BY p.participant_study_data_id
  `;
  const validationDatasCountPerParticipant =  await dbHelper.getAll({
    db, stmt: getValidationDatasCountStmt
  });
  const illegalParticipantIDs = validationDatasCountPerParticipant.filter(
    data => data['COUNT(v.participant_study_data_id)'] !== legalAmount
  ).map(data => data['participant_study_data_id']);
  const deleteIllegalParticipantsStmt = stripIndent`
    DELETE FROM participantStudyDatas
    WHERE participant_study_data_id = ?
  `;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  for (illegalID of illegalParticipantIDs) {
    const deletePrompt = codeBlock`
      Participant with Id=${illegalID} has an illegal amount of validation datas.
      Legal amount is: ${legalAmount}.
      Do you really want to delete that participants data? (yes or y to delete)
    `;
    const answer = await readLineQuestionPromise({question: deletePrompt, rl});
    if (answer === 'y' || answer === 'yes') {
      await dbHelper.run({db,
        stmt: deleteIllegalParticipantsStmt,
        values: illegalID 
      });
    }
  }
  rl.close();
};

const readLineQuestionPromise = ({question, rl}) => new Promise(resolve => {
  rl.question(question, answer => resolve(answer));
});

