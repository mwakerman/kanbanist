import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash/flow';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import NewListInput from '../components/NewListInput';
import List  from '../components/List';
import DraggableList from "../components/DraggableList";
import LoginDialog from '../components/LoginDialog';

import { actions as listActions, isListBacklog } from '../redux/modules/lists';

const FETCH_INTERVAL = 60000; // 60s

const DRAGGABLE_TYPES = {
    ITEM: 'item',
    LIST: 'list',
};

class ListsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.intervalId = null;
    }

    componentDidMount() {
        const { loggedIn, fetch } = this.props;
        if (loggedIn) {
            fetch();
            this.intervalId = setInterval(fetch, FETCH_INTERVAL);
        }
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    onDragEnd = result => {
        const { moveItem, updateListIndex } = this.props;
        const { source, destination, draggableId: rawDraggableId } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const [ type, draggableId ] = rawDraggableId.split('-');

        if (type === DRAGGABLE_TYPES.ITEM) {
            const itemId = draggableId;
            const fromListId = source.droppableId;
            const toListId = destination.droppableId;
            const index = destination.index;
            return moveItem(itemId, fromListId, toListId, index);
        }

        if (type === DRAGGABLE_TYPES.LIST) {
            const listId = draggableId;
            const index = destination.index;
            return updateListIndex(listId, index);
        }
    };

    render() {
        const { loggedIn, lists, showBacklog, backlogList } = this.props;

        const listToRender = (showBacklog ? [backlogList] : []).concat(lists.toArray());

        return (
            <div className="ListsPanel" style={this.props.style}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    { !loggedIn ? <LoginDialog /> : null }
                    <Droppable droppableId="lists" type="COLUMN" direction="horizontal">
                        {(provided, snapshot) => (
                            <div className="ListPanel-inner" ref={provided.innerRef}>
                                {listToRender.map((list, idx) => {
                                    if (isListBacklog(list)){
                                        return (
                                            <List
                                                key={list.id}
                                                list={list}
                                                className="BacklogList List"
                                                canEditTitle={false}
                                                showListMenu={false}
                                            />
                                        );
                                    } else {
                                        return (
                                            <DraggableList
                                                className={'DraggableList'}
                                                key={list.id}
                                                list={list}
                                                index={idx + (showBacklog ? -1 : 0)}
                                            />
                                        );
                                    }
                                })}
                                { provided.placeholder }
                                <NewListInput />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = {
    fetch: listActions.fetchLists,
    moveItem: listActions.moveItem,
    updateListIndex: listActions.updateListIndex,
};

// Connect to redux store and add DragDropContext.
export default flow(
    connect(mapStateToProps, mapDispatchToProps),
)(ListsPanel);
