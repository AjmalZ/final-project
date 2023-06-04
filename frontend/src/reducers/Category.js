import { createSlice } from "@reduxjs/toolkit"; // Import the createSlice function from Redux Toolkit

export const category = createSlice({
    name: "category", // Specify the name of the slice
    initialState: {
        items: [], // Initialize the items array to an empty array
        error: null // Initialize the error to null
    },
    reducers: {
        setError: (store, action) => { // Define a reducer function named setError
            store.error = action.payload // Update the error state with the payload value from the action
        },
        setItems: (store, action) => { // Define a reducer function named setItems
            store.items = action.payload // Update the items state with the payload value from the action
        }
    }
});

