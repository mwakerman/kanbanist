import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';

import ListTitle from './ListTitle';
import ListItem from './ListItem';
import NewListItemInput from './NewListItemInput';
import { BoardToaster } from './Toaster';

import { defaultPriority } from '../core/Priority';
import { connect } from 'react-redux';
import { actions as listActions } from '../redux/modules/lists';
import { Droppable } from "react-beautiful-dnd";

export const draggable = (Component) => {
    return class extends React.Component {
        render() {
            return (
                <Component />
            );
        }
    }
};

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allChecked: false,
        };

        this.listItemsRef = React.createRef();
    }

    scrollToBottom = () => {
        setTimeout(() => {
            if (this.listItemsRef.current) {
                this.listItemsRef.current.scrollTop = this.listItemsRef.current.scrollHeight
            }
        }, 50)
    };

    addItem = newCommentText => {
        if (newCommentText.length <= 0) {
            return;
        }

        const { list, onAdd } = this.props;

        // replace any urls with markdown links
        const content = newCommentText.replace(
            /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*))/g,
            '[$1]($1)'
        );
        const temp_id = window.generateUUID();

        // Force item to bottom of list.
        // TODO: properly order and properly place empty box
        const item_order = list.items.reduce((max, item) => (max > item.item_order ? max : item.item_order), 0) + 1;

        onAdd(list, { content, temp_id, item_order, priority: defaultPriority.key }, this.handleNewItemIsHidden);
        this.scrollToBottom();
    };

    handleNewItemIsHidden = reason => {
        BoardToaster.show({ message: reason, intent: Intent.WARNING, timeout: 5000 });
    };

    handleRename = newName => {
        const { list, onListRename } = this.props;
        if (list.title !== newName) {
            onListRename(list, newName);
        }
    };

    handleCompleteAll = () => {
        const { list, onListCompleteAll } = this.props;

        const millisToWait = 800; // Keep the same as ListItem#handleCheck.
        const completeAll = () =>
            setTimeout(() => {
                onListCompleteAll(list);
                this.setState({ allChecked: false });
            }, millisToWait);

        this.setState(
            {
                allChecked: true,
            },
            completeAll
        );
    };

    handleDelete = () => {
        this.props.onListDelete(this.props.list);
    };

    render() {
        const {
            list,
            canEditTitle,
            showListMenu,
            className,
            collaborators,
            draggableProps,
            style,
        } = this.props;

        return (
            <div style={style} className={className + ' List list-panel-item'} {...draggableProps}>
                <ListTitle
                    list={list}
                    onRename={this.handleRename}
                    onDelete={this.handleDelete}
                    onCompleteAll={this.handleCompleteAll}
                    disabled={!canEditTitle}
                    showListMenu={showListMenu}
                />
                <Droppable droppableId={`${list.id}`}>
                    {(provided, snapshot) => (
                        <div className="List-list-items-wrapper" ref={provided.innerRef}>
                            <div className={classNames("List-list-items", {"isDraggingOver": snapshot.isDraggingOver})} ref={this.listItemsRef}>
                                {list.items.map((item,idx) => (
                                    <ListItem
                                        index={idx}
                                        key={`${item.id}|${item.text.hashCode()}|${item.due_date_utc}|${this.state.allChecked}`}
                                        item={item}
                                        instanceList={list}
                                        onUpdate={this.props.onListItemUpdate}
                                        onComplete={this.props.onListItemComplete}
                                        checked={this.state.allChecked}
                                        collaborator={collaborators.find(c => c.id === item.responsible_uid)}
                                    />
                                ))}
                                <div style={{ overflowAnchor: 'auto', height: '1px' }}/>
                                { provided.placeholder }
                            </div>
                            <div className="new-list-item-input-wrapper">
                                <NewListItemInput onAdd={this.addItem} />
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        );
    }
}

List.propTypes = {
    list: PropTypes.any.isRequired,
    canEditTitle: PropTypes.bool,
    showListMenu: PropTypes.bool,
    className: PropTypes.string,
};

List.defaultProps = {
    canEditTitle: true,
    showListMenu: true,
    className: '',
};

// Connect to redux state/actions
const mapStateToProps = state => ({
    sortBy: state.lists.sortBy,
    collaborators: state.lists.collaborators,
});

const {
    addListItem,
    renameList,
    deleteList,
    completeList,
    updateListItem,
    completeListItem,
} = listActions;

const mapDispatchToProps = {
    onAdd: addListItem,
    onListRename: renameList,
    onListDelete: deleteList,
    onListCompleteAll: completeList,
    onListItemUpdate: updateListItem,
    onListItemComplete: completeListItem,
};

export default flow(
    connect(mapStateToProps, mapDispatchToProps),
)(List);
