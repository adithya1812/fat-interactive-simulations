// Class representing a photon in the simulation
class Photon {
  // Constructor initializes the photon with position, velocity, and direction
  constructor(x, y, direction) {
    // Set the z-position randomly within a range around the black hole's radius
    let z = random(100 - blackHole.rs, 100 + blackHole.rs);
    this.pos = createVector(x, y, z); // Position of the photon
    this.vel = p5.Vector.fromAngle(direction); // Set the velocity direction based on input angle
    this.vel.setMag(c); // Set the speed of the photon to the speed of light
    this.history = []; // Array to store the photon’s path
    this.stopped = false; // Flag to indicate if the photon has stopped
    this.theta = direction; // Initial direction of the photon
  }

  // Method to update the photon’s position
  update() {
    if (!this.stopped) { // If the photon is not stopped
      this.history.push(this.pos.copy()); // Save the current position in history
      const deltaV = this.vel.copy(); // Create a copy of the velocity
      deltaV.mult(dt); // Scale the velocity by the time step
      this.pos.add(deltaV); // Update the photon’s position
    }

    // Remove the oldest position from history if there are more than 50
    if (this.history.length > 50) {
      this.history.splice(0, 1);
    } else if (this.history.length == 0 && this.stopped) {
      // If the photon has stopped and has no history, remove it from particles array
      let index = particles.indexOf(this);
      particles.splice(index, 1);
    }

    // Remove the photon if it goes out of bounds
    if (
      this.pos.x > 2.5 * width ||
      this.pos.x < -2.5 * width ||
      this.pos.y > 2.5 * height ||
      this.pos.y < -2.5 * height
    ) {
      let index = particles.indexOf(this);
      particles.splice(index, 1);
    }
  }

  // Method to render the photon
  show() {
    stroke(255, 0, 0); // Set stroke color to red
    strokeWeight(2); // Set stroke weight
    noFill(); // Disable filling
    if (this == nearestBall) { // If this photon is the nearest one
      stroke(255); // Change stroke color to white
      strokeWeight(5); // Increase stroke weight
    }
    beginShape(); // Begin drawing the shape
    for (let v of this.history) {
      vertex(v.x - width / 2, v.y - height / 2, v.z); // Draw each position in the history
    }
    endShape(); // End drawing the shape
    push(); // Save the current transformation matrix
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z); // Move to the photon’s current position
    sphere(2); // Draw the photon as a small sphere
    pop(); // Restore the previous transformation matrix
  }
}
