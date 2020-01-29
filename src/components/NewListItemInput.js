import React from 'react';
import { EditableText } from '@blueprintjs/core';

export default class NewListItemInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newCommentText: '',
            isEditing: false,
        };
    }

    /**
     * Invoked when user cancels input with the esc key, blurs focus or
     * (unfortuntely TODO!) when a user presses cmd+enter (the standard)
     * approach to confirming a multiline EditableText.
     */
    handleBlur = () => {
        this.setState({
            newCommentText: '',
            isEditing: false,
        });
    };

    /**
     * Invoked when user changes input in any way.
     */
    handleChange = text => {
        const { onAdd } = this.props;
        // Make EditableText handle 'enter' press as submission (normally it would just
        // add a newline to the comment).
        const isNewLine = text.indexOf('\n') >= 0;
        if (isNewLine) {
            const itemText = this.state.newCommentText;
            this.setState({ newCommentText: '', isEditing: false }, () => onAdd(itemText));
        } else {
            this.setState({ newCommentText: text });
        }
    };

    render() {
        return (
            <div className="NewListItemInput">
                <div onClick={() => this.setState({ isEditing: true })}>
                    <EditableText
                        isEditing={this.state.isEditing}
                        multiline
                        value={this.state.newCommentText}
                        minLines={1}
                        placeholder="Add item (press enter to save)..."
                        onChange={this.handleChange}
                        onConfirm={this.handleBlur}
                        onCancel={() => this.setState({ isEditing: false })}
                    />
                </div>
            </div>
        );
    }
}
