import { action, runInAction, observable } from 'mobx';
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

    @action
    async login () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            const { user } = await apiClient.Auth.login(this.values.email, this.values.password);

            runInAction(() => CommonStore.setToken(user.token));
        } catch (error) {
            runInAction(() => {
                this.errors = error.response.data;
                throw error;
            });
        } finally {
            runInAction(() => this.isLoadingAuthorization = false);
        }
    }

    async register () {
        this.isLoadingAuthorization = true;
        this.errors = null;

        try {
            await apiClient.Auth.register(this.values.username, this.values.email, this.values.password);
        } catch (error) {
            runInAction(() => {
                this.errors = error.response.data;
                throw error;
            });
        } finally {
            runInAction(() => this.isLoadingAuthorization = false);
        }
    }
}

export default new AuthorizationStore();
