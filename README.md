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
   ```


3. **Set Up the Database**:
   - Make sure you have MySQL installed and running.
   - Create a new database for the project.
   - Set up your database URL in the environment variables. Create a `.env` file in the root directory and add the following:
     ```
     DATABASE_URL=your-database-url
     ```


4. **Run Migrations**:
   - If you are using a migration tool like `sequelize` or `typeorm`, run the necessary migration command. For example, with `typeorm`:
     ```bash
     npm run typeorm migration:run
     ```


6. **Start the Server**:
   ```bash
   npm start
   ```

## Usage

### Authentication
  - **sign Up**:
    - Endpoint: `POST /blog/sign-up`
    - Resquest body:
      ```json
      {
        "name": "yourname",
        "username": "yourusername",
        "email": "youremail@example.com",
        "password": "yourpassword"
      }
      ```

  - **Log In**:
    - Endpoint: `POST /blog/log-in`
    - Resquest body:
      ```json
      {
        "email": "youremail@example.com",
        "password": "yourpassword" 
      }
      ```

  - **View profile**:
    - Endpoint : `GET /blog/profile?username={usernname}`

  - **view other users**:
    - Endpoint: `GET /blog/view-users`

### Post Management 
  - **Create post**:
    - Endpoint: `POST /blog/post?username={username}`
    - Request body:
      ```json
      {
        "title": "post title",
        "body": "post body",
        "summary": "post summary" 
      }
      ```

  - **Get all Posts**:
    - Endpoint: `GET /blog/view-post`

  - **Get your own post or a different user post**:
    - Endpoint: `GET /blog/view-post?username={username}`

  - **Update a post**: 
    - Endpoint: `PUT /blog/update?username={username}&post_Id={post_Id}`
    - Request body:
      ```json
      {
        "title": "post title",
        "body": "post body",
        "summary": "post summary" 
      }
      ```
    - Endpoint: `PATCH /blog/update?username={username}&post_Id={post_Id}`
    - Request body:
      ```json
      {
        "title": "post title",
        "body": "post body" 
      }
      ```
    
  - **Delete a Post**:
    - Enpoint: `DELETE /blog/delete-post?username={username}&post_Id={post_Id}`

  - **Like a Post**:
    - EndPoint: `POST /blog/like?username={username}&post_Id={post_Id}`
  
  - **Unlike a Post**:
    - EndPoint: `DELETE /blog/unlike?username={username}&post_Id={post_Id}`

  - **View likes of a Post**:
    - Endpoint: `GET /blog/likes?post_Id={post_Id}`

### Comment Management
  - **Add Comment**:
    - Endpoint: `POST /blog/comment-on-post?username={username}&comment_Id={comment_Id}&post_Id={post_Id}`
    - Request Body:
      ```json
      {
        "comment": "your comment" 
      }
      ```

  - **Update a comment**:
    - Endpoint: `PUT /blog/update-comment?username={username}&post_Id={post_Id}`
    - Request Body:
      ```json
      {
        "comment": "new comment"
      }
      ``` 

  - **View Comments of a Post**:
    - Endpoint: `GET /blog/view-post/comments?post_Id={post_id}`
  
  - **Delete a comment**:
    - Endpoint: `DELETE /blog/delete-comment?username={username}&comment_Id={comment_Id}`

### User Management 
  - **Update profile name**:
    - EndPoint: `PATCH /blog/update/profile-name?username={username}`
    - Request Body:
      ```json
      {
        "name": "your new name",
        "email": "your email",
        "password": "your password"
      }
      ```

  - **Update email**:
    - EndPoint: `PATCH /blog/update/email?username={username}`
    - Request Body:
      ```json
      {
        "old email": "your old email",
        "new email": "your new email",
        "password": "your Password"
      }
      ``` 
  - **Delete account**:
    - Endpoint: `DELETE /blog/delete-account?username={username}`
    - Request Body:
      ```json
      {
        "email": "your email",
        "password": "your password"
      }
      ```

### Follow Management
  - **Follow a User**:
    - Endpoint: `POST /blog/follow?username={username}&follow={username}`
  - **Unfollow a User**:
    - Endpoint: `DELETE /blog/unfollow?username={username}&unfollow={username}`
  
## Examples

### Creating a New Post
To create a new post, send a `POST` request to the `/blog/post?username={username}` endpoint with the following JSON body:
```json
{
  "title": "My First Post",
  "body": "This is the content of my first post!",
  "summary": "summary of the post"
}
```

### Commenting on a Post
To add a comment to a post, send a `POST` request to the `/blog/comment-on-post?username={username}&post_Id={post_Id}` endpoint with the following JSON body:
```json
{
  "comment": "Great post!"
}
```

### Following a User
To follow a user, send a `POST` request to the `POST /blog/follow?username={username}&follow={username}` endpoint.

### Unfollowing a User
To unfollow a user, send a `DELETE` request to the `/blog/unfollow?username={username}&unfollow={username}` endpoint.

### Liking a Post
To like a post, send a `POST` request to the `/blog/like?username={username}&post_Id={post_Id}` endpoint.

### Unliking a Post
To unlike a post, send a `DELETE` request to the `/blog/unlike?username={username}&post_Id={post_Id}` endpoint.

## Contributing

We welcome contributions! Please follow these guidelines to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

### Reporting Issues
Please use the GitHub issue tracker to report any bugs or request new features.

## Additional Information

For any further questions or assistance, please contact me at calebazumah9@gmail.com
