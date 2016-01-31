define([
    'jquery',
    'underscore',
    'backbone',
    'models/page',
    'views/applicationView'
], function ($, _, Backbone, Page, ApplicationView) {
   var initialize = function () {
       var page = new Page();
       new ApplicationView(page);
   };

    return {
        initialize: initialize
    };
});