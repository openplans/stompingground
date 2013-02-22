var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    map: {
      center: [40.7873, -73.9753],
      zoom: 17
    },
    layer: {
      url: 'http://{s}.tiles.mapbox.com/v3/openplans.map-dmar86ym/{z}/{x}/{y}.png',
      minZoom: 15,
      maxZoom: 17,
      attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    },
    staticMap: {
      urlRoot: 'http://api.tiles.mapbox.com/v3/openplans.map-dmar86ym/',
      width: 240,
      height: 240,
      center: [40.7873, -73.9753],
      zoom: 17
    },
    placeTypes: {
      bad: {
        label: 'Bad',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/sticker-0d85e9.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-0d85e9.png',
          iconSize: [45, 61],
          iconAnchor: [22, 5]
        }
      },
      good: {
        label: 'Good',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/sticker-fa307d.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-fa307d.png',
          iconSize: [45, 61],
          iconAnchor: [22, 5]
        }
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);