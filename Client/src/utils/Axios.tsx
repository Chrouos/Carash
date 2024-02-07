import axios from 'axios';


axios.defaults.baseURL = process.env.NEXT_PUBLIC_REACT_APP_API_URL ;
axios.interceptors.response.use(
    (response) => { return response; },
    (error) => { console.log(`Axios Error: ${error}`) }
);

export default axios;
