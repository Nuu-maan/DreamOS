class DreamOS {
    constructor() {
        this.state = 'booting'; // booting, login, desktop
        this.windows = [];
        this.activeWindow = null;
        this.idleTime = 0;
        this.idleThreshold = 30000;
        this.isIdle = false;

        // Boot sequence
        this.bootStageIndex = 0;
        this.bootProgress = 0;
        this.lastBootUpdate = 0;

        // Login screen
        this.loginScreen = new LoginScreen(() => {
            this.state = 'desktop';
        });

        // Start menu
        this.startMenu = new StartMenu((app) => {
            this.launchApp(app);
        });

        // Desktop icons
        this.icons = SYSTEM.apps.map((app, index) => ({
            ...app,
            x: 20,
            y: 20 + index * SYSTEM.desktop.iconSpacing,
            isHovered: false,
            scale: 1,
            targetScale: 1,
            rotation: 0,
            targetRotation: 0,
            glow: 0,
            targetGlow: 0
        }));
        
        // Taskbar
        this.taskbar = {
            height: SYSTEM.desktop.taskbarHeight,
            startHovered: false,
            quickSettingsHovered: false,
            opacity: 0,
            targetOpacity: 1,
            blur: ANIMATIONS.transition.blur.from,
            targetBlur: ANIMATIONS.transition.blur.to,
            buttons: [] // Will store taskbar buttons for running apps
        };
        
        // Background animation
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: random(width),
                y: random(height),
                size: random(2, 4),
                speed: random(0.2, 0.5),
                color: random([COLORS.primary, COLORS.secondary, COLORS.accent])
            });
        }
    }

    update() {
        if (this.state === 'booting') {
            this.updateBoot();
        } else if (this.state === 'login') {
            this.loginScreen.update();
        } else if (this.state === 'desktop') {
            this.updateDesktop();
        }
    }

    updateBoot() {
        let currentStage = SYSTEM.bootStages[this.bootStageIndex];
        if (millis() - this.lastBootUpdate > 16) { // 60fps
            this.bootProgress += (100 / currentStage.duration) * 16;
            if (this.bootProgress >= 100) {
                this.bootProgress = 0;
                this.bootStageIndex++;
                if (this.bootStageIndex >= SYSTEM.bootStages.length) {
                    this.state = 'login';
                }
            }
            this.lastBootUpdate = millis();
        }
    }

    updateDesktop() {
        // Update idle state
        if (mouseX === pmouseX && mouseY === pmouseY) {
            this.idleTime += deltaTime;
            if (this.idleTime > this.idleThreshold) {
                this.isIdle = true;
            }
        } else {
            this.idleTime = 0;
            this.isIdle = false;
        }

        // Update windows
        this.windows = this.windows.filter(window => {
            window.update();
            return window.display(); // Remove window if it's fully closed
        });

        // Update particles
        for (let p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = height;
                p.x = random(width);
            }
        }

        // Update icon animations
        this.updateIconAnimations();

        // Update start menu
        this.startMenu.update();

        // Update taskbar animations
        this.taskbar.opacity = lerp(this.taskbar.opacity, this.taskbar.targetOpacity, ANIMATIONS.easing.smooth);
        this.taskbar.blur = lerp(this.taskbar.blur, this.taskbar.targetBlur, ANIMATIONS.easing.smooth);

        // Update taskbar buttons
        this.taskbar.buttons = this.windows.map(window => ({
            window,
            isHovered: false,
            scale: 1,
            targetScale: 1
        }));
    }

    updateIconAnimations() {
        for (let icon of this.icons) {
            // Update hover animations
            icon.scale = lerp(icon.scale, icon.targetScale, ANIMATIONS.easing.bouncy);
            icon.rotation = lerp(icon.rotation, icon.targetRotation, ANIMATIONS.easing.bouncy);
            icon.glow = lerp(icon.glow, icon.targetGlow, ANIMATIONS.easing.smooth);

            // Check hover state
            let isHovered = mouseX > icon.x && 
                           mouseX < icon.x + SYSTEM.desktop.iconSize &&
                           mouseY > icon.y && 
                           mouseY < icon.y + SYSTEM.desktop.iconSize;
            
            if (isHovered !== icon.isHovered) {
                icon.isHovered = isHovered;
                icon.targetScale = isHovered ? ANIMATIONS.hover.scale : 1;
                icon.targetRotation = isHovered ? ANIMATIONS.hover.rotation : 0;
                icon.targetGlow = isHovered ? ANIMATIONS.hover.glow : 0;
            }
        }
    }

    display() {
        if (this.state === 'booting') {
            this.displayBoot();
        } else if (this.state === 'login') {
            this.displayLogin();
        } else if (this.state === 'desktop') {
            this.displayDesktop();
        }
    }

    displayBoot() {
        background(COLORS.backgroundDark[0], COLORS.backgroundDark[1], COLORS.backgroundDark[2]);
        
        let currentStage = SYSTEM.bootStages[this.bootStageIndex];
        
        // Draw current boot message
        fill(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
        textSize(24);
        textAlign(CENTER, CENTER);
        textFont('VT323');
        text(currentStage.message, width/2, height/2 - 40);

        // Draw progress bar
        let barWidth = 300;
        let barHeight = 6;
        noFill();
        stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        rect(width/2 - barWidth/2, height/2 + 20, barWidth, barHeight);
        noStroke();
        fill(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        rect(width/2 - barWidth/2, height/2 + 20, 
             (barWidth * this.bootProgress/100), barHeight);
    }

    displayLogin() {
        this.loginScreen.display();
    }

    displayDesktop() {
        // Draw background
        background(COLORS.backgroundDark[0], COLORS.backgroundDark[1], COLORS.backgroundDark[2]);
        
        // Draw particles
        noStroke();
        for (let p of this.particles) {
            let alpha = this.isIdle ? 255 : 100;
            fill(p.color[0], p.color[1], p.color[2], alpha);
            circle(p.x, p.y, p.size * (1 + sin(frameCount * 0.05) * 0.2));
        }

        // Draw desktop icons
        this.displayIcons();

        // Draw windows
        for (let window of this.windows) {
            window.display();
        }

        // Draw taskbar
        this.displayTaskbar();

        // Draw start menu
        this.startMenu.display();

        // Draw idle overlay
        if (this.isIdle) {
            fill(0, 0, 0, 100);
            rect(0, 0, width, height);
            
            fill(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
            textSize(24);
            textAlign(CENTER, CENTER);
            textFont('VT323');
            text("d r e a m i n g . . .", width/2, height/2);
        }
    }

    displayIcons() {
        for (let icon of this.icons) {
            push();
            translate(
                icon.x + SYSTEM.desktop.iconSize/2,
                icon.y + SYSTEM.desktop.iconSize/2
            );
            rotate(icon.rotation);
            scale(icon.scale);

            // Icon glow
            if (icon.glow > 0) {
                drawingContext.shadowBlur = icon.glow;
                drawingContext.shadowColor = `rgba(${COLORS.primary.join(',')}, 0.5)`;
            }

            // Icon background
            fill(COLORS.desktopIconBg[0], COLORS.desktopIconBg[1],
                 COLORS.desktopIconBg[2], COLORS.desktopIconBg[3] * 255);
            if (icon.isHovered) {
                stroke(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2], 100);
            } else {
                noStroke();
            }
            rect(-SYSTEM.desktop.iconSize/2, -SYSTEM.desktop.iconSize/2,
                 SYSTEM.desktop.iconSize, SYSTEM.desktop.iconSize, 12);

            // Icon emoji
            textSize(32);
            textAlign(CENTER, CENTER);
            noStroke();
            text(icon.icon, 0, -10);

            // Icon text
            fill(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
            textSize(12);
            text(icon.name, 0, SYSTEM.desktop.iconSize/2 - 15);

            drawingContext.shadowBlur = 0;
            pop();
        }
    }

    displayTaskbar() {
        // Glass effect
        drawingContext.save();
        drawingContext.filter = `blur(${this.taskbar.blur}px)`;
        fill(255, 255, 255, 10);
        noStroke();
        rect(0, height - this.taskbar.height - 10,
             width, this.taskbar.height + 10);
        drawingContext.restore();

        // Taskbar background
        fill(COLORS.taskbarBg[0], COLORS.taskbarBg[1],
             COLORS.taskbarBg[2], COLORS.taskbarBg[3] * 255);
        stroke(COLORS.taskbarBorder[0], COLORS.taskbarBorder[1],
               COLORS.taskbarBorder[2], COLORS.taskbarBorder[3] * 255);
        strokeWeight(1);
        rect(0, height - this.taskbar.height, width, this.taskbar.height);

        // Start button
        let startBg = this.taskbar.startHovered ? COLORS.taskbarButtonHover : COLORS.taskbarBg;
        fill(startBg[0], startBg[1], startBg[2], startBg[3] * 255);
        stroke(COLORS.taskbarBorder[0], COLORS.taskbarBorder[1],
               COLORS.taskbarBorder[2], COLORS.taskbarBorder[3] * 255);
        rect(5, height - this.taskbar.height + 5,
             40, this.taskbar.height - 10, 8);
        
        textSize(20);
        textAlign(CENTER, CENTER);
        text('🌸', 25, height - this.taskbar.height/2);

        // Active windows
        let x = 50;
        for (let button of this.taskbar.buttons) {
            let isActive = button.window === this.activeWindow;
            let bg = isActive ? COLORS.taskbarButtonActive : COLORS.taskbarBg;
            
            // Button glow for active window
            if (isActive) {
                drawingContext.shadowBlur = 10;
                drawingContext.shadowColor = `rgba(${COLORS.primary.join(',')}, 0.5)`;
            }

            fill(bg[0], bg[1], bg[2], bg[3] * 255);
            stroke(COLORS.taskbarBorder[0], COLORS.taskbarBorder[1],
                   COLORS.taskbarBorder[2], COLORS.taskbarBorder[3] * 255);
            rect(x, height - this.taskbar.height + 5,
                 40, this.taskbar.height - 10, 8);
            
            push();
            translate(x + 20, height - this.taskbar.height/2);
            scale(button.scale);
            textSize(16);
            textAlign(CENTER, CENTER);
            text(button.window.icon, 0, 0);
            pop();
            
            x += 45;
            drawingContext.shadowBlur = 0;
        }

        // Quick settings
        let settingsBg = this.taskbar.quickSettingsHovered ? 
                        COLORS.taskbarButtonHover : COLORS.taskbarBg;
        fill(settingsBg[0], settingsBg[1], settingsBg[2], settingsBg[3] * 255);
        stroke(COLORS.taskbarBorder[0], COLORS.taskbarBorder[1],
               COLORS.taskbarBorder[2], COLORS.taskbarBorder[3] * 255);
        rect(width - 200, height - this.taskbar.height + 5,
             195, this.taskbar.height - 10, 8);

        // Time
        fill(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
        textSize(14);
        textAlign(RIGHT, CENTER);
        let time = new Date().toLocaleTimeString();
        text(time, width - 15, height - this.taskbar.height/2);

        // Quick setting icons
        x = width - 190;
        for (let setting of SYSTEM.quickSettings) {
            textSize(16);
            textAlign(CENTER, CENTER);
            text(setting.icon, x, height - this.taskbar.height/2);
            x += 30;
        }
    }

    mousePressed() {
        if (this.state === 'login') {
            this.loginScreen.mousePressed();
            return;
        }

        if (this.state !== 'desktop') return;

        // Check window controls first
        for (let i = this.windows.length - 1; i >= 0; i--) {
            let window = this.windows[i];
            let localX = mouseX - window.x;
            let localY = mouseY - window.y;
            
            if (localX >= 0 && localX <= window.w &&
                localY >= 0 && localY <= window.h) {
                // Check window controls
                if (window.checkControls(mouseX, mouseY)) {
                    return;
                }
                
                // Check window content
                if (window.onMousePressed && 
                    window.onMousePressed(localX - window.contentX, 
                                       localY - window.contentY)) {
                    this.activeWindow = window;
                    return;
                }
                
                // Start dragging
                window.checkDragging(mouseX, mouseY);
                if (window.isDragging) {
                    this.activeWindow = window;
                    // Move window to front
                    this.windows.splice(i, 1);
                    this.windows.push(window);
                    return;
                }
            }
        }

        // Check start button
        if (this.taskbar.startHovered) {
            this.startMenu.toggle();
            return;
        }

        // Check start menu
        if (this.startMenu.isVisible) {
            this.startMenu.mousePressed();
            return;
        }

        // Check taskbar buttons
        let x = 50;
        for (let button of this.taskbar.buttons) {
            if (mouseX > x && mouseX < x + 40 &&
                mouseY > height - this.taskbar.height) {
                this.activeWindow = button.window;
                if (button.window.isMinimized) {
                    button.window.restore();
                }
                return;
            }
            x += 45;
        }

        // Check desktop icons
        for (let icon of this.icons) {
            if (icon.isHovered) {
                this.launchApp(icon);
                return;
            }
        }
    }

    mouseReleased() {
        if (this.state !== 'desktop') return;
        
        // Release window dragging
        for (let window of this.windows) {
            if (window.isDragging) {
                window.stopDragging();
            }
            if (window.onMouseReleased) {
                let localX = mouseX - window.x - window.contentX;
                let localY = mouseY - window.y - window.contentY;
                window.onMouseReleased(localX, localY);
            }
        }
    }

    mouseMoved() {
        if (this.state !== 'desktop') return;

        // Update taskbar hover states
        this.taskbar.startHovered = mouseX < 50 && 
                                   mouseY > height - this.taskbar.height;
        
        this.taskbar.quickSettingsHovered = mouseX > width - 200 && 
                                          mouseY > height - this.taskbar.height;

        // Update window mouse move events
        for (let window of this.windows) {
            if (window.onMouseMoved) {
                let localX = mouseX - window.x - window.contentX;
                let localY = mouseY - window.y - window.contentY;
                window.onMouseMoved(localX, localY);
            }
        }
    }

    mouseWheel(event) {
        if (this.state !== 'desktop') return;

        // Pass wheel event to active window
        if (this.activeWindow && this.activeWindow.mouseWheel) {
            this.activeWindow.mouseWheel(event);
        }
    }

    keyPressed() {
        if (this.state === 'login') {
            this.loginScreen.keyPressed();
        } else if (this.state === 'desktop') {
            // Pass key events to active window first
            if (this.activeWindow && this.activeWindow.onKeyPressed &&
                this.activeWindow.onKeyPressed(key, keyCode)) {
                return;
            }
            this.startMenu.keyPressed();
        }
    }

    launchApp(app) {
        let AppClass = window[app.class];
        if (AppClass) {
            let x = random(width * 0.1, width * 0.6);
            let y = random(height * 0.1, height * 0.6);
            let newWindow = new AppClass(x, y);
            this.addWindow(newWindow);
            this.activeWindow = newWindow;
        }
    }

    addWindow(window) {
        this.windows.push(window);
    }

    removeWindow(window) {
        const index = this.windows.indexOf(window);
        if (index > -1) {
            this.windows.splice(index, 1);
        }
    }
} 