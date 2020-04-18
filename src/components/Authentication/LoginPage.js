import React from 'react';
import PropTypes from 'prop-types';
import './Authentication.scss';
import { useStore } from '../../hooks/useStore';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { Link } from 'react-router-dom';

const LoginPage = ({ history }) => {
    const { authorizationStore } = useStore();

    const login = async () => {
        const response = await authorizationStore.login();
        console.log(response);

        if (!response.errors) {
            history.push('/board');
        }
    };

    return (
        <div className='page-container'>
            <h1>Log in</h1>
            <div className='login-input-container'>
                <Input placeholder='Email' name='email' onChange={authorizationStore.handleAuthorizationInput} />
                <Input placeholder='Password' name='password' onChange={authorizationStore.handleAuthorizationInput} />
                <Button name='login' title='Login' onClick={login} />
                <Link to={'/register'} className='register-link'>
                    Register
                </Link>
            </div>
        </div>
    );
};

LoginPage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default LoginPage;
