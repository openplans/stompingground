Stomping Ground [![Build Status](https://secure.travis-ci.org/openplans/stompingground.png)](http://travis-ci.org/openplans/stompingground)
==============================

Stomping Ground is a digital stickers-on-a-map application.

Quick Start
-----------

You will need:
* Two sticker icons for each type of thing you want to put on the map -- one large sticker icon for the map screen, and one tiny pin icon for the dashboard.
* A base map to use beneath the stickers (*is this Map Box-specific?*).

1.  Place your sticker and pin icons in the `src/stompingground/static/img/`
    folder.
2.  Open the file `src/stompingground/static/js/config.js` and find the
    `placeTypes` section.
3.  Copy one of the sample place types for each of your types of things.
4.  Fill in the values for each of your icons. The sticker goes in the 
    `iconUrl`, and the pin in the `iconThumbUrl`. For example, if you are 
    adding trees to the map, and your icons are named `tree-sticker.png` and
    `tree-pin.png`, the you may have a place type that looks like:

        tree: {
          label: 'Tree',
          icon: {
            iconUrl: StompingGround.siteRoot + '/static/img/tree-sticker.png',
            iconThumbUrl: StompingGround.siteRoot + '/static/img/tree-pin.png',
            iconSize: [30, 41],
            iconAnchor: [15, 41]
          }
        },
5.  Find the `layer` section and enter the information for your desired base
    map. Also enter this information into the `staticMap` section. The `layer`
    section controls how the big sticker map looks, and `staticMap` is for the
    little maps on the dashboard. Fill out how far in an out (`maxZoom` and 
    `minZoom`) the user should be able to go on sticker map.

Contributing
------------
In the spirit of [free software](http://www.fsf.org/licensing/essays/free-sw.html), **everyone** is encouraged to help improve this project. 

Here are some ways *you* can contribute:

* by joining our developers discussion list: http://groups.google.com/group/shareabouts-dev
* by taking a look at our pipeline in the public tracker: https://www.pivotaltracker.com/projects/398973
* by using alpha, beta, and prerelease versions
* by reporting bugs
* by suggesting new features
* by writing or editing documentation
* by writing specifications
* by writing code (**no patch is too small**: fix typos, add comments, clean up inconsistent whitespace)
* by refactoring code
* by resolving issues
* by reviewing patches

Credits
-------------
Shareabouts is a project of the [Civic Works](http://openplans.org/initiatives/civic-works/) group at [OpenPlans](http://openplans.org).
