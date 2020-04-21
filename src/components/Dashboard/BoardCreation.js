import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { GiCancel } from 'react-icons/all';
import ThemeGrid from './ThemeGrid';
import './BoardCreation.scss';
import OutsideClickHandler from '../Common/HandleOutsideClick';
import { urlOrColor } from '../../utils/theme-resolver';

const BoardCreation = ({ dashboardStore }) => {
    const { boardForm, isBoardCreationInputVisible } = dashboardStore;

    const handleBoardCreation = useCallback(
        async (event) => {
            event.preventDefault();

            if (!boardForm.title) {
                return;
            }

            const [_res, err] = await dashboardStore.addBoard({
                title: boardForm.title,
                theme: boardForm.theme,
            });

            if (!err) {
                dashboardStore.setBoardCreationInputVisible(false)();
            }
        },
        [boardForm.theme, boardForm.title, dashboardStore],
    );

    const addBoardOnEnter = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            handleBoardCreation();
        },
        [handleBoardCreation],
    );

    const handleBoardInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            dashboardStore.setBoardInput(name, value);
        },
        [dashboardStore],
    );

    return (
        <div className='board-creation-wrapper'>
            <OutsideClickHandler
                isContainerOpen={isBoardCreationInputVisible}
                onOutsideClick={dashboardStore.setBoardCreationInputVisible(false)}
            >
                <div className='container'>
                    <form>
                        <div className='input-wrapper' style={urlOrColor(boardForm.theme)}>
                            <GiCancel onClick={dashboardStore.setBoardCreationInputVisible(false)} />
                            <input
                                className='input'
                                placeholder='Add title'
                                name='title'
                                onChange={handleBoardInput}
                                onKeyDown={addBoardOnEnter}
                            />
                        </div>
                        <ThemeGrid dashboardStore={dashboardStore} />
                    </form>

                    <span className='add-board-confirm' onClick={handleBoardCreation}>
                        Create board
                    </span>
                </div>
            </OutsideClickHandler>
        </div>
    );
};

BoardCreation.propTypes = {
    dashboardStore: PropTypes.object.isRequired,
};

export default observer(BoardCreation);
