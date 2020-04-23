import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { IoIosListBox, FaHome, FiLogOut } from 'react-icons/all';
import './NavBar.scss';
import NavBoardList from './NavBoardList';
import { CLIENT_URL } from '../../utils/api-client';

const NavBar = ({ history, dashboardStore }) => {
    const { isNavBoardListOpen } = dashboardStore;

    const navigateHome = useCallback(() => history.push('/dashboard/boards'), [history]);

    const setNavBoardListVisible = useCallback(
        (value) => () => {
            dashboardStore.setNavBoardListVisible(value);
        },
        [dashboardStore],
    );

    const logout = useCallback(() => {
        history.push('/login');
        localStorage.removeItem('auth-token');
    }, [history]);

    return (
        <div className='navbar-container'>
            <div className='boards-nav' onClick={navigateHome}>
                <FaHome />
            </div>
            <div className='boards-nav' onClick={setNavBoardListVisible(true)}>
                <IoIosListBox />
                <span>Boards</span>
            </div>
            {isNavBoardListOpen && <NavBoardList history={history} setNavBoardListVisible={setNavBoardListVisible} />}
            <FiLogOut className='logout boards-nav' onClick={logout} />
        </div>
    );
};

NavBar.propTypes = {
    history: PropTypes.object.isRequired,
    dashboardStore: PropTypes.object.isRequired,
};

export default observer(NavBar);
