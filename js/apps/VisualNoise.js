class VisualNoise extends Window {
    constructor(x, y) {
        super(x, y, 500, 400, "VisualNoise.app");
        this.time = 0;
        this.noiseScale = 0.02;
        this.colorOffset = random(1000);
        this.glitchAmount = 0;
        this.lastGlitch = 0;
        this.glitchInterval = random(1000, 3000);
        
        // Glitch bands
        this.glitchBands = [];
        for (let i = 0; i < 5; i++) {
            this.glitchBands.push({
                y: 0,
                height: 0,
                offset: 0,
                alpha: 0
            });
        }
    }

    display() {
        super.display();

        push();
        translate(this.x, this.y);

        // Content area
        fill(COLORS.windowBg);
        noStroke();
        rect(10, 40, this.w - 20, this.h - 50, 5);

        // Create noise pattern
        loadPixels();
        for (let x = 0; x < this.w - 20; x++) {
            for (let y = 0; y < this.h - 50; y++) {
                let noiseVal = noise(
                    (x + this.time) * this.noiseScale,
                    (y + this.time) * this.noiseScale,
                    this.colorOffset
                );
                
                let px = x + 10;
                let py = y + 40;
                
                // Apply color based on noise value
                let c = color(
                    map(noiseVal, 0, 1, 0, 255),
                    map(noise(x * 0.02, y * 0.02, this.time * 0.1), 0, 1, 0, 255),
                    map(noise(x * 0.01, y * 0.01, this.time * 0.2), 0, 1, 0, 255),
                    200
                );
                
                set(this.x + px, this.y + py, c);
            }
        }
        updatePixels();

        // Draw glitch bands
        for (let band of this.glitchBands) {
            if (band.alpha > 0) {
                push();
                translate(band.offset, 0);
                fill(255, 255, 255, band.alpha);
                noStroke();
                rect(10, 40 + band.y, this.w - 20, band.height);
                pop();
                
                band.alpha *= 0.9;
            }
        }

        // Overlay scanlines
        for (let y = 40; y < this.h - 10; y += 2) {
            stroke(0, 0, 0, 20);
            line(10, y, this.w - 10, y);
        }

        pop();
    }

    update() {
        super.update();
        
        this.time += 0.01;

        // Random glitch effects
        if (millis() - this.lastGlitch > this.glitchInterval) {
            this.glitchAmount = random(0.5, 1);
            this.lastGlitch = millis();
            this.glitchInterval = random(1000, 3000);
            
            // Create new glitch bands
            for (let band of this.glitchBands) {
                if (random() < 0.3) {
                    band.y = random(0, this.h - 50);
                    band.height = random(5, 20);
                    band.offset = random(-20, 20);
                    band.alpha = random(100, 200);
                }
            }
        }

        this.glitchAmount *= 0.95;
    }

    mousePressed() {
        super.mousePressed();
        
        // Add interactivity - clicking creates glitch effects
        if (mouseX > this.x + 10 && mouseX < this.x + this.w - 10 &&
            mouseY > this.y + 40 && mouseY < this.y + this.h - 10) {
            this.glitchAmount = 1;
            this.colorOffset = random(1000);
            
            // Create glitch bands at mouse position
            for (let band of this.glitchBands) {
                band.y = mouseY - this.y - 40;
                band.height = random(5, 20);
                band.offset = random(-20, 20);
                band.alpha = random(100, 200);
            }
        }
    }
} 