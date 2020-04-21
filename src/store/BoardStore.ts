import { action, observable, flow } from 'mobx';
import apiClient from '../utils/api-client';
import { Board, DashboardStore } from './DashboardStore';

export interface Column {
    title: string;
    id: string;
    tasks: Task[];
}

interface Task {
    title: string;
    description: string;
    id: string;
}

export class BoardStore extends DashboardStore {
    @observable board: Board = {
        title: '',
        _id: '',
        theme: '',
        columns: [],
        tasks: [],
    };
    @observable columns: Column[] = [];
    @observable columnInputs = {
        title: '',
    };
    @observable taskInput = {
        title: '',
        description: '',
    };

    @observable currentTaskOpen = '';

    @observable isColumnInputVisible = false;
    @observable isTaskInputVisible = false;
    @observable isTaskModalOpen = false;

    @observable isFetchingBoard = false;

    @observable boardError = null;

    @action handleTaskInput (name, value) {
        if (name === 'title') {
            this.taskInput[name] = value.replace(/\n|\r/g, '');

            return;
        }

        this.taskInput[name] = value;
    }

    @action.bound handleColumnInput (name, value) {
        this.columnInputs[name] = value;
    }

    @action renameColumn (columnId, newTitle) {
        const columnToRenameIndex = this.columns.findIndex((column) => column.id === columnId);

        this.columns[columnToRenameIndex].title = newTitle;
    }

    @action editTask (newTask, columnId, taskId) {
        const columnToEditTaskIndex = this.columns.findIndex((column) => column.id === columnId);
        const taskToEditIndex = this.columns[columnToEditTaskIndex].tasks.findIndex((task) => task.id === taskId);

        this.columns[columnToEditTaskIndex].tasks[taskToEditIndex] = newTask;
    }

    @action setCurrentBoard (board) {
        this.board = board;
        this.columns = board.columns;
    }

    @action.bound setTaskModalVisible = (value, taskId) => () => {
        console.log(value, taskId);
        this.isTaskModalOpen = value;
        this.currentTaskOpen = taskId;
    };

    @action resetColumnInput () {
        this.columnInputs = {
            title: '',
        };
    }

    @action resetTaskInput () {
        this.taskInput = {
            title: '',
            description: '',
        };
    }

    @action setColumnInputVisible (value: boolean) {
        this.isColumnInputVisible = value;
    }

    @action setLoadingBoard (value: boolean) {
        this.isFetchingBoard = value;
    }

    @action setTasksToColumns (board) {
        const { columns } = board;
        const { tasks } = board;

        tasks.forEach((task) => {
            columns.forEach((column) => {
                if (task.columnId === column.id) {
                    console.log(task, column);
                    column.tasks.push(task);
                }
            });
        });

        this.columns = columns;
    }

    @action.bound setTaskInputVisible (value: boolean) {
        this.isTaskInputVisible = value;
    }

    @action.bound sortTask (droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd) {
        if (droppableIdStart === droppableIdEnd) {
            const sourceIndex = this.columns.findIndex((column) => droppableIdStart === column.id);
            const removedTask = this.columns[sourceIndex].tasks.splice(droppableIndexStart, 1);

            this.columns[sourceIndex].tasks.splice(droppableIndexEnd, 0, ...removedTask);
        } else {
            const startColumnIndex = this.columns.findIndex((column) => droppableIdStart === column.id);
            const endColumnIndex = this.columns.findIndex((column) => droppableIdEnd === column.id);
            const task = this.columns[startColumnIndex].tasks.splice(droppableIndexStart, 1);

            this.columns[endColumnIndex].tasks.splice(droppableIndexEnd, 0, ...task);
        }

        this.updateBoardAfterSort();
    }

    @action clearStore () {
        this.resetColumnInput();
        this.board = {
            title: '',
            _id: '',
            theme: '',
            columns: [],
            tasks: [],
        };
    }

    *_deleteColumn (columnId) {
        this.columns.filter((column) => column.id !== columnId);

        try {
            yield apiClient.delete(`board/column/${columnId}`);
        } catch (error) {
            this.boardError = error.response.data;
        }
    }
    deleteColumn = flow(this._deleteColumn);

    *_addColumn (newColumn) {
        const currentBoardId = this.board._id;
        this.columns.push(newColumn);

        try {
            yield apiClient.post(`board/${currentBoardId}/column`, newColumn);
        } catch (error) {
            this.boardError = error.response.data;
        }
    }
    addColumn = flow(this._addColumn);

    *_addTask (newTask, columnId) {
        const columnToAddTaskIndex = this.columns.findIndex((column) => column.id === columnId);

        this.columns[columnToAddTaskIndex].tasks.push(newTask);

        try {
            const { data } = yield apiClient.post(`board/${this.board._id}/column/${columnId}/task`, newTask);

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    addTask = flow(this._addTask);

    *_getBoard (boardId) {
        this.setLoadingBoard(true);

        try {
            const { data } = yield apiClient.get(`board/${boardId}`);

            this.board = data;

            this.setTasksToColumns(data);

            return [data, null];
        } catch (error) {
            return [null, error];
        } finally {
            this.setLoadingBoard(false);
        }
    }
    getBoard = flow(this._getBoard);

    *_updateBoardAfterSort () {
        try {
            const { data } = yield apiClient.post(`board/${this.board._id}/sort`, {
                columns: this.columns,
            });

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    updateBoardAfterSort = flow(this._updateBoardAfterSort);
}
