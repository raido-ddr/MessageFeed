'use strict';

//Object used as a namespace
var app = {};

app.Page = Backbone.Model.extend({
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

app.Message = Backbone.Model.extend({
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

app.MessageList = Backbone.Collection.extend({
    model: app.Message,
    localStorage:  new Store('message-feed'),
});

app.MessageView = Backbone.View.extend({
    tagName: 'li',
    className: 'message-item l-box pure-u-22-24 pure-u-md-11-24',
    template: _.template($('#message-template').html()),
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

app.ApplicationView = Backbone.View.extend({
    el: '#app-container',
    initialize: function(model) {
        this.model = model;
        this.authorInput = this.$('#message-author-input');
        this.textInput = this.$('#message-text-input');
        app.messageList.on('add', this.onMessageAdded, this);
        app.messageList.on('remove', this.onMessageRemoved, this);
        app.messageList.on('reset', this.onMessageListReset, this);
        this.model.on('addedCountChanged', this.onAddedCountChanged, this);
        this.model.on('removedCountChanged', this.onRemovedCountChanged, this);

        //Loading messages and counters' values from the local storage
        this.model.fetch({error: this.updateCounters, success: this.updateCounters});
        app.messageList.fetch();
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
    validateMessage: function() {
        return (this.textInput.val().trim() != "");
    },
    onSubmitBtnClicked: function () {
        var self = this;
        app.messageList.create(this.newMessageData(), {
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
        var messageView = new app.MessageView({model: message});
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
        app.messageList.each(this.onMessageAdded, this);
    },
    onAddedCountChanged: function (newCountValue) {
        $('#added-messages-count').html(newCountValue);
    },
    onRemovedCountChanged: function (newCountValue) {
        $('#removed-messages-count').html(newCountValue);
    }
});

app.messageList = new app.MessageList();
app.page = new app.Page();
app.applicationView = new app.ApplicationView(app.page);