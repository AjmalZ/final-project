import React from 'react';

export const CategoryColumn = ({ category, updateCategory, setCategoryTitle, setCategoryInactive }) => {

    const update = (event) => {
        updateCategory(category._id)
    }

    return (
        <div key={category._id}>
            {/* The button to open modal */}
            <a href={"#" + category._id}><h1 className="text-xl ">{category.title}</h1><svg class="h-8 w-8 text-black" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg></a>
            <div className="modal" id={category._id}>
                <div className="modal-box">
                    <button className="btn btn-square btn-ghost absolute top-0 right-0 h-16 w-16">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input type="text" onChange={(e) => setCategoryTitle(e.target.value)} name="title" placeholder="Type here" className="input input-bordered w-full max-w-xs" defaultValue={category.title} />
                    </div>
                    gör en checkbox och anropa setCategoryInactive om man bockar i den så categoryInactive blir true.
                    <input type="checkbox" defaultChecked={category.inactive} onChange={(e) => setCategoryInactive(e.target.value)} />
                    <div className="modal-action">
                        <a href="#" className="btn btn-sm">Close</a>
                        <a href="#" className="btn btn-block" onClick={update}>Update Category</a>
                    </div>
                </div>
            </div>
        </div >
    )
}