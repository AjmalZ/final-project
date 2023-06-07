import React from 'react';
import { API_URL } from 'utils/urls';
import { useDispatch } from 'react-redux';

export const CategoryColumn = ({ cat, updateCategory, setCategoryTitle, categories, accessToken, category }) => {
    const dispatch = useDispatch();
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
    return (
        <div key={cat._id}>
            {/* The button to open modal */}
            <a href={"#" + cat._id}><h1 className="text-xl ">{cat.title}</h1><svg class="h-8 w-8 text-black" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg></a>
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
                        <a href="#" className='btn btn-sm' onClick={() => { if (window.confirm('Are you sure you want to delete this category?')) deleteCategory(cat._id) }}>Delete</a>
                        <a href="#" className="btn btn-sm" onClick={update}>Update Category</a>
                    </div>
                </div>
            </div>
        </div >
    )
}