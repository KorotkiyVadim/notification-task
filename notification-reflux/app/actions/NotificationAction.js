/**
 * Created by Vadim on 06.10.2015.
 */

var Reflux = require('reflux');
var NotificationConstants = require('../constants/NotificationConstants');

var NotificationActions = Reflux.createActions([
    NotificationConstants.NOTIFICATION_CREATE,
    NotificationConstants.NOTIFICATION_DESTROY,
    NotificationConstants.NOTIFICATION_DESTROY_COMPLETED,
    NotificationConstants.NOTIFICATION_UPDATE_ITEM
]);

module.exports = NotificationActions;