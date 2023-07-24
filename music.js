let synth;
var beat; // Reference to the sound
let distort = 0;
let hueValue = 10;
let recorder;      // p5.SoundRecorder: records the audio
let recording;     // p5.SoundFile: where we'll store the recorded audio
let recordButton;  // Button to control recording
let isRecording = false;



function preload() {
    beat = loadSound('beat.wav');
}

function setup() {
    createCanvas(200, 200);
    colorMode(HSB, 360, 100, 100); // Set max values for HSB
    synth = new p5.PolySynth();
    reverb = new p5.Reverb();
    delay = new p5.Delay();
    fft = new p5.FFT();
    recorder = new p5.SoundRecorder();
    recording = new p5.SoundFile();
    recorder.setInput();  // Set the recorder to record the p5 sound output

    let recordLink = document.getElementById('recordLink');
    recordLink.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default action of the link
        toggleRecording();
    });
    reverb.process(beat, 4, 3); // This applies reverb to the synth
    beat.loop();

}


function toggleRecording() {
    let recordLink = document.getElementById('recordLink');

    if (!isRecording) {
        // Start the recording
        recorder.record(recording);
        recordLink.textContent = 'click this to stop recording';
    } else {
        // Stop the recording
        recorder.stop();
        
        // Save the recorded audio as a WAV file
        saveSound(recording, 'hype.wav');

        recordLink.textContent = 'click this to start recording';
    }
    isRecording = !isRecording;
}
  

function draw() {
    background(0);

    let spectrum = fft.analyze();
    noStroke();

    push(); // Save the current transformation matrix
    translate(width / 2, height / 2); // Move the drawing origin to the center of the canvas

    for (let i = 0; i < spectrum.length; i++) {
        let angle = TWO_PI * i / spectrum.length; // Convert 'i' into an angle
        let amp = spectrum[i]; // Get the amplitude at frequency 'i'
        let r = map(amp, 0, 256, 20, 100); // Map amplitude to a distance from the center

        // Calculate x and y using polar to cartesian conversion
        let x = r * cos(angle);
        let y = r * sin(angle);

        // Linearly interpolate between current and next hue value for a smoother transition.
        let nextHueValue = i < spectrum.length - 1 ? map(spectrum[i + 1], 0, 255, 0, 360) : hueValue;
        let color1 = color(hueValue, 70, 90);
        let color2 = color(nextHueValue, 70, 90);
        let interCol = lerpColor(color1, color2, 0.5);

        stroke(interCol);
        line(0, 0, x, y); // Draw a line from the center to the calculated x,y
    }

    pop(); // Restore the transformation matrix to what it was at the beginning of draw()

    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255);
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();
}


function drawBoxWithHue(hueValue) {
    let boxSize = 100;
    let boxX = (width - boxSize) / 2;
    let boxY = (height - boxSize) / 2;

    fill(hueValue, 70, 90); // Reduced saturation for softer colors
    noStroke();
    rect(boxX, boxY, boxSize, boxSize);
}

function mousePressed() {
    userStartAudio();
}

function keyPressed() {
    let note;

    switch (key.toLowerCase()) {
        case 'q':
            note = 'C5';
            hueValue = 15; // Soft red
            break;
        case 'w':
            note = 'D5';
            hueValue = 30; // Gentle orange
            break;
        case 'e':
            note = 'F4';
            hueValue = 60; // Pastel yellow
            break;
        case 'r':
            note = 'B4';
            hueValue = 120; // Calming green
            break;
        case 't':
            note = 'F5';
            hueValue = 165; // Turquoise/cyan
            break;
        case 'y':
            note = 'G4';
            hueValue = 205; // Light blue
            break;
        case 'u':
            note = 'B5';
            hueValue = 255; // Mild indigo
            break;
        case 'i':
            note = 'B2';
            hueValue = 290; // Serene lavender/purple
            break;
        case 'o':
            note = 'F2';
            hueValue = 330; // Gentle pink
            break;
        case 'p':
            note = 'F3';
            hueValue = 15; // Soft red
            break;
        
        case 'a':
            note = 'C4';
            hueValue = 15; // Soft red
            break;
        case 's':
            note = 'D4';
            hueValue = 30; // Gentle orange
            break;
        case 'd':
            note = 'E4';
            hueValue = 60; // Pastel yellow
            break;
        case 'f':
            note = 'G4';
            hueValue = 120; // Calming green
            break;
        case 'g':
            note = 'A4';
            hueValue = 165; // Turquoise/cyan
            break;
        case 'h':
            note = 'C5';
            hueValue = 205; // Light blue
            break;
        case 'j':
            note = 'D5';
            hueValue = 255; // Mild indigo
            break;
        case 'k':
            note = 'E5';
            hueValue = 290; // Serene lavender/purple
            break;
        case 'l':
            note = 'G5';
            hueValue = 330; // Gentle pink
            break;
        case 'z':
            note = 'C3';
            hueValue = 7; // Soft red
            break;
        case 'x':
            note = 'D3';
            hueValue = 22; // Gentle orange
            break;
        case 'c':
            note = 'E2';
            hueValue = 52; // Pastel yellow
            break;
        case 'v':
            note = 'G3';
            hueValue = 107; // Calming green
            break;
        case 'b':
            note = 'A3';
            hueValue = 152; // Turquoise/cyan
            break;
        case 'n':
            note = 'C4';
            hueValue = 192; // Light blue
            break;
        case 'm':
            note = 'D3';
            hueValue = 247; // Mild indigo
            break;
        case ';':
            saveCanvas('sci_art', 'png');
            break;
        case '#':
            if (beat.isPlaying()) { 
                beat.pause();
            } else {
                beat.loop();
            }
            break;
    }

    let velocity = 1;
    reverb.process(synth, 4, 3); // This applies reverb to the synth
    delay.process(synth, 0.12, .7, 2300);
    synth.noteAttack(note, velocity);
}

function keyReleased() {
    synth.noteRelease(); // Stop the note when the key is released
}
