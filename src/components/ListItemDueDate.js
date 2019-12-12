import React from 'react';
import { parseDueDate } from '../core/DueDate';

const DISPLAY_TYPE = {
    DATE: 'DATE',
    RELATIVE: 'RELATIVE',
};

export default class ListItemDueDate extends React.Component {
    constructor(props) {
        super(props);
        const { dueDate } = props;
        this.state = {
            dueDate: dueDate ? parseDueDate(dueDate) : null,
            displayType: DISPLAY_TYPE.DATE,
        };
    }

    handleToggleDisplayType = () => {
        const displayType =
            this.state.displayType === DISPLAY_TYPE.RELATIVE ? DISPLAY_TYPE.DATE : DISPLAY_TYPE.RELATIVE;
        this.setState({ displayType });
    };

    render() {
        const { dueDate, displayType } = this.state;

        if (dueDate === null) {
            return null;
        }

        let text = '';
        switch (displayType) {
            case DISPLAY_TYPE.DATE:
                text = dueDate.format();
                break;
            case DISPLAY_TYPE.RELATIVE:
                text = dueDate.due_moment.fromNow();
                break;
            default:
                console.error('Unknown displayType for ListItemDueDate: ', displayType);
        }

        const classes = ['ListItem-project-duedate', dueDate.isExpired() ? 'overdue' : ''].join(' ');

        return (
            <span className={classes} onClick={this.handleToggleDisplayType}>
                {text}
            </span>
        );
    }
}
