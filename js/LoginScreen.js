class LoginScreen {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.username = '';
        this.password = '';
        this.error = '';
        this.inputSelected = null;
        this.buttonHovered = false;
        
        // Animation properties
        this.opacity = 0;
        this.targetOpacity = 1;
        this.scale = 0.95;
        this.targetScale = 1;
        this.rotation = -0.05;
        this.targetRotation = 0;
        
        // Particle system
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: random(width),
                y: random(height),
                size: random(2, 6),
                speed: random(0.2, 1),
                color: random([
                    [255, 182, 193, 0.3],    // Light pink
                    [173, 216, 230, 0.3],    // Light blue
                    [255, 218, 185, 0.3]     // Light peach
                ])
            });
        }

        // Default colors in case config isn't loaded
        this.defaultColors = {
            loginBg: [255, 255, 255, 0.1],
            loginBorder: [255, 255, 255, 0.2],
            text: [255, 255, 255],
            loginInputBg: [255, 255, 255, 0.1],
            primary: [255, 182, 193],    // Soft pink
            loginButtonBg: [255, 182, 193, 1],
            loginButtonHover: [255, 218, 185, 1]  // Peach
        };

        // Input animations
        this.inputs = {
            username: { focus: 0, hover: 0, shake: 0 },
            password: { focus: 0, hover: 0, shake: 0 }
        };

        // Button animation
        this.buttonScale = 1;
        this.buttonRotation = 0;
        this.buttonGlow = 0;
    }

    getColor(colorName) {
        return (COLORS && COLORS[colorName]) || this.defaultColors[colorName] || [255, 255, 255];
    }

    update() {
        // Smooth container animations
        this.opacity = lerp(this.opacity, this.targetOpacity, 0.1);
        this.scale = lerp(this.scale, this.targetScale, 0.1);
        this.rotation = lerp(this.rotation, this.targetRotation, 0.1);

        // Update particles
        for (let p of this.particles) {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = height;
                p.x = random(width);
            }
        }

        // Update input animations
        for (let input of ['username', 'password']) {
            this.inputs[input].focus = lerp(
                this.inputs[input].focus,
                this.inputSelected === input ? 1 : 0,
                0.1
            );
            this.inputs[input].hover = lerp(
                this.inputs[input].hover,
                this.isInputHovered(input) ? 1 : 0,
                0.2
            );
            this.inputs[input].shake *= 0.9;
        }

        // Update button animations
        let targetButtonScale = this.buttonHovered ? 1.05 : 1;
        this.buttonScale = lerp(this.buttonScale, targetButtonScale, 0.2);
        this.buttonRotation = lerp(this.buttonRotation, this.buttonHovered ? 0.05 : 0, 0.2);
        this.buttonGlow = lerp(this.buttonGlow, this.buttonHovered ? 1 : 0, 0.1);
    }

    display() {
        push();
        // Background particles
        for (let p of this.particles) {
            noStroke();
            fill(p.color[0], p.color[1], p.color[2], p.color[3] * 255);
            circle(p.x, p.y, p.size * (1 + sin(frameCount * 0.05) * 0.2));
        }

        // Semi-transparent overlay
        background(0, 0, 0, 100);

        // Center container
        let containerW = 400;
        let containerH = 500;
        let x = width/2 - containerW/2;
        let y = height/2 - containerH/2;

        // Apply container animations
        translate(width/2, height/2);
        rotate(this.rotation);
        scale(this.scale);
        translate(-width/2, -height/2);

        // Glass morphism effect
        drawingContext.save();
        drawingContext.filter = 'blur(10px)';
        noStroke();
        fill(255, 255, 255, 10);
        rect(x - 10, y - 10, containerW + 20, containerH + 20, 30);
        drawingContext.restore();

        // Container background with blur effect
        let loginBg = this.getColor('loginBg');
        fill(loginBg[0], loginBg[1], loginBg[2], loginBg[3] * 255);
        let loginBorder = this.getColor('loginBorder');
        stroke(loginBorder[0], loginBorder[1], loginBorder[2], loginBorder[3] * 255);
        strokeWeight(2);
        rect(x, y, containerW, containerH, 25);

        // Decorative circles
        noFill();
        stroke(255, 255, 255, 30);
        let circleY = y + 120;
        for (let i = 0; i < 3; i++) {
            let size = 150 + i * 30;
            let offset = sin(frameCount * 0.02 + i) * 10;
            circle(width/2, circleY + offset, size);
        }

        // Avatar with glow
        drawingContext.save();
        drawingContext.filter = 'blur(5px)';
        textSize(80);
        textAlign(CENTER, CENTER);
        fill(255, 255, 255, 50);
        text(SYSTEM?.defaultUser?.avatar || '👤', width/2, y + 100);
        drawingContext.restore();
        
        textSize(80);
        text(SYSTEM?.defaultUser?.avatar || '👤', width/2, y + 100);

        // Welcome text with gradient
        let textColor = this.getColor('text');
        textSize(28);
        textAlign(CENTER, CENTER);
        let welcomeY = y + 180;
        
        drawingContext.save();
        let gradient = drawingContext.createLinearGradient(
            x, welcomeY, x + containerW, welcomeY
        );
        gradient.addColorStop(0, 'rgba(255, 182, 193, 1)');    // Pink
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');  // White
        gradient.addColorStop(1, 'rgba(173, 216, 230, 1)');    // Blue
        drawingContext.fillStyle = gradient;
        text('Welcome to DreamOS', width/2, welcomeY);
        drawingContext.restore();

        // Inputs
        this.drawInput(
            x + 50, y + 240, containerW - 100, 50,
            '👤 Username',
            this.username,
            'username'
        );

        this.drawInput(
            x + 50, y + 310, containerW - 100, 50,
            '🔒 Password',
            '*'.repeat(this.password.length),
            'password'
        );

        // Error message with shake animation
        if (this.error) {
            push();
            translate(sin(frameCount * 0.5) * this.inputs.password.shake, 0);
            fill(255, 99, 99, this.opacity * 255);
            textSize(14);
            textAlign(CENTER, CENTER);
            text(this.error, width/2, y + 370);
            pop();
        }

        // Login button with animations
        this.drawLoginButton(x + 50, y + 400, containerW - 100, 50);

        // System info with fade
        textSize(12);
        fill(textColor[0], textColor[1], textColor[2], 128);
        let systemInfo = SYSTEM ? 
            `${SYSTEM.name} ${SYSTEM.version} (Build ${SYSTEM.buildNumber})` :
            'DreamOS';
        text(systemInfo, width/2, y + containerH - 20);

        pop();
    }

    drawInput(x, y, w, h, placeholder, value, inputName) {
        let input = this.inputs[inputName];
        let isHovered = this.isInputHovered(inputName);
        let isFocused = this.inputSelected === inputName;

        // Input container
        push();
        translate(x + w/2, y + h/2);
        scale(1 + input.hover * 0.02);
        translate(-w/2, -h/2);

        // Glow effect
        if (input.focus > 0) {
            drawingContext.save();
            drawingContext.filter = 'blur(10px)';
            noStroke();
            fill(255, 182, 193, input.focus * 50);
            rect(-10, -10, w + 20, h + 20, 15);
            drawingContext.restore();
        }

        // Background
        let inputBg = this.getColor('loginInputBg');
        fill(inputBg[0], inputBg[1], inputBg[2], (inputBg[3] + input.hover * 0.1) * 255);
        let borderColor = this.getColor(isFocused ? 'primary' : 'loginInputBg');
        stroke(borderColor[0], borderColor[1], borderColor[2], 
               ((borderColor[3] || 1) + input.focus * 0.5) * 255);
        strokeWeight(2);
        rect(0, 0, w, h, 15);

        // Input text
        let textColor = this.getColor('text');
        fill(textColor[0], textColor[1], textColor[2], 
             (0.7 + input.focus * 0.3) * 255);
        textSize(16);
        textAlign(LEFT, CENTER);
        text(value || placeholder, 20, h/2);

        pop();
    }

    drawLoginButton(x, y, w, h) {
        push();
        translate(x + w/2, y + h/2);
        rotate(this.buttonRotation);
        scale(this.buttonScale);
        translate(-w/2, -h/2);

        // Glow effect
        if (this.buttonGlow > 0) {
            drawingContext.save();
            drawingContext.filter = 'blur(10px)';
            fill(255, 182, 193, this.buttonGlow * 100);
            noStroke();
            rect(-10, -10, w + 20, h + 20, 20);
            drawingContext.restore();
        }

        // Button background
        let buttonColor = this.getColor(this.buttonHovered ? 'loginButtonHover' : 'loginButtonBg');
        fill(buttonColor[0], buttonColor[1], buttonColor[2], (buttonColor[3] || 1) * 255);
        noStroke();
        rect(0, 0, w, h, 20);

        // Button text
        let textColor = this.getColor('text');
        fill(textColor[0], textColor[1], textColor[2]);
        textSize(18);
        textAlign(CENTER, CENTER);
        text('✨ Sign in ✨', w/2, h/2);

        pop();
    }

    isInputHovered(inputName) {
        let containerW = 400;
        let containerH = 500;
        let x = width/2 - containerW/2;
        let y = height/2 - containerH/2;
        
        let inputY = inputName === 'username' ? y + 240 : y + 310;
        return mouseX > x + 50 && mouseX < x + containerW - 50 &&
               mouseY > inputY && mouseY < inputY + 50;
    }

    mousePressed() {
        let containerW = 400;
        let containerH = 500;
        let x = width/2 - containerW/2;
        let y = height/2 - containerH/2;

        // Check username input
        if (mouseY > y + 240 && mouseY < y + 290) {
            this.inputSelected = 'username';
        }
        // Check password input
        else if (mouseY > y + 310 && mouseY < y + 360) {
            this.inputSelected = 'password';
        }
        // Check login button
        else if (mouseY > y + 400 && mouseY < y + 450 &&
                mouseX > x + 50 && mouseX < x + containerW - 50) {
            this.tryLogin();
        }
        else {
            this.inputSelected = null;
        }
    }

    keyPressed() {
        if (key === 'Tab') {
            if (this.inputSelected === 'username') {
                this.inputSelected = 'password';
            } else if (this.inputSelected === 'password') {
                this.inputSelected = 'username';
            } else {
                this.inputSelected = 'username';
            }
            return false;
        }

        if (key === 'Enter') {
            this.tryLogin();
            return false;
        }

        if (this.inputSelected) {
            if (keyCode === BACKSPACE) {
                if (this.inputSelected === 'username') {
                    this.username = this.username.slice(0, -1);
                } else {
                    this.password = this.password.slice(0, -1);
                }
            } else if (key.length === 1) {
                if (this.inputSelected === 'username') {
                    this.username += key;
                } else {
                    this.password += key;
                }
            }
        }
    }

    tryLogin() {
        if (this.username === (SYSTEM?.defaultUser?.username || 'user') &&
            this.password === (SYSTEM?.defaultUser?.password || 'dream')) {
            this.error = '';
            this.onLogin();
        } else {
            this.error = 'Incorrect username or password';
            this.password = '';
            this.inputs.password.shake = 1;
        }
    }
} 