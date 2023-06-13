import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { tasks } from 'reducers/Tasks';

export const NewTaskButton = ({
    taskTitle,
    taskMessage,
    taskCategory,
    setTaskTitle,
    setTaskCategory,
    setTaskMessage,
    taskDueDate,
    setTaskDueDate,
    setTaskPriority,
    taskPriority,
    taskItems,
    resetForm
}) => {

    const dispatch = useDispatch();
    const accessToken = useSelector((store) => store.user.accessToken);
    const categories = useSelector((store) => store.category.items);
    const [showError, setShowError] = useState(false)


    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value)
    };

    const addTask = () => {
        if (taskTitle === "") {
            setShowError(true)
            return
        }
        setShowError(false)
        const cat = taskCategory ? taskCategory : categories[0]._id;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: taskTitle, message: taskMessage, dueDate: taskDueDate, category: cat, priority: taskPriority, user: user._id }),
        };

        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems, data.response]));

                    resetForm();
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });

    };
    return (
        <div>
            <div id="my_modal_task" className="modal">
                <div className="modal-box">
                    <div className="form-control w-full max-w-xs">
                        <h1 className="text-xl font-medium">Add New Task</h1>
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <span className="text-red-600">{showError ? "Title is required" : ""}</span>
                        <input type="text" onChange={(e) => setTaskTitle(e.target.value)} name="title" placeholder="Type task title here" className="input input-bordered w-full max-w-xs" value={taskTitle} />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Message</span>
                        </label>
                        <input type="text" onChange={(e) => setTaskMessage(e.target.value)} name="message" placeholder="Type task message here" className="input input-bordered w-full max-w-xs" value={taskMessage} />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Category</span>
                        </label>

                        <select className="select select-bordered" onChange={handleChange} name="category" value={taskCategory}>
                            {categories.map((cat) => (
                                <option value={cat._id} key={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Priority</span>
                        </label>

                        <select className="select select-bordered" onChange={handlePriorityChange} name="priority" value={taskPriority}>
                            <option disabled={true} value="">Select Priority</option>
                            <option value={1} key={1}>Low</option>
                            <option value={2} key={2}>Medium</option>
                            <option value={3} key={3}>High</option>
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Due Date</span>
                        </label>
                        <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={taskDueDate} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href={showError ? null : "#"} className="btn btn-sm" onClick={addTask}>Add Task</a>
                    </div>
                </div>
            </div>
        </div>
    );
};