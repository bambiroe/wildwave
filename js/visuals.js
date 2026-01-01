// js/visuals.js

const bird = { range: [3000, 8000], minCount: 15, maxCount: 40, defaultColor: "#e26ea0" }; 
const whale = { range: [20, 400], minCount: 4, maxCount: 4, defaultColor: "#5087d2" }; 
const frog = { range: [400, 2000], minCount: 1, maxCount: 8, defaultColor: "#5fd764" }; 
const cat = { range: [100, 2000], minCount: 1, maxCount: 8, defaultColor: "#d6d6d6" };

let smoothedIntensity = 0;

function createAnimalVisual(spectrum, level, animalType, fft) {
  noStroke(); 

  // ------ Color Setup ------
  const customColor = baseColorEl.value();
  const c = color(customColor);
  const [h, s, b] = [hue(c), saturation(c), brightness(c)];

  // ------ Intensity & Smoothing Setup ------
  const energy = fft.getEnergy(animalType.range[0], animalType.range[1]);
  const targetIntensity = (energy / 255) * level;
  
  // Smoothing factor of 0.2 for organic movement
  smoothedIntensity = lerp(smoothedIntensity, targetIntensity, 0.2);
  const activeIntensity = smoothedIntensity;

  // ------ Render Delegation ------
  if (animalType === bird) drawBird(h, s, b, activeIntensity, animalType);
  else if (animalType === frog) drawFrog(h, s, b, activeIntensity);
  else if (animalType === whale) drawWhale(h, s, b, activeIntensity);
  else if (animalType === cat) drawCat(h, s, b, activeIntensity);
}

function drawBird(h, s, b, intensity, type) {
  const windSpeed = 1.5 + (intensity * 2); 
  for (let i = 0; i < type.maxCount; i++) {
    const flowX = (frameCount * windSpeed + i * 80) % (width + 100) - 50;
    const noiseY = noise(i * 0.5, flowX * 0.002, frameCount * 0.005); 
    const y = map(noiseY, 0, 1, height * 0.2, height * 0.8);
    const size = map(intensity, 0, 1, 10, 35); 
    push();
    fill(h, s, b, 0.8); 
    ellipse(flowX, y, size, size);
    pop();
  }
}

function drawFrog(h, s, b, intensity) {
  const r = map(intensity, 0, 1, 120, width * 0.8); 
  const alphaVal = map(intensity, 0, 1, 0.8, 0.6); 
  push();
  translate(width / 2, height / 2);
  fill(h, s, b, alphaVal); 
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    const wobble = map(noise(cos(a) * 0.5 + 1, sin(a) * 0.5 + 1, frameCount * 0.02), 0, 1, -10, 10);
    const d = (r + wobble) / 2;
    vertex(d * cos(a), d * sin(a));
  }
  endShape(CLOSE);
  pop();
}

function drawWhale(h, s, b, intensity) {
  for (let i = 0; i < 5; i++) {
    const speed = frameCount * 0.003 * (i + 1); 
    const ampVal = map(intensity, 0, 1, 15, 250) * (0.6 + i * 0.3);
    const yBase = height * (0.3 + i * 0.15);
    push();
    fill(h + (i * 2), s, b - (i * 10), 0.6); 
    beginShape();
    vertex(0, height); 
    for (let x = 0; x <= width + 30; x += 30) {
      const dy = map(noise(x * 0.002 + speed, i * 10), 0, 1, -ampVal, ampVal);
      vertex(x, yBase + dy);
    }
    vertex(width, height); 
    endShape(CLOSE);
    pop();
  }
}

function drawCat(h, s, b, intensity) {
  const amplitude = map(intensity, 0, 1, 0, 200);
  const waveFreq = map(intensity, 0, 1, 0.01, 0.05);
  push(); 
  stroke(h, s, b); 
  strokeWeight(4);
  noFill();
  for (let i = 0; i < 3; i++) {
    const baseY = height * 0.3 + i * (height * 0.2);
    beginShape();
    for (let x = 0; x <= width; x += 10) { 
      const angle = (x * waveFreq) - (frameCount * 0.15);
      const dampen = Math.sin(map(x, 0, width, 0, PI));
      vertex(x, baseY + Math.sin(angle) * amplitude * dampen);
    }
    endShape();
  }
  pop();
}
