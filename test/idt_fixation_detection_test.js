const assert = require('assert');
const rewire = require('rewire');

const idtFixationDetectionScript = rewire('../src/idt_fixation_detection.js');
const getMinPoint = idtFixationDetectionScript.__get__('getMinPoint');
const getMaxPoint = idtFixationDetectionScript.__get__('getMaxPoint');
const getDispersion = idtFixationDetectionScript.__get__('getDispersion');
const getCenterPoint = idtFixationDetectionScript.__get__('getCenterPoint');
const pointsCoverDurationThreshold = idtFixationDetectionScript.__get__('pointsCoverDurationThreshold');
const idtFixationDetection = idtFixationDetectionScript.__get__('idtFixationDetection');

describe('Helper Functions', function() {
  const point1 = {x: 3, y: 2, elapsedTime: 100};
  const point2 = {x: -1, y: 3, elapsedTime: 200};
  const point3 = {x: 0, y: -3, elapsedTime: 300};
  const points1 = [point1, point2, point3];

  describe('#getMinPoint(points)', function () {
    it('should return the x value of point2 and the y value of point3', function () {
      assert.deepEqual({x:-1, y:-3}, getMinPoint(points1));
    })
  })
  describe('#getMaxPoint(points)', function () {
    it('should return the x value of point2 and the y value of point3', function () {
      assert.deepEqual({x:3, y:3}, getMaxPoint(points1));
    })
  })
  describe('#pointsCoverDurationThreshold(points, durationThreshold)', function () {
    it('should return true when the points cover the threshold', function() {
      assert.equal(true, pointsCoverDurationThreshold(points1, 200));
    })
    it('should return false when the points not cover the duartion Threshold', function() {
      assert.equal(false, pointsCoverDurationThreshold(points1, 201));
    });
  });
  describe('#getDispersion(points)', function() {
    it('should return 4 + 6 = 10, for the dispersion in x + the dispersion in y',
      function () {
        assert.equal(10, getDispersion(points1));
      })
  })
  describe('#getCenterPoint(points)', function() {
    it('should return the x: 1, y: 1, as the rounded avaerage of the points',
      function () {
        assert.deepEqual({x: 1, y: 1}, getCenterPoint(points1));
      })
   })
})

describe('I-DT Fixation Detection Algorithm', function() {
  let potentialFixationPoints = [];

  const durationThreshold = 200;
  const dispersionThreshold = 100;
  const maxDwellDuration = 1000;

  let onFixationCalled = false;
  const onFixation = () => onFixationCalled = true;

  const point1 = {x: 3, y: 2, elapsedTime: 100};
  const point2 = {x: -1, y: 3, elapsedTime: 200};
  const point3 = {x: 0, y: -3, elapsedTime: 300};
  const point4 = {x: 20, y: 150, elapsedTime: 400};
  const point5 = {x: 10, y: 11, elapsedTime: 500};
  const point6 = {x: 11, y: 12, elapsedTime: 600};
  const point7 = {x: 20, y: 10, elapsedTime: 1300};
  const point8 = {x: 20, y: 20, elapsedTime: 1600};

  let pointsUnderDurationThreshold1 = [];
  let pointsUnderDurationThreshold2 = [point1];
  let pointsInDispersionThreshold1 = [point1, point2];
  let pointsOutOfDispersionThreshold1 = [point1, point2, point3];
  let pointsOutOfDispersionThreshold2 = [point3, point4];
  let pointsOutOfDispersionThreshold3 = [point4, point5];
  let pointsInDispersionThreshold2 = [point5, point6];
  let pointsOutOfTimeLimit = [point5, point6, point7];

  describe('#idtFixationDetection(currentPoint, potentialFixationPoints, maxDwellDuration,' +
  'dispersionThreshold, durationThreshold, onFixation)', function () {
    it('should do nothing when the time window for the given points is below the duration Threshold',
      function () {
        idtFixationDetection(point1, pointsUnderDurationThreshold1, maxDwellDuration,
          dispersionThreshold, durationThreshold, onFixation)
        assert.deepEqual([point1], pointsUnderDurationThreshold1);
        assert.equal(false, onFixationCalled);

        idtFixationDetection(point2, pointsUnderDurationThreshold2, maxDwellDuration,
          dispersionThreshold, durationThreshold, onFixation)
        assert.deepEqual([point1, point2], pointsUnderDurationThreshold2);
        assert.equal(false, onFixationCalled);
      })
    it('should detect a fixation, when the points fit in the disperesionThreshold.'
      + 'The current point gets added and none other point reomved.', function () {
        idtFixationDetection(point3, pointsInDispersionThreshold1, maxDwellDuration,
          dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point1, point2, point3], pointsInDispersionThreshold1);
        assert.equal(true, onFixationCalled);
        onFixationCalled = false;

        idtFixationDetection(point7, pointsInDispersionThreshold2, maxDwellDuration,
          dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point5, point6, point7], pointsInDispersionThreshold2);
        assert.equal(true, onFixationCalled);
        onFixationCalled = false;
      });
    it('should delete as many points from the beginning of the array, till'
      + 'the durationThreshold is not coverd anymore', function() {
        idtFixationDetection(point4, pointsOutOfDispersionThreshold1,
          maxDwellDuration, dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point3, point4], pointsOutOfDispersionThreshold1);
        assert.equal(false, onFixationCalled);

        idtFixationDetection(point5, pointsOutOfDispersionThreshold2,
          maxDwellDuration, dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point4, point5], pointsOutOfDispersionThreshold2);
        assert.equal(false, onFixationCalled);

        idtFixationDetection(point6, pointsOutOfDispersionThreshold3,
          maxDwellDuration, dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point5, point6], pointsOutOfDispersionThreshold3);
        assert.equal(false, onFixationCalled);
      });
    it('should detect a fixation, but still shrinks the list of points because'
      + 'the elapsed time is higher than the limit', function () {
        idtFixationDetection(point8, pointsOutOfTimeLimit, maxDwellDuration,
          dispersionThreshold, durationThreshold, onFixation);
        assert.deepEqual([point6, point7, point8], pointsOutOfTimeLimit);
        assert.equal(true, onFixationCalled);
        onFixationCalled = false;
      });
  })
})

