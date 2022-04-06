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
if (process.env.NODE_ENV === 'production') {
  validationDatasPerParticipant = 6;
} else {
  validationDatasPerParticipant = 2;
}

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
    db, stmt: avgPerCalibrationProcedureStmt('accuracy_relative')
  });
  const avgPrecPerCalibrationProcedure = await dbHelper.getAll({
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
  const avgWorstPrecPerCalibrationProcedureTopEightyPct =
    await dbHelper.getAll({
      db, stmt: avgWorstPerCalibrationProcedureTopResultsStmt({
        numTopResultsPerCategory: eightyPctOfParticipantsAmount,
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
  const avgAccPerTarget = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: hundredPctOfSameTargetsAmount,
      property: 'accuracy_relative'
    })
  });
  const avgAccPerTargetTopTwentyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: twentyPctOfSameTargetsAmount,
      property: 'accuracy_relative'
    })
  });
  const avgAccPerTargetTopEightyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: eightyPctOfSameTargetsAmount,
      property: 'accuracy_relative'
    })
  });
  const avgPrecPerTarget = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: hundredPctOfSameTargetsAmount,
      property: 'precision_relative'
    })
  });
  const avgPrecPerTargetTopTwentyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: twentyPctOfSameTargetsAmount,
      property: 'precision_relative'
    })
  });
  const avgPrecPerTargetTopEightyPct = await dbHelper.getAll({
    db, stmt: avgPerTargetStmt({
      numTopResultsPerTarget: eightyPctOfSameTargetsAmount,
      property: 'precision_relative'
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

  const outString = codeBlock`
    Minumum number of gaze Estimations on any target: ${minNumGazeEstimations}
    Number of participants with a valid amount of gaze data: ${numParticipants}

    Data specific for each calibration procedure
    ----------------------------------------------
    Average Accurcy (each calibration procedure ${numParticipants} times):
    ${JSON.stringify(avgAccPerCalibrationProcedure, null, 4)}
    Average Precision (each calibration procedure ${numParticipants} times):
    ${JSON.stringify(avgPrecPerCalibrationProcedure, null, 4)}
    ${oneLineTrim`Average Accuracy of top 20 Percent of each calibration 
      procedure (${twentyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(avgAccPerCalibrationProcedureTopTwentyPct, null, 4)}
    ${oneLineTrim`Average Accuracy of top 80 Percent of each calibration 
      procedure (${eightyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(avgAccPerCalibrationProcedureTopEightyPct, null, 4)}
    ${oneLineTrim`Average Precision of top 20 Percent of each calibration 
      procedure (${twentyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(
      avgPrecPerCalibrationProcedureTopTwentyPct, null, 4
    )}
    ${oneLineTrim`Average Precision of top 80 Percent of each calibration 
      procedure (${eightyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(
      avgPrecPerCalibrationProcedureTopEightyPct, null, 4
    )}

    Average Worst Accurcy (each calibration procedure ${numParticipants} times):
    ${JSON.stringify(avgWorstAccPerCalibrationProcedure, null, 4)}
    Average Worst Precision (each calibration procedure ${numParticipants}
    times):
    ${JSON.stringify(avgWorstPrecPerCalibrationProcedure, null, 4)}
    ${oneLineTrim`Average Worst Accuracy of top 20 Percent of each calibration 
      procedure (${twentyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(avgWorstAccPerCalibrationProcedureTopTwentyPct, null, 4)}
    ${oneLineTrim`Average Worst Accuracy of top 80 Percent of each calibration 
      procedure (${eightyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(avgWorstAccPerCalibrationProcedureTopEightyPct, null, 4)}
    ${oneLineTrim`Average Worst Precision of top 20 Percent of each calibration 
      procedure (${twentyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(
      avgWorstPrecPerCalibrationProcedureTopTwentyPct, null, 4
    )}
    ${oneLineTrim`Average Worst Precision of top 80 Percent of each calibration 
      procedure (${eightyPctOfParticipantsAmount} calibrations each)`}
    ${JSON.stringify(
      avgWorstPrecPerCalibrationProcedureTopEightyPct, null, 4
    )}

    Data specific for each target position
    --------------------------------------
    Average Accurcy (${hundredPctOfSameTargetsAmount} targets each):
    ${JSON.stringify(avgAccPerTarget, null, 4)}
    Average Precision (${hundredPctOfSameTargetsAmount} targets each):
    ${JSON.stringify(avgPrecPerTarget, null, 4)}
    ${oneLineTrim`Average Accuracy of top 20 Percent for each target position (
      ${twentyPctOfSameTargetsAmount} targets each)`}
    ${JSON.stringify(avgAccPerTargetTopTwentyPct, null, 4)}
    ${oneLineTrim`Average Accuracy of top 80 Percent for each target position (
      ${eightyPctOfSameTargetsAmount} targets each)`}
    ${JSON.stringify(avgAccPerTargetTopEightyPct, null, 4)}
    ${oneLineTrim`Average Precision of top 20 Percent for each target position (
      ${twentyPctOfSameTargetsAmount} targets each)`}
    ${JSON.stringify(
      avgPrecPerTargetTopTwentyPct, null, 4
    )}
    ${oneLineTrim`Average Precision of top 80 Percent for each target position (
      ${eightyPctOfSameTargetsAmount} targets each)`}
    ${JSON.stringify(
      avgPrecPerTargetTopEightyPct, null, 4
    )}

    Data specific to participants individual properties
    ---------------------------------------------------
    Average Accuracy per Eye Color:
    ${JSON.stringify(avgAccuracyPerEyeColor, null, 4)}
  `;
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

