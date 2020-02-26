import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AnchorButton, Button, Intent, Navbar } from '@blueprintjs/core';

import { actions as userActions } from '../redux/modules/user';
import { actions as listsActions } from '../redux/modules/lists';
import { actions as uiActions } from '../redux/modules/ui';
import { Alignment } from "@blueprintjs/core/lib/cjs/common/alignment";

class Header extends React.Component {
    render() {
        const { user, fetching, logout, fetchLists, toggleToolbar } = this.props;

        const { loggedIn, token } = user;

        const logoutButton = (
            <AnchorButton
                text="Logout"
                icon="log-out"
                onClick={() => {
                    logout();
                    this.props.history.push('/');
                }}
                intent={Intent.PRIMARY}
            />
        );

        const backlogButton = (
            <AnchorButton
                text="Backlog"
                icon="comparison"
                onClick={this.props.toggleBacklog}
                intent={Intent.PRIMARY}
            />
        );

        const syncButton = (
            <AnchorButton
                loading={fetching}
                icon="refresh"
                onClick={() => fetchLists(token)}
                intent={Intent.WARNING}
            />
        );

        const loginButton = (
            <Link to="/board">
                <Button text="Login" icon="log-in" intent={Intent.PRIMARY}/>
            </Link>
        );

        const toggleToolbarButton = (
            <AnchorButton text="Filters" icon="filter-list" intent={Intent.PRIMARY} onClick={toggleToolbar}/>
        );

        const atBoard = this.props.history.location.pathname === '/board';
        const showBoardButtons = atBoard && loggedIn;
        const boardButton = <Button minimal={true} icon="control" text="Board" />;

        return (
            <Navbar className="Header">
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading className="font-roboto"><Link to="/">Kanbanist</Link></Navbar.Heading>
                    <Navbar.Divider />
                    {atBoard ? boardButton : <Link to={'/board'}>{boardButton}</Link>}
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT} className="hide-if-small-500">
                    {showBoardButtons ? syncButton : null}
                    {showBoardButtons ? backlogButton : null}
                    {showBoardButtons ? toggleToolbarButton : null}
                    {loggedIn ? logoutButton : loginButton}
                </Navbar.Group>
            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        fetching: state.lists.fetching,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(listsActions.clearAll());
            dispatch(uiActions.restoreInitialState());
            dispatch(userActions.logout());
        },

        fetchLists: token => {
            dispatch(listsActions.fetchLists(token));
        },

        toggleToolbar: () => {
            dispatch(uiActions.toggleToolbar());
        },
        toggleBacklog: () => {
            dispatch(uiActions.toggleBacklog());
        },
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Header)
);
