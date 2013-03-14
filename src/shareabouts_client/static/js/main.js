var StompingGround = StompingGround || {};

(function(SG, S, $, L) {
  var placeTypes = {},
      collection, mapView, map, router;

/* ==============================
 * Config
 * ============================== */

  _.each(StompingGround.Config.placeTypes, function(config, key) {
    placeTypes[key] = {
      'default': L.icon(config.icon),
      'label': config.label,
      'clickable': false,
      'onPostInit': markerPostInit
    };
  });

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
      'map/:id': 'fetch',
      '*path':  'defaultRoute'
    },
    initialize: function() {
      Backbone.history.start({pushState: true});
    },
    defaultRoute: function(){
      $('body').addClass('edit');
      initTools();
    },
    fetch: function(id) {
      $('body').addClass('view');

      // Update the url to reload to this map id
      $('#error-modal a').attr('href', '/map/' + id);

      // Let the user know that you're loading
      $('#loading-map-modal')
        .modal({backdrop: 'static', keyboard: 'false', show: true});

      // Disable dragging on all the place types
      _.each(placeTypes, function(placeType) {
        placeType.draggable = false;
      });

      // Fetch the existing places
      S.Util.callWithRetries(collection.fetch, 3, collection, {
        'data': {'map_id': id},
        'success': function() {
          var placeBounds;

          _.each(mapView.layerViews, function(layerView) {
            if (placeBounds) {
              placeBounds.extend(layerView.latLng);
            } else {
              placeBounds = L.latLngBounds(layerView.latLng, layerView.latLng);
            }
          });

          // Zoom to the bounds of the map places
          map.fitBounds(placeBounds.pad(0.02));

          // Add the map title above the comments
          $('#map-title').text(collection.at(0).get('map_title'));

          // Done loading!
          $('#loading-map-modal').modal('hide');
        },
        error: function() {
          $('#loading-map-modal').modal('hide');

          setTimeout(function() {
            $('#error-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
          }, 500);
        }
      });
    }
  });

  // Init the place collection
  collection = new S.PlaceCollection();

  // Setup the map view
  mapView = new S.MapView({
    el: '#map',
    mapConfig: {
      options: SG.Config.map,
      base_layer: L.tileLayer(SG.Config.layer.url, SG.Config.layer)
    },
    collection: collection,
    router: null,
    placeTypes: placeTypes
  });

  // So I don't have to type mapView.map all the time
  map = mapView.map;

  // Start router history
  $(function() {
    router = new SG.Router();
  });


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

  function initTools() {
    if (!S.Util.cookies.get('sg-suppress-intro-modal')) {
      $('#intro-modal').modal('show');
      $('#suppress-intro-modal input:checkbox').removeAttr('checked');
    } else {
      $('#suppress-intro-modal input:checkbox').attr('checked', 'checked');
    }

    $('#suppress-intro-modal input:checkbox').change(function(evt) {
      if ($(this).is(':checked')) {
        S.Util.cookies.save('sg-suppress-intro-modal', true, 7);
      } else {
        S.Util.cookies.destroy('sg-suppress-intro-modal');
      }
    });

    makeMapDroppable();

    // Show the zoom tooltip to start
    showZoomTooltip();

    // Init the control marker container
    var $controlMarkerTarget = ich['control-markers-box-tpl']();
    $controlMarkerTarget.appendTo(map.getContainer());

    // Init the control marker container
    var $controlTrash = ich['control-trash-tpl']();
    $controlTrash.appendTo(map.getContainer());

    // Init the control markers
    _.each(placeTypes, function(obj, key) {
      setControlMarker(key, obj['default'], obj.label, $controlMarkerTarget);
    });
  }

  function makeMapDroppable() {
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

          // Focus on the textarea
          $('#comment').focus();

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
  }

  // Init a new control marker
  function setControlMarker(placeType, icon, label, $target) {
    // Append new element to the target
    var $controlMarkerWrapper = $('<li></li>').appendTo($target),
        $controlMarker = ich['control-marker-tpl']({
          placeType: placeType,
          imgUrl: icon.options.iconUrl,
          label: label.toLowerCase()
        }).appendTo($controlMarkerWrapper);

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

    $controlMarker.on('touchstart', function(event) {
      event.stopPropagation();
    });
  }

/* ==============================
 * Finalization process
 * ============================== */

  function setupFinalizeProcess($target) {
    var $mapDoneButton = ich['map-done-button-tpl']()
      .appendTo($target)
      .on('click', showFinalizationModal);

    var $finalizeButton = $('#finalization-save'),
        $mapTitle = $('input[name="map-title"]');
    $finalizeButton.on('click', function() {
      var title = $mapTitle.val();
      saveMap(title);
    });
  }

  function showFinalizationModal() {
    $('#finalization-modal .carousel').carousel({interval: false}).carousel(0);
    $('#finalization-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
    $('#finalization-modal .progress').hide();
    hideFinalizeButtonTooltip();
  }

  function saveMap(title) {
    var $finalizeCarousel = $('#finalization-modal .carousel'),
        $progressBar = $('#finalization-modal .progress .bar'),
        $permalinkAnchor = $('#finalization-modal .permalink'),
        numPlaces = collection.length,
        numSavedPlaces = 0,
        mapId = (new Date()).getTime().toString(36);

        goNext = _.after(numPlaces, function() {
          var host = location.host;

          $finalizeCarousel.carousel('next');
          $permalinkAnchor
            .attr('href', 'http://' + host + '/map/' + mapId)
            .text(host + '/map/' + mapId);

          $('#finalization-review-map')
            .attr('href', 'http://' + host + '/map/' + mapId);
        });

    // Initialize the progress bar with a little sliver, to give the user
    // an indication that something's going on.
    $progressBar.css('width', (100 / (numPlaces + 1)) + '%');
    $progressBar.parent().fadeIn();

    collection.each(function(place) {

      S.Util.callWithRetries(place.save, 3, place, {
          'map_title': title,
          'map_id': mapId
        }, {
          success: function() {
            numSavedPlaces += 1;
            $progressBar.css('width', ((numSavedPlaces + 1) * 100 / (numPlaces + 1)) + '%');
            goNext();
          },
          error: _.once(function() {
            $('#finalization-modal').modal('hide');
            $('#map-save-error-modal').modal({backdrop: 'static', keyboard: 'false', show: true});
          })
        }
      );
    });
  }

  var $finalizeButtonTarget =
    $('<div id="finalize-button-wrapper"></div>').appendTo(map.getContainer());

  $(function() {
    setupFinalizeProcess($finalizeButtonTarget);
  });

/* ==============================
 * Tooltips
 * ============================== */

  function showZoomTooltip() {
    $('.leaflet-control-zoom')
      .tooltip({
        title: SG.zoomTooltipText,
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
        title: SG.controlMarkersTooltipText,
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

  function showTrashTooltip() {
    $('#control-markers-trash')
      .tooltip({
        title: SG.controlTrashTooltipText,
        trigger: 'manual',
        placement: 'left'
      })
      .tooltip('show');
  }

  function hideTrashTooltip() {
    $('#control-markers-trash').tooltip('hide');
  }


  function showFinalizeButtonTooltip() {
    $('#finalize-button-wrapper')
      .tooltip({
        title: SG.mapDoneButtonTooltipText,
        trigger: 'manual',
        placement: 'left'
      })
      .tooltip('show');
  }

  function hideFinalizeButtonTooltip() {
    $('#finalize-button-wrapper').tooltip('hide');
  }

  // Set it up to hide when the user zooms, or 5 seconds after the user starts
  // panning
  map.on('zoomend', hideZoomTooltip);
  map.on('dragstart', function() { _.delay(hideZoomTooltip, 5000); });

  // Whenever the zoom tooltip goes away, show the marker control tooltip
  $('.leaflet-control-zoom').on('hide-tooltip', _.once(showMarkerControlTooltip));

  // Hide the marker tooltip whenever the user drops a marker
  $(map.getContainer()).on('drop', hideMarkerControlTooltip);

  // Check to see if we should add a tooltip for the Done button
  var showFinalizeButtonTooltipOnce = _.once(showFinalizeButtonTooltip),
      showTrashTooltipOnce = _.once(showTrashTooltip);

  collection.on('remove', function(evt){
    if (collection.size() === 0) {
      $('#finalize-button-wrapper').hide();
    }
  });

  collection.on('add', function(evt) {
    if(collection.size() === 1) {
      showTrashTooltipOnce();
      _.delay(hideTrashTooltip, 7500);
    }

    if(collection.size() > 0) {
      $('#finalize-button-wrapper').show();
    }

    if(collection.size() === 5) {
      showFinalizeButtonTooltipOnce();
    }
  });

})(StompingGround, Shareabouts, jQuery, L);
