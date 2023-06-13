import React from "react";

export const WelcomeText = ({ username }) => {
    return (
        <h2 className="my-4">
            {username ? <p className="text-xl font-medium text-black">Welcome {username.toUpperCase()}</p> : ''}
        </h2>
    )



}