import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useStore } from '../../hooks/useStore';
import { toJS } from 'mobx';
import { urlOrColor } from '../../utils/theme-resolver';
import OutsideClickHandler from '../Common/HandleOutsideClick';
import './NavBoardList.scss';

const NavBoardList = ({ history, setNavBoardListVisible }) => {
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
        <OutsideClickHandler isContainerOpen={dashboardStore.isNavBoardListOpen} onOutsideClick={setNavBoardListVisible(false)}>
            <div className='navbar-board-list-container'>
                <div className='board'>
                    {boards.map((board, index) => (
                        <div key={index} style={urlOrColor(board.theme)} onClick={goToBoard(toJS(board))}>
                            <span>{board.title}</span>
                        </div>
                    ))}
                </div>
                <span className='add-board' onClick={dashboardStore.setBoardCreationInputVisible(true)}>Add board</span>
            </div>
        </OutsideClickHandler>
    );
};

NavBoardList.propTypes = {
    history: PropTypes.object.isRequired,
    setNavBoardListVisible: PropTypes.func.isRequired,
};

export default observer(NavBoardList);
