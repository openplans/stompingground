var StompingGround = StompingGround || {};

(function(SG, S, $) {
  var collection = new S.PlaceCollection(),
      thumbCenter = [-75.00000, 40.000000],
      thumbZoom = 17,
      locationIcons = {},
      mapsTemplateHtml = $('#park-maps-template').html(),
      mapsTemplate = Handlebars.compile(mapsTemplateHtml),
      mapsContext = {'maps': []};

  collection.on('reset', function(c) {
    var data = c.toJSON();

    var placesById = _.groupBy(data, 'map_id');

    _.each(placesById, function(places, id) {
      var first = places[0],
          placeURLData = [],
          thumbURL;

      _.each(places, function(place) {
        placeURLData.push(locationIcons[place.location_type] + '(' + place.location.lng.toFixed(5) + ',' + place.location.lat.toFixed(5) + ')');
      });
      // TODO: Should we limit the size of this URL to something like 2048
      //       characters?
      thumbURL = 'http://...' + placeURLData.join(',');

      mapsContext['maps'].push({
        id: first.map_id,
        url: SG.mapRoot + id,
        title: first.map_title,
        created: first.created_datetime,
        thumb: thumbURL
      });
    }); // <-- each placesById

    $('#maps-list').html(mapsTemplate(mapsContext));
  });

  collection.fetch();

})(StompingGround, Shareabouts, jQuery);
