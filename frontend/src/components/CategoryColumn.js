import React, { useState } from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { category } from 'reducers/Category';

// Component to render a category column
export const CategoryColumn = ({ cat, taskItems }) => {
    const dispatch = useDispatch();
    const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);

    // Get the list of categories from the Redux store
    const categories = useSelector((store) => store.category.items);

    // Get the access token from the Redux store
    const accessToken = useSelector((store) => store.user.accessToken);

    // State for the category title
    const [categoryTitle, setCategoryTitle] = useState('');

    // Function to update the category
    const update = (event) => {
        updateCategory(cat._id);
    };

    // Function to update the category in the backend
    const updateCategory = (categoryId) => {
        // Prepare the request options
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: categoryTitle }),
        };

        // Send the PATCH request to update the category
        fetch(API_URL(`category/${categoryId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the category in the Redux store
                    dispatch(category.actions.setError(null));
                    const tempCategories = categories.map((item) => {
                        return { ...item, title: item._id === categoryId ? categoryTitle : item.title };
                    });
                    dispatch(category.actions.setItems([...tempCategories]));
                } else {
                    // If the API call fails, update the error state in the Redux store
                    dispatch(category.actions.setError(data.error));
                }
            });
    };

    // Function to delete the category
    const deleteCategory = (categoryId) => {
        // Prepare the request options
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };

        // Send the DELETE request to delete the category
        fetch(API_URL(`category/${categoryId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, remove the category from the Redux store
                    dispatch(category.actions.setError(null));
                    dispatch(category.actions.setItems([...categories.filter(item => item._id !== categoryId)]));
                } else {
                    // If the API call fails, update the error state in the Redux store
                    dispatch(category.actions.setError(data.error));
                }
            });
    };

    // Filter the tasks based on the category ID
    const filteredTasks = taskItems.filter(item => item.category === cat._id);

    // Function to handle category delete modal
    const handleCategoryDelete = () => {
        setShowCategoryDeleteModal(true);
    };

    // Function to confirm category deletion
    const handleConfirmCategoryDelete = () => {
        deleteCategory(cat._id);
        setShowCategoryDeleteModal(false);
    };

    // Function to cancel category deletion
    const handleCancelCategoryDelete = () => {
        setShowCategoryDeleteModal(false);
    };

    return (
        <div key={cat._id}>
            {/* The button to open modal */}
            <div className="flex justify-between items-center">
                <a href={"#" + cat._id} className="flex w-full">
                    <h1 className="text-xl w-fit mb-10 font-semibold text-black ">{cat.title}</h1>
                    <svg className="h-6 w-6 mt-1 ml-2 text-black" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>
                </a>
                <div className="mb-10 text-xl text-black font-semibold">
                    ({filteredTasks.length})
                </div>
            </div>

            {/* Category update modal */}
            <div className="modal" id={cat._id}>
                <div className="modal-box">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={cat.title} />
                    </div>
                    <div className="modal-action flex justify-between">
                        <a href="#" className="btn btn-sm">Close</a>
                        <div className="flex gap-4">
                            <a href="#" className="btn btn-sm btn-error" onClick={handleCategoryDelete}>Delete</a>
                            <a href="#" className="btn btn-sm" onClick={update}>Update Category</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category delete modal */}
            <div className={showCategoryDeleteModal ? 'modal modal-open' : 'modal'} id="my_category_delete_modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete category</h3>
                    <p className="py-4">Are you sure you want to delete this category?</p>
                    <div className="modal-action">
                        <a href="#" className="btn" onClick={handleConfirmCategoryDelete}>Yes</a>
                        <a href="#" className="btn" onClick={handleCancelCategoryDelete}>No</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
