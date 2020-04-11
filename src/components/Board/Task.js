import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import './Task.scss';

const Task = ({ taskId, taskIndex, title }) => {
    const handleTaskEdit = () => 'hi';

    return (
        <Draggable draggableId={String(taskId)} index={taskIndex}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='task'>
                    <div>{title}</div>
                </div>
            )}
        </Draggable>
    );
};

Task.propTypes = {
    taskId: PropTypes.string.isRequired,
    taskIndex: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

export default observer(Task);
