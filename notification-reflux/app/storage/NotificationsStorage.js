/**
 * Created by Vadim on 06.10.2015.
 */

var Reflux = require('reflux');
var NotificationAction = require('../actions/NotificationAction');
var NotificationsConstants = require('../constants/NotificationConstants');
var merge = require('object-assign');


var NotificationsStore = Reflux.createStore({
    listenables: [NotificationAction],

    getInitialState: function () {
        this._Notifications = [];
        return this._Notifications;
    },
    ['on' + NotificationsConstants.NOTIFICATION_CREATE]: function (item) {
        item.id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        this._Notifications.push(item);
        this.updateList()
    },
    ['on' + NotificationsConstants.NOTIFICATION_UPDATE_ITEM]: function (id, updates) {
        for (var i = 0; i < this._Notifications.length; i++) {
            if (this._Notifications[i].id === id) {
                this._Notifications.splice(i--, 1, merge({}, this._Notifications[i], updates))

            }
            this.updateList()
        }
    },
    ['on' + NotificationsConstants.NOTIFICATION_DESTROY]: function (id) {
        for (var i = 0; i < this._Notifications.length; i++) {
            if (this._Notifications[i].id === id) {
                this._Notifications.splice(i--, 1)
            }
        }
        this.updateList()
    },
    ['on' + NotificationsConstants.NOTIFICATION_DESTROY_COMPLETED]: function () {
        this._Notifications.length = 0;
        this.updateList()
    },
    updateList: function () {
        this.trigger(this._Notifications);
    }
});

module.exports = NotificationsStore;