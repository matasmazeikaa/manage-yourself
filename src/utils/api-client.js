import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import CommonStore from '../store/CommonStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_URL = 'http://localhost:3001';

const handleErrors = (error) => {
    if (error && error.response && error.response.status === 401) {
        // logout
    }

    return error;
};

const responseBody = (response) => response.body;

const setAuthorizationHeader = (request) => {
    // there is auth token set token
    if (CommonStore.token) {
        request.set('Authorization', `Token ${CommonStore.token}`);
    }
};

const requests = {
    del: (url) => superagent.del(`${API_URL}${url}`).use(setAuthorizationHeader)
        .end(handleErrors)
        .then(responseBody),
    get: (url) => superagent.get(`${API_URL}${url}`).use(setAuthorizationHeader)
        .end(handleErrors)
        .then(responseBody),
    put: (url, body) => superagent.put(`${API_URL}${url}`, body).use(setAuthorizationHeader)
        .end(handleErrors)
        .then(responseBody),
    post: (url, body) => superagent.post(`${API_URL}${url}`, body).use(setAuthorizationHeader)
        .end(handleErrors)
        .then(responseBody),
};

const Auth = {
    login: (email, password) => {
        requests.post('/user/login', { email, password });
    },
    register: (username, email, password) => {
        requests.post('/user/register', { username, email, password });
    },
};

export default {
    Auth,
};
