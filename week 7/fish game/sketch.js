let seaImg, bigFishImg, smallFishImg, breadImg, weedsImg, bugImg, shrimpImg, bagImg, glassImg, webImg, poisonImg, lightningImg, snowImg;
let bigFishX = 0, bigFishY = 0;
let bigFishSpeed = 3;  // 大鱼的初始速度
let bigFishBaseSpeed = 3; // 大鱼的基础速度
let bigFishDirection = 1;  // 控制大鱼方向，1 为向右，-1 为向左
let bigFishRotation = 0;  // 大鱼的旋转角度，游戏结束时翻转
let smallFishX = 0, smallFishY = 0;  // 小鱼位置
let smallFishAngle = 0;
let smallFishSpeed = 2;  // 小鱼的速度
let energy = 10;  // 大鱼体力，初始值为 10
let items = [];  // 道具数组
let gameOver = false; // 游戏结束标志
let restartButton; // 重新开始按钮
let freezeTimer = 0; // 冻结时间计时器
let speedBoostTimer = 0; // 速度提升计时器

function preload() {
  // 预加载图片
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
}

function setup() {
  createCanvas(800, 600);

  // 初始化大鱼和小鱼位置
  bigFishX = 0;  // 大鱼从左侧开始
  bigFishY = random(height - 150);  // 大鱼在随机 Y 位置
  smallFishX = random(width);  // 小鱼的初始随机水平位置
  smallFishY = height * 3 / 4;  // 小鱼的初始垂直位置

  // 初始化道具
  generateItems();

  // 创建重新开始按钮并设置样式
  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 40, height / 2 + 40);
  restartButton.mousePressed(restartGame);
  restartButton.style('border', 'none');
  restartButton.style('padding', '10px 20px');
  restartButton.style('background-color', 'rgb(223,153,79)');
  restartButton.style('color', 'white');
  restartButton.style('font-size', '20px');
  restartButton.hide();
}

function draw() {
  // 绘制背景
  image(seaImg, 0, 0, width, height);

  // 游戏结束时的大鱼翻肚皮上浮效果
  if (gameOver) {
    background(seaImg, 0, 0, width, height);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 20);
    restartButton.show();

    // 让大鱼逐渐上浮并翻转
    bigFishY -= 1; // 控制大鱼向上移动的速度
    bigFishRotation += 0.05; // 控制大鱼翻转速度
    push();
    translate(bigFishX + 150, bigFishY + 75);
    rotate(bigFishRotation);
    imageMode(CENTER);
    scale(bigFishDirection, -1); // 将方向设置为 -1 使其翻转
    image(bigFishImg, 0, 0, 300, 150);
    pop();
    return;
  }

  // 检查是否被冻结
  if (freezeTimer > 0) {
    freezeTimer--;
    bigFishSpeed = 0; // 冻结时速度为0
  } else {
    bigFishSpeed = bigFishBaseSpeed; // 恢复基础速度
  }

  // 检查速度提升
  if (speedBoostTimer > 0) {
    speedBoostTimer--;
    bigFishSpeed = bigFishBaseSpeed * 1.5; // 提升速度为基础速度的1.5倍
  }

  // 控制大鱼平行移动
  bigFishX -= bigFishSpeed * bigFishDirection;

  // 大鱼出屏幕时从另一边进入
  if (bigFishX > width) {
    bigFishX = -300;
    bigFishY = random(height - 150);
  } else if (bigFishX < -300) {
    bigFishX = width;
    bigFishY = random(height - 150);
  }

  // 绘制大鱼
  push();
  translate(bigFishX + 150, bigFishY + 75);
  scale(bigFishDirection, 1);
  imageMode(CENTER);
  image(bigFishImg, 0, 0, 300, 150);
  pop();

  // 小鱼自由移动
  moveSmallFish();

  // 绘制小鱼
  push();
  translate(smallFishX, smallFishY);
  rotate(radians(smallFishAngle));
  imageMode(CENTER);
  image(smallFishImg, 0, 0, 80, 40);
  pop();

  // 绘制道具并检测碰撞
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    image(item.img, item.x, item.y, 60, 60);

    // 更新道具位置（下落）
    item.y += item.speed;

    // 检测大鱼身体与道具的碰撞
    if (dist(bigFishX + 150, bigFishY + 75, item.x, item.y) < 100) {
      // 根据道具类型增减体力或触发特殊效果
      if (item.type === 'bread') energy += 2;
      else if (item.type === 'weeds') energy += 1;
      else if (item.type === 'bug') energy += 3;
      else if (item.type === 'shrimp') energy += 4;
      else if (item.type === 'bag') energy -= 1;
      else if (item.type === 'glass') energy -= 2;
      else if (item.type === 'web') energy -= 4;
      else if (item.type === 'poison') energy -= 3;
      else if (item.type === 'lightning') speedBoostTimer = 180; // 3秒速度提升
      else if (item.type === 'snow') freezeTimer = 180; // 3秒冻结

      items.splice(i, 1);  // 移除碰撞的道具
      generateItem();  // 生成新道具
    }

    // 道具到达底部或超时则重新生成
    item.timer--;
    if (item.timer <= 0 || item.y > height) {
      items.splice(i, 1);
      generateItem();
    }
  }

  // 显示体力值
  fill(255);
  textSize(24);
 
  textAlign(LEFT, TOP);  // 确保文本从左上角开始绘制
text(`Energy: ${energy}`, 30, 30);


  // 检查体力是否为零
  if (energy <= 0) {
    gameOver = true;
  }
}

// 小鱼移动函数
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

// 使用键盘右箭头控制大鱼掉头
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    bigFishDirection *= -1;
  }
}

// 随机生成单个道具
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
    x: random(width),         // 随机 x 坐标从顶部掉落
    y: 0,                     // 从画布顶部开始
    speed: random(0.5, 2),    // 随机下落速度（降低速度范围）
    type: itemType,
    img: itemImg,
    timer: 300                // 道具的存活时间（5秒，假设60 FPS）
  };
  items.push(item);
}

// 初始化生成多个道具
function generateItems() {
  for (let i = 0; i < 5; i++) {
    generateItem();
  }
}

// 重置游戏函数
function restartGame() {
  energy = 10;
  gameOver = false;
  bigFishRotation = 0; // 重置大鱼的旋转
  items = [];
  freezeTimer = 0; // 重置冻结计时
  speedBoostTimer = 0; // 重置速度提升计时
  generateItems();
  restartButton.hide();
}
