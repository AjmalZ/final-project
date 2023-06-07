import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from 'reducers/User';
import { SideBarBtn } from './SideBarBtn';


export const TopBar = ({
    addTask,
    categories,
    taskTitle,
    taskMessage,
    taskCategory,
    setTaskTitle,
    setTaskCategory,
    setTaskMessage,
    setCategoryTitle,
    categoryTitle,
    addCategory,
    taskDueDate,
    setTaskDueDate,
    taskItems,
    setTaskPriority,
    taskPriority,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    updateUser
}) => {
    const dispatch = useDispatch();

    const handleLogoutClick = () => {
        dispatch(user.actions.setAccessToken(null));
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setUserId(null));
    };
    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };
    const handlePriorityChange = (event) => {
        setTaskPriority(event.target.value)
    };

    const username = useSelector((store) => store.user.username);
    const userInitials = username ? Array.from(username)[0] : ''

    const today = new Date();
    const formatToday = today.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

    let overdue = taskItems.filter((item) => item.dueDate && (new Date(item.dueDate).toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' })) < formatToday);
    const overdueLength = overdue && overdue.length > 0 ? overdue.length : 0;

    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <SideBarBtn />
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <a href="#my_modal_category" className="btn">+Add New Category</a>
                </div>
                <div className="form-control">
                    <a href="#my_modal_task" className="btn">+Add New Task</a>
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="badge badge-xs badge-primary indicator-item">{overdueLength}</span>
                        </div>
                    </label>

                    <div tabIndex={0} className="dropdown-content card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                        <div className="card-body">
                            <h3 className="card-title">Tasks Overdue!</h3>
                            {overdue.map((item, index) => (<p>• {item.title}</p>))}

                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                <span className="text-xs">{userInitials}</span>
                            </div>
                        </div>

                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a href="#my_modal_user_info" className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a onClick={handleLogoutClick}>Logout</a></li>
                    </ul>
                </div>
                {/* start of new task modal */}
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
                {/* end of new task modal */}
                {/*Start of new category modal */}
                <div className="modal" id="my_modal_category">
                    <div className="modal-box">
                        <div className="form-control w-full max-w-xs">
                            <h1 className="text-xl font-medium">Add New Category</h1>
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="categoryTitle" placeholder="Type category title here" className="input input-bordered w-full max-w-xs" value={categoryTitle} />
                        </div>
                        <div className="modal-action">
                            <a href="#" className="btn btn-sm">Close</a>
                            <a href="#" className="btn btn-sm" onClick={addCategory}>Add Category</a>
                        </div>
                    </div>
                </div>

                <div className="modal" id="my_modal_user_info">
                    <div className="modal-box">
                        <div className="form-control w-full max-w-xs">
                            <h1 className="text-xl font-medium">Profile</h1>
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input type="text" onChange={(e) => setFirstName(e.target.value)} name="firstName" placeholder="Type First Name here" className="input input-bordered w-full max-w-xs" value={firstName} />
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input type="text" onChange={(e) => setLastName(e.target.value)} name="lastName" placeholder="Type Last Name here" className="input input-bordered w-full max-w-xs" value={lastName} />
                            <label className="label">
                                <span className="label-text">Email Adress</span>
                            </label>
                            <input type="text" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Type Email Adress here" className="input input-bordered w-full max-w-xs" value={email} />
                        </div>
                        <div className="modal-action">
                            <a href="#" className="btn btn-sm">Close</a>
                            <a href="#" className="btn btn-sm" onClick={updateUser}>Update Profile</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}