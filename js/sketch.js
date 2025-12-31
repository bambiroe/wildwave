// js/sketch.js

let audioManager = {
  soundFile: null,
  fft: null,
  amp: null,
  isPlaying: false,

  init: function() {
    this.fft = new p5.FFT(0.9, 1024);
    this.amp = new p5.Amplitude();
  },

  loadSoundFile: function(url) {
    loadSound(url, (s) => {
      this.soundFile = s;
      this.fft.setInput(this.soundFile);
      this.amp.setInput(this.soundFile);
    });
  },

  togglePlay: function() {
    if (!this.soundFile) return;
    if (this.isPlaying) {
      this.soundFile.pause();
    } else {
      this.soundFile.loop();
    }
    this.isPlaying = !this.isPlaying;
  },

  stop: function() {
    if (this.soundFile) {
      this.soundFile.stop();
      this.isPlaying = false;
    }
  }
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB, 360, 100, 100, 1);
  audioManager.init();
  initUI();
  windowResized();
}

function draw() {
  updateVisuals();
}

function updateVisuals() {
  clear();

  let spectrum = audioManager.fft.analyze();
  let level = audioManager.amp.getLevel() * Number(sensitivityEl.value());
  let profile = animalProfileEl.value();

  if (!profile || !audioManager.soundFile || !audioManager.soundFile.isLoaded()) {
    return;
  }

  switch (profile) {
    case 'bird': createAnimalVisual(spectrum, level, bird, audioManager.fft); break;
    case 'whale': createAnimalVisual(spectrum, level, whale, audioManager.fft); break;
    case 'frog': createAnimalVisual(spectrum, level, frog, audioManager.fft); break;
    case 'cat': createAnimalVisual(spectrum, level, cat, audioManager.fft); break;
    default: ;
    break;
  }
}

function windowResized() {
  if (window.innerWidth <= 768) {
    resizeCanvas(window.innerWidth, window.innerHeight * 0.8);
  } else {
    resizeCanvas(window.innerWidth * 0.8, window.innerHeight);
  }
}
