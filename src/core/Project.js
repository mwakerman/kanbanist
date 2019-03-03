import { Record } from 'immutable';

export default Record({
    id: 0,
    name: '',
    color: 0,
    shared: false,
    item_order: 0,
    indent: 0,
    parent_id: 0,
});

/**
 * Returns an array of all nested projects (including the provided root project)
 * @param rootProject the root project to find all 
 * @param projects all rpojects
 */
export const getDescendents = (rootProject, projects) => {
    const children = projects.filter(p => p.parent_id === rootProject.id);
    return children.length === 0
        ? [ rootProject ]
        : [ rootProject ].concat(...children.map(child => getDescendents(child, projects)))
}
