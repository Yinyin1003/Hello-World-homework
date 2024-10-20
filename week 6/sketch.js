let serial;
let portName = '/dev/tty.usbmodem146401';  // 根据实际情况更改串口地址

let seaImg, bigFishImg, smallFishImg;
let bigFishX = 0, bigFishY = 0;
let smallFishX = 0, smallFishY = 0;  // 小鱼位置
let smallFishAngle = 0;
let smallFishSpeed = 2;  // 小鱼的速度
let joystickX = 300, joystickY = 300;  // 初始化为中间值
let buttonPressed = false;

function preload() {
  // 预加载图片
  seaImg = loadImage('image/sea.png');
  bigFishImg = loadImage('image/bigfish.png');
  smallFishImg = loadImage('image/smallfish.png');
}

function setup() {
  createCanvas(800, 600);

  // 初始化串口通信
  serial = new p5.SerialPort();
  serial.on('data', serialEvent);  // 当有数据传输时触发 serialEvent
  serial.open(portName);

  // 初始化大鱼和小鱼位置
  bigFishX = width / 2-100;
  bigFishY = height / 2-100;
  smallFishX = width * 3 / 4;
  smallFishY = height * 3 / 4;
}

function draw() {
  // 绘制背景
  image(seaImg, 0, 0, width, height);

  // 控制大鱼移动，确保映射到合适的范围
  let xMove = map(joystickX, 0, 600, -5, 5);
  let yMove = map(joystickY, 0, 600, -5, 5);

  // 如果手柄非常接近中间位置，不移动大鱼
  if (abs(xMove) > 0.5 || abs(yMove) > 0.5) {
    bigFishX += xMove;
    bigFishY += yMove;
  }

  // 确保大鱼不会游出画布
  bigFishX = constrain(bigFishX, 0, width-300);
  bigFishY = constrain(bigFishY, 0, height-150);

  // 绘制大鱼
  image(bigFishImg, bigFishX, bigFishY, 300, 150);

  // 小鱼自由移动
  moveSmallFish();

  // 绘制小鱼
  push();
  translate(smallFishX, smallFishY);  // 小鱼位置
  rotate(radians(smallFishAngle));    // 小鱼旋转
  imageMode(CENTER);
  image(smallFishImg, 0, 0, 80, 40);
  pop();
}

// 小鱼移动函数，包含从屏幕一边游出从另一边进入的逻辑
function moveSmallFish() {
  // 根据当前的角度和速度移动小鱼
  smallFishX -= smallFishSpeed * cos(radians(smallFishAngle));
  smallFishY -= smallFishSpeed * sin(radians(smallFishAngle));

  // 当小鱼游出画布一边时从另一边进入
  if (smallFishX > width) {
    smallFishX = 0;  // 从左边进入
  }
  if (smallFishX < 0) {
    smallFishX = width;  // 从右边进入
  }
  if (smallFishY > height) {
    smallFishY = 0;  // 从上边进入
  }
  if (smallFishY < 0) {
    smallFishY = height;  // 从下边进入
  }
}

function serialEvent() {
  let data = serial.readLine();  // 读取一行数据
  if (data.length > 0) {
    console.log(data);  // 打印数据，调试用
    let sensorValues = data.split(',');  // 解析数据
    joystickX = int(sensorValues[0].split(':')[1]);  // X 轴
    joystickY = int(sensorValues[1].split(':')[1]);  // Y 轴
    let buttonValue = int(sensorValues[2].split(':')[1]);  // 按钮状态

    // 按钮按下时让小鱼旋转
    if (buttonValue == 1 && !buttonPressed) {
      smallFishAngle += 90;  // 小鱼每次旋转 90 度
      buttonPressed = true;  // 防止连续旋转
    } else if (buttonValue == 0) {
      buttonPressed = false;  // 按钮释放
    }
  }
}
