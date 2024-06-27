function mousePressed() {
  if (mouseY > 90 && mouseY < ground[mouseX]) {
    // Get mass from the slider and scale the radius
    let mass = float(massSlider.value());
    let radius = mass * 5; // Scale radius based on mass
    // Add a new ball at the mouse position with selected mass
    let ball = new Ball(mouseX, mouseY, radius, mass);
    balls.push(ball);
  }
}

function mouseWheel(event) {
  scrolledMillis = millis();
  starfieldMove = true;
  if (event.delta < 0) {
    starfieldForward = true;
  } else if (event.delta > 0) {
    starfieldForward = false;
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    starfieldArrow = true;
    if (keyCode == UP_ARROW) {
      starfieldForward = true;
    } else {
      starfieldForward = false;
    }
  }
}

function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    starfieldArrow = false;
  }
}

function generateGradient(colors) {
  let colourGradient = drawingContext.createLinearGradient(
    0,
    height - 100,
    0,
    height
  );
  let step = 1 / (colors.length - 1);
  for (let i = 0; i < colors.length; i++) {
    colourGradient.addColorStop(i * step, colors[i]);
  }
  return colourGradient;
}

function updateGravity() {
  updateLandscape();
  createCanvas(windowWidth, windowHeight);
  wind = createVector(0, 0);
  switch (planetSelector.value()) {
    case "9.81":
      // Earth gradient
      gradient = generateGradient([
        color(80, 132, 42),
        color(68, 120, 4),
        color(52, 110, 5),
        color(68, 120, 4),
        color(52, 110, 5),
        color(80, 132, 42),
        color(154, 123, 79),
        color(150, 75, 0),
      ]);
      break;
    case "1.62":
      // Moon gradient
      gradient = generateGradient([
        color(232, 229, 24),
        color(218, 216, 223),
        color(197, 196, 204),
        color(178, 178, 178),
        color(177, 171, 184),
        color(162, 160, 169),
        color(130, 130, 130),
        color(121, 121, 121),
      ]);
      break;
    case "274":
      // Sun gradient
      gradient = generateGradient([
        color(248, 255, 137),
        color(255, 228, 132),
        color(249, 223, 116),
        color(255, 204, 51),
        color(253, 185, 101),
        color(242, 148, 107),
        color(236, 105, 125),
      ]);
      break;
    case "3.7":
      // Mercury gradient
      gradient = generateGradient([
        color(231, 232, 236),
        color(173, 168, 165),
        color(177, 173, 173),
        color(140, 140, 148),
        color(104, 105, 109),
      ]);
      break;
    case "8.87":
      //Venus gradient
      gradient = generateGradient([
        color(238, 203, 139),
        color(244, 196, 79),
        color(227, 187, 118),
        color(211, 165, 103),
        color(219, 161, 73),
        color(173, 141, 84),
        color(159, 107, 43),
      ]);
      break;
    case "3.71":
      // Mars gradient
      gradient = generateGradient([
        color(69, 24, 4),
        color(193, 68, 14),
        color(231, 125, 17),
        color(253, 166, 0),
        color(231, 125, 17),
        color(193, 68, 14),
        color(69, 24, 4),
      ]);
      break;
    case "24.79":
      // Jupiter gradient
      gradient = generateGradient([
        color(235, 243, 246),
        color(227, 220, 203),
        color(216, 202, 157),
        color(165, 145, 134),
        color(201, 144, 57),
      ]);
      break;
    case "10.44":
      // Saturn gradient
      gradient = generateGradient([
        color(237, 219, 173),
        color(226, 191, 125),
        color(195, 146, 79),
        color(252, 238, 173),
        color(196, 176, 139),
        color(226, 191, 125),
        color(195, 146, 79),
      ]);
      break;
    case "8.871":
      // Uranus gradient
      gradient = generateGradient([
        color(225, 238, 238),
        color(209, 231, 231),
        color(198, 211, 227),
        color(248, 248, 255),
        color(217, 221, 244),
        color(198, 211, 227),
        color(217, 221, 244),
      ]);
      break;
    case "11.15":
      // Neptune gradient
      gradient = generateGradient([
        color(71, 126, 253),
        color(116, 214, 253),
        color(100, 255, 238),
        color(61, 94, 249),
        color(43, 55, 139),
      ]);
      break;
    case "0.62":
      // Pluto gradient
      gradient = generateGradient([
        color(255, 241, 213),
        color(246, 221, 189),
        color(221, 196, 175),
        color(204, 186, 153),
        color(187, 168, 130),
        color(150, 133, 112),
      ]);
      break;
  }
  clearBalls();
}

function updateMassValue() {
  if (massValueDisplay) {
    massValueDisplay.html(massSlider.value().toFixed(2));
  }
}

function updateWind() {
  let direction = windDirectionSelector.value();
  let magnitude = windSlider.value();
  if (windValueDisplay) {
    windValueDisplay.html(windSlider.value().toFixed(2));
  }
  switch (direction) {
    case "N":
      wind = createVector(0, -magnitude);
      break;
    case "NE":
      wind = createVector(magnitude / sqrt(2), -magnitude / sqrt(2));
      break;
    case "E":
      wind = createVector(magnitude, 0);
      break;
    case "SE":
      wind = createVector(magnitude / sqrt(2), magnitude / sqrt(2));
      break;
    case "S":
      wind = createVector(0, magnitude);
      break;
    case "SW":
      wind = createVector(-magnitude / sqrt(2), magnitude / sqrt(2));
      break;
    case "W":
      wind = createVector(-magnitude, 0);
      break;
    case "NW":
      wind = createVector(-magnitude / sqrt(2), -magnitude / sqrt(2));
      break;
    default:
      wind = createVector(0, 0);
  }
}

function updateElasticity() {
  let elasticityValueDisplay = select("#elasticityValue");
  if (elasticityValueDisplay) {
    elasticityValueDisplay.html(elasticitySlider.value().toFixed(2));
  }
  elasticity = float(elasticitySlider.value());
}

function updateLandscape() {
  createCanvas(windowWidth, windowHeight);
  noiseScale = float(noiseSlider.value());
  gravity = float(planetSelector.value());
  elasticity = float(elasticitySlider.value());
  if (landscapeTypeCheckbox.checked()) {
    // Generate noise-based landscape
    for (let x = 0; x < width; x++) {
      ground[x] = height - noise(x * noiseScale) * 100; // Adjust height parameters as needed
    }
  } else {
    // Generate flat ground
    for (let x = 0; x < width; x++) {
      ground[x] = height - 50; // Flat ground at a fixed height
    }
  }
}

function clearBalls() {
  balls = [];
}

function restart() {
  setup();
}
