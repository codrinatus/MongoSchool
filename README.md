# MongoSchool
A React and Node.js web app for school management, featuring user authentication, MongoDB integration, and Swagger API documentation.

## Instructions to Run the Backend/Frontend

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the backend server:

    ```bash
    npm run start
    ```

The backend server will be running at `http://localhost:3001`.

The frontend development server will be running at `http://localhost:3000`.

## Usage

- Visit the default page at `http://localhost:3000`.

1. **Default Page:**

    - If you don't have an account, click on the "Register" button under the login form to create one.

    - Press the "Login" button and log in using your credentials.

    - Explore the following functionalities:

2. **Swagger UI Documentation:**

    - Press the "Swagger UI" button to access additional documentation for the backend API at [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

3. **After Logging In:**

    - Select a collection from the dropdown menu.

    - Press the "Display Entries" button to view all entries in the selected collection.

    - To add a new entry, complete all attributes in the form.

    - Press the "Insert" button to add the new entry to the selected collection.


## Additional Notes

- Ensure that MongoDB is installed and running locally, as the backend relies on it.


