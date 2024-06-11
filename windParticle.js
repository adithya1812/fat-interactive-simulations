class WindParticle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.size = random(5, 10);
  }

  applyWind(wind) {
    this.velocity = wind.copy();
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    if (windSlider.value() != 0) {
      stroke(127);
      strokeWeight(2);
      line(
        this.position.x,
        this.position.y,
        this.position.x - this.velocity.x * 5,
        this.position.y - this.velocity.y * 5
      );
    }
  }

  checkEdges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }
}
