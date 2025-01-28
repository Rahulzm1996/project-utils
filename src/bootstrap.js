/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// // Needed for redux-saga es6 generator support

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './QueryClient';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import CrashReporter from 'utils/crashReporter';
// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
/* eslint-enable import/no-unresolved, import/extensions */

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { initializeHelpHero } from 'utils/utils';
import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// package version
import pjson from '../package.json';
// import store from 'store';

// intialise crash reporter
CrashReporter();

// Create redux store with history
const initialState = {};
export const store = configureStore(initialState, history);

const helpHeroKey = process.env.REACT_APP_HELP_HERO_KEY;
export const helpHero = initializeHelpHero(helpHeroKey);

const MOUNT_NODE = document.getElementById('app');
const root = createRoot(MOUNT_NODE);
root.render(<App tab="home" />);

const render = messages => {
  root.render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <DndProvider backend={HTML5Backend}>
              <App />
            </DndProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    root.unmount();
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

window.leena = {
  version: pjson.version,
  name: pjson.name
};

window.permissions = {
  nudge: 'nudge',
  delete: 'delete',
  post: 'post',
  view: 'view',
  smartComments: 'smart-comments',
  analytics: 'analytics',
  all: '.*',
  settings: 'settings',
  bulkCreate: 'bulkCreate'
};

window.isMobile = false;
let isMobile = false;

try {
  isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
} catch (error) {
  console.log(error);
}

if (isMobile) {
  window.isMobile = true;
}

window.isIE = !!document.documentMode;

if (navigator && navigator.userAgent && navigator.userAgent.indexOf('Edge/18') > -1) {
  window.isIE = true;
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
