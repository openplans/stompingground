var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    map: {
      center: [40.67152, -73.98400],
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
      center: [40.67152, -73.98400],
      zoom: 17
    },
    placeTypes: {
      speeding: {
        label: 'Speeding',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_11579.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-dbcf2c.png',
          iconSize: [27, 13],
          iconAnchor: [13, 13]
        }
      },
      failure_to_yield: {
        label: 'Failure to Yield',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_1535.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-4ab767.png',
          iconSize: [30, 41],
          iconAnchor: [15, 41]
        }
      },
      crosswalk_needs_painting: {
        label: 'Crosswalk Needs Painting',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_712.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-fa307d.png',
          iconSize: [29, 16],
          iconAnchor: [15, 16]
        }
      },
      sidewalk_problem: {
        label: 'Sidewalk Problem',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_3837.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-0d85e9.png',
          iconSize: [26, 36],
          iconAnchor: [13, 36]
        }
      },
      generic_safety_issue: {
        label: 'Generic Safety Issue',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_6323.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-a542e5.png',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        }
      },
      this_spot_is_nice: {
        label: 'This Spot is Nice!',
        icon: {
          iconUrl: StompingGround.siteRoot + '/static/img/noun_project_6323.png',
          iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-a542e5.png',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        }
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);
