/**
 * 獲取台灣的即時時間。
 * @returns {Date} 代表台灣當前時間的 Date 對象。
 */
const getTaiwanTime = () => {
    const taiwanTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
    return new Date(taiwanTime);
};

/**
 * 將時間轉換為 ISO 格式的字符串。
 * @param {Date} date - 需要格式化的 Date 對象。
 * @returns {string} 以 ISO 格式表示的時間字符串。
 */
const toISO = (date) => {
    return date.toISOString();
};

/**
 * 將時間轉換為人類可讀的格式（例如：YYYY-MM-DD HH:mm:ss）。
 * @param {Date} date - 需要格式化的 Date 對象。
 * @returns {string} 以人類可讀格式表示的時間字符串。
 */
const toHumanReadable = (date) => {
    return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
};

/**
 * 將時間轉換為自定義格式。
 * @param {Date} date - 需要格式化的 Date 對象。
 * @param {object} options - Intl.DateTimeFormat() 的選項。
 * @returns {string} 根據指定選項格式化的時間字符串。
 */
const toCustomFormat = (date, options) => {
    return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', ...options });
};

module.exports = { getTaiwanTime, toISO, toHumanReadable, toCustomFormat };
