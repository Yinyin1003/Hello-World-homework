void setup() {
  Serial.begin(9600);       // 初始化串口通信
  pinMode(9, OUTPUT);       // 设置引脚 9 为风扇控制引脚
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');  // 从串口读取命令
    Serial.print("Received command: ");
    Serial.println(command);  // 打印收到的命令

    if (command == "Face detected") {  // 去掉 '\n' 后的判断
      analogWrite(9, 255);  // 设置风扇最大速度（PWM 255，100% 占空比）
      Serial.println("Fan ON");
    } else if (command == "No face detected") {
      analogWrite(9, 0);    // 停止风扇（PWM 0，风扇停止）
      Serial.println("Fan OFF");
    }
  }
}
