import React from 'react';
import {putAsync} from 'js-csp';

export default class CreateWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputText: ''};
  }

  handleChange(event) {
    this.setState({inputText: event.target.value});
  }

  create() {
    const text = this.state.inputText.trim();
    const ch = this.props.complexActionsChannels.dbInsert;
    putAsync(ch, text);
    this.setState({inputText: ''});
  }

  render() {
    const loading = this.props.loading;
    return loading ? <p>Adding word...</p> :
      <p>
        <input type='text' value={this.state.inputText} onChange={this.handleChange.bind(this)} />
        <a href='#' onClick={this.create.bind(this)}>Add...</a>
      </p>
  }
}