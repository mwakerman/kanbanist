import React, { Component } from 'react';
import { connect } from 'react-redux';
import flow from 'lodash/flow';
import Dimensions from 'react-dimensions';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import moment from 'moment';

import Toolbar from './Toolbar';
import ListsPanel from '../containers/ListsPanel';
import { generateQueryString } from '../redux/middleware/trelloist-filter-url';
import { NAMED_FILTERS } from '../redux/modules/lists';

const MIN_SCREEN_SIZE = 740; // pixels

class Board extends Component {
    componentDidMount() {
        // Ensure the query string in the URL matches the current filters
        const { history } = this.props;
        const { pathname, search } = history.location;
        const queryString = generateQueryString(this.props);

        // if we shouldn't have a query string then remove it
        if (queryString === '' && search !== '') {
            history.push(pathname);
            return;
        }

        if (queryString) {
            const needsUpdate = queryString !== decodeURI(search);
            if (needsUpdate) {
                history.push(pathname + queryString);
            }
        }
    }

    render() {
        const {
            showToolbar,
            showBacklog,
            backlogList,
            filteredLists,
            lists,
            filteredProjects,
            filteredPriorities,
            filterDueDate,
            namedFilter,
            actions,
            containerWidth,
            showIfResponsible,
            user,
            fetchFail,
            fetching,
        } = this.props;

        const atBoard = this.props.location.pathname === '/board';
        const shouldShowToolbar = atBoard && showToolbar;

        const dynamicStyle = {};
        if (shouldShowToolbar) {
            dynamicStyle['marginTop'] = '50px';
        }

        const toolbar = (
            <Toolbar
                toggleBacklog={actions.ui.toggleBacklog}
                lists={lists}
                filteredLists={filteredLists}
                updateListsFilter={actions.lists.updateListsFilter}
                filteredProjects={filteredProjects}
                updateProjectsFilter={actions.lists.updateProjectsFilter}
                onClearFilters={actions.lists.clearFilters}
            />
        );

        // if coming from small screen, show a reminder button.
        const isSmallScreen = containerWidth < MIN_SCREEN_SIZE;
        if (isSmallScreen) {
            return (
                <div className="Board">
                    <div className="Board-inner">
                        <p>It looks like you are visiting from a phone (or a computer with a screen for ants).</p>
                        <p>
                            Kanbanist is built for bigger screens but if you hit the button below, you'll be prompted to
                            create a reminder in Todoist to checkout Kanbanist when you get back to your computer.
                        </p>
                        <div className="margin-25px-auto text-align-center">
                            <a href="todoist://addtask?content=Check%20out%20%5BKanbanist%5D(https://kanban.ist)!&date=today">
                                <Button
                                    text="Remind me about Kanbanist"
                                    intent={Intent.DANGER}
                                    className="pt-icon-time"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        // if fetch failed
        if (fetchFail) {
            return (
                <div className="Board">
                    <div className="Board-inner">
                        <NonIdealState
                            visual={fetching ? 'refresh' : 'error'}
                            title="Unable to fetch Todoist tasks"
                            description={
                                <div>
                                    <p>Kanbanist was unable to fetch your Todoist tasks. Please try the following:</p>
                                    <ul style={{ width: '100%', textAlign: 'left' }}>
                                        <li>Ensure you have internet connectivity.</li>
                                        <li>Disable any ad-blockers for this site.</li>
                                        <li>
                                            Check your{' '}
                                            <a
                                                href="https://todoist.com/Users/viewPrefs?page=integrations"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link">
                                                API token
                                            </a>{' '}
                                            by logging out and back in.
                                        </li>
                                        <li>
                                            If Kanbanist still cannot fetch your tasks,{' '}
                                            <a href="mailto:m.wakerman+kanbanistbug@gmail.com?subject=I%20found%20a%20bug%20with%20Kanbanist">
                                                file a bug
                                            </a>
                                            .
                                        </li>
                                    </ul>
                                    <p />
                                </div>
                            }
                        />
                    </div>
                </div>
            );
        }

        // Filtering Lists & Items
        const filteredProjectIds = filteredProjects.map(project => project.id);
        const filterStartMoment = filterDueDate.get('startDate', null);
        const filterEndMoment = filterDueDate.get('endDate', null);
        const dueDateFilterIsSet = filterStartMoment !== null && filterEndMoment !== null;

        const filterFn = item => {
            // project
            if (filteredProjectIds.contains(item.project.id)) {
                return false;
            }

            // priorities
            if (filteredPriorities.map(p => p.key).contains(item.priority)) {
                return false;
            }

            // assigned
            if (item.project.shared && showIfResponsible) {
                return item.responsible_uid === user.id;
            }

            // due date - filter items without a due date
            if (dueDateFilterIsSet && !item.due_date_utc) {
                return false;
            }

            // named filters
            if (namedFilter) {
                switch (namedFilter) {
                    case NAMED_FILTERS.NEXT_7_DAYS:
                        if (!item.due_date_utc) {
                            return false;
                        }

                        if (moment(item.due_date_utc).isAfter(moment().add(7, 'days'))) {
                            return false;
                        }
                        break;
                    case NAMED_FILTERS.NO_DUE_DATE:
                        if (item.due_date_utc) {
                            return false;
                        }
                        break;
                    default:
                    // no-op
                }
            }

            // due date - filter items not in due date range
            // note 1: Todoist stores a due date of "Today" as "11:59:59 Yesterday" so we add 10 minutes to the end of
            //         of the due date range.
            // note 2: As is common, we always show overdue items even if they are not in the range, hence we don't use
            //         the start of the interval at all.
            if (dueDateFilterIsSet && item.due_date_utc) {
                return moment(item.due_date_utc).isBefore(filterEndMoment.clone().add(10, 'minutes'));
            }

            return true;
        };

        const fullyFilteredLists = lists
            .filter(list => !filteredLists.map(l => l.id).contains(list.id))
            .map(list => list.setItems(list.items.filter(filterFn)));

        const filteredBacklog = backlogList.setItems(backlogList.items.filter(filterFn));

        return (
            <div className="Board">
                {shouldShowToolbar ? toolbar : <div />}
                <ListsPanel
                    style={dynamicStyle}
                    lists={fullyFilteredLists}
                    showBacklog={showBacklog}
                    backlogList={filteredBacklog}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        showToolbar: state.ui.showToolbar,
        showBacklog: state.ui.showBacklog,
        backlogList: state.lists.backlog,
        lists: state.lists.lists,
        filteredLists: state.lists.filteredLists,
        projects: state.lists.projects,
        defaultProjectId: state.lists.defaultProjectId,
        filteredProjects: state.lists.filteredProjects,
        filteredPriorities: state.lists.filteredPriorities,
        filterDueDate: state.lists.filterDueDate,
        namedFilter: state.lists.namedFilter,
        showIfResponsible: state.lists.showIfResponsible,
        user: state.user.user,
        fetchFail: state.lists.fetchFail,
        fetching: state.lists.fetching,
    };
};

export default flow(
    Dimensions({ className: 'Board-Wrapper' }),
    connect(mapStateToProps)
)(Board);
