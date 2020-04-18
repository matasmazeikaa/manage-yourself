import { action, observable, flow } from 'mobx';
import apiClient from '../utils/api-client';

interface Column {
    title: string;
    id: string;
    tasks: Task[];
}

interface Task {
    title: string;
    description: string;
    id: string;
}

export class BoardStore {
    @observable columns: Column[] = [
        {
            title: 'hello',
            id: '23213123',
            tasks: [
                {
                    title: '1',
                    id: '1',
                    description: '',
                },
                {
                    title: '2',
                    id: '2',
                    description: '',
                },
                {
                    title: '3',
                    id: '3',
                    description: '',
                },
                {
                    title: '4',
                    id: '4',
                    description: '',
                },
                {
                    title: '5',
                    id: '5',
                    description: '',
                },
            ],
        },
    ];
    @observable columnInputs = {
        title: '',
    };
    @observable taskInput = {
        title: '',
        description: '',
    };

    @observable isColumnInputVisible = false;
    @observable isTaskInputVisible = false;

    @observable boardError = null;

    @action handleTaskInput(name, value) {
        if (name === 'title') {
            this.taskInput[name] = value.replace(/\n|\r/g, '');

            return;
        }

        this.taskInput[name] = value;
    }

    @action.bound handleColumnInput(name, value) {
        console.log(name, value);
        this.columnInputs[name] = value;
    }

    @action renameColumn(columnId, newTitle) {
        const columnToRenameIndex = this.columns.findIndex((column) => column.id === columnId);

        this.columns[columnToRenameIndex].title = newTitle;
    }

    @action addTask(newTask, columnId) {
        const columnToAddTaskIndex = this.columns.findIndex((column) => column.id === columnId);

        this.columns[columnToAddTaskIndex].tasks.push(newTask);
    }

    @action editTask(newTask, columnId, taskId) {
        const columnToEditTaskIndex = this.columns.findIndex((column) => column.id === columnId);
        const taskToEditIndex = this.columns[columnToEditTaskIndex].tasks.findIndex((task) => task.id === taskId);

        this.columns[columnToEditTaskIndex].tasks[taskToEditIndex] = newTask;
    }

    @action.bound sortTask(droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd) {
        if (droppableIdStart === droppableIdEnd) {
            const sourceIndex = this.columns.findIndex((column) => droppableIdStart === column.id);
            const removedTask = this.columns[sourceIndex].tasks.splice(droppableIndexStart, 1);

            this.columns[sourceIndex].tasks.splice(droppableIndexEnd, 0, ...removedTask);
        } else {
            const startColumnIndex = this.columns.findIndex((column) => droppableIdStart === column.id);
            const endColumnIndex = this.columns.findIndex((column) => droppableIdEnd === column.id);
            const task = this.columns[startColumnIndex].tasks.splice(droppableIndexStart, 1);
            console.log(droppableIndexEnd);
            this.columns[endColumnIndex].tasks.splice(droppableIndexEnd, 0, ...task);
        }
    }

    @action resetColumnInput() {
        this.columnInputs = {
            title: '',
        };
    }

    @action resetTaskInput() {
        this.taskInput = {
            title: '',
            description: '',
        };
    }

    @action setColumnInputVisible(value: boolean) {
        this.isColumnInputVisible = value;
    }

    @action.bound setTaskInputVisible(value: boolean) {
        this.isTaskInputVisible = value;
    }

    *_deleteColumn(columnId) {
        this.columns.filter((column) => column.id !== columnId);

        try {
            yield apiClient.delete(`board/column/${columnId}`);
        } catch (error) {
            this.boardError = error.response.data;
        }
    }
    deleteColumn = flow(this._deleteColumn);

    *_addColumn (newColumn) {
        this.columns.push(newColumn);

        try {
            yield apiClient.put('board/column', newColumn);
        } catch (error) {
            this.boardError = error.response.data;
        }
    }
    addColumn = flow(this._addColumn);
}
