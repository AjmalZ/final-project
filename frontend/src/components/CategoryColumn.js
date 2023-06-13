import React, { useState } from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch } from 'react-redux';

export const CategoryColumn = ({ cat, updateCategory, setCategoryTitle, categories, accessToken, category, taskItems }) => {
    const dispatch = useDispatch();
    const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
    const update = (event) => {
        updateCategory(cat._id)
    }
    const deleteCategory = (categoryId) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };
        fetch(API_URL(`category/${categoryId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(category.actions.setError(null));
                    dispatch(category.actions.setItems([...categories.filter(item => item._id !== categoryId)]));
                } else {
                    dispatch(category.actions.setError(data.error));
                }
            });
    };
    const filteredTasks = taskItems.filter(item => item.category === cat._id);

    const handleCategoryDelete = () => {
        setShowCategoryDeleteModal(true);
    };

    const handleConfirmCategoryDelete = () => {
        deleteCategory(cat._id);
        setShowCategoryDeleteModal(false);
    };

    const handleCancelCategoryDelete = () => {
        setShowCategoryDeleteModal(false);
    };

    return (
        <div key={cat._id}>
            {/* The button to open modal */}
            <div className="flex justify-between items-center">
                <a href={"#" + cat._id} className="flex w-full">
                    <h1 className="text-xl w-fit mb-10 font-medium text-black">{cat.title}</h1>
                    <svg className="h-6 w-6 mt-1 ml-2 text-black" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>

                </a>
                <div className="mb-10 text-xl text-black">
                    ({filteredTasks.length})
                </div>
            </div>
            <div className="modal" id={cat._id}>
                <div className="modal-box">
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={cat.title} />
                    </div>
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href="#" className="btn btn-sm" onClick={handleCategoryDelete}>Delete</a>
                        <a href="#" className="btn btn-sm" onClick={update}>Update Category</a>
                    </div>
                </div>
            </div>
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
        </div >
    )
}