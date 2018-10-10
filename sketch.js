const canvasSketch = require('canvas-sketch');
const glslsketch = require('./glslsketch');
const webglSketch = require('./webgl-sketch');
const webglSketch2 = require('./webgl-sketch2');
const gradientSketch = require('./gradient-sketch');
const pixelSketch = require('./pixel-sketch');
const canvasInCanvas = require('./canvas-in-canvas');



// Start the sketch
//canvasSketch(canvasInCanvas.sketch, canvasInCanvas.settings);
//canvasSketch(gradientSketch.sketch, gradientSketch.settings);
//canvasSketch(pixelSketch.sketch, pixelSketch.settings);
//canvasSketch(webglSketch.sketch, webglSketch.settings);
canvasSketch(webglSketch2.sketch, webglSketch.settings);