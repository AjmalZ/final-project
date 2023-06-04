import React from 'react';
import { useDispatch } from 'react-redux';
import { user } from 'reducers/User';
import { SideBarBtn } from './SideBarBtn';


export const TopBar = ({ addTask, categories, taskTitle, taskDescription, taskCategory, setTaskTitle, setTaskCategory, setTaskDescription }) => {
    const dispatch = useDispatch();

    const handleLogoutClick = () => {
        dispatch(user.actions.setAccessToken(null));
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setUserId(null));
    };

    const handleSubmit = (event) => {
        addTask()
    };

    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <SideBarBtn />
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <label htmlFor="my_modal_7" className="btn">+Add New Task</label>
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

                {/* Put this part before </body> tag */}
                <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-box">
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={taskTitle} />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <input type="text" onChange={(e) => setTaskDescription(e.target.value)} name="description" placeholder="Type here" className="input input-bordered w-full max-w-xs" value={taskDescription} />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>

                                <select className="select select-bordered" onChange={(e) => setTaskCategory(e.target.value)} name="category" value={taskCategory}>
                                    {categories.map((cat) => (
                                        <option value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-block" type="submit">+Add New Task</button>
                        </div>
                        <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
                    </form>
                </div>
            </div>
        </div>
    )
}