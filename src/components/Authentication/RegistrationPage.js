import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Input from '../Common/Input';
import Button from '../Common/Button';
import './Authentication.scss';
import { useStore } from '../../hooks/useStore';

const RegistrationPage = ({ history }) => {
    const { authorizationStore } = useStore();

    const register = async () => {
        const response = await authorizationStore.register();

        if (!response.errors) {
            authorizationStore.resetAuthorizationStoreInputValues();
            history.push('/login');
        }
    };

    return (
        <div className='page-container'>
            <h1>Register</h1>
            <div className='login-input-container'>
                <Input
                    placeholder='Username'
                    name='username'
                    onChange={authorizationStore.handleAuthorizationInput}
                />
                <Input placeholder='Email' name='email' onChange={authorizationStore.handleAuthorizationInput} />
                <Input
                    placeholder='Password'
                    name='password'
                    onChange={authorizationStore.handleAuthorizationInput}
                />
                <Button name='login' title='Register' onClick={register} />
                <Link to={'/login'} className='register-link'>
                    Login
                </Link>
            </div>
        </div>
    );
};

RegistrationPage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default RegistrationPage;
