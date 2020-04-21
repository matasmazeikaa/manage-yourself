import { observable, flow, action } from 'mobx';
import space from '../images/space-background.jpg';
import apiClient from '../utils/api-client';
import { Column } from './BoardStore';

export interface Board {
    title: string;
    _id: string;
    theme: string;
    columns: Column[];
    tasks: [];
}

interface BoardForm {
    title: string;
    theme: string;
}

export class DashboardStore {
    @observable boards: Board[] = [];
    @observable boardForm: BoardForm = {
        title: '',
        theme: space,
    };
    @observable isBoardCreationInputVisible = false;
    @observable isNavBoardListOpen = false;

    @action.bound setBoardInput (name, value) {
        this.boardForm[name] = value.replace(/\n|\r/g, '');
    }

    @action.bound setNavBoardListVisible (value: boolean) {
        this.isNavBoardListOpen = value;
    }

    @action resetBoardInput () {
        this.boardForm = {
            title: '',
            theme: '',
        };
    }

    *_getBoards () {
        try {
            const { data } = yield apiClient.get('board');

            this.boards = data;
        } catch (error) {
            return [error];
        }
    }
    getBoards = flow(this._getBoards);

    *_addBoard (newBoard) {
        try {
            const { data } = yield apiClient.post('board', newBoard);

            this.boards.push(data);
            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    addBoard = flow(this._addBoard);

    @action.bound setBoardCreationInputVisible = (value: boolean) => () => {
        this.isBoardCreationInputVisible = value;
    };
}
