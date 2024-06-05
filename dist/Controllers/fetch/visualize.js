"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require('../../Models/databasequerys');
function sortPostByDate(postArr) {
    postArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    postArr.forEach(post => post.date = new Date(post.date).toString());
    return postArr;
}
function sortComments(comments) {
    comments.sort((a, b) => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime());
    comments.forEach(comment => comment.comment_date = new Date(comment.comment_date).toString());
    return comments;
}
function getUserProfile(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfo = await data.fetchProfile(username);
            const followersinfo = await data.fetchfollowers(username);
            const followinginfo = await data.returnfollowing(username);
            const profileinfo = {
                name: userInfo[0].name,
                username: userInfo[0].username,
                email: userInfo[0].email,
                followers: followersinfo[0].followers,
                following: followinginfo[0].following,
            };
            resolve(profileinfo);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function allUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await data.fetchAllUsers();
            resolve(users);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function returnAllPost() {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await data.fetchAllPost();
            const sortedByDate = sortPostByDate(post);
            resolve(sortedByDate);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function returnPostbyUsername(username) {
    return new Promise(async (resolve, reject) => {
        try {
            await data.postOfUser(username)
                .then((post) => {
                const sort = sortPostByDate(post);
                resolve(sort);
            }).catch((rej) => {
                reject(rej);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function Post(post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const post = sortPostByDate(await data.fetchPost(post_Id));
            resolve(post);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function returnPostComments(post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const comments = sortComments(await data.fetchCommentsOfApost(post_Id));
            resolve(comments);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function returnLikes(post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const likes = await data.fetchLikesOfpost(post_Id);
            resolve(likes);
        }
        catch (error) {
            console.log(error);
        }
    });
}
/*function returnPostcomments(id:string){
    return new Promise( async(resolve,reject) =>{

    })
}*/
module.exports = {
    getUserProfile,
    allUsers,
    returnAllPost,
    returnPostbyUsername,
    Post,
    returnPostComments,
    returnLikes
};
