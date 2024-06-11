class Blackhole {
  constructor(x, y, m) {
    this.pos = createVector(x, y, 100);
    this.mass = m;
    this.rs = (2 * G * this.mass) / (c * c);
    this.accretion = this.rs;
  }

  pull(photon) {
    const force = p5.Vector.sub(this.pos, photon.pos);
    const theta = force.heading();
    const r = force.mag();
    const fg = (G * this.mass) / (r * r);
    let deltaTheta = -fg * (dt / c) * sin(photon.theta - theta);
    if (!photon.stopped) {
      deltaTheta /= abs(1.0 - (2.0 * G * this.mass) / (r * c * c));
      photon.theta += deltaTheta;
      photon.vel = p5.Vector.fromAngle(photon.theta);
      photon.vel.setMag(c);
      const deltaV = photon.vel.copy();
      deltaV.mult(dt);
      photon.pos.add(deltaV); // Update position based on velocity

      // Add force effect on z axis
      let deltaZ = (force.z / r) * fg * dt * 10;
      photon.pos.z += deltaZ;
    }

    if (r + 5 <= this.rs) {
      photon.stopped = true;
      photon.vel.mult(0); // Ensure velocity is zero when stopped
      this.accretion += 0.01;
      photon.history.splice(0, 3);
    }
  }

  check(star) {
    let d = p5.Vector.sub(this.pos, star.pos).mag();
    if (d <= this.rs) {
      let index = stars.indexOf(star);
      stars.splice(index, 1);
    }
  }

  show() {
    noStroke();
    push();
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z);
    texture(textureImg);
    torus(this.accretion, this.accretion * 0.25, 50, 50); // Accretion disk size
    push();
    rotateY(frameCount * 0.01); // Rotate the disk around the Z-axis
    ellipsoid(this.accretion * 3, this.accretion * 0.3);
    pop();
    pop();
    push();
    fill(0);
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z);
    sphere(this.rs, 50, 50);
    pop();
  }
}
