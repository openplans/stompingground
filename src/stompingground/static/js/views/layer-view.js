var Shareabouts = Shareabouts || {};

(function(S, $, console){
  S.LayerView = Backbone.View.extend({
     // A view responsible for the representation of a place on the map.
    initialize: function(){
      this.map = this.options.map;

      // A throttled version of the render function
      this.throttledRender = _.throttle(this.render, 300);

      // Bind model events
      this.model.on('change', this.updateLayer, this);
      this.model.on('focus', this.focus, this);
      this.model.on('unfocus', this.unfocus, this);

      // On map move, adjust the visibility of the markers for max efficiency
      this.map.on('move', this.throttledRender, this);

      this.initLayer();
    },
    initLayer: function() {
      var location, draggable;

      // Handle if an existing place type does not match the list of available
      // place types.
      this.placeType = this.options.placeTypes[this.model.get('location_type')];
      if (!this.placeType) {
        console.warn('Place type', this.model.get('location_type'),
          'is not configured so it will not appear on the map.');
        return;
      }

      location = this.model.get('location');
      this.latLng = L.latLng(location.lat, location.lng);

      // Default to true
      draggable = _.isUndefined(this.placeType.draggable) ? true : this.placeType.draggable;

      this.layer = L.marker(this.latLng, {
        icon: this.placeType['default'],
        clickable: draggable || this.placeType.clickable,
        draggable: draggable
      });

      // Focus on the marker onclick
      if (this.placeType.onPostInit) {
        this.placeType.onPostInit.call(this);
      }

      this.render();
    },
    updateLayer: function() {
      // Update the marker layer if the model changes and the layer exists
      this.removeLayer();
      this.initLayer();
    },
    removeLayer: function() {
      if (this.layer) {
        this.options.placeLayers.removeLayer(this.layer);
      }
    },
    render: function() {
      // Show if it is within the current map bounds
      var mapBounds = this.map.getBounds().pad(0.02);

      if (this.latLng) {
        if (mapBounds.contains(this.latLng)) {
          this.show();
        } else {
          this.hide();
        }
      }
    },
    focus: function() {
      if (this.placeType) {
        this.setIcon(this.placeType.focused);
      }
    },
    unfocus: function() {
      if (this.placeType) {
        this.setIcon(this.placeType['default']);
      }
    },
    remove: function() {
      this.removeLayer();
      this.map.off('move', this.throttledRender, this);
    },
    setIcon: function(icon) {
      if (this.layer) {
        this.layer.setIcon(icon);
      }
    },
    show: function() {
      if (this.layer) {
        this.options.placeLayers.addLayer(this.layer);
      }
    },
    hide: function() {
      this.removeLayer();
    }
  });

})(Shareabouts, jQuery, Shareabouts.Util.console);