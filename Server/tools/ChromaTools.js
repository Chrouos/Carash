const {ChromaClient, OpenAIEmbeddingFunction, TransformersEmbeddingFunction} = require('chromadb');
const ConfigCrypto = require('./ConfigCrypto')

class ChromaDB_Tools {

    constructor(chromaName) {
        this.configCrypto = new ConfigCrypto();
        this.chromaName = chromaName || this.configCrypto.config.CHROMA_NAME;;

        this.client = new ChromaClient({
            path: `http://${this.configCrypto.config.HOSTNAME}:8000`
        });
        this.collection = this.connecting();
    }

    // + 重製
    async reset(){
        try{
            this.deleteCollection().then(() => this.collection = this.connecting());
        }
        catch(err){
            console.error("[ChromaDB_Tools - reset] error: ", err.message)
        }
    }

    
    // + 獲取資料
    async get(data){
        try{
            const getting = (await (await this.collection).get(data));
            console.log("🚀 ~ file: ChromaTools.js:29 ~ ChromaDB_Tools ~ get ~ getting:", getting)

            return getting
        }
        catch(err){
            console.error("[ChromaDB_Tools - update] error: ", err.message)
        }
    }

    // + 修改資料
    async update(data){
        try{
            await ((await this.collection).upsert(data));
        }
        catch(err){
            console.error("[ChromaDB_Tools - update] error: ", err.message)
        }
    }

    // + 搜尋資料
    async query(data){
        try{
            const querying = (await (await this.collection).query(data));
            console.log("🚀 ~ file: ChromaTools.js:51 ~ ChromaDB_Tools ~ query ~ querying:", querying)
            
            return querying
        }
        catch(err){
            console.error("[ChromaDB_Tools - query] error: ", err.message)
        }
    }

    // + 搜尋前五筆
    async peek(data){
        try{
            const peeking = (await (await this.collection).peek(data));
            // console.log("🚀 ~ file: ChromaTools.js:65 ~ ChromaDB_Tools ~ peek ~ peeking:", peeking)
            
            return peeking
        }
        catch(err){
            console.error("[ChromaDB_Tools - peek] error: ", err.message)
        }
    }
    
    // + 搜尋總數
    async count(){
        try{
            const counting = (await (await this.collection).count());
            // console.log(`[${this.configCrypto.config.CHROMA_NAME}] number of items in the collection: ${counting}`);

            return counting
        }
        catch(err){
            console.error("[ChromaDB_Tools - count] error: ", err.message)
        }
    }

    // + 增加資料
    async add(data){
        try{
            if (!data.hasOwnProperty('ids')){

                data['ids'] = [];

                for (let i=0; i < data['metadatas'].length; i++) {
                    data['ids'].push(await this.nextIds(i));
                }
                
            }       
            await ((await this.collection).add(data));
        }
        catch(err){
            console.error("[ChromaDB_Tools - add] error: ", err.message)
        }
    }

    // + 連線資訊
    async connecting( ) {

        // - embedding function ~  @xenova/transformers
        const embedder = new TransformersEmbeddingFunction();
        const collection = await this.client.getOrCreateCollection({
            name: this.chromaName, 
            embeddingFunction: embedder
        })

        // - embedding function ~ OpenAI
        // const embedder = new OpenAIEmbeddingFunction({openai_api_key: this.configCrypto.config.GPT_KEY})
        // const collection = this.client.getOrCreateCollection({
        //     name: this.chromaName,
        //     metadata: {
        //         "description": "For Carash Database: " + this.chromaName
        //     },
        //     embeddingFunction: embedder
        // })

        return collection
    }

    // + 刪除該 Collection
    async deleteCollection(){
        try {
            await this.client.deleteCollection({
                name: this.chromaName
            });
        }
        catch(err) {
            console.error("[ChromaDB_Tools - deleteCollection] error: ", err.message)
        }
    }

    // + 確認目前所有的 collections
    async checkAllCollection () {
        const allCollections = await this.client.listCollections();
        console.log("🚀 ChromaDB_Tools ~ checkAllCollection ~ allCollections:", allCollections)
    }

    // + 確認 Chroma 版本
    async checkVersion () {
        const chromaVersion = await this.client.version();
        console.log(`Chroma Version: ${chromaVersion}`)
    }

    // + 確認目前所有的 collections
    async checkPeek (data) {
        const peekData = (await (await this.collection).peek(data));
        console.log(`${this.chromaName} peekData:`, peekData)
    }

    // + 確認 Chroma 名稱
    async checkChromaName (){
        console.log(`The name of the currently connected server is called ${this.chromaName}`)
    }

    // + 下一個 id 名稱
    async nextIds (i = 0) {
        try{
            const nowIds = this.configCrypto.config.CHROMA_NAME + "_" + (await this.count() + 1 + i);
            return nowIds
        }
        catch(err){
            console.error("[ChromaDB_Tools - nextIds] error: ", err.message)
        }
    }

}

module.exports = ChromaDB_Tools;