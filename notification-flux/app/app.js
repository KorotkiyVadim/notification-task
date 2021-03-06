/**
 * Created by Vadim on 05.10.2015.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var NotificationSystem = require('./notification-system');
var NotificationsAction = require('./actions/NotificationAction');


var MyComponent = React.createClass({
    _notificationSystem: null,

    _addNotification: function(event) {
        event.preventDefault();
        this._notificationSystem.addNotification({
            message: 'Notification message',
            level: 'success'
        });
    },
    _addNotificationWithNull: function(event){
        event.preventDefault();
        this._notificationSystem.addNotification({
            message: '<h1>Notification message</h1>',
            level: 'success',
            autoDismiss: 0,
            allowHTML:true,
            position:'bc',
            action: {
                label: 'Button name',
                callback: function() {
                    console.log('Notification button clicked!');
                }
            }

        });
    },
    _deleteAll: function(event){
        event.preventDefault();
        NotificationsAction.destroyCompleted()
    },
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    render: function() {
        return (
            <div>
                <button onClick={this._addNotification}>Add notification</button>
                <button onClick={this._addNotificationWithNull}>Add notification with infinity time </button>
                <button onClick={this._deleteAll}>Delete All</button>
                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
});

ReactDOM.render(
    React.createElement(MyComponent),
    document.getElementById('app')
);

