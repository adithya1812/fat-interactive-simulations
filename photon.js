class Photon {
  constructor(x, y, direction) {
    let z = random(100 - blackHole.rs, 100 + blackHole.rs);
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.fromAngle(direction);
    this.vel.setMag(c);
    this.history = [];
    this.stopped = false;
    this.theta = direction;
  }

  update() {
    if (this.stopped == false) {
      this.history.push(this.pos.copy());
      const deltaV = this.vel.copy();
      deltaV.mult(dt);
      this.pos.add(deltaV);
    }

    if (this.history.length > 50) {
      this.history.splice(0, 1);
    } else if (this.history.length == 0 && this.stopped) {
      let index = particles.indexOf(this);
      particles.splice(index, 1);
    }

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

  show() {
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let v of this.history) {
      vertex(v.x - width / 2, v.y - height / 2, v.z);
    }
    endShape();
    push();
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z);
    sphere(2);
    pop();
  }
}
