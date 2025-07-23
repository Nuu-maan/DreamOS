const COLORS = {
    // Pastel color scheme
    primary: [255, 182, 193],    // Pink
    secondary: [173, 216, 230],  // Light blue
    accent: [255, 218, 185],     // Peach
    success: [187, 232, 187],    // Mint
    warning: [255, 223, 186],    // Light orange
    error: [255, 182, 193],      // Light red
    
    // Text colors
    text: [80, 80, 80],         // Soft dark
    textLight: [255, 255, 255], // White
    textMuted: [150, 150, 150], // Gray
    
    // Background colors
    background: [248, 248, 255], // Almost white
    backgroundDark: [30, 30, 40],
    
    // Window colors
    windowBg: [255, 255, 255, 0.8],
    windowBorder: [255, 255, 255, 0.5],
    windowTitleBg: [255, 255, 255, 0.9],
    windowShadow: [0, 0, 0, 0.1],
    
    // Input and form colors
    loginInputBg: [255, 255, 255, 0.15],    // Semi-transparent white for input fields
    
    // Taskbar colors
    taskbarBg: [255, 255, 255, 0.8],
    taskbarBorder: [255, 255, 255, 0.2],
    taskbarButtonHover: [255, 255, 255, 0.9],
    taskbarButtonActive: [255, 182, 193, 0.3],
    
    // Start menu
    startMenuBg: [255, 255, 255, 0.8],
    startMenuBorder: [255, 255, 255, 0.2],
    startMenuHover: [255, 182, 193, 0.2],
    startMenuActive: [255, 182, 193, 0.3],
    
    // Desktop
    desktopIconBg: [255, 255, 255, 0.1],
    desktopIconHover: [255, 255, 255, 0.2],
    desktopIconActive: [255, 255, 255, 0.3]
};

const ANIMATIONS = {
    // Timing (in milliseconds)
    duration: {
        short: 150,
        normal: 300,
        long: 500
    },
    
    // Easing functions
    easing: {
        smooth: 0.1,      // For lerp
        bouncy: 0.08,     // For spring animations
        slow: 0.05        // For subtle movements
    },
    
    // Hover effects
    hover: {
        scale: 1.05,
        rotation: 0.02,
        glow: 20
    },
    
    // Transition effects
    transition: {
        scale: {
            from: 0.95,
            to: 1
        },
        opacity: {
            from: 0,
            to: 1
        },
        blur: {
            from: 10,
            to: 0
        }
    }
};

const SYSTEM = {
    name: 'DreamOS',
    version: '1.0.0',
    buildNumber: '22H2',
    
    // Boot sequence
    bootStages: [
        { message: 'Starting DreamOS...', duration: 1000 },
        { message: 'Loading system components', duration: 1500 },
        { message: 'Almost ready...', duration: 1000 }
    ],

    // Login settings
    defaultUser: {
        username: 'user',
        password: 'dream',
        avatar: '🌸'
    },

    // Desktop settings
    desktop: {
        wallpaper: 'default',
        iconSize: 80,
        iconSpacing: 100,
        taskbarHeight: 50
    },

    // Start menu
    startMenu: {
        width: 600,
        height: 650,
        pinned: [
            { name: 'Terminal', icon: '🌸', class: 'Terminal' },
            { name: 'Memory', icon: '✨', class: 'Memory' },
            { name: 'Dreams', icon: '🌙', class: 'Dreams' },
            { name: 'Settings', icon: '⚙️', class: 'Settings' }
        ],
        recommended: [
            { name: 'Subconscious', icon: '🌌', class: 'Subconscious' },
            { name: 'VisualNoise', icon: '🎆', class: 'VisualNoise' }
        ]
    },

    // Quick settings
    quickSettings: [
        { name: 'Wi-Fi', icon: '📶', state: true },
        { name: 'Bluetooth', icon: '📱', state: false },
        { name: 'Night Light', icon: '🌙', state: false },
        { name: 'Battery Saver', icon: '🔋', state: false }
    ],

    // Desktop apps
    apps: [
        {
            name: 'Terminal',
            icon: '🌸',
            class: 'Terminal',
            pinned: true,
            theme: {
                background: [30, 30, 40, 0.9],
                text: [255, 255, 255],
                accent: [255, 182, 193]
            }
        },
        {
            name: 'Memory',
            icon: '✨',
            class: 'Memory',
            pinned: true,
            theme: {
                background: [255, 255, 255, 0.9],
                text: [80, 80, 80],
                accent: [173, 216, 230]
            }
        },
        {
            name: 'Dreams',
            icon: '🌙',
            class: 'Dreams',
            pinned: true,
            theme: {
                background: [30, 30, 40, 0.9],
                text: [255, 255, 255],
                accent: [255, 218, 185]
            }
        },
        {
            name: 'Subconscious',
            icon: '🌌',
            class: 'Subconscious',
            pinned: false,
            theme: {
                background: [30, 30, 40, 0.9],
                text: [255, 255, 255],
                accent: [187, 232, 187]
            }
        },
        {
            name: 'VisualNoise',
            icon: '🎆',
            class: 'VisualNoise',
            pinned: false,
            theme: {
                background: [30, 30, 40, 0.9],
                text: [255, 255, 255],
                accent: [255, 223, 186]
            }
        },
        {
            name: 'Settings',
            icon: '⚙️',
            class: 'Settings',
            pinned: true,
            theme: {
                background: [255, 255, 255, 0.9],
                text: [80, 80, 80],
                accent: [150, 150, 150]
            }
        }
    ]
}; 