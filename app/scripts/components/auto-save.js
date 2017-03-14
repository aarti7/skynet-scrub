'use strict';
import React from 'react';
import { connect } from 'react-redux';
import * as autosave from '../util/auto-save';
import { compressChanges } from '../util/compress-changes';
import { fastForward, updateLocalStore } from '../actions';

export const AutoSave = React.createClass({

  componentWillMount: function () {
    const unsaved = autosave.getLocalActions();
    if (unsaved) {
      this.props.dispatch(updateLocalStore(unsaved));
    }
  },

  componentWillReceiveProps: function (newProps) {
    const { historyId, success } = newProps.save;
    const { past } = newProps.selection;
    if (success && autosave.getLocalActions()) {
      this.forget();
    } else if (past.length && historyId !== past[past.length - 1].historyId) {
      this.store(past, historyId);
    }
  },

  componentWillUnmount: function () {
    this.cancel();
  },

  store: function (past, historyId) {
    const compressed = historyId ? compressChanges(past, historyId) : compressChanges(past);
    autosave.saveLocalActions(compressed);
  },

  restore: function () {
    const { cached } = this.props.save;
    this.props.dispatch(fastForward(cached));
    this.forget();
  },

  forget: function () {
    this.props.dispatch(updateLocalStore(null));
    autosave.destroyLocalActions();
  },

  describeAction: function (action) {
    if (action.undo && action.redo) return 'Modified';
    else if (action.undo) return 'Deleted';
    else return 'Created';
  },

  renderCached: function (cached) {
    const items = cached.map(action => (
      <li key={action.id}><strong>{this.describeAction(action)}</strong>: {action.id}</li>
    ));
    return (
      <div>
        <ul className='cached'>{items}</ul>
        <button onClick={this.restore}>Restore</button>
        <button onClick={this.forget}>Forget about it</button>
      </div>
    );
  },

  render: function () {
    const { cached } = this.props.save;
    return (
      <div className='autosave'>
        { cached ? <div className='modal__cover'></div> : null }
        { cached ? (
          <div className='modal'>
            <div className='modal__inner'>
              {this.renderCached(cached)}
            </div>
          </div>
        ) : null }
      </div>
    );
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    selection: React.PropTypes.object,
    save: React.PropTypes.object
  }
});

function mapStateToProps (state) {
  return {
    selection: state.selection,
    save: state.save
  };
}

export default connect(mapStateToProps)(AutoSave);
