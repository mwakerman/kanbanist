import React from 'react';
import { connect } from 'react-redux';
import { Button, Intent } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';
import '../../node_modules/@blueprintjs/datetime/dist/blueprint-datetime.css';
import moment from 'moment';

import { actions as listActions, NAMED_FILTERS } from '../redux/modules/lists';

// DateRangePicker shortcuts
const now = moment();
const tomorrow = moment().add(1, 'days');
const sevenDaysFromNow = moment().add(6, 'days');
const beginningOfMonth = moment().startOf('month');
const endOfMonth = moment().endOf('month');

const dueDateShortcuts = [
    { label: 'Today', dateRange: [now.toDate(), now.toDate()] },
    { label: 'Tomorrow', dateRange: [tomorrow.toDate(), tomorrow.toDate()] },
    { label: 'This week', dateRange: [now.toDate(), sevenDaysFromNow.toDate()] },
    { label: 'This month', dateRange: [beginningOfMonth.toDate(), endOfMonth.toDate()] },
];

class DueDateFilterMenu extends React.Component {
    handleDateChange = dateArray => {
        const { setNamedFilter, updateDueDateFilter } = this.props;
        const [startDate, endDate] = dateArray;
        const startMoment = startDate !== null ? moment(startDate).startOf('day') : null;
        const endMoment = endDate !== null ? moment(endDate).endOf('day') : null;
        setNamedFilter(null);
        updateDueDateFilter(startMoment, endMoment);
    };

    handleClear = () => {
        const { updateDueDateFilter, setNamedFilter } = this.props;
        updateDueDateFilter(null, null);
        setNamedFilter(null);
    };

    handleNamedFilter = filter => {
        const { updateDueDateFilter, setNamedFilter } = this.props;
        console.debug('TODO: setNamedFilter', filter);

        if (filter) {
            // clear existing due date filter
            updateDueDateFilter(null, null);
            setNamedFilter(filter);
        } else {
            // un-set named filter
            setNamedFilter(null);
        }
    };

    render() {
        const { filterDueDate, namedFilter } = this.props;
        const startDateMoment = filterDueDate.get('startDate', null);
        const endDateMoment = filterDueDate.get('endDate', null);
        const startDate = startDateMoment !== null ? startDateMoment.toDate() : null;
        const endDate = endDateMoment !== null ? endDateMoment.toDate() : null;
        return (
            <div>
                <h6>Due Date Filter</h6>
                <hr />
                <Button
                    className="Toolbar-button"
                    text="Next 7 Days"
                    title="Dynamic filter"
                    onClick={() => {
                        if (namedFilter === NAMED_FILTERS.NEXT_7_DAYS) {
                            this.handleNamedFilter(null);
                        } else {
                            this.handleNamedFilter(NAMED_FILTERS.NEXT_7_DAYS);
                        }
                    }}
                    active={namedFilter === NAMED_FILTERS.NEXT_7_DAYS}
                />
                <Button
                    className="Toolbar-button"
                    text="No Due Date"
                    onClick={() => {
                        if (namedFilter === NAMED_FILTERS.NO_DUE_DATE) {
                            this.handleNamedFilter(null);
                        } else {
                            this.handleNamedFilter(NAMED_FILTERS.NO_DUE_DATE);
                        }
                    }}
                    active={namedFilter === NAMED_FILTERS.NO_DUE_DATE}
                />
                <hr />
                <div>
                    <DateRangePicker
                        value={[startDate, endDate]}
                        onChange={this.handleDateChange}
                        shortcuts={dueDateShortcuts}
                    />
                </div>
                <Button
                    text="Clear"
                    iconName="delete"
                    intent={Intent.DANGER}
                    className="pt-minimal"
                    onClick={this.handleClear}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { filterDueDate, namedFilter } = state.lists;
    return { filterDueDate, namedFilter };
};

const mapDispatchToProps = {
    updateDueDateFilter: listActions.updateDueDateFilter,
    setNamedFilter: listActions.setNamedFilter,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DueDateFilterMenu);
