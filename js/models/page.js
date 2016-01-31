define([
    'underscore',
    'backbone',
    'backboneLocalStorage'
], function (_, Backbone, Store) {
    'use strict';

    var Page = Backbone.Model.extend({
        initialize: function () {
            this.bind('change:addedMessagesCount', this.onAddedCountChanged);
            this.bind('change:removedMessagesCount', this.onRemovedCountChanged);
        },
        defaults: {
            id: 1,
            addedMessagesCount: 0,
            removedMessagesCount: 0
        },
        localStorage: new Store('page-store'),
        incrementAddedCount: function () {
            var updatedCount = this.get('addedMessagesCount') + 1;
            this.set({addedMessagesCount: updatedCount});
        },
        incrementRemovedCount: function () {
            var updatedCount = this.get('removedMessagesCount') + 1;
            this.set({removedMessagesCount: updatedCount});
        },
        onAddedCountChanged: function() {
            this.trigger('addedCountChanged', this.get('addedMessagesCount'));
        },
        onRemovedCountChanged: function () {
            this.trigger('removedCountChanged', this.get('removedMessagesCount'));
        }
    });

    return Page;

});