# MongoSchool
A React and Node.js (Express) web app for school management, featuring user authentication, MongoDB integration, and Swagger API documentation.

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

## Backend Overview

### Middleware - Verify Token

I've implemented a middleware called `verifyToken` to ensure that there is a valid authentication token before accessing the routes for the Liceu database. This middleware checks for the presence and validity of the token in the HTTP headers, providing an extra layer of security for the API.

### Routes

- **/api/auth:** Handles user authentication. On successful login, it returns a JWT token.

- **/api/register:** Allows users to register by creating a new account.

- **/api/profesori:** Provides routes to manage and retrieve information about professors.

- **/api/elevi:** Manages and retrieves data related to students.

- **/api/clase:** Handles operations related to school classes.

- **/api/note:** Manages the recording and retrieval of student grades.

More details in the Swagger Doc.

## Frontend Overview

### `App.js`

The main component orchestrating the application flow. It includes the Login, Register, and Main components. It handles the switching between login/register forms and the main application page after successful login.

### `Login.js`

Responsible for user authentication. Users can log in with their credentials, and on successful login, they are redirected to the main application page. Additionally, there is a button to navigate directly to the Swagger UI documentation.

### `Main.js`

The main application page where users can select a collection (Elevi,Profesori,Note,Clase) and either display all entries or insert new ones. It dynamically fetches and displays entries based on the selected collection. Users can also insert new entries with form inputs.

### `Register.js`

Allows users to register by providing a username and password. The registration status is displayed on the page.

### `index.js`

The entry point for rendering the React application.

## Additional Notes

- Ensure that MongoDB is installed and running locally, as the backend relies on it.


