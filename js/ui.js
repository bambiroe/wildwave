// js/ui.js

let sensitivityEl, baseColorEl, animalProfileEl, statusEl;

let presetFiles = {
  bird: 'assets/samples/bird_example.mp3',
  whale: 'assets/samples/whale_example.mp3',
  frog: 'assets/samples/frog_example.mp3',
  cat: 'assets/samples/cat_example.mp3'
};

function initUI() {
  setUpControls();
  setUpEvents();
}

function setUpControls() {
  sensitivityEl = select('#sensitivity');
  baseColorEl = select('#baseColor');
  animalProfileEl = select('#animalProfile');
  statusEl = select('#status');
}

function setUpEvents() {
  select('#fileInput').elt.addEventListener('change', handleFileSelect);
  select('#playBtn').mousePressed(togglePlay);
  select('#stopBtn').mousePressed(stopSound);
  select('#presetSelect').changed(loadPreset);
  animalProfileEl.changed(updateDefaultColor);
}

function updateDefaultColor() {
  let profile = animalProfileEl.value();
  const profiles = { bird, whale, frog, cat };
  if (profiles[profile]) {
    baseColorEl.value(profiles[profile].defaultColor);
  }
}

function handleFileSelect(event) {
  let file = event.target.files[0];
  if (!file) return;

  audioManager.stop();
  statusEl.html('Status: Uploading file...');
  let url = URL.createObjectURL(file);

  audioManager.loadSoundFile(url);
  statusEl.html('Status: File loaded');
}

function togglePlay() {
  if (!audioManager.soundFile) return statusEl.html('Status: No sound');
  audioManager.togglePlay();
  statusEl.html(audioManager.isPlaying ? 'Status: Playing' : 'Status: Paused');
  select('#playBtn').html(audioManager.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>');
}

function stopSound() {
  audioManager.stop();
  statusEl.html('Status: Stopped');
  select('#playBtn').html('<i class="fa-solid fa-play"></i>');
}

function loadPreset() {
  let val = select('#presetSelect').value();
  if (!val) return;

  audioManager.stop();
  let path = presetFiles[val];
  statusEl.html('Status: Loading preset...');

  audioManager.loadSoundFile(path);
  statusEl.html('Status: Preset loaded (' + val + ')');
  
  select('#playBtn').html('<i class="fa-solid fa-play"></i>');
}
