// Initialize mode for the simulation: menu, blackhole, or planet
let mode = "menu";

// Variables for UI elements and images
let logo;
let planetPreview;
let blackholePreview;
let homeBtn;

// Constants for simulation physics
let c = 30; // Speed of light
let G = 3.54; // Gravitational constant
let dt = 0.1; // Time step for simulation

// Variables for black hole simulation
let blackHole;
let blackHoleMass;
let blackholeSelect;
let directionSelect;
let direction;
let particles = []; // Array for particles interacting with the black hole

// Variables for black hole stars
let bhStars = [];
let numStars;
let textureImg;
let starImgs = []; // Array for star textures

// Variables for photon emission
let emittingPhotons = true;
let startStopBtn;
let cam, graphics;
let screenX, screenY;
let distanceToEventHorizon;

// Variables for planet simulation
let balls = []; // Array for balls in the planet simulation
let gravity; // Gravity value for the planet
let nearestBall, ballVel; // Variables to track the nearest ball and its velocity

// UI elements for planet simulation
let massSlider;
let massValueDisplay;
let planetSelector;
let windDirectionSelector;
let windSlider;
let windValueDisplay;
let elasticitySlider;
let elasticityValueDisplay;
let landscapeTypeCheckbox;
let noiseLabel;
let noiseSlider;
let starsCheckedBtn;
let helpBtn, helpBtnText;

// Variables for wind and ground
let wind;
let ground = []; // Array for ground heights
let groundColour = "#008000"; // Ground color
let gradient;
let noiseScale;
let colours = [
  "cyan", "lime", "pink", "orange", "#057DFF", "#FE0000", "#FEE892"
]; // Color palette for ground and particles
let elasticity = 1; // Elasticity for collisions
let windParticles = []; // Array for wind particles

// Variables for starfield simulation
let stars = [];
let spaceMode; // Mode for space simulation: 1 or 2
let scrollSpeedX, scrollSpeedY, scrollSpeed; // Speeds for scrolling
let mouseSpeedX, mouseSpeedY;
let scrolledMillis = 0; // Time tracker for starfield movement
let starfieldMove = false; // Flag for starfield movement
let starfieldArrow = false;
let starfieldForward = true;
let ir = 0.5; // Influence radius for starfield

// Load assets and initialize UI elements
function preload() {
  logo = loadImage("Images/fat.jpg"); // Load logo image
  planetPreview = document.getElementById("planetPreview"); // Planet preview element
  blackholePreview = document.getElementById("blackholePreview"); // Black hole preview element
  textureImg = loadImage("Images/texture.jpg"); // Load texture image
  starImgs = [
    loadImage("Images/sun.jpg"),
    loadImage("Images/blue.jpg"),
    loadImage("Images/white.jpg")
  ]; // Load star textures
  homeBtn = document.getElementById("homeBtn"); // Home button element
  startStopBtn = select("#startStopBtn"); // Start/stop button element
  numStars = constrain(round(0.001 * windowWidth * windowHeight), 100, 800); // Number of stars
  blackholeSelect = document.getElementById("blackholeSelect"); // Black hole dropdown
  directionSelect = document.getElementById("directionSelect"); // Direction controls
  planetSelector = select("#planet"); // Planet selector dropdown
  planetSelector.changed(updateGravity); // Update gravity on change
  massSlider = select("#massSlider"); // Mass slider
  massSlider.input(updateMassValue); // Update mass value on slider input
  massValueDisplay = select("#massValue"); // Display for mass value
  windDirectionSelector = select("#windDirection"); // Wind direction selector
  windDirectionSelector.input(updateWind); // Update wind on change
  windSlider = select("#windSlider"); // Wind strength slider
  windSlider.input(updateWind); // Update wind strength on slider input
  windValueDisplay = select("#windValue"); // Display for wind strength
  elasticitySlider = select("#elasticitySlider"); // Elasticity slider
  elasticitySlider.input(updateElasticity); // Update elasticity on slider input
  elasticityValueDisplay = select("#elasticityValue"); // Display for elasticity value
  landscapeTypeCheckbox = select("#landscapeType"); // Checkbox for landscape type
  landscapeTypeCheckbox.changed(updateLandscape); // Update landscape on change
  noiseLabel = select("#noiseLabel"); // Label for noise slider
  noiseSlider = select("#noiseSlider"); // Noise slider
  noiseSlider.input(updateLandscape); // Update landscape on slider input
}

// Set up the canvas and UI based on the selected mode
function setup() {
  // Prevent right-click menu on canvas
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (rightClickMenu) =>
      rightClickMenu.preventDefault()
    );
  }

  // Initialize help button and its text
  helpBtn = select("#helpBtn");
  helpBtnText = select("#helpBtnText");

  // Setup for the menu mode
  if (mode == "menu") {
    createCanvas(windowWidth, windowHeight); // Create canvas for menu
    blackholePreview.style.left = width / 2 + 62 + "px"; // Position black hole preview
    planetPreview.style.left = width / 2 - 598 + "px"; // Position planet preview
    homeBtn.style.display = "none"; // Hide home button
  } 

  // Setup for the black hole simulation mode
  else if (mode == "blackhole") {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create WebGL canvas
    helpBtn.show(); // Show help button
    helpBtnText.show(); // Show help text
    helpBtn.position(20, 320); // Position help button
    helpBtnText.position(75, 320); // Position help text
    blackHole = new Blackhole(width / 2, height / 2, 7220); // Create black hole object
    for (let i = 0; i < numStars; i++) {
      bhStars[i] = new bhStar(); // Create stars for black hole
    }
    blackholeSelect.style.display = "inline-block"; // Show black hole select dropdown
    directionSelect.style.display = "inline-block"; // Show direction select dropdown
    startStopBtn.show(); // Show start/stop button
    document.getElementById("photonWaveBtn").style.display = "inline-block"; // Show photon wave button
    document.getElementById("clearBtn").style.display = "inline-block"; // Show clear button
    homeBtn.style.display = "inline-block"; // Show home button
    homeBtn.style.fontSize = "14px"; // Set font size for home button
    homeBtn.style.top = "160px"; // Set top position for home button
    homeBtn.style.left = "10px"; // Set left position for home button
    homeBtn.style.width = "80px"; // Set width for home button
    cam = createEasyCam(); // Create camera for 3D view
    cam.setRotationScale(0.0006); // Set camera rotation scale
    cam.setDistanceMax(3000); // Set maximum distance for camera
    cam.setDistanceMin(100); // Set minimum distance for camera
    document.getElementById("photonInfo").style.display = "inline-block"; // Show photon info
  } 

  // Setup for the planet simulation mode
  else if (mode == "planet") {
    createCanvas(windowWidth, windowHeight); // Create canvas for planet simulation
    helpBtn.show(); // Show help button
    helpBtnText.show(); // Show help text
    helpBtn.position(25, 170); // Position help button
    helpBtnText.position(80, 170); // Position help text
    document.getElementById("helpContent").style.top = "225px"; // Position help content

    // Initialize variables for planet simulation
    wind = createVector(0, 0);
    noiseScale = float(noiseSlider.value());
    gravity = float(planetSelector.value());
    elasticity = float(elasticitySlider.value());
    updateGravity(); // Update gravity based on selector
    spaceMode = round(random(1, 2)); // Set space mode randomly
    for (let i = 0; i < 25; i++) {
      windParticles.push(new WindParticle()); // Create wind particles
    }
    for (let i = 0; i < round(0.5 * windowWidth); i++) {
      stars[i] = new Star(); // Create stars for planet simulation
    }

    // Show UI elements for planet simulation
    planetSelector.show();
    massSlider.show();
    document.getElementById("pLabel").style.display = "inline-block";
    document.getElementById("mLabel").style.display = "inline-block";
    massValueDisplay.show();
    windDirectionSelector.show();
    document.getElementById("windDLabel").style.display = "inline-block";
    windSlider.show();
    document.getElementById("windSLabel").style.display = "inline-block";
    windValueDisplay.show();
    document.getElementById("eLabel").style.display = "inline-block";
    elasticitySlider.show();
    elasticityValueDisplay.show();
    document.getElementById("landscapeLabel").style.display = "inline-block";
    landscapeTypeCheckbox.show();
    noiseLabel.show();
    noiseSlider.show();
    document.getElementById("clearBalls").style.display = "inline-block";
    document.getElementById("restart").style.display = "inline-block";
    homeBtn.style.display = "inline-block"; // Show home button
    homeBtn.style.fontSize = "20px"; // Set font size for home button
    homeBtn.style.top = "30px"; // Set top position for home button
    homeBtn.style.right = "30px"; // Set right position for home button
    homeBtn.style.width = "100px"; // Set width for home button
    document.getElementById("starsLabel").style.display = "inline-block";
    document.getElementById("starsChecked").style.display = "inline-block";
  }

  // Initialize help content and button functionality
  let helpContent = select("#helpContent");
  let helpText = select("#helpText");
  let closeHelpBtn = select("#closeHelpBtn");

  // Show help content on help button click
  helpBtn.mousePressed(() => {
    helpBtn.hide();
    helpBtnText.hide();
    let instructions = "";
    if (mode == "planet") {
      instructions = `
        <strong>Planet Simulator Instructions:</strong><br>
        - Left-click to place a new ball on the ground.<br>
        - Right-click to select the nearest ball.<br>
        - Adjust gravity, wind, and other settings using the sliders.<br>
        - Observe how balls interact with the environment and each other.<br>
        - Use the 'Clear' button to remove all balls.<br>
        - Experiment with different landscape types and elasticity settings.<br>
      `;
    } else if (mode == "blackhole") {
      instructions = `
        <strong>Black Hole Simulator Instructions:</strong><br>
        - Click on the "Wave of Photons" button to spawn a cluster of light photons.<br>
        - Right-click to select the nearest photon.<br>
        - Choose the black hole you would like to see using the black hole dropdown menu.<br>
        - Use the direction controls to emit new particles in different directions.<br>
        - Click and drag with your left mouse button to move around in the x, y, and z axis.<br>
        - Click and drag with your right mouse button to move around in the x and y axis.<br>
        - Double-click to return to your original position.<br>
        - Observe how photons and stars are affected by the black hole's gravity.<br>
        - Press clear to reset the photons.
      `;
    }

    helpText.html(instructions); // Display instructions
    helpContent.show(); // Show help content
  });

  // Hide help content on close button click
  closeHelpBtn.mousePressed(() => {
    helpContent.hide(); // Hide help content
    helpBtn.show(); // Show help button
    helpBtnText.show(); // Show help text
  });
}

// Main draw loop for updating and rendering the simulation
function draw() {
  direction = float(directionSelect.value); // Get direction value

  // Menu mode: display the menu with options for the simulations
  if (mode == "menu") {
    background(43, 44, 41); // Set background color
    imageMode(CENTER); // Center image mode
    image(logo, width / 2, 125, 400, 400); // Display logo
    textAlign(CENTER); // Center-align text
    fill(255); // Set text color to white
    textSize(24); // Set text size
    textFont("Georgia"); // Set text font
    text("Planet Simulator", width / 2 - 330, 565); // Display planet simulator text
    text("Black Hole Simulator", width / 2 + 330, 565); // Display black hole simulator text
  } 

  // Black hole simulation mode
  else if (mode == "blackhole") {
    background(0); // Set background color to black
    lights(lights()); // Set up lighting
    orbitControl(1, 1, 1, { freeRotation: true }); // Enable orbit controls for camera
    // Update and display particles
    for (let p of particles) {
      blackHole.pull(p); // Pull particle towards the black hole
      p.update(); // Update particle position
      p.show(); // Display particle
    }
    // Blackholes' true mass
    if (blackHole.mass == 7220) {
      blackHoleMass = "7.22 x 10^9"
    } else if (blackHole.mass == 28400) {
      blackHoleMass = "2.84 x 10^10"
    } else if (blackHole.mass == 4000) {
      blackHoleMass = "4.00 x 10^9"
    } else if (blackHole.mass == 1000) {
      blackHoleMass = "1.00 x 10^9"
    } else if (blackHole.mass == 40700) {
      blackHoleMass = "4.07 x 10^10"
    } else if (blackHole.mass == 100000) {
      blackHoleMass = "1.00 x 10^11"
    } else if (blackHole.mass == 270000) {
      blackHoleMass = "2.70 x 10^11"
    } 
    // Update photon information if a nearest ball is selected
    if (nearestBall != null) {
      distanceToEventHorizon = blackHole.distanceToEventHorizon(nearestBall); // Calculate distance to event horizon
      let photonSpeed = 299792458; // Speed of light in meters per second
      let photonDistance = distanceToEventHorizon.toFixed(2); // Format distance
      if (photonDistance < 0) {
        photonDistance = 0
      }
      let photonStatus = distanceToEventHorizon <= 0 ? "Inside" : "Outside"; // Check photon status

      // Update photon info and black hole size display
      document.getElementById("photonSpeed").innerText = `Photon Speed: ${photonSpeed} m/s`;
      document.getElementById("photonStatus").innerText = `Photon Status: ${photonStatus} the black hole`;
      document.getElementById("photonDistance").innerText = `Distance from Event Horizon: ${photonDistance} arbitrary units`;
      document.getElementById("blackHoleSize").innerText = `Size of Black Hole: ${blackHoleMass} solar masses`
    } else {
      // Clear photon info and black hole size display if no nearest ball is selected
      document.getElementById("photonSpeed").innerText = `Photon Speed:`;
      document.getElementById("photonStatus").innerText = `Photon Status:`;
      document.getElementById("photonDistance").innerText = `Distance from Event Horizon:`;
      document.getElementById("blackHoleSize").innerText = `Size of Black Hole: ${blackHoleMass} solar masses`
    }

    // Display the black hole and stars
    blackHole.show(); // Display the black hole
    for (let i = 0; i < bhStars.length; i++) {
      bhStars[i].show(); // Display stars
      blackHole.check(bhStars[i]); // Check stars for interaction with black hole
    }
  } 

  // Planet simulation mode
  else if (mode == "planet") {
    // Show or hide noise controls based on landscape type checkbox
    if (landscapeTypeCheckbox.checked()) {
      noiseLabel.show();
      noiseSlider.show();
    } else {
      noiseLabel.hide();
      noiseSlider.hide();
    }

    // Set background color and handle starfield movement
    background(0);
    if (
      spaceMode == 2 &&
      document.getElementById("starsChecked").checked == true
    ) {
      translate(
        map(mouseX, 0, width, 0.5 + ir, 0.5 - ir) * width,
        map(mouseY, 0, height, 0.5 + ir, 0.5 - ir) * height
      ); // Translate based on mouse position
    } else {
      translate(width / 2, height / 2); // Center the origin
    }

    // Calculate scrolling speeds based on mouse position
    scrollSpeedX = map(mouseX, 0, width, 0, 35);
    scrollSpeedY = map(mouseY, 0, height, 0, 35);
    scrollSpeed = sqrt(
      scrollSpeedX * scrollSpeedX + scrollSpeedY * scrollSpeedY
    );
    mouseSpeedX = map(width / 2 - mouseX, 0, width, 0, 15);
    mouseSpeedY = map(height / 2 - mouseY, 0, height, 0, 15);

    // Update and display stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].show(); // Display stars
      if (document.getElementById("starsChecked").checked == true) {
        if (starfieldMove == true || starfieldArrow == true || spaceMode == 2) {
          stars[i].updateZ(); // Update star position in Z axis
        } else if (spaceMode == 1) {
          stars[i].updateXY(); // Update star position in XY plane
        }
      }
    }

    // Reset starfield movement flag if enough time has passed
    if (starfieldMove == true && millis() - scrolledMillis >= 250) {
      starfieldMove = false;
    }

    // Adjust translation based on mouse position if space mode 2 is active
    if (
      spaceMode == 2 &&
      document.getElementById("starsChecked").checked == true
    ) {
      translate(
        -map(mouseX, 0, width, 0.5 + ir, 0.5 - ir) * width,
        -map(mouseY, 0, height, 0.5 + ir, 0.5 - ir) * height
      );
    } else {
      translate(-width / 2, -height / 2); // Reset translation
    }

    // Display message if no balls are present and other conditions are met
    if (balls.length == 0 && scrolledMillis == 0 && windSlider.value() == 0) {
      textAlign(CENTER);
      noStroke();
      textSize(20);
      fill("white");
      text(`Press help for instructions.`, width / 2, height / 2);
    }

    // Draw ground with gradient
    noStroke();
    drawingContext.fillStyle = gradient;
    beginShape();
    vertex(0, height);
    for (let x = 0; x < width; x++) {
      vertex(x, ground[x]);
    }
    vertex(width, height);
    endShape(CLOSE);

    // Update and display wind particles
    for (let particle of windParticles) {
      particle.applyWind(wind); // Apply wind force
      particle.update(); // Update particle position
      particle.display(); // Display particle
      particle.checkEdges(); // Check particle edges
    }

    // Update and display balls
    for (let ball of balls) {
      ball.applyForces(); // Apply forces to ball
      ball.update(); // Update ball position
      ball.display(); // Display ball
      ball.checkEdges(); // Check ball edges
      if (ball == nearestBall) {
        ball.stroke = 5; // Highlight selected ball
      } else {
        ball.stroke = 0; // Default stroke
      }
    }

    // Display information about the selected ball and planet gravity
    noStroke();
    fill(255, 100);
    rect(20, 100, 300, 125);
    textAlign(LEFT);
    textSize(16);
    if (nearestBall != null) {
      ballVel = nearestBall.velocity.mag() / 4; // Calculate ball velocity
    }
    if (balls.length > 0 && ballVel != undefined && nearestBall != null) {
      fill(255);
      text(`Velocity of selected Ball: ${ballVel.toFixed(0)} m/s`, 30, 120);
      text(`Mass of selected Ball: ${nearestBall.mass.toFixed(2)} kg`, 30, 140);
    }
    fill(255);
    text(`Gravity on selected planet: ${planetSelector.value()} m/s²`, 30, 160);

    // Check for collisions between balls
    textAlign(CENTER);
    for (let i = 0; i < balls.length - 1; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        if (
          dist(
            balls[i].position.x,
            balls[i].position.y,
            balls[j].position.x,
            balls[j].position.y
          ) <
          balls[i].r + balls[j].r
        ) {
          balls[i].collision(balls[j]); // Handle collision
        }
      }
    }

    // Draw top information bar
    noStroke();
    fill("yellow");
    rect(0, 0, width, 90);
  }
}

// Change mode based on mouse position on the menu
function changeMode() {
  if (mouseX < width / 2) {
    mode = "planet"; // Switch to planet mode
    blackholePreview.style.display = "none"; // Hide black hole preview
    planetPreview.style.display = "none"; // Hide planet preview
    setup(); // Reinitialize the setup
  } else {
    mode = "blackhole"; // Switch to black hole mode
    blackholePreview.style.display = "none"; // Hide black hole preview
    planetPreview.style.display = "none"; // Hide planet preview
    setup(); // Reinitialize the setup
  }
}

// Handle mouse press events for both modes
function mousePressed() {
  if (mode == "planet") {
    if (mouseButton == LEFT && mouseY > 90 && mouseY < ground[mouseX]) {  
        let mass = float(massSlider.value());
        let radius = mass * 5;
        let ball = new Ball(mouseX, mouseY, radius, mass);
        balls.push(ball); // Add new ball
    } else if (mouseButton == RIGHT) {
      nearestBall = null; // Reset nearest ball
      let minDistance = Infinity;
      for (let ball of balls) {
        let distance = dist(mouseX, mouseY, ball.position.x, ball.position.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearestBall = ball; // Update nearest ball
        }
      }
    }
  } else if (mode == "blackhole" && mouseButton == RIGHT) {
    nearestBall = null; // Reset nearest ball
    let minDistance = Infinity;
    for (let p of particles) {
      let screenPos = screenVector(
        createVector(p.pos.x - width / 2, p.pos.y - height / 2, p.pos.z)
      );
      if (dist(mouseX, mouseY, screenPos.x, screenPos.y) < minDistance) {
        minDistance = max(screenPos.y, mouseY) - min(screenPos.y, mouseY);
        nearestBall = p; // Update nearest ball
      }
    }
  }
}

// Reload the page to return to the homepage
function homepage() {
  location.reload(); // Reload page
}
