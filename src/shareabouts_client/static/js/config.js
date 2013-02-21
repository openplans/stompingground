var StompingGround = StompingGround || {};

(function(SG, S, $) {
  StompingGround.Config = {
    icons: {
      bad: {
        iconUrl: '/static/img/marker-heart-broken.png',
        iconThumbUrl: '/static/img/marker-heart-broken.png',
        iconSize: [51, 46],
        iconAnchor: [25, 26],
        popupAnchor: [1, -26]
      },
      good: {
        iconUrl: '/static/img/marker-heart.png',
        iconThumbUrl: '/static/img/marker-heart.png',
        iconSize: [51, 46],
        iconAnchor: [25, 26],
        popupAnchor: [1, -26]
      },
      comment: {
        iconUrl: '/static/img/marker-comment.png',
        iconThumbUrl: '/static/img/marker-comment.png',
        iconSize: [51, 46],
        iconAnchor: [25, 26],
        popupAnchor: [1, -26]
      }
    }
  };
})(StompingGround, Shareabouts, jQuery);