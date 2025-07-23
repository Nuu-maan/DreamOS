class Subconscious extends Window {
    constructor(x, y) {
        super(x, y, 500, 400, "Subconscious.app");
        this.nodes = [];
        this.connections = [];
        this.time = 0;
        
        // Create neural network nodes
        for (let i = 0; i < 20; i++) {
            this.nodes.push({
                x: random(50, this.w - 50),
                y: random(80, this.h - 20),
                size: random(4, 8),
                speed: random(0.001, 0.002),
                phase: random(TWO_PI)
            });
        }
        
        // Create connections between nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (random() < 0.2) { // 20% chance of connection
                    this.connections.push({
                        from: i,
                        to: j,
                        strength: random(0.5, 1)
                    });
                }
            }
        }

        // Random thoughts that appear
        this.thoughts = [
            "forgotten memories surface...",
            "echoes of yesterday...",
            "dreams within dreams...",
            "whispers of tomorrow...",
            "fragments of reality...",
            "shadows of thoughts..."
        ];
        this.currentThought = "";
        this.thoughtOpacity = 0;
        this.lastThoughtChange = 0;
        this.thoughtChangeInterval = 3000;
    }

    display() {
        super.display();

        push();
        translate(this.x, this.y);

        // Content area
        fill(COLORS.windowBg);
        noStroke();
        rect(10, 40, this.w - 20, this.h - 50, 5);

        // Draw connections
        for (let conn of this.connections) {
            let from = this.nodes[conn.from];
            let to = this.nodes[conn.to];
            let d = dist(from.x, from.y, to.x, to.y);
            let strength = map(d, 0, 200, 0.5, 0) * conn.strength;
            
            if (strength > 0) {
                stroke(COLORS.primary);
                strokeWeight(strength);
                line(from.x, from.y, to.x, to.y);
            }
        }

        // Draw nodes
        for (let node of this.nodes) {
            // Node glow
            let glowSize = 2 + sin(this.time + node.phase) * 1;
            fill(COLORS.primary + '40');
            noStroke();
            circle(node.x, node.y, node.size * glowSize * 2);
            
            // Node core
            fill(COLORS.primary);
            circle(node.x, node.y, node.size);
        }

        // Draw current thought
        if (this.currentThought) {
            textAlign(CENTER, CENTER);
            textSize(16);
            fill(255, 255, 255, this.thoughtOpacity);
            text(this.currentThought, this.w/2, this.h/2);
        }

        pop();
    }

    update() {
        super.update();
        
        this.time += 0.02;

        // Update node positions with subtle movement
        for (let node of this.nodes) {
            node.x += sin(this.time * node.speed + node.phase) * 0.5;
            node.y += cos(this.time * node.speed + node.phase) * 0.5;
            
            // Keep nodes within bounds
            node.x = constrain(node.x, 50, this.w - 50);
            node.y = constrain(node.y, 80, this.h - 20);
        }

        // Update thoughts
        if (millis() - this.lastThoughtChange > this.thoughtChangeInterval) {
            this.currentThought = random(this.thoughts);
            this.thoughtOpacity = 255;
            this.lastThoughtChange = millis();
        }
        
        // Fade thought opacity
        this.thoughtOpacity = max(0, this.thoughtOpacity - 1);
    }
} 