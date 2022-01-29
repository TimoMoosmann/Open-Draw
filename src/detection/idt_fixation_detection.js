function reducePointsByComparison(points, redFun) {
  return points.reduce((acc, currentVal) => {
    return {
      x: redFun(acc.x, currentVal.x),
      y: redFun(acc.y, currentVal.y)};
  });
}

function getMinPoint(points) {
  return reducePointsByComparison(points, Math.min);
}

function getMaxPoint(points) {
  return reducePointsByComparison(points, Math.max);
}

function getDispersion(points) {
  const minPoint = getMinPoint(points);
  const maxPoint = getMaxPoint(points);
  return (maxPoint.x - minPoint.x) + (maxPoint.y - minPoint.y);
}

function pointsFitInDispersionThreshold(points, dispersionThreshold) {
  return getDispersion(points) <= dispersionThreshold;
}

function getPointsTimeSpan(points) {
  return (points[points.length -1].elapsedTime - points[0].elapsedTime);
}

function getCenterPoint(points) {
  let xAcc, yAcc;
  xAcc = yAcc = 0;
  for (let i=0; i<points.length; i++) {
    xAcc += points[i].x;
    yAcc += points[i].y;
  }
  return {x: Math.round(xAcc / points.length), y: Math.round(yAcc / points.length)};
}

function pointsCoverDurationThreshold(points, durationThreshold) {
  return getPointsTimeSpan(points) >= durationThreshold;
}

function pointsWindowIsTooLarge(points, maxDwellDuration) {
  return getPointsTimeSpan(points) > maxDwellDuration;
}

function idtFixationDetection(currentPoint, potentialFixationPoints, maxDwellDuration,
  dispersionThreshold, durationThreshold, onFixation) {

  potentialFixationPoints.push(currentPoint);
  while (pointsWindowIsTooLarge(potentialFixationPoints, maxDwellDuration)) {
    potentialFixationPoints.shift();
  }
  while (pointsCoverDurationThreshold(potentialFixationPoints, durationThreshold)) {
    if (pointsFitInDispersionThreshold(potentialFixationPoints, dispersionThreshold)) {
      const fixationCenter = getCenterPoint(potentialFixationPoints);
      const fixationDuration = getPointsTimeSpan(potentialFixationPoints);
      onFixation(fixationCenter, fixationDuration);
      return;
    } else {
      potentialFixationPoints.shift();
    }
  }
}

module.exports = idtFixationDetection;

