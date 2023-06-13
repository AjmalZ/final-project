import React, { useState } from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { tasks } from 'reducers/Tasks';

export const ToDoCard = ({ task, taskItems }) => {
    const selectedCategory = task.category ?? categories[0];
    const categories = useSelector((store) => store.category.items);
    const accessToken = useSelector((store) => store.user.accessToken);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskMessage, setTaskMessage] = useState('');
    const [taskCategory, setTaskCategory] = useState(categories.length > 0 ? categories[0]._id : "");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskPriority, setTaskPriority] = useState(1);

    const resetForm = () => {
        setTaskTitle('');
        setTaskMessage('');
        setTaskCategory(categories.length > 0 ? categories[0]._id : "");
        setTaskDueDate("");
        setTaskPriority(1);
    }

    const dispatch = useDispatch();
    const [showTaskDeleteModal, setShowTaskDeleteModal] = useState(false);

    const update = (event) => {
        updateTask(task._id);
    };

    const handleChange = (event) => {
        setTaskCategory(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value);
    };

    const dateObject = task.dueDate ? new Date(task.dueDate) : "";
    const formattedDate = dateObject !== "" ? dateObject.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "";

    const updateTask = (taskId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: taskTitle, message: taskMessage, dueDate: taskDueDate, category: taskCategory, priority: taskPriority }),
        };

        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let taskItemsWithoutTask = taskItems.filter((item) => item._id !== taskId);
                    dispatch(tasks.actions.setError(null));
                    resetForm()
                    dispatch(tasks.actions.setItems([...taskItemsWithoutTask, data.response]));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    const deleteTask = (taskId) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };
        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItems.filter(item => item._id !== taskId)]));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    const handleDelete = () => {
        setShowTaskDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteTask(task._id);
        setShowTaskDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowTaskDeleteModal(false);
    };

    return (
        <div className="kanbanCard bg-white rounded-md mb-5 shadow-2xl">
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
                        <h1 className="text-base font-semibold ">{task.title}</h1>
                        <h2 className="text-xs text-neutral-500">{task.message}</h2>
                        <p> {task.dueDate ? formattedDate : ""}</p>
                    </a>
                    <div className="modal" id={task._id}>
                        <div className="modal-box">
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={task.title} />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Message</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskMessage(e.target.value)} name="message" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={task.message} />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Current Category</span>
                                </label>
                                <select className="select select-bordered" onChange={handleChange} name="category" defaultValue={selectedCategory}>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Priority</span>
                                </label>
                                <select className="select select-bordered" onChange={handlePriorityChange} name="priority" defaultValue={task.priority}>
                                    <option value={1}>Low</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>High</option>
                                </select>
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Due Date</span>
                                </label>
                                <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" className="input input-bordered w-full max-w-xs" defaultValue={formattedDate} />
                            </div>
                            <div className="modal-action flex justify-between">
                                <a href="#" className="btn btn-sm">Close</a>
                                <div className="flex gap-5">
                                    <a href="#" className="btn btn-sm btn-error" onClick={handleDelete}>Delete</a>
                                    <a href="#" className="btn btn-sm" onClick={update}>Update Task</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={showTaskDeleteModal ? 'modal modal-open' : 'modal'} id="my_task_delete_modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete task</h3>
                            <p className="py-4">Are you sure you want to delete this task?</p>
                            <div className="modal-action">
                                <a href="#" className="btn" onClick={handleConfirmDelete}>Yes</a>
                                <a href="#" className="btn" onClick={handleCancelDelete}>No</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
