let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let mouthOpen = 0; // Variable to store open/close status

let seaImg, bigFishImg, smallFishImg, starImg, shanhuImg, breadImg, weedsImg, bugImg, winImg, shrimpImg, bagImg, glassImg, webImg, poisonImg, lightningImg, snowImg, gogofishImg;
let bigFishX = 0, bigFishY = 0;
let bigFishSpeed = 3;  
let bigFishBaseSpeed = 3;
let bigFishDirection = 1;
let bigFishRotation = 0;
let smallFishX = 0, smallFishY = 0;
let smallFishAngle = 0;
let smallFishSpeed = 2;
let energy = 10;
let items = [];
let gamestart = false;
let gameOver = false;
let gameWon = false;
let startImg, restartImg, gameoverImg;
let freezeTimer = 0;
let speedBoostTimer = 0;
let gogoFishSound, backgroundMusic, bubblesSound, badSound, goodSound, loseSound, winSound;
let loseSoundPlayed = false;
let winSoundPlayed = false;

function preload() {
  faceMesh = ml5.faceMesh(options); // Load the faceMesh model
  
  seaImg = loadImage('images/sea.png');
  bigFishImg = loadImage('images/bigfish.png');
  smallFishImg = loadImage('images/smallfish.png');
  breadImg = loadImage('images/bread.png');
  weedsImg = loadImage('images/weeds.png');
  bugImg = loadImage('images/bug.png');
  shrimpImg = loadImage('images/shrimp.png');
  bagImg = loadImage('images/bag.png');
  glassImg = loadImage('images/glass.png');
  webImg = loadImage('images/web.png');
  poisonImg = loadImage('images/poison.png');
  lightningImg = loadImage('images/lightning.png');
  snowImg = loadImage('images/snow.png');
  gogofishImg = loadImage('images/Go Go Fish.png');
  startImg = loadImage('images/starto.png');
  restartImg = loadImage('images/restarto.png');
  gameoverImg = loadImage('images/Game Over.png')
  gogoFishSound = loadSound('audio/gogo fish.mp3')
  backgroundMusic = loadSound('audio/music.mp3')
  bubblesSound = loadSound('audio/bubbles.mp3')
  badSound = loadSound('audio/bad.mp3')
  goodSound = loadSound('audio/good.mp3')
  loseSound = loadSound('audio/lose.mp3')
  winSound = loadSound('audio/win.mp3');
  winImg= loadImage('images/win.png')
  starImg= loadImage('images/star.png')
  shanhuImg= loadImage('images/shanhu.png')
}

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces); // Start face detection

  bigFishX = 0;
  bigFishY = random(height - 150);
  smallFishX = random(width);
  smallFishY = height * 3 / 4;
  generateItems();
  backgroundMusic.loop();
}

function draw() {
  image(video, 0, 0, 200, 150); // Display a small preview of the camera feed

  if (!gamestart) {
    drawStartScreen();
  } else if (gameOver) {
    drawGameOverScreen();
  } else if (gameWon) {
    drawWonScreen();
  } else {
    playGame();
  }

  checkMouthStatus();
}

function checkMouthStatus() {
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let mouthDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
    let threshold = 10;

    if (mouthDistance > threshold) {
      if (mouthOpen === 0) {
        bigFishDirection *= -1; // Change direction on mouth open
        mouthOpen = 1;
      }
    } else {
      mouthOpen = 0; // Set to closed when distance is below threshold
    }
  }
}

function gotFaces(results) {
  faces = results;
}

function drawStartScreen() {
  image(seaImg, 0, 0, width, height);
  bigFishX += 2;
  if (bigFishX > width + 150) {
    bigFishX = -300;
  }
  push();
  translate(bigFishX + 150, bigFishY + 75);
  scale(-bigFishDirection, 1);
  imageMode(CENTER);
  image(bigFishImg, 0, -50, 300, 150);
  pop();
  image(gogofishImg, bigFishX - 300, bigFishY - 20, 257, 50);
  image(startImg, width / 2 - 60, height / 2 + 30, 120, 60);
}

function playGame() {
  image(seaImg, 0, 0, width, height);
  if (freezeTimer > 0) {
    freezeTimer--;
    bigFishSpeed = 0;
  } else {
    bigFishSpeed = bigFishBaseSpeed;
  }
  if (speedBoostTimer > 0) {
    speedBoostTimer--;
    bigFishSpeed = bigFishBaseSpeed * 1.5;
  }
  bigFishX -= bigFishSpeed * bigFishDirection;
  if (bigFishX > width) {
    bigFishX = -300;
    bigFishY = random(height - 150);
  } else if (bigFishX < -300) {
    bigFishX = width;
    bigFishY = random(height - 150);
  }
  push();
  translate(bigFishX + 150, bigFishY + 75);
  scale(bigFishDirection, 1);
  imageMode(CENTER);
  image(bigFishImg, 0, 0, 300, 150);
  pop();
  moveSmallFish();
  push();
  translate(smallFishX, smallFishY);
  rotate(radians(smallFishAngle));
  imageMode(CENTER);
  image(smallFishImg, 0, 0, 80, 40);
  pop();
  drawItemsAndCheckCollisions();
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Energy: ${energy}`, 30, 30);

  if (energy >= 20) {
    gameWon = true;
  }
  if (energy <= 0) {
    gameOver = true;
  }
}

// The rest of the functions (drawGameOverScreen, drawWonScreen, mousePressed, etc.)
// remain unchanged from your original code



function drawGameOverScreen() {
  image(seaImg, 0, 0, width, height);
  fill(255);
  image(gameoverImg, width / 2 - 155, height / 2 - 100, 310, 60);
  image(restartImg, width / 2 - 75, height / 2 + 50, 150, 60);
  
  if (!loseSoundPlayed) { // 确保音效只播放一次
    loseSound.play();
    loseSoundPlayed = true;
  }
 // <-- 应该加上一个闭合大括号

  bigFishY -= 1;
  bigFishRotation += 0.05;
  push();
  translate(bigFishX + 150, bigFishY + 75);
  rotate(bigFishRotation);
  imageMode(CENTER);
  scale(bigFishDirection, 1);
  image(bigFishImg, 0, 0, 300, 150);
  pop();
}

function drawWonScreen() {
  image(seaImg, 0, 0, width, height);
  fill(255);
  image(winImg, width / 2 - 155, height / 2 - 100, 310, 60);
  //大鱼旋转效果
  {push();
  translate(width / 2 - 200, height / 2); // 将大鱼移动到中心左侧
  rotate(HALF_PI);
  rotate(frameCount * 0.02); // 持续旋转
  imageMode(CENTER);
  image(bigFishImg, 0, 0, 300, 150); // 竖起展示
  pop();
  }
  // 小鱼旋转效果
  {push();
  translate(width / 2 + 200, height / 2); // 将小鱼移动到中心右侧
  rotate(HALF_PI);
  rotate(-frameCount * 0.05); // 反方向旋转
  imageMode(CENTER);
  image(smallFishImg, 0, 0, 80, 40); // 竖起展示
  pop();
  }
  // 海星海草旋转效果
  {push();
    translate(width /2, height/2-150); 
    image(starImg, 0, 0, 80, 80); // 竖起展示
    pop();
    }
    {push();
      translate(width - 250, height -200); 
      image(shanhuImg, 0, 0, 280, 250); // 竖起展示
      pop();}
  // 确保胜利音效只播放一次
  if (!winSoundPlayed) {
    winSound.play();
    winSoundPlayed = true;
  }
  fill(255);
  image(winImg, width / 2 - 155, height / 2 - 100, 310, 60);
  // 显示重新开始按钮
  image(restartImg, width / 2 - 75, height / 2 + 50, 150, 60);
}


function mousePressed() {
  if (!gamestart && mouseX > width / 2 - startImg.width / 2 && mouseX < width / 2 + startImg.width / 2 &&
      mouseY > height / 2 && mouseY < height / 2 + startImg.height) {
    startGame();
  }
  if ((gameOver || gameWon) && mouseX > width / 2 - restartImg.width / 2 && mouseX < width / 2 + restartImg.width / 2 &&
      mouseY > height / 2 + 50 && mouseY < height / 2 + 50 + restartImg.height) {
    restartGame();
  }
}

function startGame() {
  gamestart = true;
  if (gogoFishSound.isPlaying()) {
    gogoFishSound.stop(); // 防止重复播放
  }
  gogoFishSound.play(); // 开始播放音频
}


function restartGame() {
  energy = 10;
  gameOver = false;
  gameWon = false; // 重置胜利状态
  bigFishRotation = 0;
  items = [];
  freezeTimer = 0;
  speedBoostTimer = 0;
  loseSoundPlayed = false; // 重置 loseSound 播放标志
  winSoundPlayed = false; // 重置 winSound 播放标志
  generateItems();
}



function moveSmallFish() {
  smallFishX -= smallFishSpeed * cos(radians(smallFishAngle));
  smallFishY -= smallFishSpeed * sin(radians(smallFishAngle));
  if (smallFishX > width) {
    smallFishX = 0;
    smallFishY = random(height);
  }
  if (smallFishX < 0) {
    smallFishX = width;
    smallFishY = random(height);
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    bigFishDirection *= -1;
  }
 
    // Start the game with the right arrow key
    if (!gamestart && keyCode === RIGHT_ARROW) {
      startGame();
    }
    
    // Restart the game with the right arrow key
    if ((gameOver || gameWon) && keyCode === RIGHT_ARROW) {
      restartGame();
    }
  
}


function generateItem() {
  let itemType = random(['bread', 'weeds', 'bug', 'shrimp', 'bag', 'glass', 'web', 'poison', 'lightning', 'snow']);
  let itemImg;
  if (itemType === 'bread') itemImg = breadImg;
  else if (itemType === 'weeds') itemImg = weedsImg;
  else if (itemType === 'bug') itemImg = bugImg;
  else if (itemType === 'shrimp') itemImg = shrimpImg;
  else if (itemType === 'bag') itemImg = bagImg;
  else if (itemType === 'glass') itemImg = glassImg;
  else if (itemType === 'web') itemImg = webImg;
  else if (itemType === 'poison') itemImg = poisonImg;
  else if (itemType === 'lightning') itemImg = lightningImg;
  else if (itemType === 'snow') itemImg = snowImg;
  let item = {
    x: random(width),
    y: 0,
    speed: random(0.5, 2),
    type: itemType,
    img: itemImg,
    timer: 300
  };
  items.push(item);
}

function generateItems() {
  for (let i = 0; i < 5; i++) {
    generateItem();
  }
}

function drawItemsAndCheckCollisions() {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    image(item.img, item.x, item.y, 60, 60);
    item.y += item.speed;
    if (dist(bigFishX + 150, bigFishY + 75, item.x, item.y) < 100) {
      if (item.type === 'bread') {energy += 1;goodSound.play(); }
      else if (item.type === 'weeds') {energy += 1;goodSound.play(); }
      else if (item.type === 'bug') {energy += 2;goodSound.play(); }
      else if (item.type === 'shrimp') {energy += 3;goodSound.play(); }
      else if (item.type === 'bag') {energy -= 2;badSound.play()}
      else if (item.type === 'glass') {energy -= 2;badSound.play()}
      else if (item.type === 'web') {energy -= 3;badSound.play()}
      else if (item.type === 'poison') {energy -= 3;badSound.play()}
      else if (item.type === 'lightning') {speedBoostTimer = 180;goodSound.play(); }
      else if (item.type === 'snow') {freezeTimer = 180;badSound.play();}
      items.splice(i, 1);
      generateItem();
    }
    item.timer--;
    if (item.timer <= 0 || item.y > height) {
      items.splice(i, 1);
      generateItem();
    }
  }
}

