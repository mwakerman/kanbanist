import React from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import flow from 'lodash/flow';

import NewListInput from '../components/NewListInput';
import List from '../components/List';
import DraggableList from '../components/DraggableList';
import LoginDialog from '../components/LoginDialog';

import { actions as listActions } from '../redux/modules/lists';

const FETCH_INTERVAL = 60000; // 60s

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

    render() {
        const { loggedIn, lists, showBacklog, backlogList } = this.props;

        const backlog = (
            <List
                className="BacklogList List"
                key={`${backlogList.id}|${backlogList.title}`.hashCode()}
                list={backlogList}
                canEditTitle={false}
                showListMenu={false}
                spacerAtBottom={false}
            />
        );

        return (
            <div className="ListsPanel" style={this.props.style}>
                {!loggedIn ? <LoginDialog /> : <div />}
                {showBacklog ? backlog : <div />}
                {lists.map(list => (
                    <DraggableList
                        className="DraggableList List"
                        key={`${list.id}|${list.title}`.hashCode()}
                        list={list}
                    />
                ))}
                <NewListInput />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = {
    fetch: listActions.fetchLists,
};

// Connect to redux store and add DragDropContext.
export default flow(
    DragDropContext(HTML5Backend),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ListsPanel);
