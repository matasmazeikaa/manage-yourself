import { observable, flow } from 'mobx';
import apiClient from '../utils/api-client';

export class DashboardStore {
    @observable boards = [];

    *_getBoards () {
        try {
            const { data } = yield apiClient.get('boards');

            console.log(data);
        } catch (error) {
            return [error];
        }
    }
    getBoards = flow(this._getBoards);
}
