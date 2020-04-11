import { createContext } from 'react';
import AuthorizationStore from '../store/AuthorizationStore';
import { BoardStore } from '../store/BoardStore';

const boardStore = new BoardStore();

export const storeContext = createContext({
    authorizationStore: AuthorizationStore,
    boardStore,
});
