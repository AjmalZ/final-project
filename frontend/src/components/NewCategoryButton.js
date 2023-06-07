import React from "react";

export const NewCategoryButton = ({ categoryTitle, setCategoryTitle, addCategory }) => {
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