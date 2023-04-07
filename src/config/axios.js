import axios from 'axios';
import { getToken } from '../utils/getToken';

const token = getToken();
const BASE_URL = 'http://127.0.0.1:5000/api/admin/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "application/json",
        "x-access-token": `${token}`
    }
});

const loginPost = async (username, password) => {
    const res = await axios.post(`${BASE_URL}login`, { username, password });
    return res;
}
export { axiosInstance, loginPost } 