import React from 'react';
import { useDispatch } from 'react-redux';
import { user } from 'reducers/User';
import { SideBarBtn } from './SideBarBtn';


export const TopBar = ({ addTask, categories, taskTitle, taskMessage, taskCategory, setTaskTitle, setTaskCategory, setTaskMessage, setCategoryTitle, categoryTitle, addCategory }) => {
    const dispatch = useDispatch();

    const handleLogoutClick = () => {
        dispatch(user.actions.setAccessToken(null));
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setUserId(null));
    };
    const handleChange = (event) => {
        setTaskCategory(event.target.value)
    };

    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <SideBarBtn />
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <label htmlFor="my_modal_category" className="btn">+Add New Category</label>
                </div>
                <div className="form-control">
                    <label htmlFor="my_modal_task" className="btn">+Add New Task</label>
                </div>
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span className="text-xs">AA</span>
                            </div>
                        </div>

                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogoutClick}>Logout</a></li>
                    </ul>
                </div>
                {/* start of new task modal */}
                <input type="checkbox" id="my_modal_task" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <div className="form-control w-full max-w-xs">
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
                        <button className="btn btn-block" onClick={addTask}>Add Task</button>
                    </div>
                    <label className="modal-backdrop" htmlFor="my_modal_task">Close</label>
                </div>
                {/* end of new task modal */}
                {/*Start of new category modal */}
                <input type="checkbox" id="my_modal_category" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="categoryTitle" placeholder="Type category title here" className="input input-bordered w-full max-w-xs" value={categoryTitle} />
                        </div>
                        <button className="btn btn-block" onClick={addCategory}>Add Category</button>
                    </div>
                </div>
            </div>
        </div>
    )
}