var StompingGround = StompingGround || {};

(function(SG, S, $) {
  var _heatmapData = {},
      collection, aoColumns, aaData, _heatmapLayer;

  aoColumns = [
    {sTitle: 'Map Name'},
    {sTitle: 'Created'},
    {sTitle: 'Happy Stickers'},
    {sTitle: 'Sad Sticker'},
    {sTitle: 'Comments'},
    {sTitle: 'Link'}
  ];

  aaData = [];

  collection = new S.PlaceCollection();

  function getArraySize(a) {
    return (_.isArray(a) && _.size(a)) || 0;
  }

  function initMap(data) {
    var map = L.map('heatmap', SG.Config.map),
        layer = L.tileLayer(SG.Config.layer.url, SG.Config.layer).addTo(map);

    _heatmapData['all'] = [];

    _.each(data, function(obj, i) {
      _heatmapData[obj.location_type] = _heatmapData[obj.location_type] || [];

      _heatmapData['all'][i] = [[obj.location.lat, obj.location.lng], 1];
      _heatmapData[obj.location_type].push([[obj.location.lat, obj.location.lng], 1]);
    });

    _heatmapLayer = new L.ImageOverlay.HeatCanvas(_heatmapData['all'], {
      bgcolor: [0, 0, 0, 0],
      bufferRatio: 0.05,
      step: 0.05,
      colorscheme: function(value){
        var h = (1 - value);
        var l = 0.5;
        var s = 1;
        var a = value + 0.03;
        return [h, s, l, a];
      }
    });

    map.addLayer(_heatmapLayer);
  }

  function initLocationTypeSelector(data) {
    var $locationTypeSelector = $('#heatmap-location-type'),
        types = _.uniq(_.pluck(data, 'location_type'));

    _.each(types, function(type, i) {
      $locationTypeSelector.append('<option value="'+type+'">'+type.charAt(0).toUpperCase() + type.substring(1)+'</option>');
    });

    $locationTypeSelector.change(function(evt) {
      _heatmapLayer.setData(_heatmapData[evt.target.value]);
    });
  }

  collection.on('reset', function(c) {
    var data = c.toJSON();

    var placesById = _.groupBy(data, 'map_id');

    _.each(placesById, function(places, id) {
      var placesByType, title, created, goodCnt, badCnt, commentCnt, link,
          first = places[0];

      placesByType = _.groupBy(places, 'location_type');

      title = first.map_title;
      created = first.created_datetime;
      goodCnt = getArraySize(placesByType.good);
      badCnt = getArraySize(placesByType.bad);
      commentCnt = getArraySize(placesByType.comment);
      link = '<a href="/map/' + first.map_id +
             '" target="_blank">' + first.map_id + '</a>';

      aaData.push([title, created, goodCnt, badCnt, commentCnt, link]);
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

  collection.fetch();

})(StompingGround, Shareabouts, jQuery);

