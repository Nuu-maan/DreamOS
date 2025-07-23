class Terminal extends Window {
    constructor(x, y) {
        super(x, y, 400, 300, "Terminal.exe");
        this.lines = [`DreamOS ${SYSTEM.version}`];
        this.currentLine = "";
        this.cursorVisible = true;
        this.lastCursorBlink = 0;
        this.cursorBlinkRate = 500;
        this.autoTypeText = [
            "I remember falling asleep mid-sentence...",
            "They never said goodbye.",
            "The dreams are getting stronger.",
            "Do you remember the color of the sky that day?",
            "Sometimes I can still hear the echoes...",
            "Loading forgotten memories...",
            "Scanning dream fragments...",
            "Reality status: uncertain",
            "Time is just a concept here..."
        ];
        this.isAutoTyping = false;
        this.autoTypeIndex = 0;
        this.autoTypeCharIndex = 0;
        this.lastAutoType = 0;
        this.autoTypeDelay = 100;
        
        // Terminal specific colors
        this.colors = {
            text: COLORS.primary,
            cursor: COLORS.secondary,
            highlight: COLORS.accent
        };
    }

    update() {
        super.update();

        // Update cursor blink
        if (millis() - this.lastCursorBlink > this.cursorBlinkRate) {
            this.cursorVisible = !this.cursorVisible;
            this.lastCursorBlink = millis();
        }

        // Auto-typing effect
        if (!this.isAutoTyping && random() < 0.001) {
            this.startAutoTyping();
        }

        if (this.isAutoTyping && millis() - this.lastAutoType > this.autoTypeDelay) {
            this.updateAutoType();
        }
    }

    startAutoTyping() {
        this.isAutoTyping = true;
        this.autoTypeIndex = floor(random(this.autoTypeText.length));
        this.autoTypeCharIndex = 0;
        this.currentLine = "";
    }

    updateAutoType() {
        if (this.autoTypeCharIndex < this.autoTypeText[this.autoTypeIndex].length) {
            this.currentLine += this.autoTypeText[this.autoTypeIndex][this.autoTypeCharIndex];
            this.autoTypeCharIndex++;
            this.lastAutoType = millis();

            // Add some glitch effect when typing
            if (random() < 0.1) {
                this.glitchIntensity = random(0.1, 0.2);
            }
        } else {
            this.lines.push(this.currentLine);
            this.currentLine = "";
            this.isAutoTyping = false;
            // Keep only last 10 lines
            if (this.lines.length > 10) {
                this.lines.shift();
            }
        }
    }

    display() {
        super.display();

        push();
        // Set up the drawing context relative to the window position
        translate(this.x, this.y);
        
        // Terminal content area
        fill(COLORS.windowBg);
        noStroke();
        rect(10, 40, this.w - 20, this.h - 50, 5);

        // Draw previous lines
        let y = 60;
        textSize(16);
        textFont('VT323');
        
        for (let line of this.lines) {
            // Add a subtle gradient effect to the text
            let alpha = map(y, 60, this.h - 20, 255, 150);
            fill(this.colors.text + alpha.toString(16));
            text(line, 20, y);
            y += 20;
        }

        // Draw current line with cursor
        fill(this.colors.text);
        text(this.currentLine, 20, y);
        
        // Draw blinking cursor
        if (this.cursorVisible) {
            fill(this.colors.cursor);
            rect(20 + textWidth(this.currentLine), y - 14, 8, 16);
        }

        // Add some scanline effect
        for (let i = 40; i < this.h - 10; i += 2) {
            stroke(255, 255, 255, 2);
            line(10, i, this.w - 10, i);
        }

        pop();
    }
} 