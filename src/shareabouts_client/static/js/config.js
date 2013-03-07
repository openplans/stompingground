var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    map: {
      center: [39.9638, -75.1785],
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
      center: [39.9638, -75.1785],
      zoom: 17
    },
    placeTypes: {
      bench: {
        label: 'Bench',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/marker-dbcf2c.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-dbcf2c.png',
          shadowUrl: '/static/img/markers/marker-shadow.png',
          shadowSize: [41, 41],
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }
      },
      tree: {
        label: 'Tree',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/marker-4ab767.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-4ab767.png',
          shadowUrl: '/static/img/markers/marker-shadow.png',
          shadowSize: [41, 41],
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }
      },
      playarea: {
        label: 'Play Area',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/marker-fa307d.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-fa307d.png',
          shadowUrl: '/static/img/markers/marker-shadow.png',
          shadowSize: [41, 41],
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }
      },
      fountain: {
        label: 'Fountain',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/marker-0d85e9.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-0d85e9.png',
          shadowUrl: '/static/img/markers/marker-shadow.png',
          shadowSize: [41, 41],
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }
      },
      dogrun: {
        label: 'Dog Run',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/markers/marker-a542e5.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-a542e5.png',
          shadowUrl: '/static/img/markers/marker-shadow.png',
          shadowSize: [41, 41],
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        }
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);