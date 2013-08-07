var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    map: {
      center: [40.71479, -73.96302],
      zoom: 17
    },
    layer: {
      url: 'http://{s}.tiles.mapbox.com/v3/openplans.map-jo9bww2s/{z}/{x}/{y}.png',
      minZoom: 15,
      maxZoom: 18,
      attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    },
    staticMap: {
      urlRoot: 'http://{s}.tiles.mapbox.com/v3/openplans.map-jo9bww2s/{z}/{x}/{y}.png',
      width: 240,
      height: 240,
      center: [40.71479, -73.96302],
      zoom: 17
    },
    placeTypes: {
      speeding: {
        label: 'Drivers are speeding',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/marker-heart-broken-yellow.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-dbcf2c.png',
          iconSize: [51, 46],
          iconAnchor: [25, 20]
        }
      },
      failure_to_yield: {
        label: 'Drivers don\'t yield',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/marker-heart-broken-blue.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-4ab767.png',
          iconSize: [51, 46],
          iconAnchor: [25, 20]
        }
      },
      crosswalk_needs_painting: {
        label: 'Crosswalk is faded',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/marker-heart-broken-red.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-fa307d.png',
          iconSize: [51, 46],
          iconAnchor: [25, 20]
        }
      },
      sidewalk_problem: {
        label: 'Bad quality sidewalk',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/marker-heart-broken-green.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-0d85e9.png',
          iconSize: [51, 46],
          iconAnchor: [25, 20]
        }
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);
