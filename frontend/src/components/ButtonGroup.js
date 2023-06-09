import React from 'react';


export const ButtonGroup = ({ filterByCategory, setFilterByCategory }) => {

    const handleButtonClick = (value) => {
        if (filterByCategory.includes(value)) {
            setFilterByCategory(filterByCategory.filter((btn) => btn !== value));
        } else {
            setFilterByCategory([...filterByCategory, value]);
        }
    };

    return (
        <div className="flex-col">
            <div className="filterText flex justify-center">
                <h1>Filter by priority:</h1>
            </div>
            <div className="flex flex-col justify-center mt-3 mb-10">
                <label className="form-control w-52 cursor-pointer label">
                    <span className="label-text">Low</span>
                    <input
                        type="checkbox"
                        className="toggle w-16 toggle-info"
                        checked={filterByCategory.includes(1)}
                        onChange={() => handleButtonClick(1)}
                    />
                </label>
                <label className="form-control w-52 cursor-pointer label">
                    <span className="label-text">Medium</span>
                    <input
                        type="checkbox"
                        className="toggle w-16 toggle-warning"
                        checked={filterByCategory.includes(2)}
                        onChange={() => handleButtonClick(2)}
                    />
                </label>
                <label className="form-control w-52 cursor-pointer label">
                    <span className="label-text">High</span>
                    <input
                        type="checkbox"
                        className="toggle w-16 toggle-error"
                        checked={filterByCategory.includes(3)}
                        onChange={() => handleButtonClick(3)}
                    />
                </label>
            </div>
        </div>

    )
}