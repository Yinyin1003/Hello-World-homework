const int soundPin = A0;  // 连接声音传感器到模拟引脚 A0
const int redLED = 9;     // 红色 LED 连接到数字引脚 9
const int greenLED = 10;  // 绿色 LED 连接到数字引脚 10
const int blueLED = 11;   // 蓝色 LED 连接到数字引脚 11

int level = 0;

void setup() {
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  
  Serial.begin(9600);     // 初始化串口通信
}

void loop() {
  int soundValue = analogRead(soundPin);  // 读取声音传感器的值

  // 将声音强度划分为3个级别
  if (soundValue < 20) {
    level = 1;  // 声音小
    digitalWrite(redLED, HIGH);    // 打开红色 LED
    digitalWrite(greenLED, LOW);   // 关闭绿色 LED
    digitalWrite(blueLED, LOW);    // 关闭蓝色 LED
  } else if (soundValue >= 20 && soundValue < 30) {
    level = 2;  // 声音中等
    digitalWrite(redLED, LOW);     // 关闭红色 LED
    digitalWrite(greenLED, HIGH);  // 打开绿色 LED
    digitalWrite(blueLED, LOW);    // 关闭蓝色 LED
  } else {
    level = 3;  // 声音大
    digitalWrite(redLED, LOW);     // 关闭红色 LED
    digitalWrite(greenLED, LOW);   // 关闭绿色 LED
    digitalWrite(blueLED, HIGH);   // 打开蓝色 LED
  }

  // 通过串口发送声音级别到 p5.js
  Serial.println(level);
  
  delay(100);  // 延迟 100ms
}
