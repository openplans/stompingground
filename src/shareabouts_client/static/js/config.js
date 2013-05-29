var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    map: {
      center: [41.30702,-72.923298],
      zoom: 15
    },
    layer: {
      url: 'http://{s}.tiles.mapbox.com/v3/openplans.map-dmar86ym/{z}/{x}/{y}.png',
      minZoom: 14,
      maxZoom: 21,
      attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    },
    staticMap: {
      urlRoot: 'http://api.tiles.mapbox.com/v3/openplans.map-dmar86ym/',
      width: 240,
      height: 240,
      center: [41.30702,-72.923298],
      zoom: 15
    },
    placeTypes: {
      community: {
        label: 'Community Activity Space',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-community-space.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-community-space.png',
          iconSize: [55, 50],
          iconAnchor: [27, 25]
        }
      },
      garden: {
        label: 'Neighborhood Garden or Park',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-community-garden.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-community-garden.png',
          iconSize: [52, 55],
          iconAnchor: [26, 27]
        }
      },
      police: {
        label: 'More Police Presence',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-police-presence.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-police-presence.png',
          iconSize: [48, 52],
          iconAnchor: [24, 26]
        }
      },
      lighting: {
        label: 'Outdoor Lighting',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-outdoor-lighting.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-outdoor-lighting.png',
          iconSize: [44, 55],
          iconAnchor: [22, 27]
        }
      },
      traffic: {
        label: 'Traffic Calming',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-traffic-calming.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-traffic-calming.png',
          iconSize: [43, 55],
          iconAnchor: [21, 27]
        }
      },
      food: {
        label: 'Healthy Food',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-healthy-food.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-healthy-food.png',
          iconSize: [48, 65],
          iconAnchor: [26, 32]
        }
      },
      bikelane: {
        label: 'Bike Lane',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/icon-bike-lane.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/icon-bike-lane.png',
          iconSize: [50, 55],
          iconAnchor: [25, 27]
        }
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);
