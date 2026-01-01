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
      
      this.soundFile.onended(() => {
        this.isPlaying = false;
        if (typeof stopSound === "function") stopSound();
      });
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
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  audioManager.init();
  initUI();
}

function draw() {
  updateVisuals();
}

function updateVisuals() {
  clear();

  let profile = animalProfileEl.value();
  if (!profile || !audioManager.soundFile || !audioManager.soundFile.isLoaded()) {
    return;
  }

  let spectrum = audioManager.fft.analyze();
  let level = audioManager.amp.getLevel() * Number(sensitivityEl.value());

  const animalMap = { bird, whale, frog, cat };
  if (animalMap[profile]) {
    createAnimalVisual(spectrum, level, animalMap[profile], audioManager.fft);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
