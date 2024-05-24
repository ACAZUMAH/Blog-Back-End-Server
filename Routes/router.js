const { json } = require('node:stream/consumers')
const dbcontrol = require('../Controllers/databasecontroller.js')
const { getPostData } = require('../Controllers/readReqData.js') 
const { Post,
        returnAllPost,
        returnPostbyUsername,
        returnPostComments, 
        allUsers,
        getUserProfile,
        returnLikes } = require('../Controllers/visualize.js')
const { write } = require('fs')

async function handleAccountCreation(req,res){
    try {
        const body = await getPostData(req)
        const {name,username,email,password} = JSON.parse(body)
        await dbcontrol.signup(name,username,email,password).then((succ) =>{
            if(succ == 'Account created'){
                res.writeHead(201,{"content-type": "application/json"})
                res.end(JSON.stringify({"message": "Welcome make a post or follow others to view post"}))
            }
        }).catch((rej) =>{
            if(rej === 'account exist! try login'){
                res.writeHead(200, {"content-type": "application/json" })
                res.end(JSON.stringify({"message": "Account exist! try login"}))
            }
        })
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}
async function returnProfileInfo(req,res,username){
    try {
        const profile = await getUserProfile(username)
        if(profile){
            res.writeHead(200, {'content-type': 'application/json'})
            res.end(JSON.stringify(profile))
        }else{
            res.writeHead(404, {'content-type': 'application/json'})
            res.end(JSON.stringify({'message': 'Profile not found'}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}
async function handleLogin(req,res){
    try {
        const body = await getPostData(req)
        const { email, password } = JSON.parse(body)
        const logRes = await dbcontrol.login(email, password)
        if(logRes === 'success'){
            const redirection = await returnAllPost()
            res.writeHead(200, {"content-type": "application/json"})
            res.write(JSON.stringify({"message": "welcome back"}))
            res.end(redirection)
        }else if(logRes === 'failure'){
            res.writeHead(401, {"content-type": "application/json"})
            res.end(JSON.stringify({"message": "password mismatch"}))
        }
    }catch(rej){
        res.writeHead(404, {"content-type": "application/json"})
        res.end(JSON.stringify(rej))
    }

}

async function returnAllUsers(req,res){
    try {
        const users = await allUsers()
        if(users){
            res.writeHead(200,{"content-type": "appliaction/json"})
            res.end(users)
        }else{
            res.writeHead(500, {"content-type": "application/json"})
            res.end(JSON.stringify({"message": "Couldn't get users"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function addfollow(req, res, user,userTofollow){
    try {
        const follow = await dbcontrol.addFollowers(user,userTofollow)
        if(follow === "added"){
            return responses(res,201,{"content-type": "application/json"},{"message": "added to your followers"})
        }else{
            return responses(res,404,{"content-type":"application/json"},follow)
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}
async function makeApost(req,res,username){
    try {
        const postbody = await getPostData(req)
        const { title, body, summary } = JSON.parse(postbody)
        await dbcontrol.postData(title,body,summary,username)
        .then(async(reso)=>{
            if(reso){
                await returnPostbyUsername(username).then((post) =>{
                    res.writeHead(201,{"content-type": "application/json"})
                    res.end(JSON.stringify(post))
                }).catch((rej) =>{
                    if(rej){ 
                        res.writeHead(404,{"constent-type": "application/json"})
                        res.end(JSON.stringify({"message": rej}))
                    }
                })
            }else{
                res.writeHead(500, {"content-type": "application/json"})
                res.end(JSON.stringify({"message": "Error encounted while making the post"}))
            }
        }).catch((rej)=>{
            res.writeHead(404,{"constent-type": "application/json"})
            res.end(JSON.stringify({"message": rej}))
        })
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function returnUserPost(req,res,username){
    try {
        await returnPostbyUsername(username).then((userpost) =>{
            if(userpost){
                res.writeHead(200,{"content-type": "application/json"})
                res.end(JSON.stringify(userpost))
            }else{
                res.writeHead(404,{"content-type": "appliaction/json"})
                res.end(JSON.stringify({"message": "You don't have a post yet"}))
            }
        }).catch((rej) =>{
            res.writeHead(404,{"constent-type": "application/json"})
            res.end(JSON.stringify({"message": rej}))
        })
        
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function returnAllPosts(req,res){
    try {
        const postdata = await returnAllPost()
        if(postdata){
            res.writeHead(200,{"content-type": "application/json"})
            res.end(JSON.stringify(postdata))
        }else{
            res.writeHead(500,{"content-type": "application/json"})
            res.end(JSON.stringify({"message" : "An error encounted while fetching post"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function commentOnPost(req,res,username,post_Id){
    try {
        const comment_body = await getPostData(req)
        const { comment } = JSON.parse(comment_body)
        const postcomment = await dbcontrol.addcomment(username,comment,post_Id)
        if(postcomment){
            const post = await Post(post_Id)
            const postComments = await returnPostComments(post_Id)
            if(postComments !== undefined || postComments.length !== 0){
                res.writeHead(200, {"content-type": "application/json"})
                res.write(JSON.stringify(post))
                res.end(JSON.stringify(postComments))
            }else{
                res.writeHead(404,{"content-type": "application/json"})
                res.end(JSON.stringify({"message": "Comment not found"}))
            }
        }else{
            res.writeHead(404,{"content-type": "appliction/json"})
            res.end(JSON.stringify({"message": "comment was not added"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function likePost(req,res,username,post_Id,like){
    try {
        const likes = await dbcontrol.addLike(username,post_Id,like)
        if(likes === 'true'){
            const likedpost = await Post(post_Id)
            const likesinfo = await returnLikes(post_Id)
            res.writeHead(200,{"content-type": "application/json"})
            res.write(JSON.stringify(likedpost))
            res.end(JSON.stringify(likesinfo))
        }else{
            res.writeHead(404,{"content-type": "application/json"})
            res.end(JSON.stringify({"message": "An issue occured"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}
async function viewPostComments(req,res,post_Id){
    try {
        const post = await Post(post_Id)
        const postComments = await returnPostComments(post_Id)
        if(postComments.length !== 0 || postComments[0] !== undefined){
            res.writeHead(200,{"content-type": "application/json"})
            res.write(JSON.stringify(post))
            res.end(postComments)
        }else{
            res.writeHead(404,{"content-type": "application/json"})
            res.write(JSON.stringify(post))
            res.end(JSON.stringify({"message": "No comments yet"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}
async function likes(req,res,post_Id){
    try {
        const likesforpost = await returnLikes(post_Id)
        if(likesforpost.length !== 0 || likesforpost[0] !== undefined ){
            const post = await Post(post_Id)
            res.writeHead(200,{"content-type": "application/json"})
            res.write(JSON.stringify(post))
            res.end(JSON.stringify(likesforpost))
        }else{
           res.writeHead(404,{"content-type": "application/json"})
           res.end(JSON.stringify({"message": "No likes yet"}))
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 500
        res.end()
    }
}

async function unfollow(req,res,username,tounfollow){
    try {
        const unfollowuser = await dbcontrol.unfollowerUser(username,tounfollow)
        if(unfollowuser){
            res.writeHead(200, {"content-type": "applicatio/json"})
            res.end(JSON.stringify({"message": "removed from your followers"}))
        }
    } catch (error) {
        //console.log(error)
        res.writeHead(404, {"content-type": "application/json"})
        res.end(JSON.stringify({ "message" : error }))
    }
}

async function updatePost(req,res,username,post_Id){
    try {
        const data = await getPostData(req)
        const { title ,body, summary } = JSON.parse(data)
        const pushupdate =  await dbcontrol.makeUpdate(post_Id,title,body,summary,username)
        if(pushupdate === 'true'){
            const post = await Post(post_Id)
            res.writeHead(200,{"content-type": "application/json"})
            res.end(JSON.stringify(post))
        }

    } catch (error) {
        //console.log(error)
        res.writeHead(404, {"content-type": "application/json"})
        res.end(JSON.stringify({"message": error}))
    }
}

async function updatepart(req,res,username,post_Id){
    try {
        const data = await getPostData(req)
        const { title, body, summary } = JSON.parse(data)
        const post = await Post(post_Id)
        if(post[0].username === username){
            const newData ={
                title: title || post[0].title,
                body: body || post[0].body,
                summary: summary || post[0].summary
            }
            const update =  await dbcontrol.makeUpdate(post_Id,newData.title,newData.body,newData.summary,username)
            if(update === 'true'){
                const updatedpost = await Post(post_Id)
                res.writeHead(200,{"content-type": "application/json"})
                res.end(JSON.stringify(updatedpost))
            }
        }else{
            res.writeHead(200,{"content-type": "application/json"})
            res.end(JSON.stringify({"message": "Username or post not found"}))
        }
    } catch (error) {
        res.writeHead(404, {"content-type": "application/json"})
        res.end(JSON.stringify({"message": error}))
    }
}
module.exports = { 
    handleAccountCreation,
    returnProfileInfo,
    handleLogin,
    addfollow,
    returnAllUsers,
    makeApost,
    returnUserPost,
    returnAllPosts,
    viewPostComments,
    commentOnPost,
    likePost,
    likes,
    unfollow,
    updatePost,
    updatepart
}
