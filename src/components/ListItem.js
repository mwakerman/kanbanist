import React from 'react';
import { EditableText, Checkbox, Icon, Popover, Position } from '@blueprintjs/core';
import { DatePicker } from "@blueprintjs/datetime";
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { markdown } from 'markdown';
import $ from 'jquery';
import ListItemDueDate from './ListItemDueDate';
import Todoist from '../todoist-client/Todoist';
import { Draggable } from "react-beautiful-dnd";
import classNames from  "classnames";
import moment from 'moment';


const outlookRegex = /\[\[\s*outlook=id3=(.*?),([^\]]*)\]\]/;
const isOutlookText = rawText => {
    return outlookRegex.test(rawText);
};

class ListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
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
        this.setState({ checked: true }, () => setTimeout(() => this.props.onComplete(this.props.item), 800));
    };

    handleOnEdit = () => {
        this.setState({ isEditing: true });
    };

    handleCancel = () => {
        this.setState({
            formattedText: this.format(this.state.previousRawText),
            rawText: this.state.previousRawText,
            isEditing: false,
        });
    };

    updateItem = () => {
        const { item, onUpdate } = this.props;
        const { rawText } = this.state;
        // Only update if the value actually changed. Note that this may
        // need to be changed if we allow for changing other properties of
        // a task (like the project) in the future.
        if (item.text !== rawText) {
            onUpdate(item, { text: rawText });
        }
        this.setState({
            previousRawText: rawText,
            isEditing: false,
            formattedText: this.format(rawText),
        });
    };

    setDueDate = (dueDate) => {
        const { item, onUpdate } = this.props;
        const due = {
            date: dueDate ? moment(dueDate).format('YYYY-MM-DD') : null,
        };
        onUpdate(item, { due });
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
        const { item, collaborator, index, instanceList } = this.props;
        const { checked, rawText, formattedText, isEditing } = this.state;

        const isOutlook = isOutlookText(rawText);
        const isRecurring = item.recurring;
        const opacity = checked ? 0.5 : 1;

        return (
            <Draggable
                key={`${item.id}`}
                draggableId={`item-${item.id}-${instanceList.id}`}
                index={index}
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ opacity, ...provided.draggableProps.style }}
                        id={item.id}
                        className={classNames('ListItem', `color-${item.project.color}`, { 'dragging': snapshot.isDragging })}
                    >
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
                                        isEditing={true}
                                        onChange={this.handleChange}
                                        disabled={checked}
                                        onConfirm={(/* for some reason this fires on blur */) => this.setState({ isEditing: false, rawText: item.text })}
                                        onCancel={() => this.setState({ isEditing: false, rawText: item.text })}
                                    />
                                ) : (
                                    <div className="ListItem-text ListItem-text-formatted" onClick={this.handleOnEdit}>
                                        <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                                    </div>
                                )}
                            </div>
                            <div className="ListItem-inner-bottom">
                                <div className="non-edit-text">
                                    <div className="left-align">
                                        <span className="ListItem-project-name">{item.project.name}</span>
                                        <a href={`https://todoist.com/app/task/${item.id}`} className="task-link-wrapper">
                                            <Icon className="ListItem-task-icon" icon="link" iconSize={10} />
                                        </a>
                                        <Popover
                                            minimal={true}
                                            position={Position.BOTTOM}
                                            content={
                                                <DatePicker
                                                    clearButtonText={"No Date"}
                                                    highlightCurrentDay={true}
                                                    value={item.due_date_utc ? new Date(item.due_date_utc) : undefined}
                                                    onChange={(date, isUserChange) => isUserChange && this.setDueDate(date)}
                                                    showActionsBar={true}
                                                    minDate={moment().subtract(10, 'years').toDate()}
                                                    maxDate={moment().add(10, 'years').toDate()}
                                                />
                                            }
                                            target={
                                                <Icon
                                                    className="task-link-wrapper ListItem-task-icon"
                                                    icon="calendar"
                                                    iconSize={10}
                                                />
                                            }
                                        />
                                    </div>
                                    {isOutlook ? (
                                        <Icon className="ListItem-recurring-icon" icon="envelope" iconSize={12} />
                                    ) : null}
                                    {isRecurring ? (
                                        <Icon className="ListItem-recurring-icon" icon="exchange" iconSize={14} />
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
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default ListItem;