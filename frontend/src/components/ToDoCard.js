import React from 'react';

export const ToDoCard = ({ task, categories, updateTask, setTaskTitle, setTaskMessage, setTaskCategory, setTaskDueDate }) => {
    const selectedCategory = task.category ?? categories[0]

    const update = (event) => {
        updateTask(task._id)
    }

    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };

    const dateObject = new Date(task.dueDate);
    const formattedDate = dateObject.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return (
        <div key={task._id}>
            {/* The button to open modal */}
            <a href={"#" + task._id}><h1 className="text-xl ">{task.title}</h1><h2 className="text-xl ">{task.message}</h2></a>
            <div className="modal" id={task._id}>
                <div className="modal-box">
                    <button className="btn btn-square btn-ghost absolute top-0 right-0 h-16 w-16">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
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
                            <span className="label-text">Due Date</span>
                        </label>
                        <input type="date" onChange={(e) => setTaskDueDate(e.target.value)} name="dueDate" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={formattedDate} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm" onClick={update}>Update Task</a>
                        <a href="#" className="btn btn-sm">Close</a>
                    </div>
                </div>
            </div>
        </div >
    )
}