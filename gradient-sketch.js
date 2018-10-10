// Sketch parameters
export const settings = {
    dimensions: 'a4',
    pixelsPerInch: 300,
    units: 'cm',
    animate: true,
    playing: true,
    fps: 60,
    pixelated: false,
    canvas: document.querySelector('.background-canvas')
};

var speed = 1/1000;

  
  // animated gradient
export const sketch = () => {
    return ({ context, width, height, exporting }) => {
        let x = Math.sin(Date.now()*speed - Math.PI/4) * width / 2;
        let y = Math.cos(Date.now()*speed + Math.PI/4) * height / 2;
        // Margin in inches
        const margin = 0.6;

        // Off-white background
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        // Gradient foreground
        const fill = context.createLinearGradient(
            0 + x,
            0 + y,
            width - x,
            height - y,
        );
        fill.addColorStop(0, 'pink');
        fill.addColorStop(1, 'red');

        context.fillStyle = fill;
        context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

        // Draw points

        const fillPoints = context.createLinearGradient(
            0 + x,
            0 + y,
            width - x,
            height - y,
        );
        fillPoints.addColorStop(0, 'white');
        fillPoints.addColorStop(1, 'blue');

        // Make circles expand to edge of smallest trim (card) edge,
        // but with a 1/4" padding.
        const maxRadius = (Math.min(width, height) / 1) - (1 / 4);

        // Limit dots to the gradient box
        context.rect(margin, margin, width - margin * 2, height - margin * 2);
        context.clip();

        const points = 1000;
        for (let i = 1; i <= points; i++) {
            const t = i / points;
            // Here phi is the golden ratio
            const phi = (Math.sqrt(5) + 1) / 2;
            // Pick our angle based on the golden ratio
            const theta = 2 * Math.PI * i * phi;
            // Get back a distance 0..1 based on current step
            const distance = Math.sqrt(t);
            // Find the cartesian point on a unit circle
            const x = Math.cos(theta);
            const y = Math.sin(theta);
            // Scale this point to our max dimensions
            const r = distance * maxRadius;
            // Find the point on the paper in inches
            const cx = width / 2 + x * r;
            const cy = height / 2 + y * r;
            // Now draw a circle at each point
            // Make them smaller when closer to centre
            const radius = 0.2 * Math.pow(t, 0.5);
            context.beginPath();
            context.arc(cx, cy, radius, 0, Math.PI * 2, false);
            context.fillStyle = fillPoints;
            context.fill();
        }
    };
};