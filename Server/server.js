const os = require('os');
const express = require('express');
const cors = require('cors');
const defaultConfig = require('./config/development');    // * Config 檔案

const app = express();
const interfaces = os.networkInterfaces();  // 檢索該機器上的所有網絡接口

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

const port = defaultConfig.PORT || 8000;
let hostname = defaultConfig.HOSTNAME || 'localhost';

// -------------------- routers list
const chatGPT = require('./routers/chatGPTRouter')
app.use(chatGPT);

app.get('/', (req, res) => {
  res.send("Hello")
});

// 檢查每個網絡接口，並尋找 IPv4 地址
if (hostname == 'localhost') {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if ('IPv4' === iface.family && !iface.internal) {
        hostname = iface.address;
      }
    }
  }
} 

app.listen(port, () => {
  console.log(`[LawsNote] Server listening at http://${hostname}:${port}`);
});

