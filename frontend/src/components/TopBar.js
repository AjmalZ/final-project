import React from 'react';
import { useDispatch } from 'react-redux';
import { user } from 'reducers/User';
import { SideBarBtn } from './SideBarBtn';


export const TopBar = () => {
    const dispatch = useDispatch();

    const handleLogoutClick = () => {
        dispatch(user.actions.setAccessToken(null));
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setUserId(null));
    };
    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <SideBarBtn />
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered" />
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
            </div>
        </div>
    )
}