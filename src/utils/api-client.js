import CommonStore from '../store/CommonStore';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const LOGIN_URL = 'user/login';
const REGISTER_URL = 'user/register';

let instance = null;

const apiConfig = () => ({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiClient = () => {
    if (instance !== null) {
        return instance;
    }

    console.log(CommonStore.token);
    instance = axios.create(apiConfig());

    return instance;
};

export default apiClient();

export const setAxiosInterceptors = (instance) => {
    instance.interceptors.response.use((response) => {
        if (response.config.url === LOGIN_URL || response.config.url === REGISTER_URL) {
            console.log(response.data.token);
            instance.defaults.headers.common.Authorization = response.data.token;
            window.localStorage.setItem('auth-token', response.data.token);

            return response;
        }

        return response;
    });
};
