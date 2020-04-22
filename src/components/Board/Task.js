import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import './Task.scss';

const Task = ({ taskId, taskIndex, title, boardStore, description, comments, columnId }) => (
    <Draggable draggableId={String(taskId)} index={taskIndex}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className='task'
                onClick={boardStore.setTaskModalVisible(true, { id: taskId, title, description, comments, columnId })}
            >
                <div>{title}</div>
            </div>
        )}
    </Draggable>
);

Task.propTypes = {
    taskId: PropTypes.string.isRequired,
    taskIndex: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    boardStore: PropTypes.object.isRequired,
    description: PropTypes.string,
    comments: PropTypes.array,
    columnId: PropTypes.string,
};

export default observer(Task);
