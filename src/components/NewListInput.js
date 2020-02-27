import React from 'react';
import { Button, Card, Classes, InputGroup, Intent, Popover } from '@blueprintjs/core';
import { actions as listActions } from '../redux/modules/lists';
import { connect } from 'react-redux';

class NewListInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isFocused: false,
        };
    }

    handleAdd = () => {
        const { addList, user } = this.props;
        const { is_premium: isPremium } = user;

        if (this.state.text.length === 0 || !isPremium) {
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
        const { user } = this.props;
        const { isFocused } = this.state;
        const { is_premium: isPremium } = user;

        const addButton = (
            <Button
                className={Classes.MINIMAL}
                icon="add"
                intent={Intent.SUCCESS}
                disabled={this.state.text.length === 0 || !isPremium}
                onClick={this.handleAdd}
            />
        );

        return (
            <div className="NewListInput list-panel-item" id="new-list-input">
                <Popover
                    usePortal={true}
                    isOpen={isFocused && !isPremium}
                    content={
                        <Card>
                            Creating lists requires <a target="_blank" rel="noopener noreferrer" href="https://todoist.com/premium?ref=kanbanist">Todoist Premium</a>.
                        </Card>
                    }
                    target={
                        <InputGroup
                            value={this.state.text}
                            type="text"
                            placeholder="Add a list..."
                            onKeyPress={this.handleIfEnter}
                            onChange={event => this.setState({ text: isPremium ? event.target.value : '' })}
                            rightElement={addButton}
                            className="NewListInput-input"
                            onFocus={() => this.setState({ isFocused: true })}
                            onBlur={() => setTimeout(() => this.setState({ isFocused: false }), 100)}
                        />
                    }
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
