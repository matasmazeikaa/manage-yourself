import React, { useEffect } from 'react';
import { GiHeartPlus } from 'react-icons/all';
import { useStore } from '../hooks/useStore';
import './BoardList.scss';

const BoardList = () => {
    const { dashboardStore } = useStore();
    const hi = '';


    useEffect(() => {
        dashboardStore.getBoards();
    });

    return (
        <div className='board-list-container'>
            <div>
                <h3>Boards</h3>
                <div className='add-board-button'>
                    <GiHeartPlus />
                    <span>Add board!</span>
                </div>
            </div>
        </div>
    );
};

export default BoardList;
