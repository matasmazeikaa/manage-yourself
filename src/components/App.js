import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginPage from './Authentication/LoginPage';
import RegistrationPage from './Authentication/RegistrationPage';
import Board from './Board';
import Dashboard from './Dashboard';
import apiClient, { setAxiosInterceptors } from '../utils/api-client';

toast.configure();

setAxiosInterceptors(apiClient);

const App = () => (
    <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegistrationPage} />
        <Route path='/dashboard/boards' component={Dashboard} />
    </Switch>
);

export default App;
