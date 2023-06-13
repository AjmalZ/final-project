import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { user } from "reducers/User";
import { API_URL } from "utils/urls";
import "./Login.css";

export const Login = () => {
    // State variables for login and registration
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [mode, setMode] = useState("login");
    const [loginErrorMessage, setloginErrorMessage] = useState("");
    const [registerErrorMessage, setregisterErrorMessage] = useState("");

    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((store) => store.user.accessToken);

    // Check if user is already logged in, then redirect to home page
    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [accessToken]);

    // Handle login form submission
    const onLoginFormSubmit = (event) => {
        event.preventDefault();

        // Prepare request options
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: loginUsername.toLowerCase(), //convert username to lowercase 
                password: loginPassword
            }),
        };

        // Send login request to the server
        fetch(API_URL(mode), options)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Update user state with access token, username, and user ID
                    dispatch(user.actions.setAccessToken(data.response.accessToken));
                    dispatch(user.actions.setUsername(data.response.username));
                    dispatch(user.actions.setUserId(data.response.id));
                    localStorage.setItem('accessToken', data.response.accessToken);
                    localStorage.setItem('username', data.response.username);
                    localStorage.setItem('userId', data.response.id);
                    dispatch(user.actions.setError(null));
                    navigate("/"); // Redirect to home page
                } else {
                    // Handle login error
                    dispatch(user.actions.setAccessToken(null));
                    dispatch(user.actions.setUsername(null));
                    dispatch(user.actions.setUserId(null));
                    dispatch(user.actions.setError(data.response));
                    setloginErrorMessage(data.response);

                }
            });
    };

    // Handle registration form submission
    const onRegisterFormSubmit = (event) => {
        event.preventDefault();

        // Prepare request options
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: registerUsername.toLowerCase(), //convert username to lowercase  
                password: registerPassword
            }),
        };

        // Send registration request to the server
        fetch(API_URL("register"), options)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Update user state with access token, username, and user ID
                    dispatch(user.actions.setAccessToken(data.response.accessToken));
                    dispatch(user.actions.setUsername(data.response.username));
                    dispatch(user.actions.setUserId(data.response.id));
                    dispatch(user.actions.setError(null));
                    defaultCategoryToDo(data.response.id, data.response.accessToken, "To-Do")
                    defaultCategoryToDo(data.response.id, data.response.accessToken, "In-Progress")
                    defaultCategoryToDo(data.response.id, data.response.accessToken, "Done")
                    defaultCategoryToDo(data.response.id, data.response.accessToken, "Backlog")
                    navigate("/"); // Redirect to home page
                } else {
                    // Handle registration error
                    dispatch(user.actions.setAccessToken(null));
                    dispatch(user.actions.setUsername(null));
                    dispatch(user.actions.setUserId(null));
                    dispatch(user.actions.setError(data.response));
                    setregisterErrorMessage(data.response)

                }
            });
    };


    const defaultCategoryToDo = (userId, userToken, categoryTitle) => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken,
            },
            body: JSON.stringify({ title: categoryTitle, user: userId }),
        };

        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(categoryTitle + " added successfully")

                } else {
                    console.log(data.error)
                }
            });
    }
    // Handle login button click
    const handleLoginButtonClick = () => {
        setMode("login");
    };

    // Handle register button click
    const handleRegisterButtonClick = () => {
        setMode("register");
    };


    return (
        <div className="loginContainer">
            <div className="main">
                <input type="checkbox" id="chk" aria-hidden="true" />

                <div className="login">
                    <form className="form" onSubmit={onLoginFormSubmit}>
                        <label className="signUpLabel" htmlFor="chk" aria-hidden="true">Login</label>
                        <input
                            className="input"
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoComplete="off"
                            value={loginUsername}
                            onChange={(event) => setLoginUsername(event.target.value)}
                            required
                        />
                        <input
                            className="input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            value={loginPassword}
                            onChange={(event) => setLoginPassword(event.target.value)}
                            required
                        />
                        <button className="submitBtn" type="submit" value="Sign In" onClick={handleLoginButtonClick}>
                            Login
                        </button>
                        {loginErrorMessage && <div className="alert alert-warning justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p>{loginErrorMessage}</p>
                        </div>}
                    </form>
                </div>

                <div className="signup">
                    <form className="form" onSubmit={onRegisterFormSubmit}>
                        <label className="signUpLabel" htmlFor="chk" aria-hidden="true">Register</label>
                        <input
                            className="input"
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoComplete="off"
                            value={registerUsername}
                            onChange={(event) => setRegisterUsername(event.target.value)}
                            required
                        />
                        <input
                            className="input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            value={registerPassword}
                            onChange={(event) => setRegisterPassword(event.target.value)}
                            required
                        />
                        <button className="submitBtn" type="submit" value="Register" onClick={handleRegisterButtonClick}>
                            Register
                        </button>
                        {registerErrorMessage && <div className="alert alert-warning justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p>{registerErrorMessage}</p>
                        </div>}
                    </form>
                </div>
            </div>

        </div>
    );

};