import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Classes, Intent, MenuItem, Position, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { Select } from '@blueprintjs/labs';

import '@blueprintjs/labs/dist/blueprint-labs.css';

import { actions as listsActions, SORT_BY, SORT_BY_DIRECTION } from '../redux/modules/lists';
import FilterMenu from './FilterMenu';
import DueDateFilterMenu from './DueDateFilterMenu';
import { priorities } from '../core/Priority';

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

        const listsFilterMenu = (
            <FilterMenu
                title="Lists Filter"
                checkboxItems={lists}
                selectedItems={lists.filter(el => !filteredLists.contains(el))}
                onChange={(list, isChecked) => {
                    if (isChecked) {
                        updateListsFilter(filteredLists.filter(el => el.id !== list.id));
                    } else {
                        updateListsFilter(filteredLists.push(list));
                    }
                }}
                onChangeAll={isChecked => {
                    if (isChecked) {
                        updateListsFilter(filteredLists.filter(el => false));
                    } else {
                        updateListsFilter(lists);
                    }
                }}
            />
        );

        const projectsFilterMenu = (
            <FilterMenu
                title="Projects Filter"
                checkboxItems={projects.sort((p1, p2) => Math.sign(p1.item_order - p2.item_order))}
                selectedItems={projects.filter(el => !filteredProjects.contains(el))}
                labelProperty="name"
                onChange={(project, isChecked) => {
                    if (isChecked) {
                        updateProjectsFilter(filteredProjects.filter(el => el.id !== project.id));
                    } else {
                        updateProjectsFilter(filteredProjects.push(project));
                    }
                }}
                onChangeAll={isChecked => {
                    if (isChecked) {
                        updateProjectsFilter(filteredProjects.filter(el => false));
                    } else {
                        updateProjectsFilter(projects);
                    }
                }}
            />
        );

        const priorityFilterMenu = (
            <FilterMenu
                title="Priority Filter"
                checkboxItems={priorities}
                labelProperty="name"
                selectedItems={priorities.filter(p => !filteredPriorities.contains(p))}
                onChange={(priority, isChecked) => {
                    if (isChecked) {
                        updatePriorityFilter(filteredPriorities.filter(el => el.id !== priority.id));
                    } else {
                        updatePriorityFilter(filteredPriorities.push(priority));
                    }
                }}
                onChangeAll={isChecked => {
                    if (isChecked) {
                        updatePriorityFilter(priorities.filter(el => false));
                    } else {
                        updatePriorityFilter(priorities);
                    }
                }}
            />
        );

        return (
            <div className="Toolbar">
                <Popover
                    className="Toolbar-button Toolbar-button-popover"
                    content={listsFilterMenu}
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="pt-popover-content-sizing"
                    position={Position.BOTTOM_LEFT}>
                    <Button text="Lists" iconName="property" className="Toolbar-button" />
                </Popover>

                <Popover
                    className="Toolbar-button Toolbar-button-popover"
                    content={projectsFilterMenu}
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="pt-popover-content-sizing"
                    position={Position.BOTTOM}>
                    <Button text="Projects" iconName="projects" className="Toolbar-button" />
                </Popover>

                <Popover
                    className="Toolbar-button Toolbar-button-popover"
                    content={priorityFilterMenu}
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="pt-popover-content-sizing"
                    position={Position.BOTTOM}>
                    <Button text="Priority" iconName="flag" className="Toolbar-button" />
                </Popover>

                <Popover
                    className="Toolbar-button Toolbar-button-popover"
                    content={<DueDateFilterMenu />}
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="pt-popover-content-sizing"
                    position={Position.BOTTOM}>
                    <Button text="Due Date" iconName="calendar" className="Toolbar-button" />
                </Popover>

                <Button
                    text="Assigned to me"
                    iconName="user"
                    className="Toolbar-button"
                    active={showIfResponsible}
                    onClick={toggleAssigneeFilter}
                />

                {/*<Button*/}
                {/*text="Query"*/}
                {/*iconName="search"*/}
                {/*className="Toolbar-button"*/}
                {/*/>*/}
                <Button
                    text="Clear Filters"
                    iconName="remove"
                    intent={Intent.DANGER}
                    className="Toolbar-button"
                    onClick={onClearFilters}
                />

                <span className="light-divider pt-navbar-divider" />

                <Select
                    className="Toolbar-button"
                    items={projects}
                    itemRenderer={({ handleClick, item, isActive }) => (
                        <MenuItem
                            className={item.id === defaultProjectId ? Classes.ACTIVE : ''}
                            key={item.id}
                            onClick={handleClick}
                            text={item.name}
                        />
                    )}
                    onItemSelect={item => setDefaultProject(item.id)}
                    filterable={false}>
                    <Button text="New items project" iconName="add-to-artifact" rightIconName="double-caret-vertical" />
                </Select>

                <Select
                    className="Toolbar-button"
                    items={Object.keys(SORT_BY).map(k => ({ key: k, value: SORT_BY[k] }))}
                    itemRenderer={({ handleClick, item }) => {
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
                                iconName={icon}
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
                    <Button text="Sort lists by" iconName="sort" rightIconName="double-caret-vertical" />
                </Select>
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
