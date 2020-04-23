import { action, observable, flow, toJS } from 'mobx';
import apiClient from '../utils/api-client';
import { Board, DashboardStore } from './DashboardStore';

export const DEFAULT_CURRENT_TASK = {
    id: '',
    title: '',
    description: '',
    comments: [],
    columnId: '',
};

export interface Column {
    title: string;
    id: string;
    tasks: any;
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

    @observable comment = '';

    @observable currentTaskOpen = {
        id: '',
        title: '',
        description: '',
        comments: [],
        columnId: '',
    };
    @observable isDescriptionInputVisible = false;
    @observable isCurrentOpenTaskTitleInputVisible = false;

    @observable isColumnInputVisible = false;
    @observable isTaskInputVisible = false;
    @observable isTaskModalOpen = false;

    @observable isColumnTitleEditInputVisible = false;

    @observable isFetchingBoard = false;

    @observable boardError = null;

    @action handleTaskInput (name, value) {
        if (name === 'title') {
            this.taskInput[name] = value.replace(/\n|\r/g, '');

            return;
        }

        this.taskInput[name] = value;
    }

    @action handleCommentInput (value) {
        this.comment = value.replace(/\n|\r/g, '');
    }

    @action.bound handleCurrentOpenTaskInput (name, value) {
        if (name === 'title' && name === 'description') {
            this.taskInput[name] = value.replace(/\n|\r/g, '');

            return;
        }

        this.currentTaskOpen[name] = value;
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

    @action.bound setTaskModalVisible = (value, task) => () => {
        if (task.description === '') {
            this.isDescriptionInputVisible = true;
        }

        this.isTaskModalOpen = value;
        this.currentTaskOpen = task;
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

    @action setDescriptionInputVisible = (value: boolean) => () => {
        this.isDescriptionInputVisible = value;
    };

    @action setCurrentOpenTaskTitleInputVisible = (value: boolean) => () => {
        this.isCurrentOpenTaskTitleInputVisible = value;
    };

    @action setColumnTitleEditInputVisible (value: boolean) {
        this.isColumnTitleEditInputVisible = value;
    }

    @action setTasksToColumns (board) {
        const { columns } = board;
        const { tasks } = board;

        tasks.forEach((task) => {
            columns.forEach((column) => {
                if (task.columnId === column.id) {
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
            toJS((task[0].columnId = droppableIdEnd));

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

    @action updateTaskInColumn (columnId, taskId) {
        this.columns[columnId].title = `${this.columns[columnId].title} `;
        this.columns[columnId].tasks[taskId] = this.currentTaskOpen;
        this.columns[columnId].title.trim();
    }

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

    *_updateTask () {
        const indexOfColumn = this.columns.findIndex((column) => column.id === this.currentTaskOpen.columnId);
        const taskIndex = this.columns[indexOfColumn].tasks.findIndex((task) => task.id === this.currentTaskOpen.id);
        this.updateTaskInColumn(indexOfColumn, taskIndex);

        try {
            const { data } = yield apiClient.put(`board/${this.board._id}/task/${this.currentTaskOpen.id}`, {
                description: this.currentTaskOpen.description,
                title: this.currentTaskOpen.title,
            });

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    updateTask = flow(this._updateTask);

    *_deleteTask (taskId, columnId) {
        const columnIndex = this.columns.findIndex((column) => column.id === columnId);
        const taskIndex = this.columns[columnIndex].tasks.findIndex((task) => task && task.id === taskId);

        delete this.columns[columnIndex].tasks[taskIndex];
        this.columns[columnIndex].title = `${this.columns[columnIndex].title} `;
        this.columns[columnIndex].title.trim();

        try {
            const { data } = yield apiClient.delete(`board/${this.board._id}/task/${taskId}`);

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    deleteTask = flow(this._deleteTask);

    *_updateColumnTitle (columnId, title) {
        // @ts-ignore
        this.columns.find((column) => column.id === columnId).title = this.columnInputs.title;
        this.columnInputs.title = '';
        this.isColumnTitleEditInputVisible = false;

        try {
            const { data } = yield apiClient.put(`board/${this.board._id}/column/${columnId}`, {
                title,
            });

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    updateColumnTitle = flow(this._updateColumnTitle);

    *_deleteColumn (columnId) {
        // @ts-ignore
        const columnIndex = this.columns.findIndex((column) => column.id === columnId);
        this.columns.splice(columnIndex, 1);

        try {
            const { data } = yield apiClient.delete(`board/${this.board._id}/column/${columnId}`);

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    deleteColumn = flow(this._deleteColumn);

    *_addComment () {
        try {
            const { data } = yield apiClient.post(`board/${this.board._id}/task/${this.currentTaskOpen.id}/comments`, {
                description: this.comment,
            });

            // @ts-ignore
            this.currentTaskOpen.comments.push(data);

            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
    addComment = flow(this._addComment);
}
