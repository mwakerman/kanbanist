import React from 'react';
import { Provider } from 'react-redux';
import App from './App';

export const Root = ({ store, actions, history }) => {
    return (
        <Provider store={store}>
            <App actions={actions} history={history} />
        </Provider>
    );
};

export default Root;
