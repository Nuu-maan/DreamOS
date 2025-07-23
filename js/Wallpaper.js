class Wallpaper {
    constructor() {
        this.gradient = [];
        this.time = 0;
        this.generateGradient();
    }

    generateGradient() {
        // Create a soft, modern gradient
        let colors = [
            color(25, 25, 35),    // Dark blue-gray
            color(45, 45, 65),    // Medium blue-gray
            color(35, 35, 55)     // Dark purple-gray
        ];
        
        // Create gradient only if canvas exists
        if (typeof height !== 'undefined') {
            for (let i = 0; i < height; i++) {
                let t = i / height;
                let c;
                
                if (t < 0.5) {
                    c = lerpColor(colors[0], colors[1], t * 2);
                } else {
                    c = lerpColor(colors[1], colors[2], (t - 0.5) * 2);
                }
                
                this.gradient[i] = c;
            }
        }
    }

    display() {
        // Draw gradient background
        if (this.gradient.length > 0) {
            for (let i = 0; i < height; i++) {
                stroke(this.gradient[i]);
                line(0, i, width, i);
            }
        }

        // Add subtle animated particles
        this.time += 0.001;
        noStroke();
        
        for (let i = 0; i < 50; i++) {
            let x = (noise(i * 100, this.time) * width * 1.5) - width * 0.25;
            let y = (noise(i * 200, this.time) * height * 1.5) - height * 0.25;
            let size = noise(i * 300, this.time) * 3;
            
            fill(255, 255, 255, 10);
            circle(x, y, size);
        }

        // Add a subtle vignette effect
        drawingContext.save();
        let grd = drawingContext.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, width
        );
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.4)');
        drawingContext.fillStyle = grd;
        drawingContext.fillRect(0, 0, width, height);
        drawingContext.restore();
    }

    windowResized() {
        this.generateGradient();
    }
} 