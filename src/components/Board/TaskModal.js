import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import './TaskModal.scss';

const TaskModal = ({ boardStore }) => {
    return (
        <Modal
            open={boardStore.isTaskModalOpen}
            onClose={boardStore.setTaskInputVisible(false, '')}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
        >
            <div className='modalWrapper'>
                <div className='content'>
                    <div className='header'>
                        <h1>Title</h1>
                        <span>Icon</span>
                    </div>
                    <div>
                        <span>Description</span>
                        <span>Icon</span>
                    </div>
                    <div>
                        <span>Comment</span>
                        <span>Icon</span>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

TaskModal.propTypes = {
    boardStore: PropTypes.object.isRequired,
};

export default observer(TaskModal);
