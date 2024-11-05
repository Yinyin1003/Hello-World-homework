// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/POrpyhHhm/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let lastLabel = ""; // 记录上一次的标签

// Images and sounds
let dogImage, yellowImage;
let goodSound, badSound;

// Load the model and assets first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  dogImage = loadImage('my/dog.png');     // 替换为狗的图片文件路径
  yellowImage = loadImage('my/yellow.png'); // 替换为黄色的图片文件路径
  goodSound = loadSound('my/good.mp3');    // 替换为 good 声音文件路径
  badSound = loadSound('my/bad.mp3');      // 替换为 bad 声音文件路径
}

function setup() {
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Check label and display the corresponding image and sound
  if (label === "dog") {
    image(dogImage, 80, 50, 160, 120);  // 显示较小的狗的图片
    if (label !== lastLabel) {  // 只有当标签改变时播放声音
      goodSound.play();
    }
  } else if (label === "yellow") {
    image(yellowImage, 100, 50, 120, 100);  // 显示较小的黄色图片
    if (label !== lastLabel) {  // 只有当标签改变时播放声音
      badSound.play();
    }
  }

  // Update lastLabel to the current label
  lastLabel = label;

  // Draw the label text
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  // Classify again
  classifyVideo();
}
