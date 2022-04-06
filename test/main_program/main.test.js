// Test drawLineZoomed

// create Zoom from with different levels ([1.0, 1.5, 3.0})
// Define a test viewport: 32: 20
// Define test lines: start: 0, 0; end: 31, 17
//                    start: 20, 10 end: 30, 14
//
// drawZommedLines lv1: same lines
// drawZommedLines lv2: 11:(-8, -5), (46.5 - 8 = 39, 35.5 -5 = 30.5)
//  -> for each movement +/- (8, 5);
