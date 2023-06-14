import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from 'reducers/User';
import { API_URL } from 'utils/urls';
import { category } from 'reducers/Category';

// Component for a button to add a new category
export const NewCategoryButton = () => {
    const dispatch = useDispatch();

    // Get the access token from the Redux store
    const accessToken = useSelector((store) => store.user.accessToken);

    // Get the list of categories from the Redux store
    const categories = useSelector((store) => store.category.items);

    // State for the category title
    const [categoryTitle, setCategoryTitle] = useState('');

    // Function to add a new category
    const addCategory = () => {
        // Prepare the request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: categoryTitle, user: user._id }),
        };

        // Send the POST request to add a new category
        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the Redux store and reset the category title
                    dispatch(category.actions.setError(null));
                    setCategoryTitle("");
                    dispatch(category.actions.setItems([...categories, data.response]));
                } else {
                    // If the API call fails, update the error state in the Redux store
                    dispatch(category.actions.setError(data.error));
                }
            });
    };

    return (
        <div>
            {/* New category modal */}
            <div className="modal" id="my_modal_category">
                <div className="modal-box">
                    <div className="form-control w-full max-w-xs">
                        <h1 className="text-xl font-medium">Add New Category</h1>
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="categoryTitle" placeholder="Type category title here" className="input input-bordered w-full max-w-xs" value={categoryTitle} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href="#" className="btn btn-sm" onClick={addCategory}>Add Category</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
