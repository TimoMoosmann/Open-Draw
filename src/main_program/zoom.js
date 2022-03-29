import {createPos, createZoom} from '../data_types';

// To solve problems with floating arithmetic. Snapping to edges of the
// canvas when the viewing window is close enough, is activated;
const snapTolerance = 0.01; // 1% of screen widht

const canMoveLeft = zoom => {
  return zoom.canvasOffsetFactor.x > 0;
};

const canMoveRight = zoom => {
  return zoom.canvasOffsetFactor.x < zoom.level.maxCanvasOffsetFactor;
};

const canMoveUp = zoom => {
  return zoom.canvasOffsetFactor.y > 0;
};

const canMoveDown = zoom => {
  return zoom.canvasOffsetFactor.y < zoom.level.maxCanvasOffsetFactor;
};

const moveLeft = zoom => {
  const xNoBoundaries =
    zoom.canvasOffsetFactor.x - zoom.offsetFactorShiftAmount;
  zoom.canvasOffsetFactor.x = moveOrSnapZero(xNoBoundaries);
  return zoom;
};

const moveRight = zoom => {
  const xNoBoundaries =
    zoom.canvasOffsetFactor.x + zoom.offsetFactorShiftAmount;
  zoom.canvasOffsetFactor.x = moveOrSnapMax({
    maxVal: zoom.level.maxCanvasOffsetFactor, posVal: xNoBoundaries
  });
  return zoom;
};

const moveUp = zoom => {
  const yNoBoundaries =
    zoom.canvasOffsetFactor.y - zoom.offsetFactorShiftAmount;
  zoom.canvasOffsetFactor.y = moveOrSnapZero(yNoBoundaries);
  return zoom;
};

const moveDown = zoom => {
  const yNoBoundaries =
    zoom.canvasOffsetFactor.y + zoom.offsetFactorShiftAmount;
  zoom.canvasOffsetFactor.y = moveOrSnapMax({
    maxVal: zoom.level.maxCanvasOffsetFactor, posVal: yNoBoundaries
  });
  return zoom;
};

const canZoomIn = zoom => {
  return zoom.level.next !== null;
};

const canZoomOut = zoom => {
  return zoom.level.prev !== null;
};

const zoomIn = zoom => {
  if (zoom.level.next) {
    const zoomFactor = zoom.level.factor;
    const nxtLevelZoomFactor = zoom.level.next.factor;
    const offsetFactorChange = zoomLevelTransitionOffsetChange({
      higherZoomFactor: nxtLevelZoomFactor,
      lowerZoomFactor: zoomFactor
    });
    zoom.canvasOffsetFactor.x += offsetFactorChange;
    zoom.canvasOffsetFactor.y += offsetFactorChange;
    zoom.level = zoom.level.next;
  }
  return zoom;
};

const zoomOut = zoom => {
  if (zoom.level.prev) {
    if (zoom.level.prev.factor === 1.0) {
      zoom.canvasOffsetFactor = createPos({x: 0, y: 0});
    } else {
      const zoomFactor = zoom.level.factor;
      const prevLevelZoomFactor = zoom.level.prev.factor;
      const offsetFactorChange = zoomLevelTransitionOffsetChange({
        higherZoomFactor: zoomFactor,
        lowerZoomFactor: prevLevelZoomFactor
      });
      const offsetFactorXNoBoundaries =
        zoom.canvasOffsetFactor.x - offsetFactorChange;
      const offsetFactorYNoBoundaries =
        zoom.canvasOffsetFactor.y - offsetFactorChange;
      zoom.canvasOffsetFactor.x = moveOrSnapZero(offsetFactorXNoBoundaries);
      zoom.canvasOffsetFactor.y = moveOrSnapZero(offsetFactorYNoBoundaries);
    }
    zoom.level = zoom.level.prev;
  }
  return zoom;
};

const moveOrSnapZero = posVal  => {
  return posVal >= 0 + snapTolerance ? posVal : 0;
};

const moveOrSnapMax = ({maxVal, posVal}) => {
  return posVal <= maxVal - snapTolerance ? posVal : maxVal;
};

const zoomLevelTransitionOffsetChange = ({
  higherZoomFactor,
  lowerZoomFactor
}) => {
  return (higherZoomFactor - lowerZoomFactor) / 2;
};

export {canMoveLeft, canMoveRight, canMoveUp, canMoveDown, canZoomIn,
  canZoomOut, moveLeft, moveRight, moveUp, moveDown, zoomIn, zoomOut
};
