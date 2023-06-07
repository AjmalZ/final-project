import React from 'react';

export const ProfileModal = ({ firstName, setFirstName, lastName, setLastName, email, setEmail, updateUser }) => {
    return (
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
    );
};