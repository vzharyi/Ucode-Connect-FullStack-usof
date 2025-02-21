# USOF Frontend

>QFlow is an intuitive and efficient web platform designed for managing and interacting with various IT-related posts. It provides a user-friendly environment for both creators and consumers of technical content, allowing users to ask questions, post solutions, and engage with others' insights. The platform also supports real-time discussions through comments, allowing users to share their opinions and solutions in a collaborative way. QFlow helps to streamline knowledge-sharing in the IT community by offering features like liking posts, adding to favorites, and providing authentication for user management.

---

## Technologies
- `React` — is the core library for building the user interface of QFlow. It allows for the creation of dynamic and interactive UI components, providing a smooth and responsive experience for users;
- `Redux` — is used for state management. It helps to manage and centralize the application’s state, making it easier to maintain and share data across different components;
- `Axios` — is used to make HTTP requests to the backend. It simplifies sending asynchronous requests for data, including user authentication, fetching posts, comments, and handling other server-side interactions;
- `React Router` — is used for navigation within the app. It enables seamless navigation between different pages, allowing users to easily access different sections of the platform without reloading the page.

## Setup and Installation

1. **Clone the repository for backend part.**
   ```bash
   git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/vzharyi.git
   ```

2. **Customize the [config/config.json](config/config.json) file. Change the user and password to your existing user. Example:**
   ```
   "user": "vzharyi"
   "password": "securepass"
   ```

3. **Install the dependencies for backend part.**
   ```bash
   npm install
   ```

4. **Run the command MySQL:**
   ```
   mysql -u {USER_NAME} -p < config/db.sql. 
   ```
   You need to enter your login, press enter, and provide your MySQL password.

5. **Start the server for backend part.**
   ```bash
   npm run start
   ```

6. **Clone the repository for frontend part.**
   ```bash
   git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-frontend/vzharyi.git
   ```

7. **Install the dependencies for frontend part.**
   ```bash
   npm install
   ```

8. **Start the server for frontend part.**
   ```bash
   npm run start
   ```
Access the API at http://localhost:8080

Access the Client at http://localhost:3000

Admin panel is available at http://localhost:8080/admin

---

## Frontend Documentation

### Registration
- Users must provide the following details during registration:
    - **Full Name**
    - **Username**
    - **Email**
    - **Password**
    - **Confirm Password**
- Once the user registers, a **verification email** is sent to the provided email address to confirm the email.

### Login
- Users can log in with their registered **username** and **password**.
- If they forget their password, they can request a **password reset**, and a reset link will be sent to their email.

### Authentication Restrictions
- Without authentication, users can only:
    - View posts
    - Browse public content
- Once logged in, users gain the following privileges:
    - **Create new posts**
    - **Edit their own posts**
    - **Delete their posts**
    - **Select categories for posts**
    - **Comment on posts** that are not blocked
    - **Like posts and comments**
    - **Reply to comments**
    - **Add posts to favorites**
    - **Update their profile information** and **change their profile picture**

### Admin Permissions
- Admins can:
    - **Delete all posts**, including blocked ones
- Admins **cannot**:
    - Edit posts
    - Edit user data
    - Edit comments
- Admins can **create categories**.