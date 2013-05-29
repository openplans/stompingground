/*globals _ Handlebars moment Shareabouts jQuery L */

var StompingGround = StompingGround || {};

(function(SG, S, $) {
  'use strict';

  var collection = new S.PlaceCollection(),
      mapsTemplateHtml = $('#park-maps-template').html(),
      mapsTemplate = Handlebars.compile(mapsTemplateHtml),
      mapsContext = {'maps': []};

  // Borrowed and refactored from Leaflet source
  var getBoundsZoom = function (bounds, minZoom, maxZoom, size, padding) {
    bounds = L.latLngBounds(bounds);

    var zoom = minZoom,
        nw = bounds.getNorthWest(),
        se = bounds.getSouthEast(),
        fitsInMap = true,
        boundsSize;

    padding = L.point(padding || [0, 0]);

    do {
      zoom++;
      boundsSize = L.CRS.EPSG4326.latLngToPoint(se, zoom).subtract(L.CRS.EPSG4326.latLngToPoint(nw, zoom)).add(padding);
      fitsInMap = boundsSize.x < size.x && boundsSize.y < size.y;

    } while (fitsInMap && zoom <= maxZoom);

    if (!fitsInMap) {
      return zoom - 1;
    }
    return zoom;
  };

  // Construct the static thumbnail url
  var getThumbUrl = function(places) {
    var placeURLData = [],
        bounds, zoom, center;

    _.each(places, function(place) {
      if (SG.Config.placeTypes[place.location_type]) {
        placeURLData.push('url-'+SG.Config.placeTypes[place.location_type].icon.iconThumbUrl + '(' + place.location.lng.toFixed(5) + ',' + place.location.lat.toFixed(5) + ')');

        if (bounds) {
          bounds.extend([place.location.lng, place.location.lat]);
        } else {
          bounds = L.latLngBounds([place.location.lng, place.location.lat], [place.location.lng, place.location.lat]);
        }
      }
    });

    zoom = SG.Config.staticMap.zoom || getBoundsZoom(bounds, SG.Config.staticMap.minZoom, SG.Config.staticMap.maxZoom,
                         L.point([SG.Config.staticMap.width, SG.Config.staticMap.height]),
                         SG.Config.staticMap.padding);
    center = SG.Config.staticMap.center || bounds.getCenter();

    // TODO: Should we limit the size of this URL to something like 2048
    //       characters?
    return SG.Config.staticMap.urlRoot + encodeURIComponent(placeURLData.join(',')) + '/' +
      center.lat.toFixed(5)+','+center.lng.toFixed(5)+','+zoom+'/'+
      SG.Config.staticMap.width+'x'+SG.Config.staticMap.height+'.png';
  };

  collection.on('reset', function(c) {
    var data = c.toJSON();

    var placesById = _.groupBy(data, 'map_id');

    _.each(placesById, function(places, id) {
      var first = places[0],
          placeURLData = [],
          thumbURL;

      thumbURL = getThumbUrl(places);

      mapsContext.maps.push({
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
    S.Util.callWithRetries(collection.fetch, 3, collection, {
      error: function() {
        $('#error-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
      }
    });
  });

}(StompingGround, Shareabouts, jQuery));
