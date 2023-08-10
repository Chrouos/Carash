const os = require('os');
const express = require('express');
const router = express.Router();
const config = require('config');


const { Configuration, OpenAIApi } = require("openai");

const app = express();
const interfaces = os.networkInterfaces();  // 檢索該機器上的所有網絡接口
const port = 8000;
let hostname = 'localhost';

app.get('/', (req, res) => {
  res.send('The Root Server');
});

// * 交通事故的敘述 -> 歸納成 Json 的格式
app.get('/classified_chat', (req, res) => {
  // ! 產生可能會需要一點時間

  // Setup OpenAI API key
  const OPENAI_API_KEY = config.get('chatGPT.key');
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
  });

  // Configure openAI AIP access
  const openai = new OpenAIApi(configuration);

  // get Response
  async function getResponse () {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {
          "role": "system",
          "content": "你現在是一位交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json的格式，如果沒有資料請保持欄位空白\n{\"發生日期\": ,\"發生時間\": ,\"發生地點\": ,\"被告駕駛交通工具\": ,\"原告駕駛交通工具\": ,\"出發地\":,\"行駛道路\": ,\"行進方向\": ,\"事發經過\": ,\n\"行進方向的號誌\": ,\"天候\": ,\"路況\": ,\"行車速度\":,\"被告車輛損壞情形\":,\"原告車輛損壞情形\":,\"被告傷勢\": ,\"原告傷勢\": }"
        },
        {
          "role": "user",
          "content": "<交通事故敘述>\n被告於民國109年2月11日騎乘車牌號碼000-0000號普通重型機車，行經臺中市○○區○○路○段000號前時，因未注意車前狀況之過失，不慎碰撞原告所有、停放於該處之車牌號碼000-0000號普通重型機車（下稱系爭機車），致系爭機車受損，原告因系爭機車受損支出必要之修復費用合計新臺幣（下同）17,000元（均為零件費用）。系爭機車因被告過失撞損，原告爰依侵權行為之法律關係，請求被告給付原告17,000元。"
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    
    console.log("message", response.data.choices[0].message)
  };

  getResponse();

  // Done
  res.send(OPENAI_API_KEY);
});





// 檢查每個網絡接口，並尋找 IPv4 地址
for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if ('IPv4' === iface.family && !iface.internal) {
      hostname = iface.address;
    }
  }
}

app.listen(port, () => {
  console.log(`[LawsNote] Server listening at http://${hostname}:${port}`);
});

