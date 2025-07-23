class Memory extends App {
    constructor(x, y) {
        super(x, y, 500, 400, "Memory.app", "✨");
        
        // Override theme
        this.theme = {
            background: [255, 255, 255, 0.95],
            text: COLORS.text,
            accent: COLORS.secondary
        };

        // Memory cards
        this.memories = [
            { date: '2024-03-15', text: 'A distant dream of cherry blossoms...', color: COLORS.primary },
            { date: '2024-03-14', text: 'The sound of rain on a tin roof...', color: COLORS.secondary },
            { date: '2024-03-13', text: 'Childhood summers that lasted forever...', color: COLORS.accent }
        ];

        // Scroll state
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.maxScroll = 0;
        this.isDragging = false;
        this.dragStartY = 0;
        this.startScrollY = 0;

        // Card animations
        this.cards = this.memories.map((memory, index) => ({
            y: index * 120,
            scale: 1,
            targetScale: 1,
            rotation: 0,
            targetRotation: 0,
            opacity: 0,
            targetOpacity: 1,
            isHovered: false
        }));

        // New memory input
        this.isAddingMemory = false;
        this.newMemoryText = '';
        this.addButtonHovered = false;
    }

    update() {
        super.update();

        // Update scroll with smooth damping
        this.scrollY = lerp(this.scrollY, this.targetScrollY, ANIMATIONS.easing.smooth);
        
        // Update max scroll
        this.maxScroll = Math.max(0, this.memories.length * 120 - this.contentH + 60);
        this.targetScrollY = constrain(this.targetScrollY, 0, this.maxScroll);

        // Update card animations
        this.cards.forEach((card, i) => {
            card.scale = lerp(card.scale, card.targetScale, ANIMATIONS.easing.bouncy);
            card.rotation = lerp(card.rotation, card.targetRotation, ANIMATIONS.easing.bouncy);
            card.opacity = lerp(card.opacity, card.targetOpacity, ANIMATIONS.easing.smooth);

            // Check hover state
            let cardY = card.y - this.scrollY;
            card.isHovered = mouseX > this.x + this.contentX + 20 &&
                           mouseX < this.x + this.contentX + this.contentW - 20 &&
                           mouseY > this.y + this.contentY + cardY &&
                           mouseY < this.y + this.contentY + cardY + 100;

            if (card.isHovered) {
                card.targetScale = 1.02;
                card.targetRotation = 0.02;
            } else {
                card.targetScale = 1;
                card.targetRotation = 0;
            }
        });
    }

    drawContent() {
        // Memory cards
        this.cards.forEach((card, i) => {
            let memory = this.memories[i];
            let y = card.y - this.scrollY;

            // Only draw visible cards
            if (y + 100 < 0 || y > this.contentH) return;

            push();
            translate(this.contentW/2, y + 50);
            rotate(card.rotation);
            scale(card.scale);
            translate(-this.contentW/2, -50);

            // Card background with glow
            if (card.isHovered) {
                drawingContext.shadowBlur = 15;
                drawingContext.shadowColor = `rgba(${memory.color.join(',')}, 0.5)`;
            }

            // Card background
            fill(255, 255, 255, 255 * card.opacity);
            stroke(memory.color[0], memory.color[1], memory.color[2], 100 * card.opacity);
            strokeWeight(2);
            rect(20, 0, this.contentW - 40, 100, 15);

            // Card content
            noStroke();
            fill(100, 100, 100, 200 * card.opacity);
            textSize(12);
            textAlign(LEFT, TOP);
            text(memory.date, 40, 20);

            fill(50, 50, 50, 255 * card.opacity);
            textSize(16);
            text(memory.text, 40, 45);

            drawingContext.shadowBlur = 0;
            pop();
        });

        // Add memory button
        let buttonY = this.contentH - 50;
        this.addButtonHovered = mouseX > this.x + this.contentX + this.contentW/2 - 30 &&
                               mouseX < this.x + this.contentX + this.contentW/2 + 30 &&
                               mouseY > this.y + this.contentY + buttonY - 20 &&
                               mouseY < this.y + this.contentY + buttonY + 20;

        // Button glow
        if (this.addButtonHovered) {
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = `rgba(${COLORS.primary.join(',')}, 0.5)`;
        }

        // Button background
        fill(this.addButtonHovered ? COLORS.primary[0] : 255,
             this.addButtonHovered ? COLORS.primary[1] : 255,
             this.addButtonHovered ? COLORS.primary[2] : 255,
             this.addButtonHovered ? 255 : 230);
        stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2],
               this.addButtonHovered ? 255 : 100);
        strokeWeight(2);
        rect(this.contentW/2 - 30, buttonY - 20, 60, 40, 20);

        // Button icon
        textSize(24);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(this.addButtonHovered ? 255 : COLORS.primary[0],
             this.addButtonHovered ? 255 : COLORS.primary[1],
             this.addButtonHovered ? 255 : COLORS.primary[2]);
        text('✨', this.contentW/2, buttonY);

        drawingContext.shadowBlur = 0;

        // New memory input
        if (this.isAddingMemory) {
            // Input overlay
            fill(0, 0, 0, 100);
            noStroke();
            rect(0, 0, this.contentW, this.contentH);

            // Input card
            fill(255);
            stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            strokeWeight(2);
            rect(20, this.contentH/2 - 100, this.contentW - 40, 200, 15);

            // Input text
            fill(50);
            noStroke();
            textSize(16);
            textAlign(LEFT, TOP);
            text('New Memory', 40, this.contentH/2 - 80);

            // Text input
            fill(255);
            stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            rect(40, this.contentH/2 - 40, this.contentW - 80, 100, 10);

            fill(0);
            noStroke();
            text(this.newMemoryText + (frameCount % 60 < 30 ? '|' : ''),
                 50, this.contentH/2 - 30);

            // Save button
            let saveHovered = mouseX > this.x + this.contentX + this.contentW - 140 &&
                            mouseX < this.x + this.contentX + this.contentW - 40 &&
                            mouseY > this.y + this.contentY + this.contentH/2 + 70 &&
                            mouseY < this.y + this.contentY + this.contentH/2 + 110;

            fill(saveHovered ? COLORS.primary[0] : 255,
                 saveHovered ? COLORS.primary[1] : 255,
                 saveHovered ? COLORS.primary[2] : 255);
            stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            rect(this.contentW - 140, this.contentH/2 + 70, 100, 40, 20);

            fill(saveHovered ? 255 : COLORS.primary[0],
                 saveHovered ? 255 : COLORS.primary[1],
                 saveHovered ? 255 : COLORS.primary[2]);
            noStroke();
            textAlign(CENTER, CENTER);
            text('Save ✨', this.contentW - 90, this.contentH/2 + 90);
        }
    }

    onMousePressed(x, y) {
        if (this.isAddingMemory) {
            // Check save button
            let saveHovered = x > this.contentW - 140 &&
                            x < this.contentW - 40 &&
                            y > this.contentH/2 + 70 &&
                            y < this.contentH/2 + 110;
            if (saveHovered && this.newMemoryText.trim()) {
                this.addMemory();
                return true;
            }
            return true;
        }

        // Start scroll drag
        this.isDragging = true;
        this.dragStartY = y;
        this.startScrollY = this.targetScrollY;
        return true;
    }

    onMouseReleased(x, y) {
        this.isDragging = false;

        // Check add button
        if (!this.isAddingMemory && this.addButtonHovered) {
            this.isAddingMemory = true;
            this.newMemoryText = '';
            return true;
        }

        return false;
    }

    onMouseMoved(x, y) {
        if (this.isDragging) {
            this.targetScrollY = this.startScrollY - (y - this.dragStartY);
            return true;
        }
        return false;
    }

    onKeyPressed(key, keyCode) {
        if (!this.isAddingMemory) return false;

        if (keyCode === ESCAPE) {
            this.isAddingMemory = false;
            return true;
        }

        if (keyCode === ENTER && this.newMemoryText.trim()) {
            this.addMemory();
            return true;
        }

        if (keyCode === BACKSPACE) {
            this.newMemoryText = this.newMemoryText.slice(0, -1);
            return true;
        }

        if (key.length === 1) {
            this.newMemoryText += key;
            return true;
        }

        return false;
    }

    addMemory() {
        let today = new Date().toISOString().split('T')[0];
        this.memories.unshift({
            date: today,
            text: this.newMemoryText,
            color: random([COLORS.primary, COLORS.secondary, COLORS.accent])
        });

        // Add new card animation
        this.cards.unshift({
            y: -120,
            scale: 0,
            targetScale: 1,
            rotation: 0.1,
            targetRotation: 0,
            opacity: 0,
            targetOpacity: 1,
            isHovered: false
        });

        // Update card positions
        this.cards.forEach((card, i) => {
            if (i > 0) card.y = i * 120;
        });

        this.isAddingMemory = false;
        this.targetScrollY = 0;
    }

    mouseWheel(event) {
        if (this.isAddingMemory) return;
        this.targetScrollY += event.delta;
        return true;
    }
} 