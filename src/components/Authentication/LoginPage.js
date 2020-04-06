import React from 'react';
import './Authentication.scss';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { Link } from 'react-router-dom';

const LoginPage = () => (
    <div className='page-container'>

        <h1>Log in</h1>
        <div className='login-input-container'>
            <Input placeholder='Username' name='Hi' />
            <Input placeholder='Password' name='Hi' />
            <Button name='login' title='Login'/>
            <Link to={'/register'} className='register-link'>Register</Link>
        </div>

    </div>
);

export default LoginPage;
