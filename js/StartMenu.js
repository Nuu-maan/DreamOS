class StartMenu {
    constructor(onAppLaunch) {
        this.isVisible = false;
        this.onAppLaunch = onAppLaunch;
        
        // Animation properties
        this.opacity = 0;
        this.targetOpacity = 0;
        this.scale = 0.95;
        this.targetScale = 1;
        this.blur = ANIMATIONS.transition.blur.from;
        this.targetBlur = ANIMATIONS.transition.blur.to;
        
        // UI state
        this.searchText = '';
        this.searchFocused = false;
        this.hoveredApp = null;
        this.selectedCategory = 'pinned';
        
        // Particle system
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: random(SYSTEM.startMenu.width),
                y: random(SYSTEM.startMenu.height),
                size: random(2, 4),
                speed: random(0.2, 0.5),
                color: random([COLORS.primary, COLORS.secondary, COLORS.accent])
            });
        }
    }

    update() {
        // Smooth animations
        this.opacity = lerp(this.opacity, this.targetOpacity, ANIMATIONS.easing.smooth);
        this.scale = lerp(this.scale, this.targetScale, ANIMATIONS.easing.bouncy);
        this.blur = lerp(this.blur, this.targetBlur, ANIMATIONS.easing.smooth);

        // Update particles
        for (let p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = SYSTEM.startMenu.height;
                p.x = random(SYSTEM.startMenu.width);
            }
        }
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.targetOpacity = this.isVisible ? 1 : 0;
        this.targetScale = this.isVisible ? 1 : 0.95;
        this.targetBlur = this.isVisible ? 0 : 10;
        if (this.isVisible) {
            this.searchText = '';
            this.searchFocused = true;
        }
    }

    hide() {
        this.isVisible = false;
        this.targetOpacity = 0;
        this.targetScale = 0.95;
        this.targetBlur = 10;
    }

    display() {
        if (this.opacity < 0.01) return;

        push();
        let x = width/2 - SYSTEM.startMenu.width/2;
        let y = height - SYSTEM.startMenu.height - SYSTEM.desktop.taskbarHeight - 10;

        // Apply animations
        translate(x + SYSTEM.startMenu.width/2, y + SYSTEM.startMenu.height/2);
        scale(this.scale);
        translate(-SYSTEM.startMenu.width/2, -SYSTEM.startMenu.height/2);

        // Menu shadow
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = `rgba(${COLORS.windowShadow.join(',')})`;

        // Glass background
        drawingContext.save();
        drawingContext.filter = `blur(${this.blur}px)`;
        fill(255, 255, 255, 10);
        noStroke();
        rect(-10, -10, SYSTEM.startMenu.width + 20, SYSTEM.startMenu.height + 20, 20);
        drawingContext.restore();

        // Menu background
        let bg = COLORS.startMenuBg;
        fill(bg[0], bg[1], bg[2], bg[3] * 255 * this.opacity);
        stroke(COLORS.startMenuBorder[0], COLORS.startMenuBorder[1],
               COLORS.startMenuBorder[2], COLORS.startMenuBorder[3] * 255 * this.opacity);
        strokeWeight(1);
        rect(0, 0, SYSTEM.startMenu.width, SYSTEM.startMenu.height, 15);

        // Draw particles
        for (let p of this.particles) {
            fill(p.color[0], p.color[1], p.color[2], 
                 20 * this.opacity * (1 + sin(frameCount * 0.05) * 0.2));
            noStroke();
            circle(p.x, p.y, p.size);
        }

        // Search bar
        this.drawSearchBar(20, 20);

        // Categories
        this.drawCategories(20, 80);

        // Apps grid
        let apps = this.selectedCategory === 'pinned' ? 
                  SYSTEM.startMenu.pinned : SYSTEM.startMenu.recommended;
        this.drawAppsGrid(apps, 20, 120);

        // User profile
        this.drawUserProfile(20);

        drawingContext.shadowBlur = 0;
        pop();
    }

    drawSearchBar(x, y) {
        let w = SYSTEM.startMenu.width - 40;
        let h = 40;

        // Search background
        fill(COLORS.loginInputBg[0], COLORS.loginInputBg[1], 
             COLORS.loginInputBg[2], COLORS.loginInputBg[3] * 255);
        stroke(this.searchFocused ? COLORS.primary[0] : COLORS.loginInputBg[0],
               this.searchFocused ? COLORS.primary[1] : COLORS.loginInputBg[1],
               this.searchFocused ? COLORS.primary[2] : COLORS.loginInputBg[2],
               (this.searchFocused ? 1 : COLORS.loginInputBg[3]) * 255);
        strokeWeight(2);
        rect(x, y, w, h, 10);

        // Search icon
        fill(COLORS.text[0], COLORS.text[1], COLORS.text[2], 200);
        noStroke();
        textSize(16);
        text('🔍', x + 15, y + h/2);

        // Search text
        textAlign(LEFT, CENTER);
        text(this.searchText || 'Type to search', x + 40, y + h/2);
    }

    drawCategories(x, y) {
        let categories = [
            { id: 'pinned', name: 'Pinned', icon: '📌' },
            { id: 'recommended', name: 'Recommended', icon: '✨' }
        ];

        textAlign(LEFT, CENTER);
        textSize(14);

        categories.forEach((cat, i) => {
            let isSelected = this.selectedCategory === cat.id;
            let isHovered = mouseX > x + i * 150 && mouseX < x + (i + 1) * 150 - 20 &&
                           mouseY > y && mouseY < y + 30;
            
            // Category background
            if (isSelected || isHovered) {
                fill(COLORS.startMenuHover[0], COLORS.startMenuHover[1],
                     COLORS.startMenuHover[2], COLORS.startMenuHover[3] * 255);
                noStroke();
                rect(x + i * 150, y, 130, 30, 8);
            }

            // Category text
            fill(COLORS.text[0], COLORS.text[1], COLORS.text[2],
                 (isSelected || isHovered ? 1 : 0.7) * 255);
            text(`${cat.icon} ${cat.name}`, x + i * 150 + 15, y + 15);
        });
    }

    drawAppsGrid(apps, x, y) {
        let itemSize = 90;
        let itemsPerRow = 6;
        let padding = 10;

        apps.forEach((app, i) => {
            let itemX = x + (i % itemsPerRow) * (itemSize + padding);
            let itemY = y + Math.floor(i / itemsPerRow) * (itemSize + padding);
            
            let isHovered = mouseX > itemX && mouseX < itemX + itemSize &&
                           mouseY > itemY && mouseY < itemY + itemSize;
            
            if (isHovered) {
                this.hoveredApp = app;
            }

            // App background
            fill(isHovered ? COLORS.startMenuHover[0] : COLORS.startMenuBg[0],
                 isHovered ? COLORS.startMenuHover[1] : COLORS.startMenuBg[1],
                 isHovered ? COLORS.startMenuHover[2] : COLORS.startMenuBg[2],
                 (isHovered ? COLORS.startMenuHover[3] : COLORS.startMenuBg[3]) * 255);
            stroke(COLORS.startMenuBorder[0], COLORS.startMenuBorder[1],
                   COLORS.startMenuBorder[2], COLORS.startMenuBorder[3] * 255);
            strokeWeight(1);
            rect(itemX, itemY, itemSize, itemSize, 12);

            // App icon
            push();
            translate(itemX + itemSize/2, itemY + itemSize/2 - 10);
            scale(isHovered ? 1.1 : 1);
            textSize(32);
            textAlign(CENTER, CENTER);
            text(app.icon, 0, 0);
            pop();

            // App name
            fill(COLORS.text[0], COLORS.text[1], COLORS.text[2],
                 (isHovered ? 1 : 0.8) * 255);
            textSize(12);
            textAlign(CENTER, CENTER);
            text(app.name, itemX + itemSize/2, itemY + itemSize - 15);
        });
    }

    drawUserProfile(x) {
        let y = SYSTEM.startMenu.height - 60;
        let w = SYSTEM.startMenu.width - 40;

        // Profile container
        fill(COLORS.loginInputBg[0], COLORS.loginInputBg[1],
             COLORS.loginInputBg[2], COLORS.loginInputBg[3] * 255);
        noStroke();
        rect(x, y, w, 40, 10);

        // Avatar
        textSize(24);
        textAlign(CENTER, CENTER);
        text(SYSTEM.defaultUser.avatar, x + 25, y + 20);

        // Username
        fill(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        textSize(14);
        textAlign(LEFT, CENTER);
        text(SYSTEM.defaultUser.username, x + 50, y + 20);
    }

    mousePressed() {
        if (!this.isVisible) return;

        // Check if click is outside menu
        let x = width/2 - SYSTEM.startMenu.width/2;
        let y = height - SYSTEM.startMenu.height - SYSTEM.desktop.taskbarHeight - 10;
        
        if (mouseX < x || mouseX > x + SYSTEM.startMenu.width ||
            mouseY < y || mouseY > y + SYSTEM.startMenu.height) {
            this.hide();
            return;
        }

        // Check category clicks
        let categoryY = y + 80;
        if (mouseY > categoryY && mouseY < categoryY + 30) {
            let categoryX = mouseX - x - 20;
            if (categoryX >= 0 && categoryX < 150) {
                this.selectedCategory = 'pinned';
            } else if (categoryX >= 150 && categoryX < 300) {
                this.selectedCategory = 'recommended';
            }
        }

        // Launch app if one is hovered
        if (this.hoveredApp) {
            this.onAppLaunch(this.hoveredApp);
            this.hide();
        }
    }

    keyPressed() {
        if (!this.isVisible || !this.searchFocused) return;

        if (keyCode === BACKSPACE) {
            this.searchText = this.searchText.slice(0, -1);
        } else if (key.length === 1) {
            this.searchText += key;
        }
    }
} 