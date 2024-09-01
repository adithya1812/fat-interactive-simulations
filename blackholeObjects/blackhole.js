// Class representing a Black Hole in the simulation
class Blackhole {
  // Constructor initializes the black hole with position, mass, and calculates its Schwarzschild radius
  constructor(x, y, m) {
    this.pos = createVector(x, y, 100); // Position of the black hole
    this.mass = m; // Mass of the black hole
    // Schwarzschild radius calculation: rs = 2 * G * mass / c^2
    this.rs = (2 * G * this.mass) / (c * c);
    this.accretion = this.rs; // Accretion disk radius, initially equal to Schwarzschild radius
  }

  // Method to apply gravitational pull on a photon
  pull(photon) {
    // Compute the gravitational force vector and its direction
    const force = p5.Vector.sub(this.pos, photon.pos);
    const theta = force.heading();
    const r = force.mag(); // Distance from the photon to the black hole
    const fg = (G * this.mass) / (r * r); // Gravitational force magnitude

    // Compute the change in angle due to gravity
    let deltaTheta = -fg * (dt / c) * sin(photon.theta - theta);
    if (!photon.stopped) {
      // Adjust the change in angle considering relativistic effects
      deltaTheta /= abs(1.0 - (2.0 * G * this.mass) / (r * c * c));
      photon.theta += deltaTheta; // Update photon's direction
      photon.vel = p5.Vector.fromAngle(photon.theta); // Update photon's velocity vector
      photon.vel.setMag(c); // Set velocity magnitude to speed of light

      // Update photon position based on its velocity
      const deltaV = photon.vel.copy();
      deltaV.mult(dt);
      photon.pos.add(deltaV);

      // Add force effect on the z-axis to simulate gravitational pull in 3D
      let deltaZ = (force.z / r) * fg * dt * 10;
      photon.pos.z += deltaZ;
    }

    // Check if photon crosses the event horizon
    if (r + 5 <= this.rs) {
      photon.stopped = true; // Stop the photon
      photon.vel.mult(0); // Set photon's velocity to zero
      this.accretion += 0.01; // Increase the accretion disk size
      photon.history.splice(0, 3); // Clear photon history
    }
  }

  // Method to check if a star is within the event horizon
  check(star) {
    let d = p5.Vector.sub(this.pos, star.pos).mag(); // Distance from star to black hole
    if (d <= this.rs) {
      // Remove star from the list if it's inside the event horizon
      let index = stars.indexOf(star);
      stars.splice(index, 1);
    }
  }

  // Method to render the black hole on the canvas
  show() {
    noStroke(); // Disable stroke for shapes
    push(); // Save the current drawing style settings and transformations
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z); // Move origin to black hole position
    texture(textureImg); // Set texture for accretion disk
    torus(this.accretion, this.accretion * 0.25, 50, 50); // Draw the accretion disk
    push();
    rotateY(frameCount * 0.01); // Rotate the disk for animation
    ellipsoid(this.accretion * 3, this.accretion * 0.3); // Draw the main black hole
    pop();
    pop();
    push();
    fill(0); // Set fill color to black
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z); // Move origin to black hole position
    sphere(this.rs, 50, 50); // Draw the event horizon as a sphere
    pop();
  }

  // Method to calculate the distance from a particle to the event horizon
  distanceToEventHorizon(particle) {
    let d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y); // Distance between particle and black hole
    return d - this.rs; // Return distance from particle to event horizon
  }
}
