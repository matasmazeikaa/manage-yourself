import React from 'react';
import './Authentication.scss';
import Input from '../Common/Input';

const LoginPage = () => (
    <div className='page-container'>

        <h1>Log in</h1>
        <div className='login-input-container'>
            <Input placeholder='Username' name='Hi' />
            <Input placeholder='Password' name='Hi' />
        </div>

    </div>
);

export default LoginPage;
