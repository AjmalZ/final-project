const BASE_URL = "http://localhost:8080"; // Define the base URL for the API

export const API_URL = (slug) => `${BASE_URL}/${slug}`; // Define a function called API_URL that takes a slug parameter

// The API_URL function concatenates the BASE_URL with the provided slug and returns the resulting URL string
// For example, if the slug is "users", the API_URL function will return "http://localhost:8080/users"
