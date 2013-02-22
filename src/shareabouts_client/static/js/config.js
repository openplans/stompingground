var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
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