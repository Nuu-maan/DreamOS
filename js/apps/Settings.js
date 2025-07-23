class Settings extends App {
    constructor(x, y) {
        super(x, y, 400, 300, '⚙️', 'Settings');
        this.categories = [
            { name: 'General', icon: '🔧' },
            { name: 'Appearance', icon: '🎨' },
            { name: 'Sound', icon: '🔊' },
            { name: 'About', icon: 'ℹ️' }
        ];
        this.activeCategory = 0;
    }

    display() {
        super.display();
        
        if (!this.isMinimized) {
            // Draw categories
            let y = this.contentY + 20;
            textSize(14);
            textAlign(LEFT, CENTER);
            
            for (let i = 0; i < this.categories.length; i++) {
                let category = this.categories[i];
                let isActive = i === this.activeCategory;
                
                // Category background
                if (isActive) {
                    fill(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2], 50);
                    noStroke();
                    rect(this.contentX + 10, y - 10, 150, 30, 8);
                }
                
                // Category text
                fill(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
                text(`${category.icon} ${category.name}`, this.contentX + 20, y);
                y += 40;
            }
            
            // Draw separator
            stroke(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2], 50);
            line(this.contentX + 170, this.contentY + 10, 
                 this.contentX + 170, this.y + this.h - 20);
                
            // Draw content area
            let category = this.categories[this.activeCategory];
            textAlign(CENTER, CENTER);
            text(`${category.name} settings coming soon...`, 
                 this.contentX + 285, this.contentY + 150);
        }
        return true;
    }

    onMousePressed(x, y) {
        // Check category clicks
        let categoryY = 20;
        for (let i = 0; i < this.categories.length; i++) {
            if (x >= 10 && x <= 160 &&
                y >= categoryY - 10 && y <= categoryY + 20) {
                this.activeCategory = i;
                return true;
            }
            categoryY += 40;
        }
        return false;
    }
} 