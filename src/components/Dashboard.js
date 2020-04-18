import React from 'react';
import NavBar from './NavBar';
import Board from './Board';
import { Route, Switch } from 'react-router-dom';
import BoardList from './BoardList';

const Dashboard = () => {
    const hi = '';

    return (
        <div>
            <NavBar />
            <Switch>
                <Route path='/dashboard/boards' component={BoardList} />
                <Route path='/dashboard/board' component={Board} />
            </Switch>
        </div>
    );
};

export default Dashboard;
