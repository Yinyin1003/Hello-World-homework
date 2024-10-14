let img; // Declare image variable
let scaleFactor; // Scaling factor
let pixelSize = 10; // Controls the size of the pixel block, the larger the value, the more pixelated the effect

function preload() {
  img = loadImage('images/jellycat.jpeg'); // Load the image (replace with your image path)
}

function setup() {
  let imgAspectRatio = img.width / img.height; // Calculate the aspect ratio of the image
  let screenAspectRatio = windowWidth / windowHeight; // Calculate the aspect ratio of the screen

  // Determine scaling factor based on the aspect ratio of the image and screen
  if (imgAspectRatio > screenAspectRatio) {
    scaleFactor = windowWidth / img.width; // Scale based on the screen width
  } else {
    scaleFactor = windowHeight / img.height; // Scale based on the screen height
  }

  let newWidth = img.width * scaleFactor;
  let newHeight = img.height * scaleFactor;

  createCanvas(newWidth, newHeight); // Create canvas based on the scaled image size
  img.resize(newWidth, newHeight); // Resize the image to fit the screen

  img.loadPixels(); // Load pixel data from the image
  noLoop(); // Draw only once
}

function draw() {
  background(255); // Set white background

  // Use double loops to iterate through each pixel block in the image
  for (let y = 0; y < img.height; y += pixelSize) {
    for (let x = 0; x < img.width; x += pixelSize) {
      // Calculate the index in the pixel array
      let index = (x + y * img.width) * 4;
      
      // Get the RGB values of the pixel
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Set the fill color
      fill(r, g, b);
      noStroke();

      // Draw the pixel block (use a rectangle to represent the pixel)
      rect(x, y, pixelSize, pixelSize);
    }
  }
}

function windowResized() {
  // When the window is resized, adjust the canvas and image size accordingly
  setup(); // Re-run the setup function to fit the new window size
}
