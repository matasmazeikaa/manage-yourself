import React, { useCallback, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { FiCheck, FiPlus, GiCancel } from 'react-icons/all';
import Task from './Task';
import { generateId } from '../../utils/id-generator';
import './Column.scss';
import OutsideClickHandler from '../Common/HandleOutsideClick';

const Column = ({ columnTitle, columnId, tasks, boardStore }) => {
    const { taskInput } = boardStore;
    const [isTaskInputOpen, setTaskInputOpen] = useState(false);
    const [isColumnEditVisible, setColumnEditVisible] = useState(false);

    const setTaskInputVisible = useCallback(
        (value) => () => {
            setTaskInputOpen(value);
        },
        [],
    );

    const setColumnEditInputVisible = useCallback(
        (value) => () => {
            if (value === true) {
                boardStore.handleColumnInput('title', columnTitle);
            }

            setColumnEditVisible(value);
        },
        [boardStore, columnTitle],
    );

    const addTask = useCallback(
        (columnId) => () => {
            if (!isTaskInputOpen) {
                setTaskInputVisible(true)();

                return;
            }

            if (taskInput.title.trim() === '') {
                return;
            }

            boardStore.addTask(
                {
                    title: taskInput.title,
                    columnId,
                    description: '',
                    comments: [],
                    id: generateId(),
                },
                columnId,
            );
            boardStore.resetTaskInput();
        },
        [boardStore, isTaskInputOpen, setTaskInputVisible, taskInput.title],
    );

    const addTaskOnEnter = useCallback(
        (event, columnId) => {
            if (event.key !== 'Enter') {
                return;
            }

            addTask(columnId)();
        },
        [addTask],
    );

    const updateColumnTitle = useCallback(async () => {
        if (boardStore.columnInputs.title === '') {
            return;
        }

        const [res, err] = await boardStore.updateColumnTitle(columnId, boardStore.columnInputs.title);
        setColumnEditVisible(false);
    }, [boardStore, columnId]);

    const deleteColumn = useCallback(async (event) => {
        event.stopPropagation();

        const [res, err] = await boardStore.deleteColumn(columnId);
    }, [boardStore, columnId]);

    const handleTaskInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            boardStore.handleTaskInput(name, value);
        },
        [boardStore],
    );

    const updateColumnTitleOnEnter = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            updateColumnTitle();
        },
        [updateColumnTitle],
    );

    const handleTaskTitleUpdateInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            boardStore.handleColumnInput(name, value);
        },
        [boardStore],
    );

    return (
        <div className='column-wrapper'>
            {!isColumnEditVisible ? (
                <h3 onClick={setColumnEditInputVisible(true)} className='column-title'>
                    {columnTitle}
                    <GiCancel className='cancel-add-task' onClick={deleteColumn} />
                </h3>
            ) : (
                <OutsideClickHandler isContainerOpen={isColumnEditVisible} onOutsideClick={setColumnEditInputVisible(false)}>
                    <input
                        className='column-input'
                        name='title'
                        onChange={handleTaskTitleUpdateInput}
                        value={boardStore.columnInputs.title}
                        onKeyDown={updateColumnTitleOnEnter}
                    />
                </OutsideClickHandler>
            )}
            <Droppable droppableId={columnId}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='column'>
                        {tasks.map((task, index) => (
                            <Task
                                title={task.title}
                                taskIndex={index}
                                taskId={task.id}
                                key={task.id}
                                boardStore={boardStore}
                                description={task.description}
                                comments={task.comments}
                                columnId={columnId}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {!isTaskInputOpen ? (
                <div className='add-task-button' onClick={addTask()}>
                    <FiPlus />
                    <span>Add task</span>
                </div>
            ) : (
                <div className='add-task-input-wrapper' onKeyDown={(event) => addTaskOnEnter(event, columnId)}>
                    <OutsideClickHandler isContainerOpen={isTaskInputOpen} onOutsideClick={setTaskInputVisible(false)}>
                        <TextArea className='add-task-input' name='title' value={taskInput.title} onChange={handleTaskInput} />
                        <div>
                            <div className='save-task-button' onClick={addTask(columnId)}>
                                <FiCheck />
                                <span>Save task</span>
                            </div>
                            <GiCancel className='cancel-add-task' onClick={setTaskInputVisible(false)} />
                        </div>
                    </OutsideClickHandler>
                </div>
            )}
        </div>
    );
};

Column.propTypes = {
    columnId: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
    boardStore: PropTypes.object.isRequired,
    columnTitle: PropTypes.string.isRequired,
};

export default observer(Column);
