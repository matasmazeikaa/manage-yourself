import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './Authentication/LoginPage';
import RegistrationPage from './Authentication/RegistrationPage';

const App = () => (
    <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegistrationPage} />
    </Switch>
);

export default App;
