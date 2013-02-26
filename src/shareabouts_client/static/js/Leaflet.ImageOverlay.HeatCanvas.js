/*
 * L.ImageOverlay.Canvas is used to overlay HTML5 canvases over the map (to specific geographical bounds).
 */

L.ImageOverlay.HeatCanvas = L.ImageOverlay.Canvas.extend({
  options: {
    step: 1,
    degree: HeatCanvas.LINEAR,
    opacity: 0.6,
    colorscheme: null
  },

  initialize: function (data, options) { // ([[latLng, value], ...], Object)
    var i, len;

    this._bounds = L.latLngBounds([data[0][0], data[0][0]]);

    for (i=1, len=data.length; i<len; i++) {
      this._bounds.extend(data[i][0]);
    }

    this.data = data;
    L.setOptions(this, options);
  },

  _initImage: function () {
    L.ImageOverlay.Canvas.prototype._initImage.call(this);

    //this.canvas is a thing
    this.heatCanvas = new HeatCanvas(this.canvas);
    this.heatCanvas.bgcolor = this.options.bgcolor;
  },

  _reset: function () {
    var canvas   = this.canvas,
        topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft),
        i, len, pixel;

    L.DomUtil.setPosition(canvas, topLeft);

    this.heatCanvas.resize(size.x, size.y);

    this.heatCanvas.clear();
    for (i=0, len=this.data.length; i<len; i++) {
      pixel = this._map.latLngToLayerPoint(this.data[i][0]);
      this.heatCanvas.push(
              Math.floor(pixel.x - topLeft.x),
              Math.floor(pixel.y - topLeft.y),
              this.data[i][1]);
    }
    this.heatCanvas.render(this.options.step, this.options.degree, this.options.colorscheme);
  }
});

L.imageOverlay.heatCanvas = function (data, options) {
  return new L.ImageOverlay.HeatCanvas(data, options);
};