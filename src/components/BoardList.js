import React, { useCallback, useEffect } from 'react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { GiHeartPlus, GiCancel } from 'react-icons/all';
import { useStore } from '../hooks/useStore';
import './BoardList.scss';
import { urlOrColor } from '../utils/theme-resolver';
import { toast } from 'react-toastify';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from './Common/Loader';

const BoardList = ({ history }) => {
    const { dashboardStore } = useStore();
    const { boards, isLoadingBoardList } = dashboardStore;

    const goToBoard = useCallback(
        (board) => () => {
            history.push(`/dashboard/boards/${board._id}`, board);
            NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
            });
        },
        [history],
    );

    const handleBoardDelete = useCallback((boardId) => async (event) => {
        event.stopPropagation();

        const [res, err] = await dashboardStore.deleteBoard(boardId);
    }, [dashboardStore]);

    useEffect(() => {
        dashboardStore.getBoards();
    }, [dashboardStore]);

    return (
        <div className='board-list-container'>
            {isLoadingBoardList && <Loader /> }
            <h3>Boards</h3>
            <div className='board-list-wrapper'>
                {boards.map((board, index) => board && (
                    <div key={index} style={urlOrColor(board.theme)} onClick={goToBoard(toJS(board))}>
                        <GiCancel className='delete-board' onClick={handleBoardDelete(board._id)}/>
                        <span>{board.title}</span>
                    </div>
                ))}
                <div className='add-board-button' onClick={dashboardStore.setBoardCreationInputVisible(true)}>
                    <GiHeartPlus />
                    <span>Add board!</span>
                </div>
            </div>
            <NotificationContainer />
        </div>
    );
};

BoardList.propTypes = {
    history: PropTypes.object.isRequired,
};

export default observer(BoardList);
