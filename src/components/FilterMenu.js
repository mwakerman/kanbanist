import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';

export default class FilterMenu extends React.Component {
    handleCheckbox = (checkboxItem, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.props.onChange(checkboxItem, value);
    };

    handleAllCheckbox = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.props.onChangeAll(value);
    };

    render() {
        const { checkboxItems, selectedItems, title, labelProperty } = this.props;
        const displayNum = this.props.title === 'Lists Filter' ? true : false; 
        const allSelected = checkboxItems.filter(el => !selectedItems.contains(el)).isEmpty();

        return (
            <div className="FilterMenu">
                <h6>{title}</h6>
                <hr />
                <div className="FilterMenu-checkboxes">
                    <Checkbox
                        style={{ fontWeight: 'bold' }}
                        key="all-checkbox"
                        checked={allSelected}
                        label="All"
                        onChange={this.handleAllCheckbox}
                    />
                    {checkboxItems.map(item => {
                        let labelString = item[labelProperty];
                        if (displayNum)
                            labelString += "\t(" + item["items"].size + ")";
                        return (
                            <Checkbox
                                key={item.id}
                                checked={selectedItems.contains(item)}
                                label={labelString}
                                onChange={event => this.handleCheckbox(item, event)}
                            >
                            </Checkbox>
                        );
                    })}
                </div>
            </div>
        );
    }
}

FilterMenu.propTypes = {
    checkboxItems: PropTypes.any.isRequired,
    selectedItems: PropTypes.any.isRequired,
    title: PropTypes.string,
    labelProperty: PropTypes.string,
    onChange: PropTypes.func,
    onChangeAll: PropTypes.func,
};

FilterMenu.defaultProps = {
    title: 'Filter Menu',
    labelProperty: 'title',
    onChange: (item, isChecked) => console.log(`item: ${item}, isChecked: ${isChecked}`),
    onChangeAll: isChecked => console.log(`allItems: ${isChecked}`),
};
