import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tasks } from 'reducers/Tasks';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { TopBar } from './TopBar';
import { SideBar } from './SideBar';
import './Main.css';

export const Main = () => {
    const taskItems = useSelector((store) => store.tasks.items);
    const dispatch = useDispatch();
    const accessToken = useSelector((store) => store.user.accessToken);
    const username = useSelector((store) => store.user.username);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };

        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.response);
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems(data.response));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                    dispatch(tasks.actions.setItems([]));
                }
            });
    }, [accessToken, dispatch]);

    const postNewTask = (e) => {
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ message }),
        };

        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems, data.response]));
                    setMessage('');
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    return (
        <>
            <TopBar />
            <div>
                {username ? <h1>THESE ARE THE TASKS OF {username.toUpperCase()}</h1> : ''}
                {taskItems.map((task) => (
                    <div key={task._id}>
                        <textarea value={task.message}></textarea>
                    </div>
                ))}
            </div>
            <SideBar />
        </>
    );
};
