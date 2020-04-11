import React, { useCallback } from 'react';
import cx from 'classnames';
import { observable } from 'mobx';
import { v5 as uuid } from 'uuid';
import { observer } from 'mobx-react';
import { DragDropContext } from 'react-beautiful-dnd';
import { FiPlus, FiCheck, GiCancel } from 'react-icons/all';
import Column from './Board/Column';
import { useStore } from '../hooks/useStore';
import Button from './Common/Button';
import { generateId } from '../utils/id-generator';
import Input from './Common/Input';
import './Board.scss';
import './Board/Column.scss';
import OutsideClickHandler from './Common/HandleOutsideClick';

const Board = () => {
    const { boardStore } = useStore();
    const { columns, isColumnInputVisible, columnInputs } = boardStore;

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

    return (
        <div style={{ overflowX: 'auto' }}>
            <div className='background' />
            <DragDropContext onDragEnd={onDragEnd}>
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
        </div>
    );
};

export default observer(Board);
