import React from 'react';
import {EditableText} from '@blueprintjs/core';

export default class NewListItemInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newCommentText: "",
        }
    }

    /**
     * Invoked when user cancels input with the esc key, blurs focus or
     * (unfortuntely TODO!) when a user presses cmd+enter (the standard)
     * approach to confirming a multiline EditableText.
     */
    handleBlur = () => {
        this.setState({
            newCommentText: "",
        });
    }

    /**
     * Invoked when user changes input in any way.
     */
    handleChange = (text) => {
        // Make EditableText handle 'enter' press as submission (normally it would just
        // add a newline to the comment).
        const isNewLine = text.indexOf("\n") >= 0;
        if (isNewLine){
            const itemText = this.state.newCommentText;
            this.setState(
                { newCommentText: ""},
                () => this.props.onAdd(itemText)
            )
        } else {
            this.setState({
                newCommentText: text,
            })
        }
    };

    render() {
        return (
            <div className="NewListItemInput">
                <EditableText
                    multiline
                    value={this.state.newCommentText}
                    minLines={1}
                    placeholder="Add item (press enter to save)..."
                    onChange={this.handleChange}
                    onConfirm={this.handleBlur}
                />
            </div>
        );
    }
}