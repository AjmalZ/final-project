import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tasks } from 'reducers/Tasks';
import { category } from 'reducers/Category';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { TopBar } from './TopBar';
import { SideBar } from './SideBar';
import { ToDoCard } from './ToDoCard';
import './Main.css';

export const Main = () => {
    const taskItems = useSelector((store) => store.tasks.items);
    const categories = useSelector((store) => store.category.items);
    const dispatch = useDispatch();
    const accessToken = useSelector((store) => store.user.accessToken);
    const username = useSelector((store) => store.user.username);
    const navigate = useNavigate();
    /*const [message, setMessage] = useState('');*/

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
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems(data.response));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                    dispatch(tasks.actions.setItems([]));
                }
            });

        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(category.actions.setError(null));
                    dispatch(category.actions.setItems(data.response));
                } else {
                    dispatch(category.actions.setError(data.error));
                    dispatch(category.actions.setItems([]));
                }
            });
    }, [accessToken, dispatch]);

    const addTask = (e) => {
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: "testing task", category: "647ce18feff3b2ebf815b859", user: user._id }),
        };

        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems, data.response]));
                    /*setMessage('');*/
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    return (
        <>
            <TopBar addTask={addTask} />
            <div>
                {username ? <h1>THESE ARE THE TASKS OF {username.toUpperCase()}</h1> : ''}
            </div>
            <div className="flex justify-center">
                {categories.map((cat) => (
                    <div className="grid grid-cols-4 gap-5">
                        <div className="bg-gray-100 p-3">
                            <h4 className="flex justify-between items-center">
                                <span className="text-2xl text-gray-600">{cat.title}</span>
                            </h4>
                            {taskItems.filter(categoryTask => categoryTask.category === cat._id).map((task) => (
                                <div className="bg-white rounded-md ">
                                    <label className="bg-gradient-to-r from-blue-500 to-blue px-2">
                                        Low priority
                                    </label>
                                    <div className="text-gray-600 text-sm">
                                        <ToDoCard task={task} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <SideBar />
        </>
    );
};
