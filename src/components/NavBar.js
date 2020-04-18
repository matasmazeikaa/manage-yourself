import React from 'react';
import { IoIosListBox, FaHome } from 'react-icons/all';
import './NavBar.scss';

const NavBar = () => (
    <div className='navbar-container'>
        <div className='boards-nav '>
            <FaHome />
        </div>
        <div className='boards-nav '>
            <IoIosListBox />
            <span>Boards</span>
        </div>
    </div>
);

export default NavBar;
