let dreamOS;
let wallpaper;

function setup() {
    createCanvas(windowWidth, windowHeight);
    wallpaper = new Wallpaper();
    dreamOS = new DreamOS();

    // Create a button to start audio context
    let startButton = createButton('Click to Start');
    startButton.position(20, 20);
    startButton.mousePressed(() => {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }
        startButton.remove();
    });
}

function draw() {
    wallpaper.display();
    dreamOS.update();
    dreamOS.display();
}

function mousePressed() {
    // Start audio context on first interaction
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    if (dreamOS) dreamOS.mousePressed();
}

function mouseReleased() {
    if (dreamOS) dreamOS.mouseReleased();
}

function mouseMoved() {
    if (dreamOS) dreamOS.mouseMoved();
}

function mouseWheel(event) {
    if (dreamOS) dreamOS.mouseWheel(event);
}

function keyPressed() {
    if (dreamOS) dreamOS.keyPressed();
    return false; // Prevent default browser behavior
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    wallpaper.windowResized();
} 