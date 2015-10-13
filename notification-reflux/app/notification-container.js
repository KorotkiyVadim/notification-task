var React = require('react');
var NotificationItem = require('./notification-item');
var Default = require('./default/default');
var Helpers = require('./helpers/helpers');

class NotificationContainer extends React.Component {
    constructor(props) {
        super(props);

        this._style = this.props.getStyles.container(this.props.position);

        if (this.props.getStyles.overrideWidth && (this.props.position === Default.positions.tc || this.props.position === Default.positions.bc)) {
            this._style['marginLeft'] = -(this.props.getStyles.overrideWidth / 2);
        }

    }

    static propTypes = {
        position: React.PropTypes.string.isRequired,
        notifications: React.PropTypes.array.isRequired
    };


    render() {
        if ([Default.positions.bl, Default.positions.br, Default.positions.bc].indexOf(this.props.position) > -1) {
            this.props.notifications.reverse();
        }
        var {notifications, ...others } = this.props;
        var _notifications = null;
         _notifications = notifications.map(function(notification) {
            return (
                <NotificationItem
                 ref={'notification-' + notification.id }
                 key={notification.id}
                 notification={notification}
                 {...others}
             />)
        });


        return (
            <div className={'notifications-' + this.props.position} style={this._style}>
                {_notifications}
            </div>
        );
    }
}



module.exports = NotificationContainer;