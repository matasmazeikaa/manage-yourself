import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from './Authentication/LoginPage';
import Register from './Authentication/RegistrationPage';
import Dashboard from './Dashboard';
import apiClient, { setAxiosInterceptors } from '../utils/api-client';
import NotFoundPage from './NotFoundPage';

toast.configure();

setAxiosInterceptors(apiClient);

const App = () => (
    <Switch>
        <Route path='/' exact={true}>
            <Redirect to='/login' />
        </Route>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/dashboard/boards' component={Dashboard} />
        <Route path='/not-found' component={NotFoundPage} />
        <Route path='*'>
            <Redirect to='/not-found'/>
        </Route>
    </Switch>
);

export default App;
