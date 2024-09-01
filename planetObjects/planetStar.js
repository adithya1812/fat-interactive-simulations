class Star {
  constructor() {
    // Initialize star's position, depth (z), previous depth (pz), and size
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.z = random(width);
    this.pz = this.z; // Previous depth for drawing lines
    this.size = random(5, 20); // Size of the star
  }

  // Update the z position of the star based on the current scrolling or movement mode
  updateZ() {
    if (
      (starfieldForward == true && spaceMode != 2) ||
      (starfieldForward == true && starfieldMove == true)
    ) {
      // Move star forward in the z direction
      this.z -= scrollSpeed;
    } else if (
      (starfieldForward == false && spaceMode != 2) ||
      (starfieldForward == false && starfieldMove == true)
    ) {
      // Move star backward in the z direction
      this.z += scrollSpeed;
    } else if (spaceMode == 2) {
      // Special mode for adjusting star's z position
      this.z -= 3;
    }
    // Reset star position when it goes out of bounds in z direction
    if (this.z < 0) {
      this.z = width;
      this.x = random(-width / 2, width / 2);
      this.y = random(-height / 2, height / 2);
      this.pz = this.z;
    }
    if (this.z > width) {
      this.z = 1;
      this.x = random(-width / 2, width / 2);
      this.y = random(-height / 2, height / 2);
      this.pz = this.z;
    }
  }

  // Update the x and y position of the star based on mouse speed
  updateXY() {
    this.x = this.x + mouseSpeedX;
    this.y = this.y + mouseSpeedY;
    // Reset star position when it goes out of bounds in x or y direction
    if (this.x > width / 2) {
      this.x = -width / 2;
      this.y = random(-height / 2, height / 2);
      this.z = random(width);
    } else if (this.x < -width / 2) {
      this.x = width / 2;
      this.y = random(-height / 2, height / 2);
      this.z = random(width);
    } else if (this.y < -height / 2) {
      this.x = random(-width / 2, width / 2);
      this.y = height / 2;
      this.z = random(width);
    } else if (this.y > height / 2) {
      this.x = random(-width / 2, width / 2);
      this.y = -height / 2;
      this.z = random(width);
    }
  }

  // Display the star on the canvas
  show() {
    fill(255); // Set the fill color to white
    noStroke(); // Disable stroke
    // Map star's x, y, and z coordinates to screen coordinates
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, this.size, 0); // Size based on depth
    let px = map(this.x / this.pz, 0, 1, 0, width);
    let py = map(this.y / this.pz, 0, 1, 0, height);
    this.pz = this.z; // Update previous depth
    // Draw a line if the starfield is moving or an arrow key is pressed, otherwise draw a circle
    if (starfieldMove == true || starfieldArrow == true) {
      stroke(255); // Set stroke color to white
      strokeWeight(r); // Set stroke weight based on star size
      line(px, py, sx, sy); // Draw a line from previous position to current position
    } else {
      fill(255); // Set fill color to white
      circle(sx, sy, r); // Draw a circle representing the star
    }
  }
}
