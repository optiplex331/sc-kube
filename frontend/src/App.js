import React, { useState, useEffect, useCallback } from 'react';

import './App.css';
import TaskList from './components/TaskList';
import NewTask from './components/NewTask';
import DeleteAllTasks from './components/DeleteAllTasks';

function App() {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = useCallback(() => {
        fetch('/api/tasks', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks.');
                }
                return response.json();
            })
            .then(jsonData => {
                setTasks(jsonData.tasks);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    function addTaskHandler(task) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add task.');
                }
                return response.json();
            })
            .then(resData => {
                setTasks(prevTasks => [...prevTasks, resData.task]);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function deleteAllTasksHandler() {
        fetch('/api/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete tasks！');
                }
                setTasks([]);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className='App'>
            <section>
                <NewTask onAddTask={addTaskHandler} />
                <DeleteAllTasks onDeleteAllTasks={deleteAllTasksHandler} />
            </section>
            <section>
                <button onClick={fetchTasks}>Fetch Tasks</button>
                <TaskList tasks={tasks} />
            </section>
        </div>
    );
}

export default App;
