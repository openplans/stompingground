/*global Shareabouts _ L jQuery*/

var StompingGround = StompingGround || {};

(function(SG, S, $) {
  'use strict';

  var _heatmapData = {},
      aaData = [],
      collection = new S.PlaceCollection(),
      aoColumns, _heatmap, sortedPlaceTypes;

  sortedPlaceTypes = _.map(SG.Config.placeTypes, function(pt, id) {
    return {label: pt.label, id: id};
  });

  sortedPlaceTypes = _.sortBy(sortedPlaceTypes, function(pt) {
    return pt.label;
  });

  // Init the column headers
  aoColumns = [
    {sTitle: 'Name'},
    {sTitle: 'Created'}
  ];

  _.each(sortedPlaceTypes, function(pt, i) {
    aoColumns.push({sTitle: pt.label});
  });

  aoColumns.push({sTitle: 'Link'});

  function getArraySize(a) {
    return (_.isArray(a) && _.size(a)) || 0;
  }

  function initMap(data) {
    var map = L.map('adminmap', SG.Config.map),
        layer = L.tileLayer(SG.Config.layer.url, SG.Config.layer).addTo(map);

    _heatmapData.all = [];

    _.each(data, function(obj, i) {
      _heatmapData[obj.location_type] = _heatmapData[obj.location_type] || [];

      _heatmapData.all[i] = obj;
      _heatmapData[obj.location_type].push(obj);
    });

    _heatmap = S.heatmap(_heatmapData.all, {
      bgcolor: [0, 0, 0, 0],
      bufferPixels: 100,
      step: 0.05,
      colorscheme: function(value){
        var h = (1 - value);
        var l = 0.5;
        var s = 1;
        var a = value + 0.03;
        return [h, s, l, a];
      }
    });

    map.addLayer(_heatmap.layer);
  }

  function initLocationTypeSelector(data) {
    var $locationTypeSelector = $('#heatmap-location-type'),
        types = _.uniq(_.pluck(data, 'location_type'));

    _.each(types, function(type, i) {
      $locationTypeSelector.append('<option value="'+type+'">'+type.charAt(0).toUpperCase() + type.substring(1)+'</option>');
    });

    $locationTypeSelector.change(function(evt) {
      _heatmap.setData(_heatmapData[evt.target.value]);
    });
  }

  collection.on('reset', function(c) {
    var data = c.toJSON();

    var placesById = _.groupBy(data, 'map_id');

    _.each(placesById, function(places, id) {
      var row, placesByType, link,
          first = places[0];

      placesByType = _.groupBy(places, 'location_type');

      row = [first.map_title, first.created_datetime];

      _.each(sortedPlaceTypes, function(pt, i) {
        row.push(getArraySize(placesByType[pt.id]));
      });

      row.push('<a href="/map/' + first.map_id +
             '" target="_blank">' + first.map_id + '</a>');

      aaData.push(row);
    });

    var tableOptions = {
      aoColumns: aoColumns,
      aaData: aaData,
      bPaginate: true,
      bInfo: false
    };

    $('#admin-table').dataTable(tableOptions);

    initMap(data);
    initLocationTypeSelector(data);
  });

  $(function() {
    S.Util.callWithRetries(collection.fetch, 3, collection, {
      error: function() {
        $('#error-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
      }
    });
  });

}(StompingGround, Shareabouts, jQuery));

