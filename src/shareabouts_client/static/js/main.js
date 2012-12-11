var StompingGround = StompingGround || {};

(function(SG, S, $, L) {
  var collection, mapView, happyIcon, happyFocusedIcon;

  happyIcon = L.icon({
    iconUrl: '/static/img/markers/marker-e1264d.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/static/img/markers/marker-shadow.png',
    shadowSize: [41, 41]
  });

  happyFocusedIcon = L.icon({
    iconUrl: '/static/img/markers/marker-2654d2.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/static/img/markers/marker-shadow.png',
    shadowSize: [41, 41]
  });

  collection = new S.PlaceCollection();
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
    placeTypes: {
      'happy': {
        'default': happyIcon,
        'focused': happyFocusedIcon,
        'label': 'Happy'
      }
    }
  });

  collection.fetch();

  mapView.map.on('contextmenu', function(evt) {
    collection.create({
      'location': {
        'lat': evt.latlng.lat,
        'lng': evt.latlng.lng
      },
      'location_type': 'happy'
    });
  });

})(StompingGround, Shareabouts, jQuery, L);