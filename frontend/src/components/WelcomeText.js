import React from "react";
import { useSelector } from 'react-redux';

export const WelcomeText = () => {

    const username = useSelector((store) => store.user.username);

    return (
        <h2 className="my-4">
            {username ? <p className="text-xl font-medium text-black">Welcome {username.toUpperCase()}</p> : ''}
        </h2>
    )



}