import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';
export const CLIENT_URL = 'http://localhost:3000';

const LOGIN_URL = 'user/login';
export const REGISTER_URL = 'user/register';

let instance = null;

const apiConfig = () => ({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('auth-token') ? localStorage.getItem('auth-token') : '',
    },
});

const apiClient = () => {
    if (instance !== null) {
        return instance;
    }

    instance = axios.create(apiConfig());

    return instance;
};

export default apiClient();

export const setAxiosInterceptors = (instance) => {
    instance.interceptors.response.use(
        (response) => {
            console.log(response);
            instance.defaults.headers.Authorization = localStorage.getItem('auth-token');

            if (response.config.url === LOGIN_URL || response.config.url === REGISTER_URL) {
                // eslint-disable-next-line no-debugger
                // delete instance.defaults.headers.common.Authorization;
                instance.defaults.headers.Authorization = response.data.token;

                window.localStorage.setItem('auth-token', response.data.token);

                return response;
            }

            return response;
        },
        (error) => {
            const { response } = error;
            console.log(error);

            if (typeof response === 'undefined') {
                throw {
                    data: {
                        code: 'unknown_error',
                        message: 'Unknown error',
                        error,
                    },
                };
            }

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('auth-token');

                window.location.replace(CLIENT_URL);
            }

            throw error;
        },
    );
};
