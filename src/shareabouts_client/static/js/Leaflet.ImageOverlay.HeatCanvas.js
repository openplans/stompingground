/*
 * L.ImageOverlay.Canvas is used to overlay HTML5 canvases over the map (to specific geographical bounds).
 */

L.ImageOverlay.HeatCanvas = L.ImageOverlay.Canvas.extend({
  options: {
    step: 1,
    degree: HeatCanvas.LINEAR,
    opacity: 1,
    colorscheme: null,
    resizeCanvas: true,
    bufferPixels: 0
  },

  initialize: function (data, options) { // ([[latLng, value], ...], Object)
    L.setOptions(this, options);

    this.setData(data);
  },

  setData: function(data) {
    var i, len, nePoint, swPoint;

    this._data = data;

    if (this.canvas) {
      this._reset();
    }
  },

  _initImage: function () {
    this._bounds = L.latLngBounds([this._data[0][0], this._data[0][0]]);

    for (i=1, len=this._data.length; i<len; i++) {
      this._bounds.extend(this._data[i][0]);
    }

    if (this.options.bufferPixels) {
      nePoint = this._map.project(this._bounds.getNorthEast());
      swPoint = this._map.project(this._bounds.getSouthWest());

      this._bounds.extend(this._map.unproject([nePoint.x + this.options.bufferPixels,
                                               nePoint.y - this.options.bufferPixels]));
      this._bounds.extend(this._map.unproject([swPoint.x - this.options.bufferPixels,
                                               swPoint.y + this.options.bufferPixels]));
    }

    L.ImageOverlay.Canvas.prototype._initImage.call(this);

    //this.canvas is a thing
    this.heatCanvas = new HeatCanvas(this.canvas);
    this.heatCanvas.bgcolor = this.options.bgcolor;
  },

  _reset: function () {
    L.ImageOverlay.Canvas.prototype._reset.call(this);

    var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
        i, len, pixel;

    this.heatCanvas.clear();
    for (i=0, len=this._data.length; i<len; i++) {
      pixel = this._map.latLngToLayerPoint(this._data[i][0]);
      this.heatCanvas.push(
              Math.floor(pixel.x - topLeft.x),
              Math.floor(pixel.y - topLeft.y),
              this._data[i][1]);
    }
    this.heatCanvas.render(this.options.step, this.options.degree, this.options.colorscheme);
  }
});

L.imageOverlay.heatCanvas = function (data, options) {
  return new L.ImageOverlay.HeatCanvas(data, options);
};