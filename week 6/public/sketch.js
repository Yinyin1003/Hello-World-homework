let socket;
let soundLevel = 1;  // 初始化声音等级
let currentSize = 30;  // 当前图形的大小
let targetSize = 30;   // 目标图形大小
let currentBackground = 255;  // 当前背景色
let targetBackground = 255;   // 目标背景色

function setup() {
  createCanvas(400, 400);
  noStroke();  // 禁用所有图形的边线
  
  // 连接到 WebSocket 服务器
  socket = new WebSocket('ws://localhost:3001');

  // 当 WebSocket 连接打开时
  socket.onopen = function(event) {
    console.log("Connected to WebSocket server");
  };

  // 当接收到数据时
  socket.onmessage = function(event) {
    soundLevel = int(event.data);  // 将数据转换为整数
    console.log("Sound Level:", soundLevel);

    // 根据不同的声音级别，设置目标大小和目标背景颜色
    if (soundLevel === 1) {
      targetSize = 30;  // 小声音时的小圆
      targetBackground = 180;  // 较浅的背景
    } else if (soundLevel === 2) {
      targetSize = 100;  // 中等声音时的中等圆
      targetBackground = 160;  // 中等背景
    } else if (soundLevel === 3) {
      targetSize = 250;  // 大声音时的大圆
      targetBackground = 140;  // 深色背景
    }
  };
}

function draw() {
  // 线性插值实现颜色和平滑过渡
  currentBackground = lerp(currentBackground, targetBackground, 0.05);  // 颜色逐渐过渡
  currentSize = lerp(currentSize, targetSize, 0.05);  // 大小逐渐过渡

  background(currentBackground);  // 使用当前背景色

  // 绘制图形，大小逐渐变化
  ellipse(width / 2, height / 2, currentSize, currentSize);  
}

  