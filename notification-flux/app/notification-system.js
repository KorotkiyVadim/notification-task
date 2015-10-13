var React = require('react');
var NotificationsStore = require('./storage/NotificationsStorage');
var NotificationsAction = require('./actions/NotificationAction');
var merge = require('object-assign');
var NotificationContainer = require('./notification-container');
var Default = require('./default/default');
var Styles = require('./styles/styles');
var Helpers = require('./helpers/helpers');

function getNotificationsState() {
    return {
        notifications: NotificationsStore.getAll()
    };
}

class NotificationMessageSystem extends React.Component {
    constructor(props) {
        super(props);

        this.state = getNotificationsState();
    }

    static defaultProps = {
        style: {},
        noAnimation: false
    };

    _getStyles = {
        overrideStyle: {},

        overrideWidth: null,

        setOverrideStyle(style) {
            this.overrideStyle = style;
        },

        wrapper() {
            if (!this.overrideStyle) return {};
            return merge({}, Styles.Wrapper, this.overrideStyle);
        },

        container(position) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Containers || {};

            this.overrideWidth = Styles.Containers.DefaultStyle.width;

            if (override.DefaultStyle && override.DefaultStyle.width) {
                this.overrideWidth = override.DefaultStyle.width;
            }

            if (override[position] && override[position].width) {
                this.overrideWidth = override[position].width;
            }

            return merge({}, Styles.Containers.DefaultStyle, Styles.Containers[position], override.DefaultStyle, override[position]);
        },

        notification(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.NotificationItem || {};
            return merge({}, Styles.NotificationItem.DefaultStyle, Styles.NotificationItem[level], override.DefaultStyle, override[level]);
        },

        title(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Title || {};
            return merge({}, Styles.Title.DefaultStyle, Styles.Title[level], override.DefaultStyle, override[level]);
        },

        messageWrapper(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.MessageWrapper || {};
            return merge({}, Styles.MessageWrapper.DefaultStyle, Styles.MessageWrapper[level], override.DefaultStyle, override[level]);
        },

        dismiss(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Dismiss || {};
            return merge({}, Styles.Dismiss.DefaultStyle, Styles.Dismiss[level], override.DefaultStyle, override[level]);
        },

        action(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.Action || {};
            return merge({}, Styles.Action.DefaultStyle, Styles.Action[level], override.DefaultStyle, override[level]);
        },

        actionWrapper(level) {
            if (!this.overrideStyle) return {};
            var override = this.overrideStyle.ActionWrapper || {};
            return merge({}, Styles.ActionWrapper.DefaultStyle, Styles.ActionWrapper[level], override.DefaultStyle, override[level]);
        }
    };

    addNotification(notification) {

        var notification = merge({}, Default.notification, notification);

        var error = false;

        try {
            if (!notification.level) {
                throw "notification level is required."
            }

            if (isNaN(notification.autoDismiss)) {
                throw "'autoDismiss' must be a number."
            }

            if (Object.keys(Default.positions).indexOf(notification.position) === -1) {
                throw "'" + notification.position + "' is not a valid position."
            }

            if (Object.keys(Default.levels).indexOf(notification.level) === -1) {
                throw "'" + notification.level + "' is not a valid level."
            }

            if (!notification.dismissible && !notification.action) {
                throw "You need to set notification dismissible to true or set an action, otherwise user will not be able to dismiss the notification."
            }

        } catch (err) {
            error = true;
            console.error('Error adding notification: ' + err);
        }

        if (!error) {


            notification.position = notification.position.toLowerCase();
            notification.level = notification.level.toLowerCase();
            notification.autoDismiss = parseInt(notification.autoDismiss);

            NotificationsAction.create(notification)
        }

    };

    componentDidMount() {
        this._getStyles.setOverrideStyle(this.props.style);
        NotificationsStore.addChangeListener(this._onChange);
    };

    componentWillUnmount = () => {
        NotificationsStore.removeChangeListener(this._onChange);
    };

    render() {
        var containers = null;
        var notifications = this.state.notifications;
        var _notifications = [];

        if (notifications.length) {
            containers = Object.keys(Default.positions).map((position) => {

                var _notifications = notifications.filter(function(notification) {
                    return position === notification.position;
                });

                if (_notifications.length) {
                    return (
                        <NotificationContainer
                            ref={'container-'+ position}
                            key={position}
                            position={position}
                            notifications={_notifications}
                            getStyles={this._getStyles}
                            noAnimation={this.props.noAnimation}
                            />
                    );
                }
            });
        }

        return (
            <div className="notifications-wrapper" style={this._getStyles.wrapper()}>
                {containers}
            </div>

        );
    };

    _onChange = () => {
        this.setState(getNotificationsState());
    };

}


module.exports = NotificationMessageSystem;
