import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

const Button = ({ title, name, onClick }) => {
    const hi = 'hi';

    return (
        <div className='button' id='button-6' onClick={onClick}>
            <div id='spin' />
            <a name={name}>{title}</a>
        </div>
    );
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Button;
