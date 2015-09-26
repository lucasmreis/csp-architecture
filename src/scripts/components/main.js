import React from 'react';
import {putAsync} from 'js-csp';

import CreateWord from './createWord';

export default class Main extends React.Component {
  view(direction) {
    const ch = this.props.updateChannels.view;
    return () => putAsync(ch, direction);
  }

  render() {
    const state = this.props.appState;
    const currentWord = state.words[state.current];
    return <div>
      <p>Current word: { currentWord }</p>
      <p>
        <a href='#' onClick={this.view('prev')}>Previous</a>
        <a href='#' onClick={this.view('next')}>Next</a>
      </p>
      <CreateWord complexActionsChannels={this.props.complexActionsChannels} loading={this.props.appState.loading}/>
      <pre>{ JSON.stringify(state, null, '  ') }</pre>
    </div>
  }
}