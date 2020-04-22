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

    const setTaskInputVisible = useCallback(
        (value) => () => {
            setTaskInputOpen(value);
        },
        [],
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

    // const setTaskInputVisible = useCallback(
    //     (value) => () => {
    //         boardStore.setTaskInputVisible(value);
    //     },
    //     [boardStore],
    // );

    const handleTaskInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            boardStore.handleTaskInput(name, value);
        },
        [boardStore],
    );

    return (
        <div className='column-wrapper'>
            <h3>{columnTitle}</h3>
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
