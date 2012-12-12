var StompingGround = StompingGround || {};

(function(SG, S, $, L) {
  var collection, mapView, goodIcon, badIcon, placeTypes;

  // Icons
  badIcon = L.icon({
    iconUrl: '/static/img/marker-heart-broken.png',
    iconSize: [51, 46],
    iconAnchor: [25, 26],
    popupAnchor: [1, -26]
  });

  goodIcon = L.icon({
    iconUrl: '/static/img/marker-heart.png',
    iconSize: [51, 46],
    iconAnchor: [25, 26],
    popupAnchor: [1, -26]
  });

  placeTypes = {
    'good': {
      'default': goodIcon,
      'label': 'Good'
    },
    'bad': {
      'default': badIcon,
      'label': 'Bad'
    }
  };

  // Init the place collection
  collection = new S.PlaceCollection();

  // Setup the map view
  mapView = new S.MapView({
    el: '#map',
    mapConfig: {
      options: {
        center: [40.7873, -73.9753],
        zoom: 16
      },
      base_layer: new L.BingLayer('AvwpEJSPGtaU_s5ANOzYMZAesUO0Uit-5NydR60whL3KC0sFFCK-9Ay1jaFZ_s0P', {
        type: 'Road',
        maxZoom: 20
      })
    },
    collection: collection,
    router: null,
    placeTypes: placeTypes
  });

  // Fetch the existing places
  collection.fetch();

  // Begin marker control section //
  var controlMarkerGroup;


  // Init the layer group for the control markers
  controlMarkerGroup = L.layerGroup();
  mapView.map.addLayer(controlMarkerGroup);

  // Init a new control marker
  function setControlMarker(placeType, icon, $target) {
    // Append new element to the target
    var $controlMarker = $('<li><img src="'+icon.options.iconUrl+'"></img></li>').appendTo($target);

    $controlMarker.on('mousedown', function(evt) {
      var mapContainerOffset = $(mapView.map.getContainer()).offset(),
          controlMarkerOffset = $controlMarker.offset(),
          pos = {left: controlMarkerOffset.left - mapContainerOffset.left,
                 top: controlMarkerOffset.top - mapContainerOffset.top};
          ll = mapView.map.containerPointToLatLng([pos.left+icon.options.iconAnchor[0],
                                                   pos.top+icon.options.iconAnchor[1]]),
          marker = L.marker(ll, {
            icon: icon,
            draggable: true
          }).addTo(mapView.map);

      // Super hack to start the dragging!!
      marker.dragging._draggable._onDown(evt);

      // When I'm done dragging, create a new model and remove this from the map
      marker.on('dragend', function(evt) {
        var ll = marker.getLatLng();

        collection.create({
          'location': {
            'lat': ll.lat,
            'lng': ll.lng
          },
          'location_type': placeType,
          'visible': true
        }, {
          wait: true,
          success: function() {
            controlMarkerGroup.removeLayer(marker);
          },
          error: function() {
            controlMarkerGroup.removeLayer(marker);
          }
        });
      });

      evt.preventDefault();
    });
  }

  // Init the control marker container
  var $controlMarkerTarget =
    $('<ul id="control-markers"></ul>').appendTo(mapView.map.getPanes().mapPane);

  // Init the control markers
  _.each(placeTypes, function(obj, key) {
    setControlMarker(key, obj['default'], $controlMarkerTarget);
  });

  function showZoomTooltip() {
    $('.leaflet-control-zoom')
      .tooltip({
        title: 'Move the map around to find the place you want to start. Use these buttons to move in and out.',
        trigger: 'manual',
        placement: 'right'
      })
      .tooltip('show');
  };

  function hideZoomTooltip() {
    $('.leaflet-control-zoom').tooltip('hide');
    mapView.map.off('zoomend', hideZoomTooltip);
  };

  showZoomTooltip();
  mapView.map.on('zoomend', hideZoomTooltip);

  mapView.map.on('contextmenu', function(evt) {
    L.DomEvent.preventDefault(evt);

    var ll = evt.latlng;
    var marker = L.marker(ll, {
      draggable: true,
      icon: goodIcon,
      origin: [5, 5]
    });

    mapView.map.addLayer(marker);
    marker.fire('movestart').fire('dragstart');
  });

})(StompingGround, Shareabouts, jQuery, L);
