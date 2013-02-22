var StompingGround = StompingGround || {};

(function(SG, S, $) {
  var collection, aoColumns, aaData;

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
        heatmapLayer = new L.TileLayer.HeatCanvas({},{
          'step':0.5,
          'degree':HeatCanvas.LINEAR,
          'opacity':0.7}
        ),
        heatmapData = [];

    _.each(data, function(obj, i) {
      heatmapData[i] = {lat: obj.location.lat, lon: obj.location.lng, v: 20};
    });

    heatmapLayer.data = heatmapData;
    map.addLayer(heatmapLayer);
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
  });

  collection.fetch();

})(StompingGround, Shareabouts, jQuery);

