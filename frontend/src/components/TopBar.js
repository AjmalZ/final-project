import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from 'reducers/User';
import { SideBarBtn } from './SideBarBtn';
import { ProfileModal } from './ProfileModal';
import logo from '../logo/logo.png';

export const TopBar = ({
    taskItems,
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
        localStorage.removeItem('accessToken');
    };


    const username = useSelector((store) => store.user.username);
    const userInitials = username ? Array.from(username)[0] : ''

    const today = new Date();
    const formatToday = today.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' });

    let overdue = taskItems.filter((item) => item.dueDate && (new Date(item.dueDate).toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' })) < formatToday);
    const overdueLength = overdue && overdue.length > 0 ? overdue.length : 0;

    return (
        <div className="navbar bg-base-300">
            <div className="flex-1 gap-6">
                <SideBarBtn />
                <img className="headerLogo w-1/6" src={logo} alt="header logo" />
            </div>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn  btn-ghost btn-circle mr-4">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
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
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-11">
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

                <div className="modal" id="my_modal_user_info">
                    <ProfileModal firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} updateUser={updateUser} />
                </div>
            </div>
        </div>
    )
}