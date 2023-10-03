let { PythonShell } = require('python-shell')
const ChromaDB_Tools = require('../tools/ChromaTools');
const MongoDB_Tools = require('../tools/MongoDbTools');
const fs = require('fs');
const ObjectId = require("mongodb").ObjectId;
const path = require('path');


// -------------------- 預測金額
exports.predictor_money = async (req, res) => {
    try {

        // - 整理 request data
        const requestData = req.body;
        var responseData = req.body;

        // - 回傳的資料
        var responseData = { predictor_money: 0 };

        // - 傳送給 python 的檔案
        let options = {
            cwd: './lawsnote_project', // + python 的執行目錄
            // args: [ ] // + 給 python 的參數
        }

        // - 執行 Python 檔案 (由目錄開始: ./Server/...)
        await PythonShell.run('Generate_First_Stage_result.py', options)
            .then(response => {
                responseData['predictor_money'] = JSON.parse(response[response.length - 1])[0]

            })
            .catch(err => {
                console.error("Python Error: ", err);
            });

        requestData.incidentJson['預測金額'] = parseInt(responseData['predictor_money']);

        // - 儲存到資料庫
        const mongodb = new MongoDB_Tools();
        await mongodb.update(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(responseData.ids) }, 
            updateOperation = { 
                $set: {
                    incidentJson: requestData.incidentJson
                }
            }
        );

        console.log("🚀 ~ file: pythonController.js:29 ~ exports.predictor_money=async ~ responseData:", responseData)
        res.status(200).send(responseData);
    }
    catch (error) {
        console.error("[predictor_money] Error :", error.message || error);
        res.status(500).send(`[predictor_money] Error : ${error.message || error}`);
    }
}

// -------------------- 儲存要預測的檔案
exports.save_predictor_file = async (req, res) => {
    try {
        const { happened, incidentJson } = req.body;


        if (!happened || !incidentJson) {
            return res.status(400).send("Missing required request data");
        }

        const formal_test_write = {
            money: 0,
            happened,
            incidentJson
        };

        const filePath = path.join(__dirname, 'lawsnote_project', 'data', 'formal_test.json');

        // Ensure directory exists, or create it
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        function writeFilePromise(filePath, data) {
            return new Promise((resolve, reject) => {
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        await writeFilePromise('./lawsnote_project/data/formal_test.json', JSON.stringify(formal_test_write));


        // await fs.promises.writeFile(filePath, JSON.stringify(formal_test_write)); // + fs.writeFile 本身是使用回呼（callback）的方式進行非同步操作，並不回傳 Promise => (fs.promises.writeFile)

        res.status(200).send("Successfully saved the predictor file");
    } catch (error) {
        console.error("[save_predictor_file] Error :", error.message || error);
        res.status(500).send(`[save_predictor_file] Error : ${error.message || error}`);
    }
};

