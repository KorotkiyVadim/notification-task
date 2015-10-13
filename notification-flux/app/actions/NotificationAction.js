/**
 * Created by Vadim on 06.10.2015.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var NotificationConstants = require('../constants/NotificationConstants');

var NotificationActions = {

    /**
     * @param  {obj} item
     */
    create: function(item) {
        AppDispatcher.dispatch({
            actionType: NotificationConstants.NOTIFICATION_CREATE,
            item: item
        });
    },

    /**
     * @param  {string} id The ID of the NotificationConstants item
     * @param  {object} item
     */
    update: function(id, item) {
        AppDispatcher.dispatch({
            actionType: NotificationConstants.NOTIFICATION_UPDATE_ITEM,
            id: id,
            item: item
        });
    },

    /**
     * @param  {string} id
     */
    destroy: function(id) {
        AppDispatcher.dispatch({
            actionType: NotificationConstants.NOTIFICATION_DESTROY,
            id: id
        });
    },

    /**
     * Delete all the completed ToDos
     */
    destroyCompleted: function() {
        AppDispatcher.dispatch({
            actionType: NotificationConstants.NOTIFICATION_DESTROY_COMPLETED
        });
    }

};

module.exports = NotificationActions;