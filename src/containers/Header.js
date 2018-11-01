import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { AnchorButton, Intent, Spinner } from '@blueprintjs/core';

import { actions as userActions } from '../redux/modules/user';
import { actions as listsActions } from '../redux/modules/lists';
import { actions as uiActions } from '../redux/modules/ui';

class Header extends React.Component {
    render() {
        const { user, fetching, logout, fetchLists, toggleToolbar } = this.props;

        const { loggedIn, token } = user;

        const logoutButton = (
            <AnchorButton
                className="light-text header-right"
                text="Logout"
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
                iconName="comparison"
                className="light-text header-right"
                onClick={this.props.toggleBacklog}
                intent={Intent.PRIMARY}
            />
        );

        const syncButton = (
            <AnchorButton
                className="light-text header-right"
                iconName="refresh"
                onClick={() => fetchLists(token)}
                intent={Intent.WARNING}
            />
        );

        const spinner = <Spinner className="light-text pt-small header-right" intent={Intent.WARNING} />;

        const loginButton = (
            <Link to="/board" className="light-text pt-button pt-intent-primary">
                Login
            </Link>
        );

        const toggleToolbarButton = (
            <AnchorButton
                text="Filters"
                className="light-text header-right"
                iconName="filter-list"
                intent={Intent.PRIMARY}
                onClick={toggleToolbar}
            />
        );

        const emptyDiv = <div className="header-right" style={{ marginLeft: '0px' }} />;
        const atBoard = this.props.history.location.pathname === '/board';
        const showBoardButtons = atBoard && loggedIn;
        const boardButton = <button className="pt-button pt-minimal pt-icon-control">Board</button>;

        return (
            <nav className="Header pt-navbar pt-fixed-top">
                <div className="pt-navbar-group pt-align-left">
                    <div className="pt-navbar-heading font-roboto">
                        <Link to="/">Kanbanist</Link>
                    </div>
                    <span className="pt-navbar-divider" />
                    {/* Board button does nothing if at /board (prevents potential query string being cleared) */}
                    {atBoard ? boardButton : <Link to={'/board'}>{boardButton}</Link>}
                </div>
                <div className="pt-navbar-group pt-align-right hide-if-small-500">
                    {showBoardButtons ? (fetching ? spinner : syncButton) : emptyDiv}
                    {showBoardButtons ? backlogButton : emptyDiv}
                    {showBoardButtons ? toggleToolbarButton : emptyDiv}
                    {loggedIn ? logoutButton : loginButton}
                </div>
            </nav>
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
