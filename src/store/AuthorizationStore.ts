import { action, flow, observable } from 'mobx';
import CommonStore from './CommonStore';
import apiClient from '../utils/api-client';

class AuthorizationStore {
    @observable isLoadingAuthorization = false;
    @observable errors = null;
    @observable values = {
        username: '',
        email: '',
        password: '',
    };

    @action handleAuthorizationInput (name, value) {
        this.values[name] = value;
    }

    @action reset () {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
    }

    *_login () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            const { user } = yield apiClient.Auth.login(this.values.email, this.values.password);

            CommonStore.setToken(user.token);
        } catch (error) {
            this.errors = error.response.data;
            throw error;
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    login = flow(this._login);

    *_register () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            const response = yield apiClient.Auth.register(this.values.username, this.values.email, this.values.password);

            console.log(response);
        } catch (error) {
            this.errors = error.response.data;
            throw error;
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    register = flow(this._register);
}

export default new AuthorizationStore();
