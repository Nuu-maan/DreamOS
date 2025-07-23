class Dreams extends Window {
    constructor(x, y) {
        super(x, y, 500, 400, "Dreams.app");
        this.particles = [];
        this.time = 0;
        
        // Create particles
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: random(-1, 1),
                y: random(-1, 1),
                z: random(-1, 1),
                size: random(0.02, 0.05),
                speed: random(0.001, 0.003),
                color: color(
                    random(100, 255),
                    random(100, 255),
                    random(200, 255),
                    150
                )
            });
        }
    }

    display() {
        super.display();

        push();
        // Set up the drawing context relative to the window
        translate(this.x, this.y);

        // Content area
        fill(COLORS.windowBg);
        noStroke();
        rect(10, 40, this.w - 20, this.h - 50, 5);

        // Dream visualization
        push();
        translate(this.w/2, this.h/2);
        
        // Update and draw particles
        this.time += 0.01;
        for (let p of this.particles) {
            let x = p.x * (this.w - 100);
            let y = p.y * (this.h - 100);
            
            // Orbital motion
            let angle = this.time * p.speed;
            let px = x * cos(angle) - y * sin(angle);
            let py = x * sin(angle) + y * cos(angle);
            
            // Draw particle
            fill(p.color);
            noStroke();
            circle(px, py, 
                  p.size * (this.w + this.h)/2 * (1 + 0.2 * sin(this.time * 2)));
        }
        pop();

        // Dreamy text overlay
        textAlign(CENTER, CENTER);
        textSize(24);
        fill(255, 255, 255, 50 + 25 * sin(this.time));
        text("d r e a m i n g . . .", this.w/2, this.h/2);

        pop();
    }

    update() {
        super.update();
        // Additional dream-specific updates can go here
    }
} 