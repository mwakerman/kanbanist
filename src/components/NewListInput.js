import React from 'react';
import { Button, Classes, InputGroup, Intent } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { actions as listActions } from '../redux/modules/lists';

class NewListInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isFocused: false,
        };
    }

    handleAdd = () => {
        const { addList } = this.props;

        const error = this.state.text.length === 0;
        if (error) {
            return;
        }

        const name = this.state.text.trim();
        const temp_id = window.generateUUID();

        // note: calling addList within the setState callback prevents the scrollIntoView from functioning as desired.
        addList({ name, temp_id });

        // add item and clear state
        this.setState(
            {
                text: '',
            },
            () => {
                // scroll right to keep the new list input in view.
                document.getElementById('new-list-input').scrollIntoView();
                // stay at the top
                window.scroll(0, 0);
            }
        );
    };

    // allow creation of list using 'enter' key.
    // note: input should stay focused.
    handleIfEnter = e => {
        if (e.key === 'Enter') {
            this.handleAdd();
        }
    };

    render() {

        const addButton = (
            <Button
                className={Classes.MINIMAL}
                icon="add"
                intent={Intent.SUCCESS}
                disabled={this.state.text.length === 0}
                onClick={this.handleAdd}
            />
        );

        return (
            <div className="NewListInput list-panel-item" id="new-list-input">
                <InputGroup
                    value={this.state.text}
                    type="text"
                    placeholder="Add a list..."
                    onKeyPress={this.handleIfEnter}
                    onChange={event => this.setState({ text: event.target.value })}
                    rightElement={addButton}
                    className="NewListInput-input"
                    onFocus={() => this.setState({ isFocused: true })}
                    onBlur={() => setTimeout(() => this.setState({ isFocused: false }), 100)}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {
    addList: listActions.addList,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewListInput);
