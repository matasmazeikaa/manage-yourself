import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../Common/Input';
import Button from '../Common/Button';
import './Authentication.scss';
import { useStore } from '../../hooks/useStore';

const RegistrationPage = () => {
    const { authorizationStore } = useStore();
    const register = () => {
        authorizationStore.register();
    };

    const handleChange = (event) => {
        const { target } = event;

        authorizationStore.handleAuthorizationInput(target.name, target.value);
    };

    console.log(authorizationStore.values);

    return (
        <div className='page-container'>
            <h1>Register</h1>
            <div className='login-input-container'>
                <Input placeholder='Username' name='username' onChange={handleChange}/>
                <Input placeholder='Email' name='email' onChange={handleChange}/>
                <Input placeholder='Password' name='password' onChange={handleChange}/>
                <Button name='login' title='Register' onClick={register}/>
                <Link to={'/login'} className='register-link'>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default RegistrationPage;
