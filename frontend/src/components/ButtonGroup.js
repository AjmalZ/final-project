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
        <div className="flex justify-center">
            <button
                onClick={() => handleButtonClick(1)}
                className={filterByCategory.includes(1) ? 'btn btn-sm rounded-r-none bg-blue-500 text-black' : 'btn btn-sm rounded-r-none btn-outline '}
            >
                Low
            </button>
            <button
                onClick={() => handleButtonClick(2)}
                className={filterByCategory.includes(2) ? 'btn btn-sm rounded-none bg-yellow-500 text-black' : 'btn btn-sm rounded-none btn-outline '}
            >
                Medium
            </button>
            <button
                onClick={() => handleButtonClick(3)}
                className={filterByCategory.includes(3) ? 'btn btn-sm rounded-l-none bg-red-500 text-black' : 'btn btn-sm rounded-l-none btn-outline '}
            >
                High
            </button>
        </div>
    )
}