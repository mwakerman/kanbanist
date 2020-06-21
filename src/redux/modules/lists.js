import { Map, Set, List as ImmutableList } from 'immutable';
import Raven from 'raven-js';
import Todoist from '../../todoist-client/Todoist';

import List from '../../core/List';
import Item from '../../core/Item';
import Project from '../../core/Project';
import { defaultPriority } from '../../core/Priority';

const moment = require('moment');

export const isBacklogListId = listId => listId === "0";

export const isListBacklog = list => isBacklogListId(list.id);

export const isInboxProject = project => {
    return project.name === 'Inbox';
};

export const SORT_BY = {
    USER_SET: 'Board',
    DATE_ADDED: 'Date Added',
    DUE_DATE: 'Due Date',
    PRIORITY: 'Priority',
    PROJECT_ORDER: 'Project Order',
};

export const SORT_BY_DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC',
};

export const HIDDEN_REASON = {
    PROJECT_FILTERED: 'Warning: you are creating items for a filtered project.',
    DUE_DATE_FILTERED: 'Warning: you are creating items while a Due Date filter is active.',
    PRIORITY_FILTERED: 'Warning: you are creating items with a filtered priority.',
};

export const NAMED_FILTERS = {
    NEXT_7_DAYS: 'NEXT_7_DAYS',
    TODAY: 'TODAY',
    NO_DUE_DATE: 'NO_DUE_DATE',
};

const initialState = {
    lists: ImmutableList.of(),
    filteredLists: ImmutableList.of(),
    backlog: new List({ id: 0, title: 'Backlog' }),
    projects: ImmutableList.of(),
    defaultProjectId: undefined,
    filteredProjects: ImmutableList.of(),
    filterDueDate: Map({ startDate: null, endDate: null }),
    filteredPriorities: ImmutableList.of(),
    showIfResponsible: false,
    showSubtasks: true,
    namedFilter: null,
    fetching: false,
    fetchFail: null,
    sortBy: Map({ field: SORT_BY.USER_SET, direction: SORT_BY_DIRECTION.ASC }),
    collaborators: [],
};

export const types = {
    ADD_NEW_LIST: 'ADD_NEW_LIST',
    RENAME_LIST: 'RENAME_LIST',
    COMPLETE_LIST: 'COMPLETE_LIST',
    DELETE_LIST: 'DELETE_LIST',
    ADD_LIST_ITEM: 'ADD_LIST_ITEM',
    UPDATE_LIST_ITEM: 'UPDATE_LIST_ITEM',
    COMPLETE_LIST_ITEM: 'COMPLETE_LIST_ITEM',
    UPDATE_ID: 'UPDATE_ID',
    FETCH_LISTS: 'FETCH_LISTS',
    FETCH_REQUEST_SENT: 'FETCH_REQUEST_SENT',
    FETCH_SUCCESSFUL: 'FETCH_SUCCESSFUL',
    FETCH_FAILURE: 'FETCH_FAILURE',
    CLEAR_ALL: 'CLEAR_ALL',
    UPDATE_LISTS_FILTER: 'UPDATE_LISTS_FILTER',
    UPDATE_PROJECTS_FILTER: 'UPDATE_PROJECTS_FILTER',
    UPDATE_DUE_DATE_FILTER: 'UPDATE_DUE_DATE_FILTER',
    UPDATE_PRIORITY_FILTER: 'UPDATE_PRIORITY_FILTER',
    TOGGLE_ASSIGNEE_FILTER: 'TOGGLE_ASSIGNEE_FILTER',
    TOGGLE_SUBTASK_FILTER: 'TOGGLE_SUBTASK_FILTER',
    SET_NAMED_FILTER: 'SET_NAMED_FILTER',
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    SET_DEFAULT_PROJECT: 'SET_DEFAULT_PROJECT',
    SET_SORT_BY: 'SET_SORT_BY',

    // TODO: changing item dragging API with new action
    MOVE_ITEM: 'MOVE_ITEM',
    UPDATE_LIST_INDEX: 'UPDATE_LIST_INDEX',
};

export const actions = {
    addList: newList => ({ type: types.ADD_NEW_LIST, payload: newList }),
    renameList: (list, newListName) => ({ type: types.RENAME_LIST, payload: { list, newListName } }),
    completeList: list => ({ type: types.COMPLETE_LIST, payload: { list } }),
    deleteList: list => ({ type: types.DELETE_LIST, payload: { list } }),
    addListItem: (list, item, onHidden) => ({ type: types.ADD_LIST_ITEM, payload: { list, item, onHidden } }),
    updateListItem: (item, fields) => ({ type: types.UPDATE_LIST_ITEM, payload: { item, fields } }),
    updateId: (type, old_id, new_id) => ({ type: types.UPDATE_ID, payload: { type, old_id, new_id }}),
    completeListItem: item => ({ type: types.COMPLETE_LIST_ITEM, payload: { item } }),
    fetchLists: () => (dispatch, getState) => {
        const state = getState();
        dispatch(actions.fetchRequest());
        Todoist.fetch(state.user.user.token)
            .then(response => {
                const { labels, sharedLabels, items, projects, collaborators } = response;
                dispatch(actions.fetchSuccess(labels, sharedLabels, items, projects, collaborators));
            })
            .catch(err => {
                Raven.captureException(err);
                console.error('Could not fetch Todoist tasks: ', err);
                dispatch(actions.fetchFailure(err.message || 'Could not fetch Todoist tasks'));
            });
    },
    fetchRequest: () => ({ type: types.FETCH_REQUEST_SENT }),
    fetchSuccess: (labelList, sharedLabels, items, projects, collaborators) => ({
        type: types.FETCH_SUCCESSFUL,
        payload: { labelList, sharedLabels, items, projects, collaborators },
    }),
    fetchFailure: error => ({ type: types.FETCH_FAILURE, payload: { error } }),
    clearAll: () => ({ type: types.CLEAR_ALL }),
    updateListsFilter: filteredLists => ({ type: types.UPDATE_LISTS_FILTER, payload: { filteredLists } }),
    updateProjectsFilter: filteredProjects => ({ type: types.UPDATE_PROJECTS_FILTER, payload: { filteredProjects } }),
    updateDueDateFilter: (startDate, endDate) => ({
        type: types.UPDATE_DUE_DATE_FILTER,
        payload: { startDate, endDate },
    }),
    updatePriorityFilter: filteredPriorities => ({
        type: types.UPDATE_PRIORITY_FILTER,
        payload: { filteredPriorities },
    }),
    toggleAssigneeFilter: () => ({ type: types.TOGGLE_ASSIGNEE_FILTER }),
    toggleSubtaskFilter: () => ({ type: types.TOGGLE_SUBTASK_FILTER }),
    setNamedFilter: namedFilter => ({ type: types.SET_NAMED_FILTER, payload: { namedFilter } }),
    clearFilters: () => ({ type: types.CLEAR_FILTERS }),
    setDefaultProject: projectId => ({ type: types.SET_DEFAULT_PROJECT, payload: { projectId } }),
    setSortBy: (field, direction) => ({ type: types.SET_SORT_BY, payload: { field, direction } }),
    moveItem: (itemId, fromListId, toListId, itemIndex) => ({
        type: types.MOVE_ITEM,
        payload: { itemId, fromListId, toListId, itemIndex }
    }),
    updateListIndex: (listId, newIndex) => ({
        type: types.UPDATE_LIST_INDEX,
        payload: { listId, newIndex }
    }),
};

function addList(state, action) {
    const { name, temp_id } = action.payload;

    // prevent multiple lists from having the same name
    let title = name;
    let titleAlreadyUsed = state.lists.map(list => list.title).contains(title);
    while (titleAlreadyUsed) {
        title = title + ' 2';
        titleAlreadyUsed = state.lists.map(list => list.title).contains(title);
    }

    const newList = new List({ title, id: temp_id, items: ImmutableList.of() });
    return { ...state, lists: state.lists.push(newList) };
}

function renameList(state, action) {
    const { list, newListName } = action.payload;

    // TODO: de-duplicate from above
    // prevent multiple lists from having the same name
    let title = newListName;
    let titleAlreadyUsed = state.lists.map(list => list.title).contains(title);
    while (titleAlreadyUsed) {
        title = title + ' 2';
        titleAlreadyUsed = state.lists.map(list => list.title).contains(title);
    }

    // note: even though we are changing the title of a list we are NOT changing the "value" as that does not change
    //       on each item outside of a move or re-fetch (in which case all items will also be updated)
    const updatedLists = state.lists.map(itemList => {
        if (itemList.id === list.id) {
            const { id, items, isShared } = itemList;
            if (isShared) {
                // for shared labels, id = value so we have to update the id too to avoid treating the next fetch like
                // a new list (and losing our ordering)
                return new List({ id: title.replaceAll(' ', '_'), items, title, isShared })
            } else {
                return new List({ id, items, title });
            }
        } else {
            return itemList;
        }
    });
    return { ...state, lists: updatedLists };
}

function deleteList(state, action) {
    const { id } = action.payload.list;
    const removedList = state.lists.find(itemList => itemList.id === id);
    const lists = state.lists.filter(el => el.id !== id);
    const backlog = state.backlog.setItems(state.backlog.items.concat(removedList.items));
    return { ...state, lists, backlog };
}

function completeList(state, action) {
    const { id } = action.payload.list;
    const updatedLists = state.lists.map(itemList => {
        if (itemList.id === id) {
            return itemList.setItems(ImmutableList.of());
        } else {
            return itemList;
        }
    });
    return { ...state, lists: updatedLists };
}

function addListItem(state, action) {
    const { list, item, onHidden } = action.payload;
    const { content, temp_id, item_order } = item;
    const { lists, projects, backlog, defaultProjectId } = state;

    // if the newly created item will be hidden, we notify the action caller
    const inboxProject = projects.find(isInboxProject);
    const projectId = defaultProjectId ? defaultProjectId : inboxProject.id;
    if (state.filteredProjects.find(project => project.id === projectId)) {
        onHidden(HIDDEN_REASON.PROJECT_FILTERED);
    } else if (state.filterDueDate.get('startDate', false)) {
        // this will if there is any due date filter at all - even if quick-add is about to add a due date that means
        // the item IS visible
        onHidden(HIDDEN_REASON.DUE_DATE_FILTERED);
    } else if (state.filteredPriorities.map(p => p.id).contains(defaultPriority.id)) {
        // same as above, this will fire even if quick-add syntax will mean a priority will be set that means the item
        // IS visible
        onHidden(HIDDEN_REASON.PRIORITY_FILTERED);
    }

    const project = projects.find(p => p.id === defaultProjectId, null, projects.find(isInboxProject));
    const date_added = new Date();
    const newListItem = new Item({ text: content, id: temp_id, item_order, project, date_added });

    if (isListBacklog(list)) {
        return { ...state, backlog: backlog.append(newListItem) };
    }

    const updatedLists = lists.map(itemList => (itemList.id === list.id ? itemList.append(newListItem) : itemList));
    return { ...state, lists: updatedLists };
}

function updateListItem(state, action) {
    const { item, fields } = action.payload;
    const updatedLists = state.lists.map(itemList => itemList.updateItem(item, item.updateWith(fields)));
    const updatedBacklog = state.backlog.updateItem(item, item.updateWith(fields));
    return { ...state, lists: updatedLists, backlog: updatedBacklog };
}

function completeListItem(state, action) {
    const { item } = action.payload;
    const { backlog, lists } = state;

    // If completing an item from the backlog
    const completedFromBacklog = backlog.items.contains(item);
    if (completedFromBacklog) {
        return { ...state, backlog: backlog.removeItem(item) };
    }

    const updatedLists = lists.map(itemList => {
        return itemList.removeItem(item);
    });
    return { ...state, lists: updatedLists };
}

/**
 * Todoist returns the mapping from the `temp_id` (that we provide) to the true id of the label or list item.
 * If we waited for the server to return before continuing then there is a notable delay when adding list items
 * and lists. So instead we just use the temp id then updateItem the id when todoist returns in a seperate action.
 *
 * See: todoistPersistenceMiddleware > case types.ADD_LIST_ITEM for an example.
 *
 */
function updateId(state, action) {
    const { type, old_id, new_id } = action.payload;
    switch (type) {
        case Item:
            return updateItemId(state, old_id, new_id);
        case List:
            return updateListId(state, old_id, `${new_id}`);
        default:
            console.error('Updating id for unknown type: ', type);
            return state;
    }
}

function updateItemId(state, old_id, new_id) {
    // Find the item to replace and its containing list
    const { list, item } = state.lists.reduce(
        (listAndItem, itemList) => {
            const item = itemList.items.find(el => el.id === old_id, null);
            if (item) {
                return {
                    list: itemList,
                    item: item,
                };
            } else {
                return listAndItem;
            }
        },
        { list: null, item: null }
    );

    if (list === null || item === null) {
        console.error('Could not find list or item for id update: ', { old_id, new_id });
        return state;
    }

    // Update the list and item
    const updatedLists = state.lists.map(itemList => {
        if (itemList.id !== list.id) {
            return itemList;
        } else {
            return itemList.updateItem(item, item.updateWith({ id: new_id }));
        }
    });
    return { ...state, lists: updatedLists };
}

function updateListId(state, old_id, new_id) {
    const newLists = state.lists.map(itemList => {
        if (itemList.id !== old_id) {
            return itemList;
        } else {
            return itemList.updateWith({ id: new_id });
        }
    });
    return { ...state, lists: newLists };
}

function updateListsFilter(state, action) {
    const { filteredLists } = action.payload;

    const listsRemoved = Set(filteredLists).subtract(Set(state.filteredLists)).toList();
    let backlog = listsRemoved.reduce((backlog, list) => {
        return list.get('items').reduce((acc, item) => acc.append(item), backlog)
    }, state.backlog);

    const listsAdded = Set(state.filteredLists).subtract(Set(filteredLists)).toList();
    backlog = listsAdded.reduce((backlog, list) => {
        return list.get('items').reduce((acc, item) => acc.removeItem(item), backlog)
    }, backlog);

    return {
        ...state,
        backlog,
        filteredLists,
    };
}

function updateProjectsFilter(state, action) {
    const { filteredProjects } = action.payload;
    return { ...state, filteredProjects };
}

function updatePriorityFilter(state, action) {
    const { filteredPriorities } = action.payload;
    return { ...state, filteredPriorities };
}

function updateDueDateFilter(state, action) {
    const { startDate, endDate } = action.payload;
    return { ...state, filterDueDate: Map({ startDate, endDate }) };
}

function toggleAssigneeFilter(state, action) {
    return { ...state, showIfResponsible: !state.showIfResponsible };
}

function toggleSubtaskFilter(state, action) {
    return { ...state, showSubtasks: !state.showSubtasks };
}

function setNamedFilter(state, action) {
    const { namedFilter } = action.payload;
    if (Object.keys(NAMED_FILTERS).some(f => f === namedFilter) || namedFilter === null) {
        return { ...state, namedFilter };
    } else {
        console.error('unknown named filter', namedFilter);
        return state;
    }
}

function fetchRequest(state, action) {
    return { ...state, fetching: true };
}

function fetchSuccess(state, action) {
    const { labelList, sharedLabels, items, projects, collaborators } = action.payload;

    const projectIdMap = projects.reduce((mapping, project) => {
        mapping[project.id] = new Project(project);
        return mapping;
    }, {});

    // Create Lists.
    const loadedLists = ImmutableList(
        sharedLabels.concat(labelList).map(label => {
            return new List({
                id: label.id,
                title: label.name,
                isShared: label.is_shared,
                value: label.value,
                items: ImmutableList(
                    items
                        .filter(item => item.labels.includes(label.value))
                        .filter(item => {
                            // FIXME: remove items without a valid project (seen in wild, unsure how it happens)
                            const project = projectIdMap[item.project_id];
                            if (!project) {
                                console.warn('item is missing valid project, skipping...');
                                console.warn(JSON.stringify({ projects, item }, null, 2));
                            }
                            return !!project;
                        })
                        .filter(item => !item.checked)
                        .map(item => new Item({
                            ...item,
                            due_date_utc: item.due && item.due.date,
                            recurring: item.due && item.due.is_recurring,
                            text: item.content,
                            project: projectIdMap[item.project_id],
                        }))

                ),
            });
        })
    );

    // Create list filters
    const filteredListIds = Set(state.filteredLists.map(el => el.id));
    const filteredLists = loadedLists.filter(el => filteredListIds.has(el.id));

    // Create backlog.
    // Important Note: when a label is deleted Todoist doesn't remove that label from any tasks that had that label
    //                 but our Todoist client does filter those labels. So rather than just check if labels is empty
    //                 we need to filter our backlog items to items that don't have a label that exists.
    const backlogList = new List({
        id: "0",
        title: 'Backlog',
        items: ImmutableList(
            items
                .filter(item => item.labels.length === 0 || Set.of(...item.labels).intersect(filteredListIds).size > 0)
                .filter(item => {
                    // FIXME: remove items without a valid project (seen in wild, unsure how it happens)
                    const project = projectIdMap[item.project_id];
                    if (!project) {
                        console.warn('item in backlog is missing valid project, skipping...');
                        console.warn(JSON.stringify({ projects, item }, null, 2));
                    }
                    return !!project;
                })
                .filter(item => !item.checked)
                .map(item => new Item({
                    ...item,
                    due_date_utc: item.due && item.due.date,
                    recurring: item.due && item.due.is_recurring,
                    text: item.content,
                    project: projectIdMap[item.project_id],
                }))
        ),
    });

    // Create projects and filtered projects
    const loadedProjects = ImmutableList(Object.keys(projectIdMap).map(pid => projectIdMap[pid]));
    const filteredProjectsIds = state.filteredProjects.map(el => el.id);
    const filteredProjects = loadedProjects.filter(el => filteredProjectsIds.contains(el.id));

    return {
        ...state,
        projects: loadedProjects,
        filteredProjects,
        lists: loadedLists,
        filteredLists,
        backlog: backlogList,
        fetching: false,
        fetchFail: null,
        collaborators,
    };
}

function fetchFailure(state, action) {
    return { ...state, fetching: false, fetchFail: action.payload.error };
}

function setDefaultProject(state, action) {
    const { projectId } = action.payload;
    return { ...state, defaultProjectId: projectId };
}

function setSortBy(state, action) {
    const { field, direction } = action.payload;
    if (SORT_BY[field] && SORT_BY_DIRECTION[direction]) {
        const sortBy = state.sortBy.set('field', SORT_BY[field]).set('direction', SORT_BY_DIRECTION[direction]);
        return { ...state, sortBy };
    } else {
        console.warn(`unknown sortBy field ${field} or sortBy direction ${direction}`);
        return state;
    }
}

function moveItem(state, action) {
    const { itemId, fromListId, toListId, itemIndex } = action.payload;

    const item = state.lists.push(state.backlog)
        .find(l => l.id === fromListId).get('items')
        .find(i => i.id === itemId);

    const updatedLists = state.lists.map(l => {
        let newList = l;

        if (l.id === fromListId) {
            newList = newList.removeItem(item);
        }

        // don't add an item to a list twice
        if (l.id === toListId && !newList.get('items').some(i => i.id === item.id)) {
            newList = newList.insert(itemIndex, item);
        }

        return newList;
    });

    let updatedBacklog = state.backlog;
    if (isBacklogListId(fromListId)) {
        updatedBacklog = updatedBacklog.removeItem(item);
    }

    if (isBacklogListId(toListId)) {
        updatedBacklog = updatedBacklog.insert(itemIndex, item);
    }

    return { ...state, lists: updatedLists, backlog: updatedBacklog };
}

function updateListIndex(state, action) {
    const { listId, newIndex } = action.payload;
    const { lists } = state;
    const list = lists.find(l => l.id === listId);
    return {
        ...state,
        lists: lists.filter(el => el.id !== listId).insert(newIndex, list)
    };
}

function sortLists(state, prevState) {
    const { lists, backlog } = state;
    const sortByField = state.sortBy.get('field');
    const sortByDirection = state.sortBy.get('direction');
    let sortFn = (a, b, list) => 0;
    switch (sortByField) {
        case SORT_BY.USER_SET:
            sortFn = (a, b, list) => {
                let aIndex = list ? list.get('items').findIndex(i => i.id === a.id) : 1;
                let bIndex = list ? list.get('items').findIndex(i => i.id === b.id) : 0;
                aIndex = aIndex > -1 ? aIndex : list.get('items').size;
                bIndex = bIndex > -1 ? bIndex : list.get('items').size;
                return aIndex <= bIndex ? -1 : 1;
            };
            break;
        case SORT_BY.DATE_ADDED:
            sortFn = (a, b) => {
                const aDateCreated = moment(a.date_added);
                const bDateCreated = moment(b.date_added);
                const comp = aDateCreated.isSame(bDateCreated) ? 0 : aDateCreated.isBefore(bDateCreated) ? -1 : 1;
                return sortByDirection === SORT_BY_DIRECTION.ASC ? comp : -1 * comp;
            };
            break;
        case SORT_BY.DUE_DATE:
            sortFn = (a, b) => {
                // always push items without a due date to bottom of list and keep stable on direction change
                if (!a.due_date_utc && !b.due_date_utc) {
                    return 0;
                } else if (!a.due_date_utc) {
                    return 1;
                } else if (!b.due_date_utc) {
                    return -1;
                }
                const aDateCreated = moment(a.due_date_utc);
                const bDateCreated = moment(b.due_date_utc);
                const comp = aDateCreated.isSame(bDateCreated) ? 0 : aDateCreated.isBefore(bDateCreated) ? -1 : 1;
                return sortByDirection === SORT_BY_DIRECTION.ASC ? comp : -1 * comp;
            };
            break;
        case SORT_BY.PRIORITY:
            const isAscending = sortByDirection === SORT_BY_DIRECTION.ASC;
            sortFn = (a, b) => (isAscending ? 1 : -1) * Math.sign(b.priority - a.priority);
            break;
        case SORT_BY.PROJECT_ORDER:
            sortFn = (a, b) => {
                let ret = 0;
                // first sort by projects...
                if (a.project.item_order < b.project.item_order) {
                    ret = -1;
                } else if (a.project.item_order > b.project.item_order) {
                    ret = 1;
                    // ...then sort items in project
                } else {
                    ret = Math.sign(a.item_order - b.item_order);
                }
                return (sortByDirection === SORT_BY_DIRECTION.ASC ? 1 : -1) * ret;
            };
            break;
        default:
            console.warn(`unknown sortBy.field: ${sortByField}`);
    }

    return {
        ...state,
        lists: lists.map(list => {
            const prevList = prevState.lists.find(l => l.id === list.id);
            return list.sort((a,b) => sortFn(a, b, prevList));
        }),
        backlog: backlog.sort((a,b) => sortFn(a, b, backlog))
    };
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ADD_NEW_LIST:
            return addList(state, action);
        case types.RENAME_LIST:
            return renameList(state, action);
        case types.DELETE_LIST:
            return deleteList(state, action);
        case types.COMPLETE_LIST:
            return completeList(state, action);
        case types.ADD_LIST_ITEM:
            return sortLists(addListItem(state, action), state);
        case types.UPDATE_LIST_ITEM:
            return updateListItem(state, action);
        case types.UPDATE_ID:
            return sortLists(updateId(state, action), state);
        case types.COMPLETE_LIST_ITEM:
            return completeListItem(state, action);

        case types.UPDATE_LISTS_FILTER:
            return updateListsFilter(state, action);
        case types.UPDATE_PROJECTS_FILTER:
            return updateProjectsFilter(state, action);
        case types.UPDATE_DUE_DATE_FILTER:
            return updateDueDateFilter(state, action);
        case types.UPDATE_PRIORITY_FILTER:
            return updatePriorityFilter(state, action);
        case types.TOGGLE_ASSIGNEE_FILTER:
            return toggleAssigneeFilter(state, action);
        case types.TOGGLE_SUBTASK_FILTER:
            return toggleSubtaskFilter(state, action);
        case types.SET_NAMED_FILTER:
            return setNamedFilter(state, action);

        case types.FETCH_REQUEST_SENT:
            return fetchRequest(state, action);
        case types.FETCH_SUCCESSFUL:
            return sortLists(fetchSuccess(state, action), state);
        case types.FETCH_FAILURE:
            return fetchFailure(state, action);

        case types.CLEAR_FILTERS:
            return {
                ...state,
                filteredProjects: initialState.filteredProjects,
                filteredLists: initialState.filteredLists,
                filterDueDate: initialState.filterDueDate,
                filteredPriorities: initialState.filteredPriorities,
                showIfResponsible: false,
                showSubtasks: true,
                namedFilter: null,
            };

        case types.CLEAR_ALL:
            return initialState;

        case types.SET_DEFAULT_PROJECT:
            return setDefaultProject(state, action);
        case types.SET_SORT_BY:
            return sortLists(setSortBy(state, action), state);

        case types.MOVE_ITEM:
            return moveItem(state, action);

        case types.UPDATE_LIST_INDEX:
            return updateListIndex(state, action);

        default:
            return state;
    }
};
