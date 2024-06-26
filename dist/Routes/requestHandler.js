const querystring = require('querystring')
const route = require('./router')
 
function handlePostRequest(req, res){
    const pathname = req.url
    let username
    let post_Id
    // endpoint for signing in
    if(pathname === '/blog/sign-up'){
       return route.handleAccountCreation(req, res)
    // endpoint pfor loging in 
    }else if(pathname === '/blog/log-in'){
        return route.handleLogin(req, res)
    //endpoint for creating a point
    }else if(pathname.match(/\/blog\/post\?username=([0-9a-zA-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        return route.makeApost(req, res, username)
    // endpoint for a creating a follow
    }else if(pathname.match(/\/blog\/follow\?username=([0-9a-zA-Z]+)&follow=([0-9a-zA-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        const userTofollow = queryparam.follow 
        return route.addfollow(req, res, username, userTofollow)
    // endpoint for creating a comment 
    }else if(pathname.match(/\/blog\/comment-on-post\?username=([0-9a-zA-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username 
        post_Id = queryparam.post_Id
        return route.commentOnPost(req,res,username,post_Id)
    // endpoint to like a post
    }else if(pathname.match(/\/blog\/like-post\?username=([0-9a-zA-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const like = true 
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        post_Id = queryparam.post_Id
        return route.likePost(req,res,username,post_Id,like)
    }else{
        res.writeHeader(400, { "content-type": "application/json"})
        res.end(JSON.stringify({"Bad Request": "unrecognized request path"}))
    }
}

function handleGetRequest(req, res){
    const pathname = req.url
    let username
    let post_Id
    //endpoint for viewing profile
    if(pathname.match(/\/blog\/profile\?username=([0-9a-zA-Z]+)/)){
        const queryparam  = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        return route.returnProfileInfo(req,res,username)
    //endpoint for viewing users on the blog
    }else if(pathname === '/blog/view-users'){
        return route.returnAllUsers(req,res)
    //endpoint for viewing posts on the blog
    }else if(pathname === '/blog/view-post'){
        return route.returnAllPosts(req, res)
    //endpoint for viewing comments of a post
    }else if(pathname.match(/\/blog\/view-post\/comments\?post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id  
        return route.viewPostComments(req, res, post_Id)
    //endpoint for viewing likes of a post
    }else if(pathname.match(/blog\/likes\?post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id
        return route.likes(req,res,post_Id)
    // endpoint for a viewing user post
    }else if(pathname.match(/\/blog\/view-post\?username=([0-9a-zA-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username 
        return route.returnUserPost(req, res, username)
    // endpoint for a owner of a post to view comments
    }else if(pathname.match(/\/blog\/([0-9a-zA-Z]+)\/post\/comments\?post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id
        return route.viewPostComments(req, res, post_Id)
    }else{
        res.writeHead(400,{ "content-type": "application/json"})
        res.end(JSON.stringify({"Bad Request": "unrecognized request path"}))
    }
}

function handlePutRequest(req,res){
    const pathname = req.url
    let post_Id
    let username
    let commentId
    //endpoint for updating a post
    if(pathname.match(/\/blog\/update\?username=([0-9a-zA-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id
        username = queryparam.username
        return route.updatePost(req,res,username,post_Id)
    //endpoint for updating a comment
    }else if(pathname.match(/\/blog\/update-comment\?username=([0-9a-zA-Z]+)&comment_Id=([0-9]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id
        username = queryparam.username
        commentId = queryparam.comment_Id
        return route.updateComment(req,res,username,post_Id,commentId)
    }else{
        res.writeHead(400,{ "content-type": "application/json"})
        res.end(JSON.stringify({"Bad Request": "unrecognized request path"}))
    }
}

function handlePatchRequest(req,res){
    const pathname = req.url
    let post_Id
    let username
    //enndpoint for patching a post
    if(pathname.match(/\/blog\/update\?username=([0-9a-zA-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        post_Id = queryparam.post_Id
        username = queryparam.username
        return route.updatepart(req,res,username,post_Id)
    // enpoint for updating profile name
    }else if(pathname.match(/\/blog\/update\/profile-name\?username=([0-9a-zA-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        return route.updateprofile(req,res,username)
    // enpoint for updating email
    }else if(pathname.match(/\/blog\/update\/email\?username=([0-9a-zA-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        return route.updateEmail(req,res,username)
    }else{
        res.writeHead(400,{ "content-type": "application/json"})
        res.end(JSON.stringify({"Bad Request": "unrecognized request path"}))
    }
}

function handleDeleteRequest(req,res){
    const pathname = req.url
    let username 
    let post_Id 
    //endpoint for unfollowing a user
    if(pathname.match(/blog\/unfollow\?username=([0-9a-zA-Z]+)&unfollow=(([0-9a-zA-Z]+))/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        const tounfollow = queryparam.unfollow 
        return route.unfollow(req,res,username,tounfollow)
    // endpoint for deleting a post
    }else if(pathname.match(/\/blog\/delete-post\?username=([0-9a-z-A-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        post_Id = queryparam.post_Id
        return route.deletePost(req,res,username,post_Id)
    //endpoint for unliking a post
    }else if(pathname.match(/\/blog\/unlike\?username=([0-9a-z-A-Z]+)&post_Id=([0-9a-fA-F-]+)$/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        post_Id = queryparam.post_Id
        return route.unlikePost(req,res,username,post_Id)
    //endpoint for deleting a comment
    }else if(pathname.match(/\/blog\/delete-comment\?username=([0-9a-z-A-Z]+)&comment_Id=([0-9]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        const commentId = queryparam.comment_Id
        return route.deleteComment(req,res,username,commentId)
    // endpoint for deleting an account
    }else if(pathname.match(/\/blog\/delete-account\?username=([0-9a-z-A-Z]+)/)){
        const queryparam = querystring.parse(pathname.split('?')[1])
        username = queryparam.username
        return route.deleteAccount(req,res,username)
    }else{
        res.writeHead(400,{ "content-type": "application/json"})
        res.end(JSON.stringify({"Bad Request": "unrecognized request path"}))
    }
}
module.exports = {
    handlePostRequest,
    handleGetRequest,
    handlePutRequest,
    handlePatchRequest,
    handleDeleteRequest
}
