var StompingGround = StompingGround || {};

(function(SG, S, $) {
  var collection = new S.PlaceCollection(),
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
        placeURLData.push('url-'+StompingGround.Config.placeTypes[place.location_type].icon.iconThumbUrl + '(' + place.location.lng.toFixed(5) + ',' + place.location.lat.toFixed(5) + ')');
      });
      // TODO: Should we limit the size of this URL to something like 2048
      //       characters?
      thumbURL = SG.Config.staticMap.urlRoot + encodeURIComponent(placeURLData.join(',')) +
        '/'+SG.Config.staticMap.center[1]+','+SG.Config.staticMap.center[0]+','+SG.Config.staticMap.zoom+'/'+
        SG.Config.staticMap.width+'x'+SG.Config.staticMap.height+'.png';

      mapsContext['maps'].push({
        id: first.map_id,
        url: 'http://' + SG.siteRoot +  SG.mapRoot + id,
        title: first.map_title,
        created: moment(first.created_datetime).fromNow(),
        thumb: thumbURL
      });
    }); // <-- each placesById

    $('#maps-list').html(mapsTemplate(mapsContext));

    // Init Facebook widgets after the markup is in place
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });

  $(function() {
    S.Util.fetchWithRetries(collection, {
      error: function() {
        $('#error-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
      }
    }, 3);
  });

})(StompingGround, Shareabouts, jQuery);
