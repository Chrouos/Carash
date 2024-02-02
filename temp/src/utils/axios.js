import axios from 'axios';

// require('dotenv').config({ path: path.resolve(__dirname, '.env') })
// console.log('__dirname：', __dirname)

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log("file: axios.js:10 ~ error:", error)
    }
);

export default axios;
