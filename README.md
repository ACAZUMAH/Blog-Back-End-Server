# Blog Back-End Server

This project provides the back-end infrastructure for a blog platform where users can sign up, log in, create posts, like posts, comment on posts, update or delete their posts and comments, follow or unfollow other users, and like or unlike posts.

## Features
- **User Authentication**:
  - Users can sign up and log in.
  - Secure password handling with encryption.
  
- **Post Management**:
  - Create, read, update, and delete posts.
  - Like and unlike posts.

- **Comment Management**:
  - Add, update, and delete comments on posts.
  
- **User Management**:
  - Update user profiles.
  - Follow and unfollow other users.

## Installation

### System Requirements
- **Operating System**: Any OS with Node.js 14+ and npm 6+ support.
- **Dependencies**: Listed in the `package.json` file.

### Steps to Install
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ACAZUMAH/blog-backend-server.git
   cd blog-backend-server

2. **Install Dependencies**:
  ```bash
   npm install

3. **Set Up the Database**:
   Make sure you have MySQL installed and running.
   Create a new database for the project.

4. **Run Migrations**:
  If you are using a migration tool like sequelize or typeorm, run the necessary migration command. For example, with typeorm:
    npm run typeorm migration:run

5. **start server**
  ```bash
   npm start

## Usage
-**Authentication**
  -sign-up:
    Endpoint: `POST /blog/sign-up
    Resquest body:
    {
       "name": "yourname",
       "username": "yourusername",
       "email": "youremail@example.com",
       "password": "yourpassword"
    }

  -Log In:
    Endpoint: POST /api/log-in
    Resquest body:
    {
       "email": "youremail@example.com",
       "password": "yourpassword" 
    }

  -View profile:
    Endpoint : GET /blog/profile?username={usernname}

  -view other users:
   Endpoint: GET /blog/view-users

## Post Management 
  -Create post:
    Endpoint: POST /blog/post?username={username}
    Request body:
    {
      "title": "post title",
      "body": "post body",
      "summary": "post summary" 
    }

  -Get all Posts:
    Endpoint: GET /blog/view-post

  -Get your own post or a different user post
    Endpoint: GET /blog/view-post?username={username}

  -Update a post 
    Endpoint: PUT /blog/update?username={username}&post_Id={post_Id}
    Request body:
    {
      "title": "post title",
      "body": "post body",
      "summary": "post summary" 
    }
    Endpoint: PATCH /blog/update?username={username}&post_Id={post_Id}
    {
      "title": "post title",
      "body": "post body",
      "summary": "post summary" 
    }
  
  

  
  



## Follow Management
  -Follow a User:
    Endpoint: POST /blog/follow?username={username}&follow={username}
  -Unfollow a User:
    Endpoint: DELETE /blog/unfollow?username={username}&unfollow={username}