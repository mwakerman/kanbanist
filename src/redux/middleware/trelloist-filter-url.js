import { push } from 'react-router-redux';
import { types } from '../modules/lists';
import { List } from 'immutable';
import { priorities } from '../../core/Priority';

export function generateQueryString({
    lists,
    projects,
    filteredLists,
    filteredProjects,
    filteredLabels,
    filteredPriorities,
    filterDueDate,
    showIfResponsible,
    startDate,
    endDate,
    namedFilter,
}) {
    const queryParams = {};

    if (!filteredLists.isEmpty()) {
        const visibleLists = lists
            .filter(list => !filteredLists.map(el => el.id).contains(list.id))
            .map(list => list.title);

        queryParams['lists'] = JSON.stringify(visibleLists.toArray());
    }

    if (!filteredProjects.isEmpty()) {
        const visibleProjects = projects
            .filter(project => !filteredProjects.map(el => el.id).contains(project.id))
            .map(project => project.name);

        queryParams['projects'] = JSON.stringify(visibleProjects.toArray());
    }

    if (!filteredLabels.isEmpty()) {
        const visibleLabels = filteredLists
            .filter(list => !filteredLabels.map(el => el.id).contains(list.id))
            .map(list => list.title);

        queryParams['labels'] = JSON.stringify(visibleLabels.toArray());
    }
    if (!filteredPriorities.isEmpty()) {
        const visiblePriorities = priorities
            .filter(p => !filteredPriorities.map(el => el.id).contains(p.id))
            .map(p => p.id);
        queryParams['priorities'] = JSON.stringify(visiblePriorities.toArray());
    }

    if (showIfResponsible) {
        queryParams['assigned'] = JSON.stringify(showIfResponsible);
    }

    // If startDate/endDate are `undefined` then they were not the filter being updated but if they are `null` then
    // they were being cleared and we want to remove them from the query string.
    const filterStartDate = filterDueDate.get('startDate', null);
    const filterEndDate = filterDueDate.get('endDate', null);
    if (startDate) {
        queryParams['start'] = startDate.valueOf();
    } else if (startDate === undefined && filterStartDate) {
        queryParams['start'] = filterStartDate.valueOf();
    }

    if (endDate) {
        queryParams['end'] = endDate.valueOf();
    } else if (endDate === undefined && filterEndDate) {
        queryParams['end'] = filterEndDate.valueOf();
    }

    if (namedFilter) {
        queryParams['filter'] = namedFilter;
    }

    const keys = List(Object.keys(queryParams));
    return keys.isEmpty() ? '' : '?' + keys.map(key => key + '=' + queryParams[key]).join('&');
}

const trelloistFilterUrl = store => next => action => {
    const { router, lists } = store.getState();
    const { dispatch } = store;
    let willShowIfResponsible = lists.showIfResponsible;
    switch (action.type) {
        // Ensures the URL query string is in sync with state every time a filter is updated
        case types.TOGGLE_ASSIGNEE_FILTER:
            willShowIfResponsible = !willShowIfResponsible;
        // eslint-disable-next-line
        // fallthrough
        case types.UPDATE_LISTS_FILTER:
        case types.UPDATE_PROJECTS_FILTER:
        case types.UPDATE_LABELS_FILTER:
        case types.UPDATE_DUE_DATE_FILTER:
        case types.SET_NAMED_FILTER:
        case types.UPDATE_PRIORITY_FILTER:
            // Override the filtered key in lists with the action payload, required as the action hasn't yet happened
            const queryString = generateQueryString({
                ...lists,
                ...action.payload,
                showIfResponsible: willShowIfResponsible,
            });
            if (queryString) {
                dispatch(push(router.location.pathname + queryString));
            } else {
                dispatch(push(router.location.pathname));
            }
            break;

        case types.CLEAR_FILTERS:
            dispatch(push(router.location.pathname));
            break;

        default:
        // Nothing.
    }

    // Fire next action.
    next(action);
};

export default trelloistFilterUrl;
