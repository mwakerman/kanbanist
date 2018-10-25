import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';

import List from './List';
import { DragAndDropTypes } from './Constants';

class DraggableListGroupItem extends React.Component {
    render() {
        const { connectDragSource, ...rest } = this.props;
        return (
            <List
                {...rest}
                ref={instance => connectDragSource(findDOMNode(instance))}
            />
        );
    }
}

const listSource = {
    beginDrag(props) {
        return {
            list: props.list
        };
    }
};

export default DragSource(DragAndDropTypes.LIST, listSource, (connect, monitor) => ({
    isDragging: monitor.isDragging(),
    connectDragSource: connect.dragSource(),
}))(DraggableListGroupItem);
