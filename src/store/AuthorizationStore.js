import { observable, action, flow } from 'mobx';
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

    @action setUsername (username) {
        this.values.username = username;
    }

    @action setPassword (password) {
        this.values.password = password;
    }

    @action reset () {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
    }

    login = flow(function *() {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            const { user } = yield apiClient.Auth.login(this.values.email, this.values.password);
        } catch (error) {
            this.errors = error.response.data;
            throw error;
        } finally {
            this.isLoadingAuthorization = false;
        }
    });

    register = flow(function *() {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            yield apiClient.Auth.register(this.values.username, this.values.email, this.values.password);
        } catch (error) {
            this.errors = error.response.data;
            throw error;
        } finally {
            this.isLoadingAuthorization = false;
        }
    });
}

export default new AuthorizationStore();
