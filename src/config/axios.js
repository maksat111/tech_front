import axios from 'axios';
import { getToken } from '../utils/getToken';

const token = getToken();
const BASE_URL = 'https://turkmenexpress.com.tm/api/administrator/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': "application/json",
        "Authorization": `Bearer ${token}`
    }
});

const loginPost = async (phone_number, password) => {
    const res = await axios.post(`${BASE_URL}login/`, { phone_number, password });
    return res;
}
export { axiosInstance, loginPost } 