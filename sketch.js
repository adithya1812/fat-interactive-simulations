let mode = "menu";
let logo;
let planetPreview;
let blackholePreview;
let homeBtn;

let c = 30;
let G = 3.54;
let dt = 0.1;

let blackHole;
let blackholeSelect;
let directionSelect;
let direction;
let particles = [];

let bhStars = [];
let numStars;
let textureImg;
let starImgs = [];

let emittingPhotons = true;
let startStopBtn;
let cam;

let balls = [];
let gravity;

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

let wind;
let ground = [];
let groundColour = "#008000";
let gradient;
let noiseScale; // Adjust this value for ground roughness
let colours = [
  "cyan",
  "lime",
  "pink",
  "orange",
  "#057DFF",
  "#FE0000",
  "#FEE892",
  "#F6FCFF",
]; // Array of colors for balls
let elasticity = 1;
let windParticles = [];

let stars = [];
let spaceMode;
let scrollSpeedX, scrollSpeedY, scrollSpeed;
let mouseSpeedX, mouseSpeedY;
let scrolledMillis = 0;
let starfieldMove = false;
let starfieldArrow = false;
let starfieldForward = true;
let ir = 0.5;

function preload() {
  logo = loadImage("Images/fat.jpg");
  planetPreview = document.getElementById("planetPreview");
  blackholePreview = document.getElementById("blackholePreview");
  textureImg = loadImage("Images/texture.jpg");
  starImgs = [
    loadImage("Images/sun.jpg"),
    loadImage("Images/blue.jpg"),
    loadImage("Images/white.jpg"),
  ];
  homeBtn = document.getElementById("homeBtn");
  startStopBtn = select("#startStopBtn");
  numStars = constrain(round(0.001 * windowWidth * windowHeight), 100, 800);
  blackholeSelect = document.getElementById("blackholeSelect");
  directionSelect = document.getElementById("directionSelect");
  direction = float(directionSelect.value);
  planetSelector = select("#planet");
  planetSelector.changed(updateGravity);
  massSlider = select("#massSlider");
  massSlider.input(updateMassValue);
  massValueDisplay = select("#massValue");
  windDirectionSelector = select("#windDirection");
  windDirectionSelector.input(updateWind);
  windSlider = select("#windSlider");
  windSlider.input(updateWind);
  windValueDisplay = select("#windValue");
  elasticitySlider = select("#elasticitySlider");
  elasticitySlider.input(updateElasticity);
  elasticityValueDisplay = select("#elasticityValue");
  landscapeTypeCheckbox = select("#landscapeType");
  landscapeTypeCheckbox.changed(updateLandscape);
  noiseLabel = select("#noiseLabel");
  noiseSlider = select("#noiseSlider");
  noiseSlider.input(updateLandscape);
}

function setup() {
  if (mode == "menu") {
    createCanvas(windowWidth, windowHeight);
    blackholePreview.style.left = width / 2 + 62 + "px";
    planetPreview.style.left = width / 2 - 598 + "px";
    homeBtn.style.display = "none";
  } else if (mode == "blackhole") {
    createCanvas(windowWidth, windowHeight, WEBGL);
    blackHole = new Blackhole(width / 2, height / 2, 7220);
    for (let i = 0; i < numStars; i++) {
      bhStars[i] = new bhStar();
    }
    blackholeSelect.style.display = "inline-block";
    directionSelect.style.display = "inline-block";
    startStopBtn.show();
    document.getElementById("photonWaveBtn").style.display = "inline-block";
    document.getElementById("clearBtn").style.display = "inline-block";
    homeBtn.style.display = "inline-block";
    homeBtn.style.fontSize = "14px";
    homeBtn.style.top = "160px";
    homeBtn.style.left = "10px";
    homeBtn.style.width = "80px";
    cam = createEasyCam();
    cam.setRotationScale(0.0006);
    cam.setDistanceMax(3000);
    cam.setDistanceMin(100);
  } else if (mode == "planet") {
    createCanvas(windowWidth, windowHeight);
    wind = createVector(0, 0);
    noiseScale = float(noiseSlider.value());
    gravity = float(planetSelector.value());
    elasticity = float(elasticitySlider.value());
    // Generate the ground based on checkbox state
    updateGravity();
    // Initialize wind particles
    spaceMode = round(random(1, 2));
    for (let i = 0; i < 25; i++) {
      windParticles.push(new WindParticle());
    }
    for (let i = 0; i < round(0.5 * windowWidth); i++) {
      stars[i] = new Star();
    }
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
    homeBtn.style.display = "inline-block";
    homeBtn.style.fontSize = "20px";
    homeBtn.style.top = "30px";
    homeBtn.style.right = "30px";
    homeBtn.style.width = "100px";
  }
}

function draw() {
  if (mode == "menu") {
    background(43, 44, 41);
    imageMode(CENTER);
    image(logo, width / 2, 125, 400, 400);
    textAlign(CENTER);
    fill(255);
    textSize(24);
    textFont("Georgia");
    text("Planet Simulator", width / 2 - 330, 700);
    text("Black Hole Simulator", width / 2 + 330, 700);
  } else if (mode == "blackhole") {
    background(0);
    lights(lights());
    orbitControl(1, 1, 1, { freeRotation: true });
    for (let p of particles) {
      blackHole.pull(p);
      p.update();
      p.show();
    }
    blackHole.show();
    for (let i = 0; i < bhStars.length; i++) {
      bhStars[i].show();
      blackHole.check(bhStars[i]);
    }
  } else if (mode == "planet") {
    if (landscapeTypeCheckbox.checked()) {
      noiseLabel.show();
      noiseSlider.show();
    } else {
      noiseLabel.hide();
      noiseSlider.hide();
    }
    background(0);
    if (spaceMode == 2) {
      translate(
        map(mouseX, 0, width, 0.5 + ir, 0.5 - ir) * width,
        map(mouseY, 0, height, 0.5 + ir, 0.5 - ir) * height
      );
    } else {
      translate(width / 2, height / 2);
    }
    scrollSpeedX = map(mouseX, 0, width, 0, 35);
    scrollSpeedY = map(mouseY, 0, height, 0, 35);
    scrollSpeed = sqrt(
      scrollSpeedX * scrollSpeedX + scrollSpeedY * scrollSpeedY
    );
    mouseSpeedX = map(width / 2 - mouseX, 0, width, 0, 15);
    mouseSpeedY = map(height / 2 - mouseY, 0, height, 0, 15);
    for (let i = 0; i < stars.length; i++) {
      stars[i].show();
      if (starfieldMove == true || starfieldArrow == true || spaceMode == 2) {
        stars[i].updateZ();
      } else if (spaceMode == 1) {
        stars[i].updateXY();
      }
    }
    if (starfieldMove == true && millis() - scrolledMillis >= 250) {
      starfieldMove = false;
    }
    if (spaceMode == 2) {
      translate(
        -map(mouseX, 0, width, 0.5 + ir, 0.5 - ir) * width,
        -map(mouseY, 0, height, 0.5 + ir, 0.5 - ir) * height
      );
    } else {
      translate(-width / 2, -height / 2);
    }
    if (balls.length == 0 && scrolledMillis == 0 && windSlider.value() == 0) {
      textAlign(CENTER);
      noStroke();
      textSize(20);
      fill("white");
      text(
        `Click to spawn balls at the mouse position, \n and scroll your mouse or press the up and down arrows for a cool effect!`,
        width / 2,
        height / 2
      );
    }
    // Display ground
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
      particle.applyWind(wind);
      particle.update();
      particle.display();
      particle.checkEdges();
    }

    // Update and display all balls
    for (let ball of balls) {
      ball.applyForces();
      ball.update();
      ball.display();
      ball.checkEdges();
    }
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
          balls[i].collision(balls[j]);
        }
      }
    }
    noStroke();
    fill("yellow");
    rect(0, 0, width, 90);
  }
}

function changeMode() {
  if (mouseX < width / 2) {
    mode = "planet";
    blackholePreview.style.display = "none";
    planetPreview.style.display = "none";
    setup();
  } else {
    mode = "blackhole";
    blackholePreview.style.display = "none";
    planetPreview.style.display = "none";
    setup();
  }
}

function homepage() {
  location.reload();
}
