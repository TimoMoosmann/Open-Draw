import {createFixation, createPos, createTimedPosItem, posLowerThanOrEqual, posSubtract} from '../data_types.js'; 
import {mean} from '../util/math.js';

import {List, Item} from '../../other_modules/linked-list.js';

const runWebgazerDwellDetection = ({
  dispersionThreshold,
  durationThreshold,
  onFixation
}) => {
  const timedGazePositions = new List();
  webgazer.setGazeListener((gazePos, timestamp) => {
    const timedGazePosItem = createTimedPosItem({timestamp, pos: gazePos});
    timedGazePositions.append(timedGazePosItem);
    let fixation;
    if (fixation = idtOneIteration({
      dispersionThreshold, durationThreshold, timedGazePositions
    })) {
      onFixation(fixation);
    }
  });
};

const idtOneIteration = ({
  dispersionThreshold, durationThreshold, timedGazePositions
}) => {
  if (timedGazePositions.size >= 2) {
    getMaxWindowToFitInDispersionThreshold({
      dispersionThreshold, timedGazePositions
    });
    const windowFirstEl = timedGazePositions.head;
    const windowLastEl = (timedGazePositions.size === 1) ?
      timedGazePositions.head : timedGazePositions.tail;
    let fixationDuration;
    if (
      (fixationDuration = windowLastEl.timestamp - windowFirstEl.timestamp)
      >= durationThreshold
    ) {
      const fixationCenter = getCenterPoint(
        timedGazePositions.toArray().map(it => it.pos)
      );
      return createFixation({
        center: fixationCenter,
        duration: fixationDuration
      });
    }
  }
  return false;
};

const getMaxWindowToFitInDispersionThreshold = ({
  dispersionThreshold, timedGazePositions
}) => {
  let maxPos = createPos(timedGazePositions.tail.pos);
  let minPos = createPos(timedGazePositions.tail.pos);
  let itemsFitInDispersionThreshold = false;
  let prevItem = timedGazePositions.tail;
  let currentItem = timedGazePositions.tail.prev;
  while (
    (itemsFitInDispersionThreshold = fitsInDispersionThreshold({
      maxPos, minPos, dispersionThreshold
    })) && currentItem)
  {
    updateMax({maxPos, updatePos: currentItem.pos});
    updateMin({minPos, updatePos: currentItem.pos});
    prevItem = currentItem;
    currentItem = currentItem.prev;
  }
  if (!itemsFitInDispersionThreshold) {
    removeFromElToHead(prevItem);
  }
  return timedGazePositions;
};

const fitsInDispersionThreshold = ({maxPos, minPos, dispersionThreshold}) => {
  return posLowerThanOrEqual(posSubtract(maxPos, minPos), dispersionThreshold);
};

const updateMax = ({maxPos, updatePos}) => {
  maxPos.x = Math.max(maxPos.x, updatePos.x);
  maxPos.y = Math.max(maxPos.y, updatePos.y);
};

const updateMin = ({minPos, updatePos}) => {
  minPos.x = Math.min(minPos.x, updatePos.x);
  minPos.y = Math.min(minPos.y, updatePos.y);
};

const removeFromElToHead = el => {
  if (el.prev !== null) removeFromElToHead(el.prev);
  el.detach();
};

const getCenterPoint = posArr => createPos({
  x: Math.round(mean(posArr.map(pos => pos.x))),
  y: Math.round(mean(posArr.map(pos => pos.y))),
});

export {idtOneIteration};

