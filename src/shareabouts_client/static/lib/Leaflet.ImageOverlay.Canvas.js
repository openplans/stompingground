/*
 * L.ImageOverlay.Canvas is used to overlay HTML5 canvases over the map (to specific geographical bounds).
 */

L.ImageOverlay.Canvas = L.ImageOverlay.extend({
  options: {
    opacity: 1,
    // Should the pixel of the canvas resize on reset? If false, the CSS width
    // and height change but not the canvas pixel content. If true, then the
    // canvas is also resized and new data will need to be provided.
    resizeCanvas: false
  },

  initialize: function (bounds, options) { // (LatLngBounds, Object)
    this._bounds = L.latLngBounds(bounds);

    L.setOptions(this, options);
  },

  _initImage: function () {
    var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

    // Publicly accessible canvas to draw on.
    this.canvas = this._image = L.DomUtil.create('canvas', 'leaflet-image-layer');
    this.canvas.width  = size.x;
    this.canvas.height = size.y;

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this.canvas, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this.canvas, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    L.extend(this.canvas, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.bind(this._onImageLoad, this)
    });
  },

  _reset: function () {
    var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

    L.DomUtil.setPosition(this.canvas, topLeft);

    if (this.options.resizeCanvas) {
      this.canvas.width  = size.x;
      this.canvas.height = size.y;
    }

    this.canvas.style.width  = size.x + 'px';
    this.canvas.style.height = size.y + 'px';

    // This layer has updated itself per the map's viewreset event. Update
    // the canvas if you need to.
    this.fire('viewreset');
  }
});

L.imageOverlay.canvas = function (bounds, options) {
  return new L.ImageOverlay.Canvas(bounds, options);
};