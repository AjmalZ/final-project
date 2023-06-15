import React, { useState } from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { tasks } from 'reducers/Tasks';


export const ToDoCard = ({ task, taskItems }) => {

    // Get the list of categories from the Redux store
    const categories = useSelector((store) => store.category.items);

    // Get the access token from the Redux store
    const accessToken = useSelector((store) => store.user.accessToken);

    const dispatch = useDispatch();

    // State for the task title, message, category, due date, priority, and task delete modal
    const [taskTitle, setTaskTitle] = useState('');
    const [taskMessage, setTaskMessage] = useState('');
    const [taskCategory, setTaskCategory] = useState(task.category ?? categories[0]);
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskPriority, setTaskPriority] = useState(task.priority ?? 1);
    const [showTaskDeleteModal, setShowTaskDeleteModal] = useState(false);

    // Function to reset the task form
    const resetForm = () => {
        setTaskTitle('');
        setTaskMessage('');
        setTaskCategory(task.category ?? categories[0]);
        setTaskDueDate("");
        setTaskPriority(1);
    };

    // Function to update the task
    const update = (event) => {
        updateTask(task._id);
    };

    // Function to handle changes in the task category dropdown
    const handleChange = (event) => {
        setTaskCategory(event.target.value);
    };

    // Function to handle changes in the task priority dropdown
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value);
    };

    // Function to handle task delete
    const handleDelete = () => {
        setShowTaskDeleteModal(true);
    };

    // Function to confirm task deletion
    const handleConfirmDelete = () => {
        deleteTask(task._id);
        setShowTaskDeleteModal(false);
    };

    // Function to cancel task deletion
    const handleCancelDelete = () => {
        setShowTaskDeleteModal(false);
    };

    // Convert task due date to a date object and format it
    const dateObject = task.dueDate ? new Date(task.dueDate) : "";
    const formattedDate = dateObject !== "" ? dateObject.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "";

    // Function to update the task
    const updateTask = (taskId) => {
        // Prepare the request options
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: taskTitle, message: taskMessage, dueDate: taskDueDate, category: taskCategory, priority: taskPriority }),
        };

        // Send the PATCH request to update the task
        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the Redux store and reset the task form
                    let taskItemsWithoutTask = taskItems.filter((item) => item._id !== taskId);
                    dispatch(tasks.actions.setError(null));
                    resetForm();
                    dispatch(tasks.actions.setItems([...taskItemsWithoutTask, data.response]));
                } else {
                    // If the API call fails, set the error in the Redux store
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    // Function to delete the task
    const deleteTask = (taskId) => {
        // Prepare the request options
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };

        // Send the DELETE request to delete the task
        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the Redux store by removing the deleted task
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems.filter(item => item._id !== taskId)]));
                } else {
                    // If the API call fails, set the error in the Redux store
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    return (
        <div className="kanbanCard bg-white rounded-md mb-5 shadow-2xl">
            {/* Display the task priority label based on the priority value */}
            {task.priority === 1 ?
                <label className="bg-gradient-to-r from-blue-500 to-blue px-2 block rounded-md borderBottomRadius0">
                    Low priority
                </label>
                : task.priority === 2 ?
                    <label className="bg-gradient-to-r from-yellow-500 to-yellow px-2 block rounded-md borderBottomRadius0">
                        Medium priority
                    </label>
                    : task.priority === 3 ?
                        <label className="bg-gradient-to-r from-red-500 to-red px-2 block rounded-md borderBottomRadius0">
                            High priority
                        </label>
                        : ""}
            <div className="text-gray-600 text-sm">
                <div key={task._id}>
                    <a href={"#" + task._id}>
                        <h1 className="text-base font-semibold text-black pt-1 pl-2">{task.title}</h1>
                        <h2 className="text-xs text-neutral-500 pt-1 pl-2">{task.message}</h2>
                        <p className="pl-2"> {task.dueDate ? formattedDate : ""}</p>
                    </a>
                    <div className="modal" id={task._id}>
                        <div className="modal-box">
                            {/* Input field for task title */}
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={task.title} />
                            </div>
                            {/* Input field for task message */}
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Message</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskMessage(e.target.value)} name="message" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={task.message} />
                            </div>
                            {/* Dropdown to select the current task category */}
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Current Category</span>
                                </label>
                                <select className="select select-bordered" onChange={handleChange} name="category" defaultValue={taskCategory}>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Dropdown to select the task priority */}
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Priority</span>
                                </label>
                                <select className="select select-bordered" onChange={handlePriorityChange} name="priority" defaultValue={taskPriority}>
                                    <option value={1}>Low</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>High</option>
                                </select>
                            </div>
                            {/* Input field to set the task due date */}
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Due Date</span>
                                </label>
                                <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" className="input input-bordered w-full max-w-xs" defaultValue={formattedDate} />
                            </div>
                            {/* Modal actions */}
                            <div className="modal-action flex justify-between">
                                <a href="#" className="btn btn-sm">Close</a>
                                <div className="flex gap-5">
                                    {/* Button to delete the task */}
                                    <a href="#" className="btn btn-sm btn-error" onClick={handleDelete}>Delete</a>
                                    {/* Button to update the task */}
                                    <a href="#" className="btn btn-sm" onClick={update}>Update Task</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Task delete confirmation modal */}
                    <div className={showTaskDeleteModal ? 'modal modal-open' : 'modal'} id="my_task_delete_modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete task</h3>
                            <p className="py-4">Are you sure you want to delete this task?</p>
                            <div className="modal-action">
                                {/* Button to confirm task deletion */}
                                <a href="#" className="btn" onClick={handleConfirmDelete}>Yes</a>
                                {/* Button to cancel task deletion */}
                                <a href="#" className="btn" onClick={handleCancelDelete}>No</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
