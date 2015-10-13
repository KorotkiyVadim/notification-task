var React = require('react');
var ReactDOM = require('react-dom');
var Default = require('./default/default');
var Styles = require('./styles/styles');
var Helpers = require('./helpers/helpers');
var NotificationsAction = require('./actions/NotificationAction');


class NotificationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.getStyles = this.props.getStyles;
        this.level = this.props.notification.level;
        this.noAnimation = this.props.notification.noAnimation || false;
        this.allowHTML= this.props.notification.allowHTML || false;
        this._styles = {
            notification: this.getStyles.notification(this.level),
            title: this.getStyles.title(this.level),
            dismiss: this.getStyles.dismiss(this.level),
            messageWrapper: this.getStyles.messageWrapper(this.level),
            actionWrapper: this.getStyles.actionWrapper(this.level),
            action: this.getStyles.action(this.level)
        };
        if (!this.props.notification.dismissible) {
            this._styles.notification.cursor = 'default';
        }
    }

    static  propTypes = {
        notification: React.PropTypes.object,
        allowHTML: React.PropTypes.bool
    };

    static defaultProps = {
        _notificationTimer: null,
        _height: 0,
        _isMounted: false
    };

    _getCssPropertyByPosition() {
        var position = this.props.notification.position;
        var css = {};

        switch (position) {
            case Default.positions.tl:
            case Default.positions.bl:
                css = {
                    property: 'left',
                    value: -200
                };
                break;

            case Default.positions.tr:
            case Default.positions.br:
                css = {
                    property: 'right',
                    value: -200
                };
                break;

            case Default.positions.tc:
                css = {
                    property: 'top',
                    value: -100
                };
                break;

            case Default.positions.bc:
                css = {
                    property: 'bottom',
                    value: -100
                };
                break;
        }

        return css;
    };

    _defaultAction = (event) => {
        event.preventDefault();
        var notification = this.props.notification;
        this._hideNotification();
        notification.action.callback();
    };

    _hideNotification() {
        if (this._notificationTimer) {
            this._notificationTimer.clear();
        }

        if (this._isMounted) {
            NotificationsAction.destroy(this.props.notification.id)
        }
    };

    _dismiss = () => {
        if (!this.props.notification.dismissible) {
            return;
        }

        NotificationsAction.destroy(this.props.notification.id)
    };

    componentDidMount() {
        var notification = this.props.notification;

        var element = ReactDOM.findDOMNode(this);

        this._height = element.offsetHeight;

        this._isMounted = true;

        if (notification.autoDismiss) {

            this._notificationTimer = new Helpers.timer(() => this._hideNotification(), notification.autoDismiss * 1000);

            element.addEventListener('mouseenter', () => this._notificationTimer.pause());

            element.addEventListener('mouseleave', () => this._notificationTimer.resume());
        }

        this._showNotification();

    };

    _showNotification = () => {
        this.setState({
            visible: true
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    _allowHTML(string) {
        return {__html: string};
    };

    render() {
        var notification = this.props.notification;

        var className = 'notification notification-' + notification.level;

        if (this.state.visible) {
            className = className + ' notification-visible';
        } else {
            className = className + ' notification-hidden';
        }

        if (!notification.dismissible) {
            className = className + ' notification-not-dismissible';
        }

        if (this.props.getStyles.overrideStyle) {
            var cssByPos = this._getCssPropertyByPosition();
            if (!this.state.visible) {
                this._styles.notification[cssByPos.property] = cssByPos.value;
            }

            if (this.state.visible) {
                this._styles.notification.height = this._height;
                this._styles.notification[cssByPos.property] = 0;
            }


            this._styles.notification.opacity = this.state.visible ? this._styles.notification.isVisible.opacity : this._styles.notification.isHidden.opacity;
        }

        var dismiss = null;
        var actionButton = null;
        var title = null;
        var message = null;

        if (notification.title) {
            title = <h4 className="notification-title" style={this._styles.title}>{notification.title}</h4>;
        }

        if (notification.message) {
            if (this.allowHTML) {
                message = (
                    <div className="notification-message" style={this._styles.messageWrapper}
                         dangerouslySetInnerHTML={this._allowHTML(notification.message)}></div>
                );
            } else {
                message = (
                    <div className="notification-message"
                         style={this._styles.messageWrapper}>{notification.message}</div>
                );
            }
        }

        if (notification.dismissible) {
            dismiss = <span className="notification-dismiss" style={this._styles.dismiss}
                            onClick={this._dismiss}>&times;</span>;
        }

        if (notification.action) {
            actionButton = (
                <div className="notification-action-wrapper" style={this._styles.actionWrapper}>
                    <button className="notification-action-button" onClick={this._defaultAction}
                            style={this._styles.action}>{notification.action.label}</button>
                </div>
            );
        }

        return (
            <div className={className} style={this._styles.notification}>
                {title}
                {message}
                {dismiss}
                {actionButton}
            </div>
        );
    };
}



module.exports = NotificationItem;
