define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var Message = Backbone.Model.extend({
        defaults: {
            messageAuthor: 'Anonymous',
            messageText: '',
            time: '0:0:0'
        },
        validate: function(attributes) {
            var errors = [];
            if(! attributes.messageText) {
                errors.push('Message text cannot be empty.');
            }
            return errors.length > 0 ? errors : false;
        }
    });

    return Message;
});