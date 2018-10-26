import * as Immutable from 'immutable';
import moment from 'moment';
import List from '../core/List';
import Item from '../core/Item';
import Project from '../core/Project';
import { priorities as Priorities } from '../core/Priority';
import { NAMED_FILTERS } from '../redux/modules/lists';
export { save } from 'redux-localstorage-simple';

// Constants
const TRELLOIST_VERSION_NAMESPACE = 'TRELLOIST_VERSION';
const VERSION = '8';
export const LOCAL_STORAGE_NAMESPACE = 'trelloist';

// http://stackoverflow.com/a/901144/4988358
function getParameterByName(name) {
    const url = window.location.href;
    // eslint-disable-next-line
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Deserializes the initial state from localStorage.
export function load() {
    const loadedState = {};
    if (localStorage[LOCAL_STORAGE_NAMESPACE]) {
        const jsState = JSON.parse(localStorage[LOCAL_STORAGE_NAMESPACE]);

        // Versioning - by bumping the version number I can force a clean load when someone visits the site.
        // TODO: maintain the user so another login isn't required.
        const localVersion = localStorage[TRELLOIST_VERSION_NAMESPACE];
        if (!localVersion || localVersion !== VERSION) {
            console.warn('Version bump, clearing localStorage...');
            localStorage.clear();
            localStorage[TRELLOIST_VERSION_NAMESPACE] = VERSION;
            return {};
        }

        // User
        loadedState.user = jsState.user;

        // Lists
        loadedState.lists = {};
        loadedState.lists.lists = Immutable.List(
            jsState.lists.lists.map(listObject => {
                const listItems = listObject.items.map(itemObj => new Item(itemObj));
                return new List({
                    id: listObject.id,
                    title: listObject.title,
                    items: Immutable.List(listItems),
                });
            })
        );

        const backlogItems = jsState.lists.backlog.items.map(itemObj => new Item(itemObj));
        loadedState.lists.backlog = new List({
            id: 0,
            title: 'Backlog',
            items: Immutable.List(backlogItems),
        });

        // Projects
        loadedState.lists.projects = Immutable.List(jsState.lists.projects.map(project => new Project(project)));

        // Filters
        let filteredListIds = Immutable.List(jsState.lists.filteredLists.map(el => el.id));
        let filteredProjectIds = Immutable.List(jsState.lists.filteredProjects.map(project => project.id));
        let filteredPriorities = Priorities.filter(p => jsState.lists.filteredPriorities.indexOf(p.id) >= 0);

        loadedState.lists.filterDueDate = Immutable.Map({
            startDate: jsState.lists.filterDueDate.startDate ? moment(jsState.lists.filterDueDate.startDate) : null,
            endDate: jsState.lists.filterDueDate.endDate ? moment(jsState.lists.filterDueDate.endDate) : null,
        });

        let showIfResponsible = jsState.lists.showIfResponsible || false;
        let namedFilter = NAMED_FILTERS[jsState.lists.namedFilter] || null;

        loadedState.lists.sortBy = new Immutable.Map({
            field: jsState.lists.sortBy.field,
            direction: jsState.lists.sortBy.direction,
        });

        // Filter from URL overrides redux state

        // Build map from query string to objects
        const { lists, projects, priorities, start, end, assigned, filter } = Immutable.List([
            'lists',
            'projects',
            'priorities',
            'start',
            'end',
            'assigned',
            'filter',
        ]).reduce((params, param) => {
            const value = getParameterByName(param);

            // filters are non-JSON strings and can't be JSON.parse'd
            if (param === 'filter' && value) {
                params[param] = value;
            } else if (value) {
                params[param] = JSON.parse(value);
            }
            return params;
        }, {});

        // If ANY params are present then we ignore redux state for all filters and just use the URL
        if (lists || projects || priorities || start || end || assigned || filter) {
            // lists
            filteredListIds = lists
                ? loadedState.lists.lists.filter(el => lists.indexOf(el.title) < 0).map(el => el.id)
                : Immutable.List.of();

            filteredProjectIds = projects
                ? loadedState.lists.projects.filter(el => projects.indexOf(el.name) < 0).map(el => el.id)
                : Immutable.List.of();

            filteredPriorities = priorities
                ? Priorities.filter(el => priorities.indexOf(el.id) < 0)
                : Immutable.List.of();

            // due date
            loadedState.lists.filterDueDate = Immutable.Map({
                startDate: start ? moment(start) : null,
                endDate: end ? moment(end) : null,
            });

            // assigned
            showIfResponsible = assigned;

            // named
            namedFilter = filter ? NAMED_FILTERS[filter] : null;
        }

        loadedState.lists.filteredLists = loadedState.lists.lists.filter(list => filteredListIds.contains(list.id));
        loadedState.lists.filteredProjects = loadedState.lists.projects.filter(project =>
            filteredProjectIds.contains(project.id)
        );
        loadedState.lists.defaultProjectId = jsState.lists.defaultProjectId;
        loadedState.lists.filteredPriorities = filteredPriorities;
        loadedState.lists.showIfResponsible = showIfResponsible;
        loadedState.lists.namedFilter = namedFilter;

        loadedState.lists.collaborators = jsState.lists.collaborators;

        // ui
        loadedState.ui = jsState.ui;
    }

    return loadedState;
}
