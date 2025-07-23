class App extends Window {
    constructor(x, y, w, h, title, icon) {
        super(x, y, w, h, title, icon);
        
        // Content area dimensions
        this.contentX = 10;
        this.contentY = 40;
        this.contentW = this.w - 20;
        this.contentH = this.h - 50;

        // Animation and interaction states
        this.contentScale = 0;
        this.targetContentScale = 1;
        this.contentOpacity = 0;
        this.targetContentOpacity = 1;
        this.isMinimized = false;
        this.isClosing = false;

        // Theme (can be overridden by specific apps)
        this.theme = {
            background: COLORS.windowBg,
            text: COLORS.text,
            accent: COLORS.primary
        };
    }

    update() {
        super.update();
        
        // Update content animations
        this.contentScale = lerp(this.contentScale, this.targetContentScale, ANIMATIONS.easing.smooth);
        this.contentOpacity = lerp(this.contentOpacity, this.targetContentOpacity, ANIMATIONS.easing.smooth);
    }

    display() {
        if (this.isClosing && this.opacity < 0.01) return false;
        
        super.display();

        push();
        translate(this.x, this.y);

        // Draw content area with scale animation
        push();
        translate(this.contentX + this.contentW/2, this.contentY + this.contentH/2);
        scale(this.contentScale);
        translate(-this.contentW/2, -this.contentH/2);

        // Content background
        fill(this.theme.background[0], this.theme.background[1],
             this.theme.background[2], this.theme.background[3] * 255 * this.contentOpacity);
        noStroke();
        rect(0, 0, this.contentW, this.contentH, 8);

        // Draw app-specific content
        this.drawContent();

        pop();
        pop();

        return true;
    }

    drawContent() {
        // Override this in specific app classes
    }

    minimize() {
        this.isMinimized = true;
        this.targetContentScale = 0;
        this.targetContentOpacity = 0;
        this.targetOpacity = 0.5;
    }

    restore() {
        this.isMinimized = false;
        this.targetContentScale = 1;
        this.targetContentOpacity = 1;
        this.targetOpacity = 1;
    }

    close() {
        this.isClosing = true;
        this.targetOpacity = 0;
        this.targetScale = 0.8;
    }

    onMousePressed(x, y) {
        // Override this in specific app classes
        // Return true if the event was handled
        return false;
    }

    onMouseReleased(x, y) {
        // Override this in specific app classes
        // Return true if the event was handled
        return false;
    }

    onMouseMoved(x, y) {
        // Override this in specific app classes
        // Return true if the event was handled
        return false;
    }

    onKeyPressed(key, keyCode) {
        // Override this in specific app classes
        // Return true if the event was handled
        return false;
    }
} 