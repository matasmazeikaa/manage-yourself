import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import NavBar from './Dashboard/NavBar';
import Board from './Board';
import { Route, Switch } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import BoardList from './BoardList';
import BoardCreation from './Dashboard/BoardCreation';

const Dashboard = ({ history }) => {
    const { dashboardStore } = useStore();
    const { isBoardCreationInputVisible } = dashboardStore;
    console.log(isBoardCreationInputVisible);

    return (
        <>
            <NavBar history={history} dashboardStore={dashboardStore}/>
            {isBoardCreationInputVisible && <BoardCreation dashboardStore={dashboardStore} />}
            <Switch>
                <Route path='/dashboard/boards' component={BoardList} exact={true} />
                <Route path='/dashboard/boards/:id' component={Board}/>
            </Switch>
        </>
    );
};

Dashboard.propTypes = {
    history: PropTypes.object.isRequired,
};

export default observer(Dashboard);
