
jest.dontMock('../../constants/NotificationConstants');
jest.dontMock('../NotificationsStorage');
jest.dontMock('object-assign');


describe('NotificationsStorage', function () {

    var NotificationConstants = require('../../constants/NotificationConstants.js');
    var AppDispatcher;
    var NotificationsStorage;
    var callback;

    //TODO to carry out in utils or helpers
    function checkType(value) {
        return value ? (({}).toString.apply(value)).slice(8, -1) : null
    }

    // mock actions
    var item = {
        message: '<h1>Notification message</h1>',
        level: 'success',
        autoDismiss: 0,
        allowHTML: true,
        position: 'bc'
    };

    var actionNotificationCreate = {
        actionType: NotificationConstants.NOTIFICATION_CREATE,
        item: item
    };
    var actionNotificationDestroy = {
        actionType: NotificationConstants.NOTIFICATION_DESTROY,
        id: 'replace me in test'
    };

    var actionNotificationDestroyAll = {
        actionType: NotificationConstants.NOTIFICATION_DESTROY_COMPLETED
    };

    var actionNotificationUpdate = {
        actionType: NotificationConstants.NOTIFICATION_UPDATE_ITEM,
        item:{
            position: 'tl'
        }
    };

    beforeEach(function () {
        AppDispatcher = require('../../dispatcher/AppDispatcher');
        NotificationsStorage = require('../NotificationsStorage');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function () {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('should initialize with no notification items', function () {
        var all = NotificationsStorage.getAll();
        expect(checkType(all)).toEqual('Array');
    });

    it('creates a notification item', function () {
        callback(actionNotificationCreate);
        var all = NotificationsStorage.getAll();
        expect(all.length).toBe(1);
        expect(all[0].level).toEqual('success');
    });

    it('update a notification item', function () {
        callback(actionNotificationCreate);
        var all = NotificationsStorage.getAll();
        actionNotificationUpdate.id = all[0].id;
        callback(actionNotificationUpdate);
        expect(all[0].position).toEqual('tl');
    });

    it('destroys a notification item', function () {
        callback(actionNotificationCreate);
        var all = NotificationsStorage.getAll();
        expect(all.length).toBe(1);
        actionNotificationDestroy.id = all[0].id;
        callback(actionNotificationDestroy);
        expect(all.length).toEqual(0);
    });

    it('can destroys all notification', function () {
        for ( var i = 0; i < 3; i++) {
            callback(actionNotificationCreate);
        }
        expect((NotificationsStorage.getAll()).length).toBe(3);

        callback(actionNotificationDestroyAll);

        expect((NotificationsStorage.getAll()).length).toBe(0);

    });

});
