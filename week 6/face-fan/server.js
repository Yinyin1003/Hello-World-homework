const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({ path: "/dev/cu.usbmodem146101", baudRate: 9600 });
console.log("Serial port opened");
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
console.log("parse");

wss.on("connection", (ws) => {
  console.log("Client connected");
  // add a listener that can send data to the arduino
  // from the client
  ws.on('message', (message) => {
    console.log(message)
    var str = message.toString()

    if (str === 'true') {
      console.log("sending face")
      port.write('Face detected\n');  // 发送到 Arduino：检测到人脸，启动风扇
    } else {
      port.write('No face detected\n');  // 发送到 Arduino：没有检测到人脸，关闭风扇
    }
});

parser.on("data", (data) => {
  console.log("server received from arduino: ", data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // simply send the data to the client as a string
      client.send(data.toString());
    }
  });
})
})
