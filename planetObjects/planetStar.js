class Star {
  constructor() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.z = random(width);
    this.pz = this.z;
    this.size = random(5, 20);
  }
  updateZ() {
    if (
      (starfieldForward == true && spaceMode != 2) ||
      (starfieldForward == true && starfieldMove == true)
    ) {
      this.z -= scrollSpeed;
    } else if (
      (starfieldForward == false && spaceMode != 2) ||
      (starfieldForward == false && starfieldMove == true)
    ) {
      this.z += scrollSpeed;
    } else if (spaceMode == 2) {
      this.z -= 3;
    }
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

  updateXY() {
    this.x = this.x + mouseSpeedX;
    this.y = this.y + mouseSpeedY;
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

  show() {
    fill(255);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, this.size, 0);
    let px = map(this.x / this.pz, 0, 1, 0, width);
    let py = map(this.y / this.pz, 0, 1, 0, height);
    this.pz = this.z;
    if (starfieldMove == true || starfieldArrow == true) {
      stroke(255);
      strokeWeight(r);
      line(px, py, sx, sy);
    } else {
      fill(255);
      circle(sx, sy, r);
    }
  }
}
