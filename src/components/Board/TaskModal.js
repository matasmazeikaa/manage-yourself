import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import TextArea from 'react-textarea-autosize';
import { MdSubtitles, MdDescription, MdComment, FiCheck, GiCancel } from 'react-icons/all';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TaskModal.scss';
import { useStore } from '../../hooks/useStore';
import { DEFAULT_CURRENT_TASK } from '../../store/BoardStore';

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

            boardStore.handleCurrentOpenTaskInput(name, value);
        },
        [boardStore],
    );

    const handleUpdateTask = useCallback(
        (value) => async () => {
            if (value === 'description') {
                boardStore.setDescriptionInputVisible(false)();
            }

            const [res, err] = await boardStore.updateTask();
        },
        [boardStore],
    );

    const handleCommentAdd = useCallback(
        async (event) => {
            if (event.key === 'Enter') {
                const [res, err] = await boardStore.addComment();
                boardStore.handleCommentInput('');
            }
        },
        [boardStore],
    );

    const handleCommentInput = useCallback(
        (event) => {
            const {
                target: { value },
            } = event;

            boardStore.handleCommentInput(value);
        },
        [boardStore],
    );

    const onEnterKey = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            if (title === '') {
                return;
            }

            boardStore.setCurrentOpenTaskTitleInputVisible(false)();
            handleUpdateTask()();
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
                    <GiCancel
                        className='cancel-add-task close-modal'
                        onClick={boardStore.setTaskModalVisible(false, DEFAULT_CURRENT_TASK)}
                    />
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
                            <span onClick={boardStore.setDescriptionInputVisible(true)} className='description'>
                                {description}
                            </span>
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
                                    <div className='save-description-wrapper' onClick={handleUpdateTask('description')}>
                                        <FiCheck />
                                        <span onClick={handleUpdateTask}>Save description</span>
                                    </div>
                                    <GiCancel
                                        className='cancel-add-task'
                                        onClick={description !== '' && boardStore.setDescriptionInputVisible(false)}
                                    />
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
                            <TextArea
                                className='comment-input'
                                placeholder='Leave a comment ...'
                                value={boardStore.comment}
                                onKeyPress={handleCommentAdd}
                                onChange={handleCommentInput}
                            />
                        </div>
                        <div className='comment-wrapper'>
                            {boardStore.currentTaskOpen.comments.map((comment, index) => (
                                <div key={index} className='comment-container'>
                                    <Avatar className='user-avatar'>{comment.user[0].substring(0, 2)}</Avatar>
                                    <div className='user-creation'>
                                        <span className='user'>{comment.user[0]}</span>
                                        <span>{moment(comment.creation_date).format('YYYY-MM-DD HH:mm')}</span>
                                    </div>
                                    <span>{comment.description}</span>
                                </div>
                            ))}
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
