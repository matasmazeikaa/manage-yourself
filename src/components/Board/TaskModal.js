import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import TextArea from 'react-textarea-autosize';
import { MdSubtitles, MdDescription, MdComment, FiCheck, GiCancel } from 'react-icons/all';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import './TaskModal.scss';
import { useStore } from '../../hooks/useStore';

const TaskModal = () => {
    const { boardStore } = useStore();
    const {
        currentTaskOpen: { title, description, comments },
    } = boardStore;

    const handleTaskInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            console.log(name, value);

            boardStore.handleCurrentOpenTaskInput(name, value);
        },
        [boardStore],
    );

    const handleUpdateTask = useCallback(async () => {
        const [res, err] = await boardStore.updateTask();

        if (!err) {
            console.log('nice');
        }
    }, [boardStore]);

    const onEnterKey = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            if (title === '') {
                return;
            }

            boardStore.setCurrentOpenTaskTitleInputVisible(false)();
            handleUpdateTask();
        },
        [boardStore, handleUpdateTask, title],
    );

    return (
        <Modal
            open={boardStore.isTaskModalOpen}
            onClose={boardStore.setTaskInputVisible(false, '')}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
        >
            <div className='modalWrapper'>
                <div className='content'>
                    <div className='section'>
                        <MdSubtitles />
                        {!boardStore.isCurrentOpenTaskTitleInputVisible ? (
                            <h1 onClick={boardStore.setCurrentOpenTaskTitleInputVisible(true)}>{title}</h1>
                        ) : (
                            <input
                                value={boardStore.currentTaskOpen.title}
                                name='title'
                                className='title-input'
                                onChange={handleTaskInput}
                                onKeyPress={onEnterKey}
                            />
                        )}
                    </div>
                    <div className='section description-section'>
                        <div className='description-wrapper'>
                            <MdDescription />
                            <h1>Description</h1>
                        </div>
                        {!boardStore.isDescriptionInputVisible ? (
                            <span onClick={boardStore.setDescriptionInputVisible(true)}>{description}</span>
                        ) : (
                            <>
                                <TextArea
                                    onChange={handleTaskInput}
                                    className='description-input'
                                    placeholder='Enter your description here ...'
                                    value={description}
                                    name='description'
                                />
                                <div className='save-description-container'>
                                    <div className='save-description-wrapper'>
                                        <FiCheck />
                                        <span onClick={handleUpdateTask}>Save description</span>
                                    </div>
                                    <GiCancel className='cancel-add-task' onClick={boardStore.setDescriptionInputVisible(false)} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className='section description-section'>
                        <div className='description-wrapper'>
                            <MdComment />
                            <h1>Comments</h1>
                        </div>
                        <div className='comments-wrapper'>
                            <Avatar className='avatar'>MM</Avatar>
                            <TextArea className='comment-input' placeholder='Leave a comment ...' />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

TaskModal.propTypes = {
    boardStore: PropTypes.object.isRequired,
};

export default observer(TaskModal);
