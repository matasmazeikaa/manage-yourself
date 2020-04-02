import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Input.scss';

const Input = ({ placeholder, name }) => {
    const hello = 'hi';

    return (
        <div className='formGroup'>
            <input type='input' className='formField' placeholder={placeholder} name={name} required/>
            <label htmlFor='name' className='formLabel'>{placeholder}</label>
        </div>
    );
};

Input.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default Input;
