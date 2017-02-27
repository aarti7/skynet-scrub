'use strict';
import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwZWd5cHQiLCJhIjoiY2l6ZTk5YTNxMjV3czMzdGU5ZXNhNzdraSJ9.HPI_4OulrnpD8qI57P12tg';
const id = 'main-map-component';

const Map = React.createClass({
  displayName: 'Map',

  initMap: function (el) {
    if (el && !this.map) {
      this.map = new mapboxgl.Map({
        center: [125.48, 9.7],
        container: el,
        scrollWheelZoom: false,
        style: 'mapbox://styles/mapbox/satellite-v9',
        zoom: 11
      });
    }
  },

  render: function () {
    return (
      <div className='map__container' ref={this.initMap} id={id}></div>
    );
  }
});
export default connect(state => state)(Map);
