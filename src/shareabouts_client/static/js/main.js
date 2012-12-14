var StompingGround = StompingGround || {};

(function(SG, S, $, L) {
  var collection, mapView, map, goodIcon, badIcon, placeTypes, router;

/* ==============================
 * Config
 * ============================== */

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

  commentIcon = L.icon({
    iconUrl: '/static/img/marker-comment.png',
    iconSize: [51, 46],
    iconAnchor: [25, 26],
    popupAnchor: [1, -26]
  });

  placeTypes = {
    'good': {
      'default': goodIcon,
      'label': 'Good',
      'onPostInit': markerPostInit
    },
    'bad': {
      'default': badIcon,
      'label': 'Bad',
      'onPostInit': markerPostInit
    },
    'comment': {
      'default': commentIcon,
      'label': 'Comment',
      'onPostInit': markerPostInit
    }
  };

  function markerPostInit() {
    function elementsIntersect($a, $b) {
      var aOffset = $a.offset(),
          aWidth = $a.width(),
          aHeight = $a.height(),
          bOffset = $b.offset(),
          bWidth = $b.width(),
          bHeight = $b.height(),

          aBounds = L.bounds([aOffset.top, aOffset.left],
            [aOffset.top+aHeight, aOffset.left+aWidth]),

          bBounds = L.bounds([bOffset.top, bOffset.left],
            [bOffset.top+bHeight, bOffset.left+bWidth]);

      return aBounds.intersects(bBounds);
    }

    this.layer.on('click', function(evt) {
      // 'this' is the layer view
      var comment = this.model.get('comment');
      if (comment) {
        // Open popup with comment
        this.layer.bindPopup(comment).openPopup();
      }

      }, this);

    this.layer.on('drag', function(evt) {
      var $icon = $(evt.target._icon),
          $trash = $('#control-markers-trash');

      if(elementsIntersect($icon, $trash)) {
        $trash.addClass('hover');
      } else {
        $trash.removeClass('hover');
      }
    });

    this.layer.on('dragend', function(evt) {
      var $icon = $(evt.target._icon),
          $trash = $('#control-markers-trash');

      if(elementsIntersect($icon, $trash)) {
        this.model.destroy();
        $trash.removeClass('hover');
      } else {
        var latLng = this.layer.getLatLng();

        this.model.set({
          location: {lat: latLng.lat, lng: latLng.lng}
        });
      }
    }, this);
  }


/* ==============================
 * Initialization
 * ============================== */

  // Define the router
  SG.Router = Backbone.Router.extend({
    routes: {
      ':id': 'fetch'
    },
    initialize: function() {
      Backbone.history.start({pushState: true});
    },
    fetch: function(id) {
      // Fetch the existing places
      collection.fetch({'data': {'map_id': id}});
    }
  });

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

  router = new SG.Router();

  // So I don't have to type mapView.map all the time
  map = mapView.map;

/* ==============================
 * Controls Setup
 * ============================== */

  function containsPoint($el, x, y) {
    var elOffset = $el.offset(),
        elSize = {width: $el.width(), height: $el.height()};

    return (
      x >= elOffset.left &&
      x < elOffset.left + elSize.width &&
      y >= elOffset.top &&
      y < elOffset.top + elSize.height);
  }

  // Make the map a jQuery UI drop target
  $(map.getContainer()).droppable({
    drop: function(event, ui) {
      if (containsPoint(ui.draggable, event.pageX, event.pageY))
        return;

      function createPlace(latlng, placeType, comment) {
        collection.add({
          'location': {
            'lat': latlng.lat,
            'lng': latlng.lng
          },
          'location_type': placeType,
          'comment': comment,
          'visible': true
        });

        map.removeLayer(standInMarker);
      }

      var icon = ui.draggable.data('icon'),
          placeType = ui.draggable.data('placeType'),
          $controlMarker = ui.helper,

      // Calculate the new marker position
      mapContainerOffset = $(map.getContainer()).offset(),
      controlMarkerOffset = $controlMarker.offset(),
      pos = {left: controlMarkerOffset.left - mapContainerOffset.left,
             top: controlMarkerOffset.top - mapContainerOffset.top},
      ll = map.containerPointToLatLng([pos.left+icon.options.iconAnchor[0],
                                               pos.top+icon.options.iconAnchor[1]]),

      // Add a temporary marker to the map until we get a response from
      // the API
      standInMarker = L.marker(ll, {
        icon: icon
      }).addTo(map);

      if (placeType === 'comment') {
        // Show popup with comment form
        standInMarker.bindPopup(ich['comment-form-tpl']().get(0), {
          closeButton: false
        }).openPopup();

        // On save click, create model
        $('#comment-form').submit(function(evt) {
          createPlace(ll, placeType, $('#comment').val());
          evt.preventDefault();
        });

        // On cancel click, remove popup, marker
        $('#cancel-comment').click(function(evt) {
          map.removeLayer(standInMarker);
          evt.preventDefault();
        });

      } else {
        createPlace(ll, placeType);
      }
    }
  });

  // Init a new control marker
  function setControlMarker(placeType, icon, $target) {
    // Append new element to the target
    var $controlMarkerWrapper = $('<li></li>').appendTo($target),
        $controlMarker = $('<div class="control-marker-' + placeType + '">' +
                           '<img src="'+icon.options.iconUrl+'"></img></div>').appendTo($controlMarkerWrapper);

    // Attach the icon data to the control marker
    $controlMarker.data('placeType', placeType);
    $controlMarker.data('icon', icon);

    // Make the control a jQuery UI draggable object
    $controlMarker.draggable({
      helper: 'clone'
    });

    // Prevent the mousedown event from being registered on the map.
    $controlMarker.on('mousedown', function(event) {
      event.stopPropagation();
    });
  }

  // Init the control marker container
  var $controlMarkerTarget =
    $('<ul id="control-markers"></ul>').appendTo(map.getContainer());


  // Init the control marker container
  var $controlMarkerTrash =
    $('<div id="control-markers-trash"></div>')
      .appendTo(map.getContainer());

  // Init the control markers
  _.each(placeTypes, function(obj, key) {
    setControlMarker(key, obj['default'], $controlMarkerTarget);
  });

/* ==============================
 * Finalization process
 * ============================== */

  function setupFinalizeProcess($target) {
    var $finalizeButton1 = $('<button class="btn btn-large">I\'m Done!</button>')
      .appendTo($target)
      .on('click', showFinalizationModal);

    var $finalizeButton2 = $('#finalization-save'),
        $mapTitle = $('input[name="map-title"]');
    $finalizeButton2.on('click', function() {
      var title = $mapTitle.val();
      saveMap(title);
    });
  }

  function showFinalizationModal() {
    $('#finalization-modal .carousel').carousel({interval: false}).carousel(0);
    $('#finalization-modal').modal('show');
  }

  function saveMap(title) {
    var $finalizeCarousel = $('#finalization-modal .carousel'),
        $progressBar = $('#finalization-modal .progress .bar'),
        $permalinkAnchor = $('#finalization-modal .permalink'),
        numPlaces = collection.length,
        numSavedPlaces = 0,
        mapId = (new Date()).getTime().toString(36),

        goNext = _.after(numPlaces, function() {
          console.log('next called');
          $finalizeCarousel.carousel('next');
          $permalinkAnchor
            .attr('href', 'http://stompingground.org/' + mapId)
            .text('stompingground.org/' + mapId);
        }),

        tryToSave = function(place, data, options, tryCount) {
          var maxTries = 5,
              originalOptions = options;

          tryCount = tryCount || 1;
          options = options || {};
          options.error = function() {
            if (tryCount < maxTries) {
              tryToSave(place, data, originalOptions, tryCount + 1);
            } else {
              originalOptions.error();
            }
          };

          place.save(data, options);
        };

    // Initialize the progress bar with a little sliver, to give the user
    // an indication that something's going on.
    $progressBar.css('width', (100 / (numPlaces + 1)) + '%');
    $progressBar.parent().fadeIn();

    collection.each(function(place) {
      tryToSave(place,
        {
          'map_title': title,
          'map_id': mapId
        },
        {
          success: function() {
            numSavedPlaces += 1;
            $progressBar.css('width', ((numSavedPlaces + 1) * 100 / (numPlaces + 1)) + '%');
            console.log(numSavedPlaces, numPlaces);
            console.log((numSavedPlaces * 100 / numPlaces) + '%');
            goNext();
          },
          error: function() {
            // TODO: Handle failure
          }
        }
      );
    });


  }

  var $finalizeButtonTarget =
    $('<div id="finalize-button-wrapper"></div>').appendTo(map.getContainer());

  setupFinalizeProcess($finalizeButtonTarget);

/* ==============================
 * Tooltips
 * ============================== */

  function showZoomTooltip() {
    $('.leaflet-control-zoom')
      .tooltip({
        title: 'Move the map around to find the place you want to start. Use these buttons to move in and out.',
        trigger: 'manual',
        placement: 'right'
      })
      .tooltip('show');
  }

  function hideZoomTooltip() {
    $('.leaflet-control-zoom').tooltip('hide');
    $('.leaflet-control-zoom').trigger('hide-tooltip');
    map.off('zoomend', hideZoomTooltip);
  }

  function showMarkerControlTooltip() {
    $('#control-markers')
      .tooltip({
        title: 'Choose a sticker to make your map awesome! Drag stickers that show what you think about a place.',
        trigger: 'manual',
        placement: 'right'
      })
      .tooltip('show');
  }

  function hideMarkerControlTooltip() {
    $('#control-markers').tooltip('hide');
    $('.leaflet-control-zoom').off('hide-tooltip', showMarkerControlTooltip);
    $(map.getContainer()).off('drop', hideMarkerControlTooltip);
  }

  // Show the zoom tooltip to start
  showZoomTooltip();

  // Set it up to hide when the user zooms, or 5 seconds after the user starts
  // panning
  map.on('zoomend', hideZoomTooltip);
  map.on('dragstart', function() { _.delay(hideZoomTooltip, 5000); });

  // Whenever the zoom tooltip goes away, show the marker control tooltip
  $('.leaflet-control-zoom').on('hide-tooltip', _.once(showMarkerControlTooltip));

  // Hide the marker tooltip whenever the user drops a marker
  $(map.getContainer()).on('drop', hideMarkerControlTooltip);

})(StompingGround, Shareabouts, jQuery, L);
