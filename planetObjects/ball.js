class Ball {
  constructor(x, y, r, m) {
    this.position = createVector(x, y); // Ball's position
    this.velocity = createVector(0, 0); // Ball's velocity
    this.acceleration = createVector(0, 0); // Ball's acceleration
    this.r = r; // Ball's radius
    this.mass = m; // Ball's mass
    this.frictionCoefficient = 0.005; // Friction coefficient
    this.colour = random(colours); // Random color for the ball
    this.stroke = 0; // Stroke weight for drawing the ball
  }

  // Apply forces to the ball, including gravity, wind, and friction
  applyForces() {
    // Apply gravity
    this.acceleration = createVector(0, gravity * 0.1 * this.mass / 5);
    // Apply wind force
    this.acceleration.add(wind.copy().div(8 * this.mass));
    // Calculate and apply friction
    let frictionMagnitude = this.frictionCoefficient * this.mass * gravity;
    let friction = this.velocity
      .copy()
      .normalize()
      .mult(-1)
      .mult(frictionMagnitude);
    this.acceleration.add(friction.div(this.mass));
    // Calculate and apply slope force
    let slopeForce = this.calculateSlopeForce();
    this.acceleration.add(slopeForce);
  }

  // Calculate the force exerted by a slope
  calculateSlopeForce() {
    let currentY = ground[floor(this.position.x)];
    let nextX = min(floor(this.position.x) + 1, width - 1);
    let nextY = ground[nextX];
    let angle = atan2(nextY - currentY, 1); // Calculate slope angle
    let slopeForceMagnitude = gravity * sin(angle); // Calculate slope force magnitude
    let slopeForce = createVector(0.001 * slopeForceMagnitude, 0).rotate(angle); // Create force vector
    return slopeForce;
  }

  // Update the ball's position and velocity based on acceleration
  update() {
    this.velocity.add(this.acceleration); // Update velocity
    this.position.add(this.velocity); // Update position
  }

  // Draw the ball on the canvas
  display() {
    stroke(255); // Set stroke color
    strokeWeight(this.stroke); // Set stroke weight
    fill(this.colour); // Set fill color
    ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2); // Draw ellipse
  }

  // Check for and handle collisions with edges or other balls
  checkEdges() {
    // Handle collision with the ground
    if (this.position.y + this.r > ground[floor(this.position.x)]) {
      this.position.y = ground[floor(this.position.x)] - this.r; // Adjust position
      this.velocity.y *= -0.8; // Reverse and dampen vertical velocity
    } else if (this.position.y < this.r + 90) {
      // Remove ball if it goes off-screen at the top
      let index = balls.indexOf(this);
      balls.splice(index, 1);
    }
    // Handle collision with canvas edges
    if (this.position.x + this.r > width) {
      this.position.x = width - this.r; // Adjust position
      this.velocity.x *= -1; // Reverse horizontal velocity
    } else if (this.position.x - this.r < 0) {
      this.position.x = this.r; // Adjust position
      this.velocity.x *= -1; // Reverse horizontal velocity
    }
  }

  // Handle collisions with another ball
  collision(other) {
    let impactVector = p5.Vector.sub(other.position, this.position); // Vector from this ball to the other ball
    let d = impactVector.mag(); // Distance between balls
    if (d < this.r + other.r) {
      // Push the balls out to avoid overlap
      let overlap = d - (this.r + other.r);
      let dir = impactVector.copy();
      dir.setMag(overlap * 0.5);
      this.position.add(dir); // Move this ball
      other.position.sub(dir); // Move the other ball

      // Correct the distance for collision response
      d = this.r + other.r;
      impactVector.setMag(d);

      // Calculate new velocities
      let mSum = this.mass + other.mass;
      let vDiff = p5.Vector.sub(other.velocity, this.velocity);
      // For this ball (A)
      let num = vDiff.dot(impactVector);
      let den = mSum * d * d;
      let deltaVA = impactVector.copy();
      deltaVA.mult((2 * other.mass * num) / den);
      this.velocity.add(deltaVA);
      // For the other ball (B)
      let deltaVB = impactVector.copy();
      deltaVB.mult((-2 * this.mass * num) / den);
      other.velocity.add(deltaVB);
      // Apply elasticity to velocities
      this.velocity.mult(elasticity);
      other.velocity.mult(elasticity);
    }
  }
}
