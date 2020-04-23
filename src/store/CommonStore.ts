import { action, observable, reaction } from 'mobx';

class CommonStore {
    @observable token = window.localStorage.getItem('auth-token');

    constructor () {
        reaction(
            () => this.token,
            (token) => {
                if (token) {
                    window.localStorage.setItem('auth-token', token);
                }

                window.localStorage.removeItem('auth-token');
            },
        );
    }

    @action setToken (token) {
        window.localStorage.setItem('auth-token', token);
    }
}

export default new CommonStore();
