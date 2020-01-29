import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import moment from 'moment';

import { actions as listActions, NAMED_FILTERS } from '../redux/modules/lists';

class DueDateFilterMenu extends React.Component {
    handleDateChange = dateArray => {
        const { setNamedFilter, updateDueDateFilter } = this.props;
        const [startDate, endDate] = dateArray;
        const startMoment = startDate !== null ? moment(startDate).startOf('day') : null;
        const endMoment = endDate !== null ? moment(endDate).endOf('day') : null;
        setNamedFilter(null);
        updateDueDateFilter(startMoment, endMoment);
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
            <div className="DueDateFilterMenu FilterMenu">
                <p><strong>Dynamic</strong></p>
                <Button
                    small={true}
                    className="Toolbar-button"
                    text="Today"
                    title="Dynamic filter - Today"
                    onClick={() => {
                        if (namedFilter === NAMED_FILTERS.TODAY) {
                            this.handleNamedFilter(null);
                        } else {
                            this.handleNamedFilter(NAMED_FILTERS.TODAY);
                        }
                    }}
                    active={namedFilter === NAMED_FILTERS.TODAY}
                />
                <Button
                    small={true}
                    className="Toolbar-button"
                    text="Next 7 Days"
                    title="Dynamic filter - Next 7 days"
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
                    small={true}
                    className="Toolbar-button"
                    title="Dynamic filter - No Due Date"
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
                <br/>
                <br/>
                <p><strong>Date Range</strong></p>
                <DateRangePicker
                    value={[startDate, endDate]}
                    onChange={this.handleDateChange}
                    shortcuts={false}
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
