import { createContext } from 'react';
import AuthorizationStore from '../store/AuthorizationStore';
import { BoardStore } from '../store/BoardStore';
import { DashboardStore } from '../store/DashboardStore';

const boardStore = new BoardStore();
const dashboardStore = new DashboardStore();

export const storeContext = createContext({
    authorizationStore: AuthorizationStore,
    boardStore,
    dashboardStore,
});
