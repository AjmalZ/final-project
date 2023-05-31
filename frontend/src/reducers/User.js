import { createSlice } from "@reduxjs/toolkit"; // Import the createSlice function from Redux Toolkit

export const user = createSlice({
    name: "user", // Specify the name of the slice
    initialState: {
        username: null, // Initialize the username to null
        userId: null, // Initialize the userId to null
        accessToken: null, // Initialize the accessToken to null
        error: null // Initialize the error to null
    },
    reducers: {
        setUsername: (store, action) => { // Define a reducer function named setUsername
            store.username = action.payload // Update the username state with the payload value from the action
        },
        setUserId: (store, action) => { // Define a reducer function named setUserId
            store.userId = action.payload // Update the userId state with the payload value from the action
        },
        setAccessToken: (store, action) => { // Define a reducer function named setAccessToken
            store.accessToken = action.payload // Update the accessToken state with the payload value from the action
        },
        setError: (store, action) => { // Define a reducer function named setError
            store.error = action.payload // Update the error state with the payload value from the action
        }
    }
});
