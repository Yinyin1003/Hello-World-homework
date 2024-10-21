const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = new SerialPort({ path: "/dev/cu.usbmodem146101", baudRate: 9600 });  // 根据你的实际串口地址修改
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// 提供静态文件服务
app.use(express.static('public'));

// WebSocket 部分
wss.on('connection', (ws) => {
  console.log("Client connected");

  parser.on('data', (data) => {
    console.log("Data from Arduino:", data.trim());
    ws.send(data.trim());
  });

  ws.on('close', () => {
    console.log("Client disconnected");
  });
});

// 启动服务器并监听端口
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
