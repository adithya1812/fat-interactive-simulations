// Class representing a star in the black hole simulation
class bhStar {
  // Constructor initializes the star's position, size, texture, and rotation properties
  constructor() {
    // Randomly position the star within the canvas boundaries
    this.pos = createVector(
      random(-width, width),
      random(-height, height),
      random(-width, width)
    );
    // Randomly assign a size between 1 and 5
    this.size = random(1, 5);
    // Randomly select a texture from the array of star images
    this.textures = random(starImgs);
    // Randomly assign rotation rates for each axis
    this.xRotate = random(0.05);
    this.yRotate = random(0.05);
    this.zRotate = random(0.05);
    // Randomly select a direction for rotation (1 for X, 2 for Y, 3 for Z)
    this.spinDir = random([1, 2, 3]);
  }

  // Method to render the star on the canvas
  show() {
    noStroke(); // Disable stroke for shapes
    // Map the star's 3D position to 2D screen coordinates
    let x = map(this.pos.x / this.pos.z, 0, 1, 0, width);
    let y = map(this.pos.y / this.pos.z, 0, 1, 0, height);
    push(); // Save the current drawing style settings and transformations
    translate(x - width / 2, y - height / 2, this.pos.z); // Move origin to star's position
    
    // Rotate the star based on its rotation direction
    if (this.spinDir == 1) {
      rotateX(this.xRotate * frameCount); // Rotate around X-axis
    } else if (this.spinDir == 2) {
      rotateY(this.yRotate * frameCount); // Rotate around Y-axis
    } else {
      rotateZ(this.zRotate * frameCount); // Rotate around Z-axis
    }
    
    texture(this.textures); // Set the star's texture
    sphere(this.size); // Draw the star as a sphere
    lights(lights()); // Apply lighting to the scene
    pop(); // Restore the previous drawing style settings and transformations
  }
}
