import React from 'react';
import './DeleteAllTasks.css';

function DeleteAllTasks(props) {
    return (
        <button className="delete-button" onClick={props.onDeleteAllTasks}>
            Delete All Tasks
        </button>
    );
}

export default DeleteAllTasks;
