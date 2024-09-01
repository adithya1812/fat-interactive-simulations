class WindParticle {
  constructor() {
    // Initialize particle's position, velocity, and size
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.size = random(5, 10); // Random size between 5 and 10
  }

  // Apply the wind vector to the particle's velocity
  applyWind(wind) {
    this.velocity = wind.copy(); // Set velocity to the provided wind vector
  }

  // Update the particle's position based on its velocity
  update() {
    this.position.add(this.velocity); // Add velocity to position
  }

  // Display the particle on the canvas
  display() {
    if (windSlider.value() != 0) { // Check if wind is active
      stroke(127); // Set stroke color to a greyish tone
      strokeWeight(2); // Set stroke weight for visibility
      // Draw a line representing the particle's movement direction
      line(
        this.position.x,
        this.position.y,
        this.position.x - this.velocity.x * 5,
        this.position.y - this.velocity.y * 5
      );
    }
  }

  // Wrap the particle around the edges of the canvas
  checkEdges() {
    if (this.position.x > width) this.position.x = 0; // Wrap around the right edge
    if (this.position.x < 0) this.position.x = width; // Wrap around the left edge
    if (this.position.y > height) this.position.y = 0; // Wrap around the bottom edge
    if (this.position.y < 0) this.position.y = height; // Wrap around the top edge
  }
}
