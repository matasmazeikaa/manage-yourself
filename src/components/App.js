import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './Authentication/LoginPage';

const App = () => (
    <Switch>
        <Route path='/login' component={LoginPage} />
        {/* <Route path='/register' component={} />*/}
    </Switch>
);

export default App;
