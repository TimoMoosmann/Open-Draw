import { createZoom } from 'Src/main_program/data_types/zoom.js'
import { createZoomLevels } from 'Src/main_program/data_types/zoom_levels.js';
import {canMoveLeft, canMoveRight, canMoveUp, canMoveDown, canZoomIn,
  canZoomOut, moveLeft, moveRight, moveUp, moveDown, zoomIn, zoomOut
} from '../../src/main_program/zoom.js'

const getTestZoomFactors = () => [1.0, 1.5, 2.0, 3.0];

const createTestZoom = ({
  canvasOffsetFactor,
  offsetFactorShiftAmount = 0.25,
  testZoomFactors = getTestZoomFactors()
} = {}) => {
  const testZoom = createZoom({
    offsetFactorShiftAmount, zoomFactors: [1, 1.5, 2.0, 3.0]
  });
  if (canvasOffsetFactor) testZoom.canvasOffsetFactor = canvasOffsetFactor;
  return testZoom;
};

test('Create illegal zoom levels.', () => {
  expect(() => createZoom({
    offsetShiftFactorAmount: 0.25, zoomFactors: [1, 0.5]
  })).toThrow(
    'Zoom Levels needs to be definded in an ascending order.'
  );
  expect(() => createZoomLevels({
    offsetShiftFactorAmount: 0.25, zoomFactors: [0.5, 1]
  })).toThrow(
    'Initial Zoom Factor always needs to be 1.0'
  );
});

/*
 * Zoom Level 1: Max Offset: 0, from level 2 -> 1: offset = 0
 * Zoom Level 2: Max Offset: 0.5, from Level 1 -> 2: offset += 0.25
 * Zoom Level 3: Max Offset: 1.0, from Level 2 -> 3: offset += 0.25
 *                                from Level 3 -> 2: offset -= 0.25
 * Zoom Level 4: Max Offset: 2.0, from Level 3 -> 4: offset += 0.5
 *                                           4 -> 3:        -= 0.5
 */

test('Move around in Zoom level 1 (Zoomfactor: 1.0)', () => {
  const zoom = createTestZoom();
  const unmovedZoom = createTestZoom();
  expect(canMoveLeft(zoom)).toBe(false);
  expect(moveLeft(zoom)).toEqual(unmovedZoom);
  expect(canMoveRight(zoom)).toBe(false);
  expect(moveRight(zoom)).toEqual(unmovedZoom);
  expect(canMoveUp(zoom)).toBe(false);
  expect(moveUp(zoom)).toEqual(unmovedZoom);
  expect(canMoveDown(zoom)).toBe(false);
  expect(moveDown(zoom)).toEqual(unmovedZoom);
});

test('Zoom to level two (Zoomfactor: 1.5), and move around', () => {
  const offsetFactorShiftAmount = 0.25;
  const zoom = createTestZoom({offsetFactorShiftAmount});
  expect(canZoomIn(zoom)).toBe(true);
  zoomIn(zoom)
  expect(zoom.canvasOffsetFactor.x).toBeCloseTo(0.25, 5);
  expect(zoom.canvasOffsetFactor.y).toBeCloseTo(0.25, 5);
  expect(zoom.level.factor).toBe(1.5);

  expect(canMoveLeft(zoom)).toBe(true);
  expect(moveLeft(zoom).canvasOffsetFactor.x).toBeCloseTo(0, 5);
  expect(canMoveLeft(zoom)).toBe(false);
  expect(moveLeft(zoom).canvasOffsetFactor.x).toBe(0);

  expect(canMoveRight(zoom)).toBe(true);
  expect(moveRight(zoom).canvasOffsetFactor.x).toBeCloseTo(0.25, 5);
  expect(canMoveRight(zoom)).toBe(true);
  expect(moveRight(zoom).canvasOffsetFactor.x).toBeCloseTo(0.5, 5);
  expect(canMoveRight(zoom)).toBe(false);
  expect(moveRight(zoom).canvasOffsetFactor.x).toBe(0.5);

  expect(canMoveUp(zoom)).toBe(true);
  expect(moveUp(zoom).canvasOffsetFactor.y).toBeCloseTo(0, 5);
  expect(canMoveUp(zoom)).toBe(false);
  expect(moveUp(zoom).canvasOffsetFactor.y).toBe(0);

  expect(canMoveDown(zoom)).toBe(true);
  expect(moveDown(zoom).canvasOffsetFactor.y).toBeCloseTo(0.25, 5);
  expect(canMoveDown(zoom)).toBe(true);
  expect(moveDown(zoom).canvasOffsetFactor.y).toBeCloseTo(0.5, 5);
  expect(canMoveDown(zoom)).toBe(false);
  expect(moveDown(zoom).canvasOffsetFactor.y).toBe(0.5);
});

test('Switch zoom levels from first to last and then back to first.', () => {
  const zoom = createTestZoom();

  // Zoom in
  expect(canZoomIn(zoom)).toBe(true);
  expect(zoomIn(zoom).canvasOffsetFactor.x).toBeCloseTo(0.25, 5);
  expect(canZoomIn(zoom)).toBe(true);
  expect(zoomIn(zoom).canvasOffsetFactor.y).toBeCloseTo(0.5, 5);
  expect(canZoomIn(zoom)).toBe(true);
  expect(zoomIn(zoom).canvasOffsetFactor.x).toBeCloseTo(1.0, 5);
  expect(canZoomIn(zoom)).toBe(false);
  expect(zoomIn(zoom).canvasOffsetFactor.y).toBeCloseTo(1.0, 5);

  // Zoom out
  expect(canZoomOut(zoom)).toBe(true);
  expect(zoomOut(zoom).canvasOffsetFactor.x).toBeCloseTo(0.5, 5);
  expect(canZoomOut(zoom)).toBe(true);
  expect(zoomOut(zoom).canvasOffsetFactor.y).toBeCloseTo(0.25, 5);
  expect(canZoomOut(zoom)).toBe(true);
  expect(zoomOut(zoom).canvasOffsetFactor.x).toBe(0);
  expect(canZoomOut(zoom)).toBe(false);
  expect(zoomOut(zoom).canvasOffsetFactor.y).toBe(0);
});

