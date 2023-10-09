const CryptoJS = require('crypto-js');
const defaultConfig = require('../config/' + process.env.NODE_ENV + ".js");
require('dotenv').config();

class CryptoJS_AES {
    constructor(){
        this.config = defaultConfig;
        this.decryptionKey = process.env.DECRYPTION_KEY;
        while (this.decryptionKey.length < 32) {
            this.decryptionKey += '\0';
        }
        this.decryptConfig(this.config);
    }

    decryptConfig(Config){
        if (typeof Config !== 'object'){ return; }

        for (const key in Config){
            if (Config.hasOwnProperty(key)){
                const value = Config[key];

                if (typeof value === 'string' && value.startsWith('ENC(') && value.endsWith(')')) {
                    const encryptedMsgB64 = value.slice(4, -1);
                    try {
                        // Decode from Base64
                        const encryptedMsgBytes = CryptoJS.enc.Base64.parse(encryptedMsgB64);
                        const encryptedMsgHex = encryptedMsgBytes.toString(CryptoJS.enc.Hex);

                        // Extract IV and Encrypted Part
                        const ivHex = encryptedMsgHex.substring(0, 32);
                        const encryptedPartHex = encryptedMsgHex.substring(32);

                        const iv = CryptoJS.enc.Hex.parse(ivHex);
                        const encryptedPart = CryptoJS.enc.Hex.parse(encryptedPartHex);

                        // Decrypt
                        const cipherParams = CryptoJS.lib.CipherParams.create({
                            ciphertext: encryptedPart
                        });
                        const keyHex = CryptoJS.enc.Utf8.parse(this.decryptionKey);
                        const options = { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.Pkcs7 };
                        const decrypted = CryptoJS.AES.decrypt(cipherParams, keyHex, options);
                        
                        // Assign decrypted value back to config
                        Config[key] = decrypted.toString(CryptoJS.enc.Utf8);
                    } catch (error) {
                        console.error(`Error decrypting the key ${key}:`, error);
                    }
                }
            }
        }
    }
}

module.exports = CryptoJS_AES;
