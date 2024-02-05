const { ReturnDocument } = require('mongodb');
const MongoDB_Tools = require('../tools/MongoDbTools');
const crypto = require('crypto'); 

// ----- 註冊帳號
exports.registerAccount = async (req, res) => {
    /*
        account: string,
        password: string,
        email: string,
        name: string
    */ 

    try {
        const mongoDb = new MongoDB_Tools();
        var responseData = {}; // = 定義回傳變數

        // @ 確認帳號是否重複
        const duplicateAccountList = await mongoDb.read(
            collectionName = 'Users',
            query = { account: req.body.account }, 
        )

        // ~ 有找到相同的帳號，則取消創建
        if (duplicateAccountList.length > 0) {  
            responseData.message = "帳號已重複"; 
        }

        // ~ 註冊
        else {

            const salt = generateSalt(); // 為每個用戶生成一個唯一的鹽值
            const hashedPassword = hashPassword(req.body.password, salt); // 哈希處理密碼   
            
            const insertNewAccount = await mongoDb.create(
                collectionName = 'Users',
                document = {
                    account: req.body.account,
                    password: hashedPassword, 
                    salt: salt,
                    email: req.body.email,
                    nickName: req.body.nickName,
                    verificationCode: generateUniqueVerificationCode(req.body.account)
                }
            ) // = 回傳創建 ID
            responseData["_id"] = insertNewAccount;
            responseData.message = "帳號已成功創建";
        }
        
        return res.status(200).send(responseData);
    } catch (error) {
        return  res.status(500).send(`[registerAccount] Error: ${error.message || error}`);
    }
};

// ----- 登入，回傳驗證 verificationCode
exports.loginAccount = async (req, res) => {
    /*
        account: string,
        password: string,
    */ 

    try {
        const mongoDb = new MongoDB_Tools();
        var responseData = {}; // = 定義回傳變數

        // @ 確認帳號是否存在
        const [verificationAccount] = await mongoDb.read(
            collectionName = 'Users',
            query = { account: req.body.account }, 
        )

        // ~ 帳號不存在
        if (verificationAccount == undefined || !verificationAccount) {
            responseData = {
                message: "帳號不存在",
                isSuccesses: false
            }
        }
        // ~ 確認存在，驗證
        else {
            // @ 驗證用戶輸入的密碼是否正確
            const isSuccesses = verifyPassword(req.body.password, verificationAccount.password, verificationAccount.salt);
            responseData = {
                message: isSuccesses ? "登入成功" : "密碼錯誤",
                isSuccesses: isSuccesses,
                verificationCode: isSuccesses ? verificationAccount.verificationCode : null
            };
        }

        return res.status(200).send(responseData);
    } catch (error) {
        return res.status(500).send(`[loginAccount] Error: ${error.message || error}`);
    }
};


// -v- 隨機生成 verificationCode
function generateUniqueVerificationCode(account) {
    const timestamp = Date.now().toString(); // 獲取當前時間戳
    const randomData = crypto.randomBytes(10).toString('hex'); // 生成隨機數據
    const verificationCode = `${timestamp}-${account}-${randomData}`; // 結合時間戳和隨機數據
    return verificationCode;
}


// -v- 生成一個隨機的鹽值
function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

// -v- 使用密碼和鹽值進行哈希
function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 
        1000, // 迭代次數
        64, // 生成鍵的長度
        'sha512').toString('hex'); // 哈希算法
}

// -v- 使用相同的方法來哈希輸入的密碼
function verifyPassword(inputPassword, storedHash, storedSalt) {
    var hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 
        1000, // 迭代次數與創建時相同
        64, // 生成鍵的長度與創建時相同
        'sha512').toString('hex'); // 使用相同的哈希算法
    return storedHash === hash; // 比較哈希值
}