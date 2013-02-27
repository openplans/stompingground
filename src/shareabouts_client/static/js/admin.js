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
        layer = L.tileLayer(SG.Config.layer.url, SG.Config.layer).addTo(map),
        heatmapLayer,
        heatmapData = [];

    _.each(data, function(obj, i) {
      heatmapData[i] = [[obj.location.lat, obj.location.lng], 1];
    });

    heatmapLayer = new L.ImageOverlay.HeatCanvas(heatmapData, {
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

