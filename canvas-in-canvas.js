/**
 * A proof-of-concept showing one canvasSketch interface
 * interacting with a child canvasSketch interface.
 *
 * Here we use an off-screen sketch to draw text to a canvas,
 * and the main on-screen sketch will render that at a smaller
 * scale to produce crisper text rendering.
 *
 * Most likely, this is overkill, and simply creating and manually
 * scaling a second canvas will be far simpler and easier to manage.
 * However, this demo proves the capability of using multiple sketches,
 * if you so desire.
 *
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');

const smallGradientSketch = ({ context, update }) => {
    const margin = 0.6;

  return {
    render ({ width, height }) {
        // Gradient background
        const fill = context.createLinearGradient(
            0,
            ((Math.cos(Date.now()/1000)/2)+1) * height,
            ((Math.cos(Date.now()/1000)/2)+1) * width,
            height
        );
        fill.addColorStop(0, 'blue');
        fill.addColorStop(1, 'green');

        context.fillStyle = fill;
        context.fillRect(margin, margin, width - margin * 2, height - margin * 2);
    }
  };
};

const createText = async () => {
  const manager = await canvasSketch(smallGradientSketch, {
    // Avoid attaching to body
    parent: false,

    dimensions: [2,2],
    pixelsPerInch: 300,
    units: 'cm',
    animate: true,
    playing: true,
  });

  // Return a nicer API/interface for end-users
  return {
    canvas: manager.props.canvas
  };
};

export const settings = {
    dimensions: 'a4',
    pixelsPerInch: 300,
    units: 'cm',
    animate: true,
    playing: true,
    fps: 60,
};

export const sketch = async ({ render }) => {
  // Wait and load for a text interface
  const text = await createText();

  return ({ context, width, height }) => {
    // Margin in inches
    const margin = 0.6;

    // Gradient background
    const fill = context.createLinearGradient(
    0,
    0,
    width,
    ((Math.sin(Date.now()/1000)/2)+1) * height
    );
    fill.addColorStop(0, 'red');
    fill.addColorStop(1, 'yellow');

    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    // Draw the canvas centred and scaled down by N
    // This will give us crisper looking text in retina
    const density = 20;
    context.save();
    context.translate(width / 2, height / 2);
    context.scale(1 / density, 1 / density);
    context.translate(-text.canvas.width / 2, -text.canvas.height / 2);
    context.drawImage(text.canvas, 0, 0);
    context.restore();
  };
  
};