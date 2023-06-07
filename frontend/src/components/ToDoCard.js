import React from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch } from 'react-redux';

export const ToDoCard = ({ task, categories, updateTask, setTaskTitle, setTaskMessage, setTaskCategory, setTaskDueDate, setTaskPriority, accessToken, tasks, taskItems }) => {
    const selectedCategory = task.category ?? categories[0]
    const dispatch = useDispatch();

    const update = (event) => {
        updateTask(task._id)
    }

    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value)
    };

    const dateObject = new Date(task.dueDate);
    const formattedDate = dateObject.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });


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

    return (
        <div key={task._id}>
            {/* The button to open modal */}
            <a href={"#" + task._id}><h1 className="text-xl ">{task.title}</h1><h2 className="text-xl ">{task.message}</h2><p> {task.dueDate ? formattedDate : ""}</p></a>
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
                                <option value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Priority</span>
                        </label>

                        <select className="select select-bordered" onChange={handlePriorityChange} name="priority" value={task.priority}>
                            <option disabled={true} value="">Select Priority</option>
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Due Date</span>
                        </label>
                        <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={formattedDate} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href="#" className='btn btn-sm' onClick={() => { if (window.confirm('Are you sure you want to delete this task?')) deleteTask(task._id) }}>Delete</a>
                        <a href="#" className="btn btn-sm" onClick={update}>Update Task</a>
                    </div>
                </div>
            </div>
        </div >
    )
}