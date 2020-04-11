import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './Authentication/LoginPage';
import RegistrationPage from './Authentication/RegistrationPage';
import Board from './Board';

const App = () => (
    <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegistrationPage} />
        <Route path='/board' component={Board}/>
    </Switch>
);

export default App;
