define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/message.html'
], function ($, _, Backbone, messageTemplate) {
    'use strict';

    var MessageView = Backbone.View.extend({
        tagName: 'li',
        className: 'message-item l-box pure-u-22-24 pure-u-md-11-24',
        template: _.template(messageTemplate),
        initialize: function() {
            /*
             'remove' is Backbone's method that automatically
             removes the view associated with the model.
             */
            this.model.on('destroy', this.remove, this);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            'click .remove-btn': 'onRemoveBtnClicked'
        },
        onRemoveBtnClicked: function() {
            this.model.destroy();
        }
    });

    return MessageView;
});