import { createContext } from 'react';
import AuthorizationStore from '../store/AuthorizationStore';

export const storeContext = createContext({
    authorizationStore: AuthorizationStore,
});
