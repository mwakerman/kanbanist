import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, AnchorButton, Classes, Intent, MenuItem, Popover } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import { PopoverPosition } from "@blueprintjs/core/lib/cjs/components/popover/popoverSharedProps";
import { actions as listsActions, SORT_BY, SORT_BY_DIRECTION } from '../redux/modules/lists';
import FilterMenu from './FilterMenu';
import DueDateFilterMenu from './DueDateFilterMenu';
import { priorities } from '../core/Priority';
import { getDescendents } from '../core/Project';

import './Toolbar.css';

class Toolbar extends Component {
    render() {
        const {
            lists,
            filteredLists,
            updateListsFilter,
            projects,
            filteredProjects,
            updateProjectsFilter,
            showIfResponsible,
            toggleAssigneeFilter,
            onClearFilters,
            defaultProjectId,
            setDefaultProject,
            filteredPriorities,
            updatePriorityFilter,
            sortBy,
            setSortBy,
        } = this.props;

        return (
            <div className="Toolbar">
                <div className="inner">
                    <Popover position={PopoverPosition.BOTTOM_RIGHT} className="Toolbar-item">
                        <AnchorButton text="Lists" icon="property"/>
                        <FilterMenu
                            checkboxItems={lists}
                            selectedItems={lists.filter(el => !filteredLists.contains(el))}
                            onChange={(list, checked) => {
                                const newFilteredLists = checked
                                    ? filteredLists.filter(el => el.id !== list.id)
                                    : filteredLists.push(list);

                                updateListsFilter(newFilteredLists);
                            }}
                            onChangeAll={checked => updateListsFilter(checked ? filteredLists.filter(el => false) : lists)}
                        />
                    </Popover>
                    <Popover className="Toolbar-item">
                        <AnchorButton text="Projects" icon="projects"/>
                        <FilterMenu
                            checkboxItems={projects.sort((p1, p2) => Math.sign(p1.item_order - p2.item_order))}
                            selectedItems={projects.filter(el => !filteredProjects.contains(el))}
                            labelProperty="name"
                            onChange={(project, checked) => {
                                const descendants = getDescendents(project, projects);
                                const newFilteredProjects = checked
                                    ? filteredProjects.filter(el => !descendants.some(p => p.id === el.id))
                                    : filteredProjects.push(...descendants);

                                updateProjectsFilter(newFilteredProjects);
                            }}
                            onChangeAll={checked => updateProjectsFilter(checked ? filteredProjects.filter(el => false) : projects)}
                        />
                    </Popover>
                    <Popover className="Toolbar-item">
                        <AnchorButton text="Priority" icon="flag"/>
                        <FilterMenu
                            checkboxItems={priorities}
                            labelProperty="name"
                            selectedItems={priorities.filter(p => !filteredPriorities.contains(p))}
                            onChange={(priority, checked) => {
                                const newFilteredPriorities = checked
                                    ? filteredPriorities.filter(el => el.id !== priority.id)
                                    : filteredPriorities.push(priority);

                                updatePriorityFilter(newFilteredPriorities);
                            }}
                            onChangeAll={checked => updatePriorityFilter(checked ? priorities.filter(el => false) : priorities)}
                        />
                    </Popover>
                    <Popover className="Toolbar-item">
                        <AnchorButton text="Due Date" icon="calendar"/>
                        <DueDateFilterMenu />
                    </Popover>
                    <Button
                        className="Toolbar-item"
                        text="Assigned to me"
                        icon="user"
                        active={showIfResponsible}
                        onClick={toggleAssigneeFilter}
                    />
                    <Button
                        className="Toolbar-item"
                        text="Clear Filters"
                        icon="remove"
                        intent={Intent.DANGER}
                        onClick={onClearFilters}
                    />
                    <span className="light-divider bp3-navbar-divider" />
                    <Select
                        className="Toolbar-item"
                        items={projects.toArray()}
                        itemRenderer={(project, { handleClick, modifiers }) => {
                            if (!modifiers.matchesPredicate) {
                                return null;
                            }
                            return (
                                <MenuItem
                                    active={project.id === defaultProjectId}
                                    disabled={modifiers.disabled}
                                    key={project.id}
                                    onClick={handleClick}
                                    text={project.name}
                                />
                            );
                        }}
                        onItemSelect={({ id }) => setDefaultProject(id)}
                        filterable={false}
                    >
                        <Button text="New Items Project" icon="add-to-artifact" rightIcon="double-caret-vertical" />
                    </Select>
                    <Select
                        className="Toolbar-item"
                        items={Object.keys(SORT_BY).map(k => ({ key: k, value: SORT_BY[k] }))}
                        itemRenderer={(item, { handleClick, modifiers }) => {
                            if (!modifiers.matchesPredicate) {
                                return null;
                            }

                            const isActive = sortBy.get('field') === item.value;
                            const isAscending = sortBy.get('direction') === SORT_BY_DIRECTION.ASC;
                            let icon = 'blank';
                            if (isActive) {
                                icon = isAscending ? 'caret-up' : 'caret-down';
                            }
                            return (
                                <MenuItem
                                    className={isActive ? Classes.ACTIVE : ''}
                                    key={item.key}
                                    onClick={handleClick}
                                    text={item.value}
                                    icon={icon}
                                />
                            );
                        }}
                        onItemSelect={item => {
                            const isActive = sortBy.get('field') === item.value;
                            const isAscending = sortBy.get('direction') === SORT_BY_DIRECTION.ASC;
                            if (isActive) {
                                if (isAscending) {
                                    setSortBy(item.key, SORT_BY_DIRECTION.DESC);
                                } else {
                                    setSortBy(item.key, SORT_BY_DIRECTION.ASC);
                                }
                            } else {
                                // set new field
                                setSortBy(item.key, SORT_BY_DIRECTION.ASC);
                            }
                        }}
                        filterable={false}>
                        <Button text="Sort Lists" icon="sort" rightIcon="double-caret-vertical" />
                    </Select>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    projects: state.lists.projects,
    filteredPriorities: state.lists.filteredPriorities,
    defaultProjectId: state.lists.defaultProjectId,
    showIfResponsible: state.lists.showIfResponsible,
    sortBy: state.lists.sortBy,
});

const mapDispatchToProps = {
    setDefaultProject: listsActions.setDefaultProject,
    updatePriorityFilter: listsActions.updatePriorityFilter,
    toggleAssigneeFilter: listsActions.toggleAssigneeFilter,
    setSortBy: listsActions.setSortBy,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Toolbar);
