var StompingGround = StompingGround || {};

(function(SG, S, $, L) {
  var url = 'http://{s}.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png',
      baseLayer = L.tileLayer(url, {
        attribution: '&copy; OpenStreetMap contributors, CC-BY-SA. <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
      }),
      bing = new L.BingLayer('AvwpEJSPGtaU_s5ANOzYMZAesUO0Uit-5NydR60whL3KC0sFFCK-9Ay1jaFZ_s0P', {
        type: 'Road',
        maxZoom: 20
      }),
      map = L.map('map', {
        center: [40.7873, -73.9753],
        zoom: 16
      });

  map.addLayer(bing);
  map.setView([40.7873, -73.9753], 16);
})(StompingGround, Shareabouts, jQuery, L);