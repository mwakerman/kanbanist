import React from 'react';
import List from './List';
import { Draggable } from "react-beautiful-dnd";

export default class DraggableList extends React.Component {
    render () {
        const { list, index } = this.props;
        return (
            <Draggable
                draggableId={`list-${list.id}`}
                index={index}
            >
                {(provided, snapshot) => {
                    const draggableProps = {
                        ref: provided.innerRef,
                        ...provided.draggableProps,
                        ...provided.dragHandleProps,
                    };
                    const dynamicStyle = {
                        ...provided.draggableProps.style,
                    };
                    return (
                        <List
                            { ...this.props }
                            draggableProps={draggableProps}
                            style={dynamicStyle}
                        />
                    )
                }}
            </Draggable>

        );
    }
}