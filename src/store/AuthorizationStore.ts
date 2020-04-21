import { action, flow, observable } from 'mobx';
import apiClient from '../utils/api-client';
import CommonStore from './CommonStore';

const DEFAULT_ERROR_VALUES = {
    username: null,
    email: null,
    password: null,
};

const DEFAULT_AUTHORIZATION_VALUES = {
    username: '',
    email: '',
    password: '',
};

export class AuthorizationStore {
    @observable isLoadingAuthorization = false;
    @observable errors = DEFAULT_ERROR_VALUES;
    @observable values = DEFAULT_AUTHORIZATION_VALUES;

    @action.bound handleAuthorizationInput (event) {
        const {
            target: { name, value },
        } = event;

        this.errors[name] = null;
        this.values[name] = value;
    }

    @action resetAuthorizationStoreInputValues () {
        this.values = DEFAULT_AUTHORIZATION_VALUES;
    }

    @action resetErrors () {
        this.errors = DEFAULT_ERROR_VALUES;
    }

    @action setErrors (errors) {
        errors.forEach((error) => {
            this.errors[error.name] = error.errorMessage;
        });
    }

    *_login () {
        this.isLoadingAuthorization = true;
        this.resetErrors();

        try {
            const { data } = yield apiClient.post('user/login', {
                email: this.values.email,
                password: this.values.password,
            });

            CommonStore.setToken(data.token);

            return [data, null];
        } catch (error) {
            return [null, error];
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    login = flow(this._login);

    *_register () {
        this.isLoadingAuthorization = true;
        this.resetErrors();

        try {
            const { data } = yield apiClient.post('user/register', {
                username: this.values.username,
                password: this.values.password,
                email: this.values.email,
            });

            return [data, null];
        } catch (error) {
            return [null, error];
        } finally {
            this.isLoadingAuthorization = false;
        }
    }
    register = flow(this._register);
}
