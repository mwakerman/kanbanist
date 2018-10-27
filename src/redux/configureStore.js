import { applyMiddleware, bindActionCreators, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import Raven from 'raven-js';

import { load, save, LOCAL_STORAGE_NAMESPACE } from './localStoragePersistence';

import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

// Redux modules.
import * as lists from './modules/lists';
import * as user from './modules/user';
import * as ui from './modules/ui';

// Middleware
import todoistPersistenceMiddleware from './middleware/todoist-persistence';
import trelloistFilterUrlMiddleware from './middleware/trelloist-filter-url';
const emptyMiddleware = store => next => action => next(action);

const sentryMiddleware = store => next => action => {
    switch (action.type) {
        case user.types.LOGIN: {
            const user = action.payload;
            Raven.setUserContext({
                userId: user.id,
                userTz: user.tz_info.timezone,
                premium: user.is_premium,
            });
            break;
        }
        default:
        // no-op
    }
    next(action);
};

export const configureStore = () => {
    const reducer = combineReducers({
        lists: lists.reducer,
        user: user.reducer,
        ui: ui.reducer,
        router: routerReducer,
    });

    const logger = process.env.NODE_ENV === 'development' ? createLogger({ collapsed: true }) : emptyMiddleware;

    const history = createHistory();

    const middleware = applyMiddleware(
        logger,
        sentryMiddleware,
        todoistPersistenceMiddleware,
        save({ namespace: LOCAL_STORAGE_NAMESPACE }),
        thunk,
        routerMiddleware(history),
        trelloistFilterUrlMiddleware
    );

    // If we change the localStorage schema, loading will fail. So if we can't load
    // then we don't and the next store save will overwrite.
    let initialState = {};
    try {
        initialState = load();
    } catch (ex) {
        console.error('Could not load initialState from localStorage.', ex);
        localStorage.clear();
    }

    const store = createStore(reducer, initialState, middleware);

    const actions = {
        lists: bindActionCreators(lists.actions, store.dispatch),
        user: bindActionCreators(user.actions, store.dispatch),
        ui: bindActionCreators(ui.actions, store.dispatch),
    };
    return { store, actions, history };
};

export default configureStore;
