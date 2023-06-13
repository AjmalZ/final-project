import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from 'reducers/User';
import { API_URL } from 'utils/urls';
import { category } from 'reducers/Category';


export const NewCategoryButton = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector((store) => store.user.accessToken);
    const categories = useSelector((store) => store.category.items);
    const [categoryTitle, setCategoryTitle] = useState('');

    const addCategory = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: categoryTitle, user: user._id }),
        };
        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(category.actions.setError(null));
                    setCategoryTitle("")
                    dispatch(category.actions.setItems([...categories, data.response]));
                } else {
                    dispatch(category.actions.setError(data.error));
                }
            });
    };
    return (
        <div>
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