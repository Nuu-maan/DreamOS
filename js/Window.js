class Window {
    constructor(x, y, w, h, title, icon) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.title = title;
        this.icon = icon;
        
        // State
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isActive = true;
        this.isClosing = false;
        this.isMaximized = false;
        this.previousState = null;

        // Animation properties
        this.scale = ANIMATIONS.transition.scale.from;
        this.targetScale = ANIMATIONS.transition.scale.to;
        this.opacity = ANIMATIONS.transition.opacity.from;
        this.targetOpacity = ANIMATIONS.transition.opacity.to;
        this.rotation = 0;
        this.targetRotation = 0;

        // Control buttons
        this.controls = {
            close: { x: this.w - 45, y: 5, size: 30, isHovered: false },
            maximize: { x: this.w - 85, y: 5, size: 30, isHovered: false },
            minimize: { x: this.w - 125, y: 5, size: 30, isHovered: false }
        };
    }

    update() {
        // Smooth animations
        this.scale = lerp(this.scale, this.targetScale, ANIMATIONS.easing.smooth);
        this.opacity = lerp(this.opacity, this.targetOpacity, ANIMATIONS.easing.smooth);
        this.rotation = lerp(this.rotation, this.targetRotation, ANIMATIONS.easing.bouncy);

        // Update control button hover states
        let localMouseX = mouseX - this.x;
        let localMouseY = mouseY - this.y;

        for (let [name, control] of Object.entries(this.controls)) {
            control.isHovered = localMouseX >= control.x && 
                              localMouseX <= control.x + control.size &&
                              localMouseY >= control.y && 
                              localMouseY <= control.y + control.size;
        }

        // Add tilt effect while dragging
        if (this.isDragging) {
            this.targetRotation = (mouseX - pmouseX) * 0.002;
        } else {
            this.targetRotation = 0;
        }
    }

    display() {
        if (this.isClosing && this.opacity < 0.01) return false;

        push();
        translate(this.x + this.w/2, this.y + this.h/2);
        rotate(this.rotation);
        scale(this.scale);
        translate(-this.w/2, -this.h/2);

        // Window shadow
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = `rgba(${COLORS.windowShadow.join(',')})`;

        // Window background
        fill(COLORS.windowBg[0], COLORS.windowBg[1],
             COLORS.windowBg[2], COLORS.windowBg[3] * 255 * this.opacity);
        stroke(COLORS.windowBorder[0], COLORS.windowBorder[1],
               COLORS.windowBorder[2], COLORS.windowBorder[3] * 255 * this.opacity);
        strokeWeight(1);
        rect(0, 0, this.w, this.h, 12);

        // Title bar
        fill(COLORS.windowTitleBg[0], COLORS.windowTitleBg[1],
             COLORS.windowTitleBg[2], COLORS.windowTitleBg[3] * 255 * this.opacity);
        noStroke();
        rect(0, 0, this.w, 30, 12, 12, 0, 0);

        // Window title
        textSize(14);
        textAlign(LEFT, CENTER);
        fill(COLORS.text[0], COLORS.text[1], COLORS.text[2], 255 * this.opacity);
        text(this.icon, 10, 15);
        text(this.title, 35, 15);

        // Control buttons
        this.drawControls();

        drawingContext.shadowBlur = 0;
        pop();
        return true;
    }

    drawControls() {
        for (let [name, control] of Object.entries(this.controls)) {
            // Button background
            if (control.isHovered) {
                fill(name === 'close' ? [255, 80, 80] :
                     name === 'maximize' ? COLORS.accent :
                     COLORS.secondary);
                noStroke();
                rect(control.x, control.y, control.size, control.size);
            }

            // Button symbol
            fill(control.isHovered ? 255 : COLORS.text[0],
                 control.isHovered ? 255 : COLORS.text[1],
                 control.isHovered ? 255 : COLORS.text[2],
                 (control.isHovered ? 255 : 200) * this.opacity);
            noStroke();
            textSize(14);
            textAlign(CENTER, CENTER);
            text(name === 'close' ? '×' :
                 name === 'maximize' ? '□' : '−',
                 control.x + control.size/2,
                 control.y + control.size/2);
        }
    }

    checkDragging(mouseX, mouseY) {
        let localX = mouseX - this.x;
        let localY = mouseY - this.y;

        // Check control buttons first
        for (let control of Object.values(this.controls)) {
            if (localX >= control.x && localX <= control.x + control.size &&
                localY >= control.y && localY <= control.y + control.size) {
                return;
            }
        }

        // Check title bar for dragging
        if (localY >= 0 && localY <= 30 && localX >= 0 && localX <= this.w) {
            this.isDragging = true;
            this.dragOffsetX = localX;
            this.dragOffsetY = localY;
            this.targetScale = 0.98;
        }
    }

    checkControls(mouseX, mouseY) {
        let localX = mouseX - this.x;
        let localY = mouseY - this.y;

        for (let [name, control] of Object.entries(this.controls)) {
            if (control.isHovered) {
                if (name === 'close') {
                    this.close();
                } else if (name === 'maximize') {
                    this.maximize();
                } else if (name === 'minimize') {
                    this.minimize();
                }
                return true;
            }
        }
        return false;
    }

    stopDragging() {
        this.isDragging = false;
        this.targetScale = 1;
    }

    close() {
        this.isClosing = true;
        this.targetOpacity = 0;
        this.targetScale = 0.8;
    }

    maximize() {
        if (!this.isMaximized) {
            this.previousState = {
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h
            };
            this.x = 0;
            this.y = 0;
            this.w = width;
            this.h = height - SYSTEM.desktop.taskbarHeight;
            this.isMaximized = true;
        } else {
            Object.assign(this, this.previousState);
            this.isMaximized = false;
        }
    }

    minimize() {
        this.targetOpacity = 0;
        this.targetScale = 0.5;
    }

    restore() {
        this.targetOpacity = 1;
        this.targetScale = 1;
    }
} 