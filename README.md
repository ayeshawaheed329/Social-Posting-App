# Social-Posting-App

Welcome to SocialPostingApp! 
This repository contains a full-stack social media application developed using React for the frontend and Node.js for the backend, with MongoDB as the database. The project aims to provide users with functionalities like user authentication, post creation, retrieval, and management.

## Table of Contents

- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Functionality Overview](#functionality-overview)
  - [Frontend Features](#frontend-features)
  - [Backend API Structure (RESTful)](#backend-api-structure-restful)
- [Usage](#usage)


## Introduction

SocialPostingApp is a full-stack social media platform that enables users to create, show and delete posts. The essence of project is to utilize MERN stack to achieve real-world functionality.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **HTTP Requests**: Axios (frontend)
- **Database Interaction**: Mongoose (backend)
- **Authentication**: JWT token
- **Password Encryption**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger


### Frontend Features

- **Sign Up**: Allows users to register, creating a new account.
- **Login**: Authenticates users and generates JWT tokens for subsequent requests.
- **View Posts**: Displays a list of posts belonging to the logged-in user.
- **Create Post**: Enables users to create new posts.
- **Delete Post**: Provides the ability to delete user-specific posts.

### Backend API Structure (RESTful)

- **User Signup API**: Registers users, encrypts passwords using bcryptjs.
- **User Login API**: Generates JWT tokens for authentication.
- **Get Posts API**: Retrieves a paginated list of user-specific posts.
- **Create, Update, Delete Post APIs**: Allows CRUD operations on user posts.
- **Get Post by ID API**: Fetches specific posts for detailed view.
- **Input Validation**: Uses express-validator for user input validation.

## Usage

1. **Setup**:
   - Clone the repository.
   - Install dependencies using `npm install`.
   - Set up MongoDB and configure connection settings.

2. **Frontend**:
   - Navigate to the `frontend` directory.
   - Run `npm start` to start the React application.

3. **Backend**:
   - Navigate to the `backend` directory.
   - Run `npm start` to launch the Node.js server.

4. **Access**:
   - Open the browser and visit `http://localhost:3000` to access the application.




