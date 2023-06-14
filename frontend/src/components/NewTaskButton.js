import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { tasks } from 'reducers/Tasks';

// Component for a button to add a new task
export const NewTaskButton = ({
    taskItems
}) => {
    const dispatch = useDispatch();

    // Get the access token from the Redux store
    const accessToken = useSelector((store) => store.user.accessToken);

    // Get the list of categories from the Redux store
    const categories = useSelector((store) => store.category.items);

    // State to show/hide the error message
    const [showError, setShowError] = useState(false);

    // State for the task title, message, category, due date, and priority
    const [taskTitle, setTaskTitle] = useState('');
    const [taskMessage, setTaskMessage] = useState('');
    const [taskCategory, setTaskCategory] = useState(categories.length > 0 ? categories[0]._id : "");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskPriority, setTaskPriority] = useState(1);

    // Function to handle changes in the task category dropdown
    const handleChange = (event) => {
        setTaskCategory(event.target.value);
    };

    // Function to handle changes in the task priority dropdown
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value);
    };

    // Function to reset the task form
    const resetForm = () => {
        setTaskTitle('');
        setTaskMessage('');
        setTaskCategory(categories.length > 0 ? categories[0]._id : "");
        setTaskDueDate("");
        setTaskPriority(1);
    };

    // Function to add a new task
    const addTask = () => {
        if (taskTitle === "") {
            setShowError(true);
            return;
        }
        setShowError(false);

        // Get the selected category or use the first category in the list
        const cat = taskCategory ? taskCategory : categories[0]._id;

        // Prepare the request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: taskTitle, message: taskMessage, dueDate: taskDueDate, category: cat, priority: taskPriority, user: user._id }),
        };

        // Send the POST request to add a new task
        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the Redux store and reset the task form
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems, data.response]));

                    resetForm();
                } else {
                    // If the API call fails, update the error state in the Redux store
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    return (
        <div>
            {/* New task modal */}
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

                        {/* Dropdown to select the task category */}
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

                        {/* Dropdown to select the task priority */}
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
