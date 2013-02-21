var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    icons: {
      bad: {
        iconUrl: StompingGround.siteRoot + '/static/img/markers/sticker-0d85e9.png',
        iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-0d85e9.png',
        iconSize: [45, 61],
        iconAnchor: [21, 50]
      },
      good: {
        iconUrl: StompingGround.siteRoot + '/static/img/markers/sticker-fa307d.png',
        iconThumbUrl: StompingGround.siteRoot + '/static/img/markers/dot-fa307d.png',
        iconSize: [45, 61],
        iconAnchor: [21, 50]
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);