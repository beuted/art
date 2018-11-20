const canvasSketch = require('canvas-sketch');
const glslsketch = require('./glslsketch');
const webglSketch = require('./webgl-sketch');
const webglSketch2 = require('./webgl-sketch2');
const gradientSketch = require('./gradient-sketch');
const pixelSketch = require('./pixel-sketch');
const canvasInCanvas = require('./canvas-in-canvas');

var sketches = [
    canvasInCanvas,
    gradientSketch,
    pixelSketch,
    webglSketch,
    webglSketch2
];

var currSketchIndex = 0;

var manager = null;
canvasSketch(sketches[currSketchIndex].sketch, sketches[currSketchIndex].settings).then((x) => {
    manager = x;
});

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        currSketchIndex = (currSketchIndex - 1) % sketches.length;
        updateSketch(sketches[currSketchIndex]);
    }
    else if (e.keyCode == '39') {
        currSketchIndex = (currSketchIndex +1) % sketches.length;
        updateSketch(sketches[currSketchIndex]);
    }
}

async function updateSketch(sketch) {
    manager.destroy();
    manager = await canvasSketch(sketch.sketch, sketch.settings);
}