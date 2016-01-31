'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalStorage: {
            deps: [
                'backbone'
            ],
            exports: 'Store'
        }
    },
    paths: {
        'jquery': 'lib/jquery-min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min',
        'backboneLocalStorage': 'lib/backbone.localStorage-min',
        'text': 'lib/text',
        'templates': '../templates',
        'app': 'app'
    }
});

require([
    'app'
    ],
    function (App) {
        App.initialize();
});