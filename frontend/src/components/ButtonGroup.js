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
        <div className="flex justify-center ">
            <button
                onClick={() => handleButtonClick(1)}
                className={filterByCategory.includes(1) ? 'btn bg-blue-500 text-black' : 'btn btn-outline '}
            >
                Button 1
            </button>
            <button
                onClick={() => handleButtonClick(2)}
                className={filterByCategory.includes(2) ? 'btn bg-yellow-500 text-black' : 'btn btn-outline '}
            >
                Button 2
            </button>
            <button
                onClick={() => handleButtonClick(3)}
                className={filterByCategory.includes(3) ? 'btn bg-red-500 text-black' : 'btn btn-outline '}
            >
                Button 3
            </button>
        </div>
    )
}