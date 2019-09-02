import React from 'react';
import { EditableText, Button, Checkbox, Icon, Intent } from '@blueprintjs/core';
import '../../node_modules/@blueprintjs/core/dist/blueprint.css';
import { DragSource } from 'react-dnd';
import { DragAndDropTypes } from './Constants';
import { markdown } from 'markdown';
import $ from 'jquery';
import ListItemDueDate from './ListItemDueDate';
import Todoist from '../todoist-client/Todoist';
import ReactTooltip from 'react-tooltip';

const outlookRegex = /\[\[\s*outlook=id3=(.*?),([^\]]*)\]\]/;
const isOutlookText = rawText => {
    return outlookRegex.test(rawText);
};

class ListItem extends React.Component {
    /*
     * The "isActuallyEditing" state solves a bug in BlueprintJS whereby the
     * before pseudo-element is incorrectly sized if a EditableText component
     * is mounted with "isEditing" set to true.
     *
     * Rather, we mount the component with the isEditing prop set to false and
     * immediately set it to true.
     *
     * Hopefully I get around to submitting an issue about this on GitHub.
     *
     */

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            isActuallyEditing: false,
            previousRawText: props.item.text,
            rawText: props.item.text,
            formattedText: this.format(props.item.text),
            checked: props.checked,
        };
    }

    format = text => {
        // Convert outlook-id-3 format to regular markdown
        if (isOutlookText(text)) {
            return this.formatOutlookLink(text);
        }

        // Convert custom Todoist formatting into regular markdown.
        // See: https://support.todoist.com/hc/en-us/articles/205195102-Text-formatting
        const todoistToMd = text
            .replace(/!!(.*?)!!/g, '**$1**')
            // eslint-disable-next-line
            .replace(
                /[^[(]?(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}) \((.*?)\)/g,
                '[$2]($1)'
            );

        return markdown
            .toHTML(todoistToMd)
            .replace(/<\/?p>/g, '')
            .replace(/a href/g, 'a target="_blank" href')
            .replace(/<h(\d)>/g, (_, num) => '#'.repeat(num))
            .replace(/<\/h\d>/g, '');
    };

    formatOutlookLink = text => {
        const content = this.getOutlookContent(text);
        return markdown.toHTML(content).replace(/<\/?p>/g, '');
    };

    getOutlookContent = text => {
        const outlookRegex = /\[\[\s*outlook=id3=(.*?),([^\]]*)\]\]/;
        const matches = text.match(outlookRegex);
        // const base64String = matches[1];
        const content = matches[2];
        return content;
    };

    updateOutlookItem = (rawText, content) => {
        const beggining = rawText.split(',')[0];
        return `${beggining},${content}]]`;
    };

    handleChange = updatedText => {
        const { rawText } = this.state;
        const isOutlook = isOutlookText(rawText);
        const isNewLine = updatedText.indexOf('\n') >= 0;
        if (isNewLine) {
            this.updateItem();
        } else {
            const newRawText = isOutlook ? this.updateOutlookItem(rawText, updatedText) : updatedText;
            this.setState({ rawText: newRawText });
        }
    };

    handleCheck = () => {
        const millisToWait = 800;
        const completeInABit = wait => setTimeout(() => this.props.onComplete(this.props.item), wait);

        this.setState(
            {
                checked: true,
            },
            () => completeInABit(millisToWait)
        );
    };

    handleOnEdit = () => {
        // See comment at the top of this class as to why we do this.
        this.setState(
            {
                isEditing: true,
            },
            () => {
                this.setState({
                    isActuallyEditing: true,
                });
            }
        );
    };

    handleCancel = () => {
        this.setState({
            formattedText: this.format(this.state.previousRawText),
            rawText: this.state.previousRawText,
            isEditing: false,
            isActuallyEditing: false,
        });
    };

    updateItem = () => {
        const { item, onUpdate } = this.props;
        const { rawText } = this.state;
        // Only update if the value actually changed. Note that this may
        // need to be changed if we allow for changing other properties of
        // a task (like the project) in the future.
        if (item.text !== rawText) {
            onUpdate(item, rawText);
        }
        this.setState({
            previousRawText: rawText,
            isEditing: false,
            isActuallyEditing: false,
            formattedText: this.format(rawText),
        });
    };

    /**
     * This method converts all links into links that open in another tab and also
     * prevents the clicking of the link from causing a click event on the container
     * div which enables edit mode.
     */
    applyLinkFixes = () => {
        $(`#${this.props.item.id} a`).attr('target', '_blank');
        $(`#${this.props.item.id}`).on('click', 'a', e => e.stopPropagation());
    };

    // Apply link fix when we first mount the component...
    componentDidMount() {
        this.applyLinkFixes();
    }

    // ... and again whenever we update it.
    componentDidUpdate() {
        this.applyLinkFixes();
    }

    render() {
        const { connectDragSource, isDragging, item, collaborator } = this.props;
        const { checked, rawText, formattedText, isEditing, isActuallyEditing } = this.state;

        const isOutlook = isOutlookText(rawText);

        // Inline style
        const dynamicStyle = {};
        if (isDragging) {
            dynamicStyle['display'] = 'none';
        }
        if (this.state.checked) {
            dynamicStyle['opacity'] = '0.5';
        }

        const isRecurring = item.date_string ? item.date_string.search(/every/i) >= 0 : false;
        const classes = `ListItem pt-card pt-interactive pt-elevation-2 color-${item.project.color}`;

        return connectDragSource(
            <div style={dynamicStyle} id={item.id} className={classes}>
                <div className="ListItem-inner">
                    <div className="ListItem-inner-top">
                        <Checkbox
                            className={`ListItem-checkbox priority-${item.priority}`}
                            onChange={this.handleCheck}
                            checked={checked}
                            disabled={isEditing}
                        />
                        {isEditing ? (
                            <EditableText
                                className="ListItem-text"
                                multiline
                                value={!isOutlook ? rawText : this.getOutlookContent(rawText)}
                                isEditing={isActuallyEditing}
                                onChange={this.handleChange}
                                disabled={checked}
                            />
                        ) : (
                            <div className="ListItem-text ListItem-text-formatted" onClick={this.handleOnEdit}>
                                {isOutlook ? <Icon iconName="envelope" style={{ marginRight: '5px' }} /> : null}
                                <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                            </div>
                        )}
                        <a
                            className="task-link sr-only sr-only-focusable"
                            href={`https://todoist.com/showTask?id=${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open in Todoist">
                            <Icon iconName="link" iconSize={5} />
                        </a>
                    </div>
                    <div className="ListItem-inner-bottom">
                        {isEditing ? (
                            <div className="ListItem-edit-buttons">
                                <Button
                                    className="ListItem-edit-button"
                                    text="Save"
                                    intent={Intent.SUCCESS}
                                    onClick={this.updateItem}
                                />
                                <Button className="ListItem-edit-button" text="Cancel" onClick={this.handleCancel} />
                            </div>
                        ) : (
                            <div className="non-edit-text">
                                <span className="ListItem-project-name">{item.project.name}</span>
                                {isRecurring ? (
                                    <Icon className="ListItem-recurring-icon" iconName="exchange" iconSize={16} />
                                ) : null}
                                <ListItemDueDate dueDate={item.due_date_utc} />
                                {collaborator ? (
                                    collaborator.image_id ? (
                                        <img
                                            className="ListItem-project-avatar"
                                            alt={`Assigned to ${collaborator.full_name}`}
                                            width="18"
                                            height="18"
                                            src={Todoist.getAvatarUrl(collaborator.image_id, 'small')}
                                            data-tip={collaborator.full_name}
                                        />
                                    ) : (
                                        <span data-tip={collaborator.full_name}>
                                            {collaborator.full_name
                                                .split(' ')
                                                .map(a => a[0])
                                                .join('')}
                                        </span>
                                    )
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
                <ReactTooltip place="bottom" effect="solid" />
            </div>
        );
    }
}

const listItemSource = {
    beginDrag(props) {
        const { item, instanceList } = props;
        return { item, instanceList };
    },
};

export default DragSource(DragAndDropTypes.LIST_ITEM, listItemSource, (connect, monitor) => ({
    isDragging: monitor.isDragging(),
    connectDragSource: connect.dragSource(),
}))(ListItem);
