import {idtOneIteration} from '../../src/webgazer_extensions/fixation_detection.js';
import {createFixation, createPos, createTimedPosItem, posEqual} from '../../src/data_types.js';
import {arraysEqual} from '../../src/util/main.js';

import {List} from '../../other_modules/linked-list.js';
import {stripIndent} from 'common-tags';

// Only works for the test cases, because here the same positions are also
// exactly the same objects.
const posListEquals = (posList1, posList2) => {
  if (posList1.size != posList2.size) return false;
  for (let i = 0; i < posList1.size; i++) {
    if(
      !posEqual(posList1[i].pos, posList2[i].pos) ||
      posList1[i].timestamp !== posList2[i].timestamp
    ) {
      return false;
    }
  }
  return true;
};

describe('A sequence of potential gaze Estimations from Webgazer', () => {

  const durationThreshold = 200;
  const dispersionThreshold = createPos({x: 100, y: 100});
  const gazePos1 = createPos({x: 50, y: 25});
  const gazePos2 = createPos({x: 100, y: 50});
  const gazePos3 = createPos({x: 75, y: 75});
  const gazePos4 = createPos({x: 175, y: 150});
  const gazePos5 = createPos({x: 400, y: 400});

  test(stripIndent`
    No Fixation should be detected when there is only one or less gaze Points
    in the recent positions list. Also the list should not be altered
  `, () => {
    const gazePoint1 = createTimedPosItem({timestamp: 100, pos: gazePos1});
    const timedGazePositions = new List(gazePoint1);
    expect(idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })).toBeFalsy();
    expect(timedGazePositions.toArray().map(it => it.pos))
      .toEqual([gazePos1]);
  });

  test(stripIndent`
    Since the duration threshold of 200ms is not reached yet, the list should
    still be the same, and not fixation should be detected.
  `, () => {
    const gazePoint1 = createTimedPosItem({timestamp: 100, pos: gazePos1});
    const gazePoint2 = createTimedPosItem({timestamp: 200, pos: gazePos2});
    const timedGazePositions = new List(gazePoint1, gazePoint2);
    expect(idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })).toBeFalsy();
    expect(timedGazePositions.toArray().map(it => it.pos)).toEqual(
      [gazePos1, gazePos2]
    );
  });

  test(stripIndent`
    Now the duration Threshold is reached. Since the points still fit in the
    duration Threshold a fixation should be detected, but no point deleted
  `, () => {
    const gazePoint1 = createTimedPosItem({timestamp: 100, pos: gazePos1});
    const gazePoint2 = createTimedPosItem({timestamp: 200, pos: gazePos2});
    const gazePoint3 = createTimedPosItem({timestamp: 300, pos: gazePos3});
    const timedGazePositions = new List(gazePoint1, gazePoint2, gazePoint3);
    expect(idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })).toEqual(createFixation({
      center: createPos({x: 75, y: 50}),
      duration: 200
    }));
    expect(timedGazePositions.toArray().map(it => it.pos)).toEqual(
      [gazePos1, gazePos2, gazePos3]
    );
  });

  test(stripIndent`
    Points 2 to 4 lie in the dispersion threshold, so a fixation should be
    detected, but point 1 should be deleted.
  `, () => {
    const gazePoint1 = createTimedPosItem({timestamp: 100, pos: gazePos1});
    const gazePoint2 = createTimedPosItem({timestamp: 200, pos: gazePos2});
    const gazePoint3 = createTimedPosItem({timestamp: 300, pos: gazePos3});
    const gazePoint4 = createTimedPosItem({timestamp: 400, pos: gazePos4});
    const timedGazePositions = new List(
      gazePoint1, gazePoint2, gazePoint3, gazePoint4
    );
    expect(idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })).toEqual(createFixation({
      center: createPos({x: 117, y: 92}),
      duration: 200
    }));
    expect(timedGazePositions.toArray().map(it => it.pos)).toEqual(
      [gazePos2, gazePos3, gazePos4]
    );
  });

  test(stripIndent`
    Now only the  point 5 lies in the dispersion Threshold,
    so the other points should be deleted, and no fixation should be noted.
  `, () => {
    const gazePoint2 = createTimedPosItem({timestamp: 200, pos: gazePos2});
    const gazePoint3 = createTimedPosItem({timestamp: 300, pos: gazePos3});
    const gazePoint4 = createTimedPosItem({timestamp: 400, pos: gazePos4});
    const gazePoint5 = createTimedPosItem({timestamp: 500, pos: gazePos5});
    const timedGazePositions = new List(
      gazePoint2, gazePoint3, gazePoint4, gazePoint5
    );
    expect(idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })).toBeFalsy();
    expect(timedGazePositions.toArray().map(it => it.pos)).toEqual([gazePos5]);
  });
});
