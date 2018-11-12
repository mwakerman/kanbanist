import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import { Intent } from '@blueprintjs/core';

import ListTitle from './ListTitle';
import ListItem from './ListItem';
import NewListItemInput from './NewListItemInput';
import { BoardToaster } from './Toaster';

import { DragAndDropTypes } from './Constants';
import { defaultPriority } from '../core/Priority';
import { connect } from 'react-redux';
import { actions as listActions, SORT_BY, SORT_BY_DIRECTION } from '../redux/modules/lists';

const moment = require('moment');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allChecked: false,
        };
    }

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
    };

    handleNewItemIsHidden = reason => {
        BoardToaster.show({ message: reason, intent: Intent.WARNING, timeout: 5000 });
        console.log('HELO!');
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
            connectListItemDropTarget,
            connectListDropTarget,
            isDragging,
            listItemIsOver,
            monitorItem,
            listIsOver,
            className,
            sortBy,
            collaborators,
        } = this.props;

        // Dynamic styles
        const dynamicStyle = {};
        if (isDragging) {
            dynamicStyle['display'] = 'none';
        }
        if (listIsOver) {
            dynamicStyle['marginRight'] = '275px';
        }

        // add spacer element to correct place in list when hovering a task over a list
        let listItemToRender = list.items;
        if (listItemIsOver) {
            const item = monitorItem.item;
            const sortByField = sortBy.get('field');
            const sortByDirection = sortBy.get('direction');
            const isAscending = sortByDirection === SORT_BY_DIRECTION.ASC;
            let spacerIndex = 0;
            switch (sortByField) {
                case SORT_BY.DATE_ADDED:
                    let target = moment(item.date_added);
                    let compareFn = isAscending ? target.isBefore : target.isAfter;
                    spacerIndex = listItemToRender.findIndex(i => compareFn.call(target, moment(i.date_added)));
                    break;
                case SORT_BY.DUE_DATE:
                    target = moment(item.due_date_utc);
                    compareFn = isAscending ? target.isBefore : target.isAfter;
                    spacerIndex = listItemToRender.findIndex(i => compareFn.call(target, moment(i.due_date_utc)));
                    break;
                case SORT_BY.PRIORITY:
                    target = item.priority;
                    spacerIndex = listItemToRender.findIndex(i =>
                        isAscending ? i.priority < target : i.priority > target
                    );
                    break;
                case SORT_BY.PROJECT_ORDER:
                    spacerIndex = listItemToRender.findIndex(i => {
                        if (i.project.item_order > item.project.item_order) {
                            return isAscending;
                        } else if (i.project.item_order < item.project.item_order) {
                            return !isAscending;
                        } else {
                            return isAscending ? i.item_order > item.item_order : i.item_order <= item.item_order;
                        }
                    });
                    break;
                default:
                    console.warn('unknown sortBy.field:', sortByField);
            }
            spacerIndex = spacerIndex > -1 ? spacerIndex : listItemToRender.size + 1;
            listItemToRender = listItemToRender.insert(spacerIndex, { isSpacer: true, id: window.generateUUID() });
        }

        return connectListDropTarget(
            connectListItemDropTarget(
                <div style={dynamicStyle} className={className + ' List list-panel-item'}>
                    <ListTitle
                        title={list.title}
                        onRename={this.handleRename}
                        onDelete={this.handleDelete}
                        onCompleteAll={this.handleCompleteAll}
                        disabled={!canEditTitle}
                        showListMenu={showListMenu}
                    />
                    <div className="List-list-items">
                        {listItemToRender.map(item => {
                            if (item.isSpacer) {
                                return <div key={item.id} className="list-item-spacer" />;
                            } else {
                                return (
                                    <ListItem
                                        key={`${item.id}|${item.text.hashCode()}|${item.due_date_utc}|${
                                            this.state.allChecked
                                        }`}
                                        item={item}
                                        instanceList={list}
                                        onUpdate={this.props.onListItemUpdate}
                                        onComplete={this.props.onListItemComplete}
                                        checked={this.state.allChecked}
                                        collaborator={collaborators.find(c => c.id === item.responsible_uid)}
                                    />
                                );
                            }
                        })}
                    </div>
                    <NewListItemInput onAdd={this.addItem} />
                </div>
            )
        );
    }
}

List.propTypes = {
    list: PropTypes.any.isRequired,
    canEditTitle: PropTypes.bool,
    showListMenu: PropTypes.bool,
    spacerAtBottom: PropTypes.bool,
    className: PropTypes.string,
};

List.defaultProps = {
    canEditTitle: true,
    showListMenu: true,
    spacerAtBottom: true,
    className: '',
};

// Drag-and-Drop functions.
const listItemTarget = {
    drop(props, monitor) {
        const { item, instanceList } = monitor.getItem();
        props.onListItemDrop(props.list, item, instanceList);
    },
};

const listTarget = {
    drop(props, monitor) {
        props.onListDrop(monitor.getItem().list, props.list);
    },
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
    moveToList,
    reorderList,
    updateListItem,
    completeListItem,
} = listActions;

const mapDispatchToProps = {
    onAdd: addListItem,
    onListRename: renameList,
    onListDelete: deleteList,
    onListCompleteAll: completeList,
    onListItemDrop: moveToList,
    onListDrop: reorderList,
    onListItemUpdate: updateListItem,
    onListItemComplete: completeListItem,
};

export default flow(
    DropTarget(DragAndDropTypes.LIST_ITEM, listItemTarget, (connect, monitor) => ({
        connectListItemDropTarget: connect.dropTarget(),
        listItemIsOver: monitor.isOver(),
        monitorItem: monitor.getItem(),
    })),
    DropTarget(DragAndDropTypes.LIST, listTarget, (connect, monitor) => ({
        connectListDropTarget: connect.dropTarget(),
        listIsOver: monitor.isOver(),
    })),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(List);
