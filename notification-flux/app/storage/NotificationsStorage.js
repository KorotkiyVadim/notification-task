/**
 * Created by Vadim on 06.10.2015.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NotificationsConstants = require('../constants/NotificationConstants');
var merge = require('object-assign');

var CHANGE_EVENT = 'change';

var _Notifications = [];

/**
 * Create a Notifications item.
 * @param  {object}  The content of the Notifications
 */

var NotificationsStore = merge({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of Notifications.
     * @return {object}
     */
    getAll: function() {
        return _Notifications;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    var item;

    switch(action.actionType) {
        case NotificationsConstants.NOTIFICATION_CREATE:
            item = action.item;
            create(item);
            NotificationsStore.emitChange();
            break;

        case NotificationsConstants.NOTIFICATION_UPDATE_ITEM:
            item = action.item;
            update(action.id, item);
            NotificationsStore.emitChange();

            break;

        case NotificationsConstants.NOTIFICATION_DESTROY:
            destroy(action.id);
            NotificationsStore.emitChange();
            break;

        case NotificationsConstants.NOTIFICATION_DESTROY_COMPLETED:
            destroyCompleted();
            NotificationsStore.emitChange();
            break;

        default:
        // no op
    }
});


function create(item) {
    // Hand waving here -- not showing how this interacts with XHR or persistent
    // server-side storage.
    // Using the current timestamp + random number in place of a real id.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    item.id = id;
    _Notifications.push(item)
}

/**
 * Update a Notifications item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
    for(var i=0; i < _Notifications.length;i++){
        if(_Notifications[i].id === id){
            _Notifications.splice(i--,1, merge({}, _Notifications[i], updates))

        }
    }
}

/**
 * Delete a Notification item.
 * @param  {string} id
 */
function destroy(id) {
    for(var i=0; i < _Notifications.length;i++){
        if(_Notifications[i].id === id){
            _Notifications.splice(i--,1)
        }
    }
}
/**
 * Delete all the Notifications items.
 */
function destroyCompleted() {
    _Notifications.length = 0;
}

module.exports = NotificationsStore;