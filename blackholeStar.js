class bhStar {
  constructor() {
    this.pos = createVector(
      random(-width, width),
      random(-height, height),
      random(-width, width)
    );
    this.size = random(1, 5);
    this.textures = random(starImgs);
    this.xRotate = random(0.05);
    this.yRotate = random(0.05);
    this.zRotate = random(0.05);
    this.spinDir = random([1, 2, 3]);
  }

  show() {
    noStroke();
    let x = map(this.pos.x / this.pos.z, 0, 1, 0, width);
    let y = map(this.pos.y / this.pos.z, 0, 1, 0, height);
    push();
    translate(x - width / 2, y - height / 2, this.pos.z);
    if (this.spinDir == 1) {
      rotateX(this.xRotate * frameCount);
    } else if (this.spinDir == 2) {
      rotateY(this.yRotate * frameCount);
    } else {
      rotateZ(this.zRotate * frameCount);
    }
    texture(this.textures);
    sphere(this.size);
    lights(lights());
    pop();
  }
}
