import React from "react";

export const NewTaskButton = ({
    addTask,
    categories,
    taskTitle,
    taskMessage,
    taskCategory,
    setTaskTitle,
    setTaskCategory,
    setTaskMessage,
    taskDueDate,
    setTaskDueDate,
    setTaskPriority,
    taskPriority
}) => {
    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value)
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
                                <option value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Priority</span>
                        </label>

                        <select className="select select-bordered" onChange={handlePriorityChange} name="priority" value={taskPriority}>
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
                        <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={taskDueDate} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href="#" className="btn btn-sm" onClick={addTask}>Add Task</a>
                    </div>
                </div>
            </div>
        </div>
    );
};