// http://redux.js.org/docs/advanced/AsyncActions.html#note-on-fetch
// Ensure Promise polyfill is present.
import "core-js";
import React from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js';

import Root from './Root';
import './index.css';
import configureStore from './redux/configureStore';

// Add hashcode method - See ListItem's `id` prop.
// eslint-disable-next-line
String.prototype.hashCode = function() {
    var hash = 0,
        i,
        chr,
        len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// http://stackoverflow.com/a/1144788/4988358
window.escapeRegExp = str => {
    // eslint-disable-next-line
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

// eslint-disable-next-line
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(window.escapeRegExp(search), 'g'), replacement);
};

window.generateUUID = () => {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
};

// configure sentry
if (process.env.NODE_ENV !== 'development') {
    Raven.config('https://4e4d1ac0c746404c90f4b0248a554a39@sentry.io/237417', {
        release: process.env.REACT_APP_VERSION,
    }).install();
} else {
    console.debug('Sentry not initialised, in development mode');
}

const { store, actions, history } = configureStore();

ReactDOM.render(<Root store={store} actions={actions} history={history} />, document.getElementById('root'));
