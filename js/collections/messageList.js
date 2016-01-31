define([
    'underscore',
    'backbone',
    'backboneLocalStorage',
    'models/message'
], function (_, Backbone, Store, Message) {
    'use strict';

    var MessageList = Backbone.Collection.extend({
        model: Message,
        localStorage:  new Store('message-feed'),
    });

    return new MessageList();
})