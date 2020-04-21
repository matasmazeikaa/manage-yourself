import React, { useCallback, useEffect } from 'react';
import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { GiHeartPlus } from 'react-icons/all';
import { useStore } from '../hooks/useStore';
import './BoardList.scss';
import { urlOrColor } from '../utils/theme-resolver';

const BoardList = ({ history }) => {
    const { dashboardStore } = useStore();
    const { boards } = dashboardStore;

    const goToBoard = useCallback(
        (board) => () => {
            history.push(`/dashboard/boards/${board._id}`, board);
        },
        [history],
    );

    useEffect(() => {
        dashboardStore.getBoards();
    }, [dashboardStore]);

    return (
        <div className='board-list-container'>
            <h3>Boards</h3>
            <div className='board-list-wrapper'>
                {boards.map((board, index) => (
                    <div key={index} style={urlOrColor(board.theme)} onClick={goToBoard(toJS(board))}>
                        <span>{board.title}</span>
                    </div>
                ))}
                <div className='add-board-button' onClick={dashboardStore.setBoardCreationInputVisible(true)}>
                    <GiHeartPlus />
                    <span>Add board!</span>
                </div>
            </div>
        </div>
    );
};

BoardList.propTypes = {
    history: PropTypes.object.isRequired,
};

export default observer(BoardList);
