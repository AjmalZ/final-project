import React from "react"; // Import required modules from React
import { Link } from "react-router-dom"; // Import the Link component from React Router

const NotFound = () => {

    return (
        <>
            <p>
                <Link to="/login">GO TO LOGIN</Link> // Render a link that navigates to the "/login" route when clicked
            </p>
            <p>
                <Link to="/">GO TO MAIN</Link> // Render a link that navigates to the "/" (root) route when clicked
            </p>
            <p>Sorry, nothing here...</p> // Render a paragraph with the text "Sorry, nothing here..."
        </>
    );
}

export default NotFound;
