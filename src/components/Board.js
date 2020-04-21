import React, { useCallback, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { FiPlus, FiCheck, GiCancel } from 'react-icons/all';
import Column from './Board/Column';
import { useStore } from '../hooks/useStore';
import { generateId } from '../utils/id-generator';
import './Board.scss';
import './Board/Column.scss';
import OutsideClickHandler from './Common/HandleOutsideClick';
import TaskModal from './Board/TaskModal';

const backgroundTheme = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '-1',
};

const Board = ({ match }) => {
    const { boardStore } = useStore();
    const { columns, isColumnInputVisible, columnInputs, board } = boardStore;

    const addColumn = useCallback(() => {
        if (!isColumnInputVisible) {
            boardStore.setColumnInputVisible(true);

            return;
        }

        if (columnInputs.title.trim() === '') {
            return;
        }

        boardStore.addColumn({
            title: columnInputs.title,
            id: generateId(),
            tasks: [],
        });
        boardStore.resetColumnInput();
    }, [boardStore, columnInputs.title, isColumnInputVisible]);

    const setColumnTitleInputVisible = useCallback(
        (value) => () => {
            boardStore.setColumnInputVisible(value);
        },
        [boardStore],
    );

    const handleColumnTitleInput = useCallback(
        (event) => {
            const {
                target: { name, value },
            } = event;

            boardStore.handleColumnInput(name, value);
        },
        [boardStore],
    );

    const addColumnOnEnter = useCallback(
        (event) => {
            if (event.key !== 'Enter') {
                return;
            }

            addColumn();
        },
        [addColumn],
    );

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        console.log(destination, source, draggableId);

        if (!destination) {
            return;
        }

        boardStore.sortTask(source.droppableId, destination.droppableId, source.index, destination.index, draggableId);
    };

    const urlOrColor = () => {
        if (board.theme.charAt(0) === '#') {
            return { backgroundColor: board.theme, ...backgroundTheme };
        }

        return { background: `url(${board.theme}) no-repeat center center fixed`, ...backgroundTheme };
    };

    useEffect(() => {
        console.log(match.params.id);
        if (match.params.id !== undefined) {
            console.log(1);
            boardStore.getBoard(match.params.id);
        }

        return () => boardStore.clearStore();
    }, [boardStore, boardStore.set, match, match.params.id]);

    return (
        <div className='board'>
            <div style={urlOrColor()} className='background' />
            <DragDropContext onDragEnd={onDragEnd}>
                <h2>{board.title}</h2>
                <div className='boardContainer'>
                    {columns.map((column) => (
                        <Column
                            columnTitle={column.title}
                            tasks={column.tasks}
                            columnId={column.id}
                            key={column.id}
                            boardStore={boardStore}
                        />
                    ))}
                    <div style={{ height: '100%' }}>
                        <div className={cx('add-column-wrapper', isColumnInputVisible && 'add-column-wrapper-padding')}>
                            <OutsideClickHandler isContainerOpen={isColumnInputVisible} onOutsideClick={setColumnTitleInputVisible(false)}>
                                {!isColumnInputVisible ? (
                                    <div className='add-column-button' onClick={addColumn}>
                                        <FiPlus />
                                        <span>Add column</span>{' '}
                                    </div>
                                ) : (
                                    <input
                                        className='column-input'
                                        name='title'
                                        onChange={handleColumnTitleInput}
                                        value={columnInputs.title}
                                        onKeyDown={addColumnOnEnter}
                                    />
                                )}

                                <div className={cx(!isColumnInputVisible ? 'add-column-save-hidden' : 'add-column-save-visible')}>
                                    <div className='save-column-button-wrapper'>
                                        <div className='save-column-button' onClick={addColumn}>
                                            <FiCheck />
                                            <span>Add column</span>
                                        </div>
                                        <GiCancel className='cancel-add-task' onClick={setColumnTitleInputVisible(false)} />
                                    </div>
                                </div>
                            </OutsideClickHandler>
                        </div>
                    </div>
                </div>
            </DragDropContext>
            <TaskModal boardStore={boardStore}/>
        </div>
    );
};

Board.propTypes = {
    match: PropTypes.object,
};

export default observer(Board);
