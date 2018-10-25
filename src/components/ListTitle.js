import React from 'react';
import {Button, EditableText, Menu, MenuItem, Popover, Position} from '@blueprintjs/core';

export default class ListTitle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
        }
    }

    handleRename = () => {
        const title = this.state.title;
        const { onRename } = this.props;
        if (title.length > 0) {
            onRename(title);
        } else {
            this.setState({
                title: this.props.title,
            })
        }
    }

    render() {

        const { disabled, showListMenu, onDelete, onCompleteAll } = this.props;

        const listMenu = (
            <Menu>
                <MenuItem
                    iconName="trash"
                    onClick={onDelete}
                    text="Delete list" />
                <MenuItem
                    iconName="tick"
                    onClick={onCompleteAll}
                    text="Mark all as done" />
            </Menu>
        );

        const menuButton = (
            <Popover content={listMenu} position={Position.RIGHT_TOP}>
                <Button className="list-panel-title-close-button pt-minimal pt-small" iconName="menu-open"/>
            </Popover>
        );

        return (
            <div className="list-panel-title">
                <div className="list-panel-title-text-div">
                    <EditableText
                        className="list-panel-title-text"
                        value={this.state.title}
                        disabled={disabled}
                        onChange={(newValue) => this.setState({title: newValue})}
                        onConfirm={this.handleRename}
                    />
                </div>
                <div className="list-panel-title-close-button-div">
                    { showListMenu ? menuButton : <div/> }
                </div>
            </div>
        )
    }
}
