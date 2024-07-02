class Ball {
  constructor(x, y, r, m) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, random(-2, 2));
    this.acceleration = createVector(0, 0);
    this.r = r;
    this.mass = m;
    this.frictionCoefficient = 0.005; // Adjust friction coefficient as needed
    this.colour = random(colours);
  }

  applyForces() {
    // Apply gravity towards the ground (downward direction)
    this.acceleration = createVector(0, gravity * 0.1); // Scale gravity for visual effect

    // Apply wind force
    this.acceleration.add(wind.copy().div(8 * this.mass)); // Wind force scaled by mass

    // Apply friction force
    let frictionMagnitude = this.frictionCoefficient * this.mass * gravity;
    let friction = this.velocity
      .copy()
      .normalize()
      .mult(-1)
      .mult(frictionMagnitude);
    this.acceleration.add(friction.div(this.mass));

    // Apply slope force
    let slopeForce = this.calculateSlopeForce();
    this.acceleration.add(slopeForce);
  }

  calculateSlopeForce() {
    let currentY = ground[floor(this.position.x)];
    let nextX = min(floor(this.position.x) + 1, width - 1);
    let nextY = ground[nextX];
    let angle = atan2(nextY - currentY, 1);
    let slopeForceMagnitude = gravity * sin(angle);
    let slopeForce = createVector(0.01 * slopeForceMagnitude, 0).rotate(angle);
    return slopeForce;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  display() {
    noStroke();
    fill(this.colour);
    ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
  }

  checkEdges() {
    // Check for collision with the ground
    if (this.position.y + this.r > ground[floor(this.position.x)]) {
      this.position.y = ground[floor(this.position.x)] - this.r;
      this.velocity.y *= -0.8;
    } else if (this.position.y < this.r + 90) {
      let index = balls.indexOf(this);
      balls.splice(index, 1);
    }
    // Check for collision with the window edges
    if (this.position.x + this.r > width) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    } else if (this.position.x - this.r < 0) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    }
  }

  collision(other) {
    let impactVector = p5.Vector.sub(other.position, this.position);
    let d = impactVector.mag();
    if (d < this.r + other.r) {
      // Push the particles out so that they are not overlapping
      let overlap = d - (this.r + other.r);
      let dir = impactVector.copy();
      dir.setMag(overlap * 0.5);
      this.position.add(dir);
      other.position.sub(dir);

      // Correct the distance!
      d = this.r + other.r;
      impactVector.setMag(d);

      let mSum = this.mass + other.mass;
      let vDiff = p5.Vector.sub(other.velocity, this.velocity);
      // Particle A (this)
      let num = vDiff.dot(impactVector);
      let den = mSum * d * d;
      let deltaVA = impactVector.copy();
      deltaVA.mult((2 * other.mass * num) / den);
      this.velocity.add(deltaVA);
      // Particle B (other)
      let deltaVB = impactVector.copy();
      deltaVB.mult((-2 * this.mass * num) / den);
      other.velocity.add(deltaVB);
      this.velocity.mult(elasticity);
      other.velocity.mult(elasticity);
    }
  }
}
