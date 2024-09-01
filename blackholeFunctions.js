// Function to generate a wave of photons based on the specified direction
function photonWave() {
  // Check direction and create photons accordingly
  if (direction == "3.14") { // Left to right
    for (let y = -height / 2; y < (3 * height) / 2; y += height / 25) {
      particles.push(new Photon(2 * width - 20, y, direction));
    }
  } else if (direction == "0") { // Right to left
    for (let y = -height / 2; y < (3 * height) / 2; y += height / 25) {
      particles.push(new Photon(20 - width, y, direction));
    }
  } else if (direction == "1.57") { // Top to bottom
    for (let x = -width / 2; x < (3 * width) / 2; x += width / 25) {
      particles.push(new Photon(x, -20 - height, direction));
    }
  } else if (direction == "-1.57") { // Bottom to top
    for (let x = -width / 2; x < (3 * width) / 2; x += width / 25) {
      particles.push(new Photon(x, 2 * height - 20, direction));
    }
  }
}

// Function to change the black hole properties based on user selection
function changeBlackhole() {
  let val = blackholeSelect.value; // Get selected black hole value
  // Set camera distance limit based on black hole size
  if (val == "7220") {
    cam.setDistanceMax(3000);
  } else if (val == "28400") {
    cam.setDistanceMax(4500);
  } else if (val == "4000") {
    cam.setDistanceMax(3000);
  } else if (val == "1000") {
    cam.setDistanceMax(3000);
  } else if (val == "40700") {
    cam.setDistanceMax(5000);
  } else if (val == "100000") {
    cam.setDistanceMax(6000);
  } else if (val == "270000") {
    cam.setDistanceMax(7500);
  }
  // Create a new black hole and initialize stars
  blackHole = new Blackhole(width / 2, height / 2, val);
  bhStars.length = 0; // Clear existing stars
  for (let i = 0; i < round(0.001 * windowWidth * windowHeight); i++) {
    bhStars[i] = new bhStar(); // Add new stars
  }
  clearCanvas(); // Clear particles and nearest ball
}

// Function to clear particles and reset nearest ball
function clearCanvas() {
  particles.length = 0; // Clear particles array
  nearestBall = null; // Reset nearest ball
}

// Function to toggle the emission of photon waves
function togglePhotonWave() {
  // Check if photons are currently emitting
  if (emittingPhotons && particles.length > 0) {
    emittingPhotons = false; // Stop emitting photons
    startStopBtn.html("Start Photon Wave"); // Update button text
    for (let p of particles) {
      p.stopped = true; // Stop each photon
    }
  } else if (particles.length > 0) {
    emittingPhotons = true; // Start emitting photons
    startStopBtn.html("Stop Photon Wave"); // Update button text
    for (let p of particles) {
      p.stopped = false; // Resume each photon
    }
  }
}

// Function from https://github.com/processing/p5.js/issues/7059 commented by inaridarkfox4231 on May 19
p5.prototype.screenVector = function (v){
  const _gl = this._renderer;
  // Transfer to camera coordinate system using uMVMatrix
  const camCoord = _gl.uMVMatrix.multiplyPoint(v);
  // Calculate ndc using uPMatrix
  const ndc = _gl.uPMatrix.multiplyAndNormalizePoint(camCoord);
  // Drop into canvas coordinates.
  // The depth value is converted so that near is 0 and far is 1.
  const _x = (0.5 + 0.5 * ndc.x) * this.width;
  const _y = (0.5 - 0.5 * ndc.y) * this.height;
  const _z = (0.5 + 0.5 * ndc.z);
  // Output in vector form.
  return createVector(_x, _y, _z);
}
