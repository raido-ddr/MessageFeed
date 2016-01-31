define([
    'jquery',
    'underscore',
    'backbone',
    'collections/messageList',
    'views/messageView'
], function ($, _, Backbone, messageList, MessageView) {
    'use strict';

    var ApplicationView = Backbone.View.extend({
        el: '#app-container',
        initialize: function(model) {
            this.model = model;
            this.authorInput = this.$('#message-author-input');
            this.textInput = this.$('#message-text-input');
            messageList.on('add', this.onMessageAdded, this);
            messageList.on('remove', this.onMessageRemoved, this);
            messageList.on('reset', this.onMessageListReset, this);
            this.model.on('addedCountChanged', this.onAddedCountChanged, this);
            this.model.on('removedCountChanged', this.onRemovedCountChanged, this);

            //Loading messages and counters' values from the local storage
            this.model.fetch({error: this.updateCounters, success: this.updateCounters});
            messageList.fetch();
        },
        events: {
            'click #submit-message-btn': 'onSubmitBtnClicked',
        },
        updateCounters: function (model) {
            var addedMessagesCount = model.get('addedMessagesCount');
            $('#added-messages-count').html(addedMessagesCount);
            var removedMessagesCount = model.get('removedMessagesCount');
            $('#removed-messages-count').html(removedMessagesCount);
        },
        onSubmitBtnClicked: function (e) {
            //Prevents the page from reloading
            e.preventDefault();

            var self = this;
            messageList.create(this.newMessageData(), {
                success: function () {
                    self.model.incrementAddedCount();
                    self.model.save();
                    self.authorInput.val('');
                    self.textInput.val('');
                },
                error: function(model, errors) {
                    self.showValidationErrors(errors);
                }
            });
        },
        showValidationErrors: function (errors) {
            //Should display each of the array elements. Omitted for simplicity.
            $('#message-validation-error').html(errors[0]);
        },
        onMessageAdded: function(message) {
            var messageView = new MessageView({model: message});
            $('#message-list').append(messageView.render().el);
        },
        newMessageData: function() {
            var auth = this.authorInput.val().trim();
            var messageAuthor = this.authorInput.val().trim() != ""
                ? this.authorInput.val().trim()
                : "Anonymous";

            return {
                messageAuthor: messageAuthor,
                messageText: this.textInput.val().trim(),
                time: this.getMessageDateTime()
            }
        },
        getMessageDateTime: function() {
            return new Date().toLocaleString();
        },
        onMessageRemoved: function () {
            this.model.incrementRemovedCount();
            this.model.save();
        },
        onMessageListReset: function () {
            this.$('#message-list').html('');
            messageList.each(this.onMessageAdded, this);
        },
        onAddedCountChanged: function (newCountValue) {
            $('#added-messages-count').html(newCountValue);
        },
        onRemovedCountChanged: function (newCountValue) {
            $('#removed-messages-count').html(newCountValue);
        }
    });

    return ApplicationView;
});