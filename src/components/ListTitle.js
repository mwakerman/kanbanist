import React from 'react';
import { Button, EditableText, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';

export default class ListTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            isEditing: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.title !== prevProps.title) {
            this.setState({ title: this.props.title });
        }
    }

    handleRename = () => {
        const title = this.state.title;
        const { onRename } = this.props;
        if (title.length > 0) {
            this.setState({ isEditing: false }, () => onRename(title));
        } else {
            this.setState({ title: this.props.title });
        }
    };

    render() {
        const { disabled, showListMenu, onDelete, onCompleteAll } = this.props;
        const { isEditing } = this.state;

        const listMenu = (
            <Menu>
                <MenuItem icon="trash" onClick={onDelete} text="Delete list" />
                <MenuItem icon="tick" onClick={onCompleteAll} text="Mark all as done" />
            </Menu>
        );

        const menuButton = (
            <Popover content={listMenu} position={Position.RIGHT}>
                <Button className="list-panel-title-close-button bp3-minimal bp3-small" icon="menu-open" />
            </Popover>
        );

        return (
            <div className="list-panel-title">
                <div className="list-panel-title-text-div" onClick={() => this.setState({ isEditing: true })}>
                    <EditableText
                        isEditing={isEditing}
                        className="list-panel-title-text"
                        value={this.state.title}
                        disabled={disabled}
                        onChange={newValue => this.setState({ title: newValue })}
                        onConfirm={this.handleRename}
                        onCancel={() => this.setState({ isEditing: false })}
                    />
                </div>
                <div className="list-panel-title-close-button-div">{showListMenu ? menuButton : <div />}</div>
            </div>
        );
    }
}
