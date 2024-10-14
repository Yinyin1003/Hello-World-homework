let marioX = 0; // 马里奥的初始 X 坐标
let marioSpeed = 4; // 马里奥的移动速度
let pixelSize = 10; // 每个像素的大小

// 数字的像素图案（5x3）
let digits = [
  // 0
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  // 1
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
  ],
  // 2
  [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ],
  // 3
  [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  // 4
  [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
  ],
  // 5
  [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],
  // 6
  [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  // 7
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1]
  ],
  // 8
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  // 9
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
  ]
];

// 用于表示马里奥的像素数组，0 是空白，1 是红色
let mario = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0]
];

function setup() {
  createCanvas(800, 400); // 创建画布
  textAlign(CENTER, CENTER); // 设置文字居中对齐
}

function draw() {
  background(0); // 黑色背景

  // 获取当前时间的小时、分钟、秒
  let h = nf(hour(), 2);   
  let m = nf(minute(), 2); 
  let s = nf(second(), 2);

  // 将时钟转换为像素数字
  let timeStr = h + ':' + m + ':' + s;
  drawPixelTime(timeStr, width / 2 - 150, height / 2 - 50);

  // 绘制并移动马里奥
  drawMario(marioX, height / 2 - 130); // 在时钟上方绘制马里奥
  marioX += marioSpeed; // 让马里奥沿着 X 轴移动

  // 如果马里奥走到画布的边缘，让他从另一侧重新出现
  if (marioX > width) {
    marioX = -mario[0].length * pixelSize; // 马里奥从左边重新进入画布
  }
}

// 绘制像素化时钟
function drawPixelTime(timeStr, x, y) {
  for (let i = 0; i < timeStr.length; i++) {
    let char = timeStr[i];
    if (char === ':') {
      // 绘制冒号
      fill(255);
      rect(x + i * (pixelSize * 4), y + pixelSize * 2, pixelSize, pixelSize);
      rect(x + i * (pixelSize * 4), y + pixelSize * 4, pixelSize, pixelSize);
    } else {
      // 绘制数字
      let digit = int(char);
      drawDigit(digit, x + i * (pixelSize * 4), y);
    }
  }
}

// 绘制单个数字
function drawDigit(digit, x, y) {
  let digitArray = digits[digit];
  for (let row = 0; row < digitArray.length; row++) {
    for (let col = 0; col < digitArray[row].length; col++) {
      if (digitArray[row][col] === 1) {
        fill(255);
        noStroke();
        rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

// 绘制马里奥像素小人函数
function drawMario(x, y) {
  for (let row = 0; row < mario.length; row++) {
    for (let col = 0; col < mario[row].length; col++) {
      let colorCode = mario[row][col];
      if (colorCode === 1) {
        fill(255, 0, 0); // 红色
      } else {
        continue; // 空白跳过
      }
      noStroke();
      rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize); // 绘制每个像素
    }
  }
}


