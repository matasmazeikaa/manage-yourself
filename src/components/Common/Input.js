import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './Input.scss';

const Input = ({ placeholder, name, onChange }) => {
    const hello = 'hi';

    return (
        <div className='formGroup'>
            <input type='input' className='formField' placeholder={placeholder} name={name} required onChange={onChange}/>
            <label htmlFor='name' className='formLabel'>{placeholder}</label>
        </div>
    );
};

Input.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Input;
