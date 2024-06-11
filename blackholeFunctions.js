function photonWave() {
  if (direction === Math.PI) {
    for (let y = -height / 2; y < (3 * height) / 2; y += height / 25) {
      particles.push(new Photon(2 * width - 20, y, direction));
    }
  } else if (direction === 0) {
    for (let y = -height / 2; y < (3 * height) / 2; y += height / 25) {
      particles.push(new Photon(20 - width, y, direction));
    }
  } else if (direction === Math.PI / 2) {
    for (let x = -width / 2; x < (3 * width) / 2; x += width / 25) {
      particles.push(new Photon(x, -20 - height, direction));
    }
  } else if (direction === -Math.PI / 2) {
    for (let x = -width / 2; x < (3 * width) / 2; x += width / 25) {
      particles.push(new Photon(x, 2 * height - 20, direction));
    }
  }
}

function changeBlackhole() {
  let val = blackholeSelect.value;
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
  blackHole = new Blackhole(width / 2, height / 2, val);
  bhStars.length = 0;
  for (let i = 0; i < round(0.001 * windowWidth * windowHeight); i++) {
    bhStars[i] = new bhStar();
  }
  clearCanvas();
}

function clearCanvas() {
  particles.length = 0;
}

function togglePhotonWave() {
  if (emittingPhotons && particles.length > 0) {
    emittingPhotons = false;
    startStopBtn.html("Start Photon Wave");
    for (let p of particles) {
      p.stopped = true;
    }
  } else if (particles.length > 0) {
    emittingPhotons = true;
    startStopBtn.html("Stop Photon Wave");
    for (let p of particles) {
      p.stopped = false;
    }
  }
}
