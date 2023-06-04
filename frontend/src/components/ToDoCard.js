import React from 'react';

export const ToDoCard = ({ task }) => {

    return (
        <div key={task._id}>
            <h1>{task.title}</h1>
            <h2>{task.message}</h2>
        </div>
    )
}