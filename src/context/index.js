import { createContext } from 'react';
import { AuthorizationStore } from '../store/AuthorizationStore';
import { BoardStore } from '../store/BoardStore';
import { DashboardStore } from '../store/DashboardStore';

const dashboardStore = new DashboardStore();
const boardStore = new BoardStore();
const authorizationStore = new AuthorizationStore();

export const storeContext = createContext({
    authorizationStore,
    boardStore,
    dashboardStore,
});
