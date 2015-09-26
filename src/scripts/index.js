import Polyfill from 'babel/polyfill';
import {chan, go, take, put, putAsync, buffers} from 'js-csp';

import React from 'react';
import Main from './components/main';

import * as Updates from './updates';
import * as ComplexActions from './complexActions';

const loadApp = () => ({
  state: {
    words: ['first', 'second', 'last'],
    current: 0,
    loading: false
  },
  updates: {
    channels: {
      view: chan(),
      add: chan(),
      loading: chan()
    },
    consumers: {
      view: Updates.view,
      add: Updates.add,
      loading: Updates.loading
    }
  },
  complexActions: {
    channels: {
      dbInsert: chan()
    },
    consumers: {
      dbInsert: ComplexActions.dbInsert
    }
  },
  renderCh: chan(buffers.sliding(1))
});

const initUpdates = app => {
  Object.keys(app.updates.consumers).forEach(k => {
    const updateFn = app.updates.consumers[k];
    const ch = app.updates.channels[k];
    go(function* () {
      while (true) {
        const value = yield take(ch);
        console.log(`On update channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
        app.state = updateFn(app.state, value);
        yield put(app.renderCh, app.state);
      }
    });
  });
};

const initComplexActions = app => {
  Object.keys(app.complexActions.consumers).forEach(k => {
    const complexActionFn = app.complexActions.consumers[k];
    const ch = app.complexActions.channels[k];
    go(function* () {
      while (true) {
        const value = yield take(ch);
        console.log(`On complex action channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
        complexActionFn(app.updates.channels, value);
      }
    });
  });
};

const initRender = (app, element) => {
  putAsync(app.renderCh, app.state);

  go(function* () {
    while(true) {
      const state = yield take(app.renderCh);
      const finishRender = chan();
      React.render(
        <Main
          appState = {app.state}
          updateChannels = {app.updates.channels}
          complexActionsChannels = {app.complexActions.channels} />,
        element,
        () => window.requestAnimationFrame(() => putAsync(finishRender, {})));
      yield take(finishRender);
    }
  });
};

const start = () => {
  let app = loadApp();
  window.app = app; // for debugging and testing
  initUpdates(app);
  initComplexActions(app);
  initRender(app, document.getElementById('main'));
};

start();

window.csp = require('js-csp');