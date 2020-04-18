import { action, flow, observable } from 'mobx';
import apiClient from '../utils/api-client';
import CommonStore from './CommonStore';

class AuthorizationStore {
    @observable isLoadingAuthorization = false;
    @observable errors = null;
    @observable values = {
        username: '',
        email: '',
        password: '',
    };

    @action.bound handleAuthorizationInput (name, value) {
        this.values[name] = value;
    }

    @action resetAuthorizationStoreInputValues () {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
    }

    *_login () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            const { data } = yield apiClient.post('user/login', {
                email: this.values.email,
                password: this.values.password,
            });

            CommonStore.setToken(data.token);

            return data;
        } catch (error) {
            console.log(error);
            this.errors = error.errors;
            return error.response.data;
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    login = flow(this._login);

    *_register () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            return yield apiClient.post('user/register', {
                username: this.values.username,
                password: this.values.password,
                email: this.values.email,
            });
        } catch (error) {
            return error.response.data;
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    register = flow(this._register);
}

export default new AuthorizationStore();
