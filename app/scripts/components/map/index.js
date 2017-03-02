'use strict';
import React from 'react';
import { connect } from 'react-redux';
import glSupported from 'mapbox-gl-supported';
import { mapboxgl, MapboxDraw } from '../../util/window';
import drawStyles from './styles/mapbox-draw-styles';
import { updateSelection, updateSelectionHistory } from '../../actions';

const glSupport = glSupported();
const noGl = (
  <div className='nogl'>
    <p>Sorry, but your browser does not support GL.</p>
  </div>
);
const id = 'main-map-component';
const Map = React.createClass({
  initMap: function (el) {
    if (el && !this.map && glSupport) {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZWd5cHQiLCJhIjoiY2l6ZTk5YTNxMjV3czMzdGU5ZXNhNzdraSJ9.HPI_4OulrnpD8qI57P12tg';
      this.map = new mapboxgl.Map({
        center: [125.48, 9.7],
        container: el,
        scrollWheelZoom: false,
        style: 'mapbox://styles/mapbox/satellite-v9',
        zoom: 11
      });
      const draw = new MapboxDraw({
        styles: drawStyles,
        displayControlsDefault: false,
        controls: { trash: true, line_string: true }
      });
      this.map.addControl(draw);
      window.Draw = draw;
      this.map.on('draw.create', () => {
        setTimeout(() => this.props.dispatch(updateSelectionHistory()), 20);
      });
      this.map.on('draw.delete', () => {
        setTimeout(() => this.props.dispatch(updateSelectionHistory()), 20);
      });
      this.map.on('draw.update', () => {
        setTimeout(() => this.props.dispatch(updateSelectionHistory()), 20);
      });
      this.map.on('draw.selectionchange', (e) => {
        this.props.dispatch(updateSelection(e.features));
      });
    }
  },

  // componentWillReceiveProps: function (nextProps) {
  //   nextProps.selection.
  // },

  render: function () {
    if (!glSupport) { return noGl; }
    return (
      <div className='map__container' ref={this.initMap} id={id}></div>
    );
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    selection: React.PropTypes.array
  }
});

function mapStateToProps (state) {
  return {
    selection: state.selection.present
  };
}

export default connect(mapStateToProps)(Map);
