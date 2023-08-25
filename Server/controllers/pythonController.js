// * 預測金額
exports.predictor_money = async(req, res) => {
    try {

        // - 整理 request data
        const requestData = req.body;  

        res.status(200).send(requestData);
    }
    catch (error) {
        console.error("[getTitle] Error :", error.message || error);
        res.status(500).send(`[getTitle] Error : ${error.message || error}`);
    }
}