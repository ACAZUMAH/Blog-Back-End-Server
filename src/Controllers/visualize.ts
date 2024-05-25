import { rejects } from "assert"
import { resolve } from "path"

const data = require('../Models/databasequerys')

type general = {
    Id: string 
    username: string,
    title: string,
    body: string,
    summary:string  
    date: string | number
}
type profile = {
    name:string,
    username:string
    email:string 
}
type following = {
    following: number
}
type followers ={
    followers: number 
}
type comment ={
    comment_Id:string
    username: string,
    comment: string,
    comment_date: string | number
}
type likes ={
    likes: number
}
function sortPostByDate(postArr:general[]){
    postArr.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    postArr.forEach(post => post.date = new Date(post.date).toString())
    return postArr
}
function sortComments(comments:comment[]){
    comments.sort((a,b) => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime())
    comments.forEach(comment => comment.comment_date = new Date(comment.comment_date).toString())
    return comments
}
function getUserProfile(username:string){
    return new Promise(async (resolve,reject) =>{
        try {
            const userInfo:profile[] = await data.fetchProfile(username)
            const followersinfo:followers[] = await data.fetchfollowers(username)
            const followinginfo:following[] = await data.returnfollowing(username)
            const profileinfo = {
                name: userInfo[0].name,
                username: userInfo[0].username,
                email: userInfo[0].email,
                followers: followersinfo[0].followers,
                following: followinginfo[0].following,
            }
            resolve(profileinfo)
        } catch (error) {
            console.log(error)
        }
    })
}
function allUsers(){
    return new Promise(async (resolve,reject) =>{
        try {
            const users = await data.fetchAllUsers()
            resolve(users)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnAllPost(){
    return new Promise(async (resolve,reject) =>{
        try{
            const post = await data.fetchAllPost()
            const sortedByDate = sortPostByDate(post)
            resolve(sortedByDate)
        }catch(error){
            console.log(error)
        }
    })
}
function returnPostbyUsername(username:string){
    return new Promise(async (resolve,reject) =>{
        try {
            await data.postOfUser(username)
            .then((post:general[])=>{
                const sort = sortPostByDate(post)
                resolve(sort)
            }).catch((rej:string)=>{
                reject(rej)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
function Post(post_Id:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const post = sortPostByDate(await data.fetchPost(post_Id))
            resolve(post)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnPostComments(post_Id:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const comments = sortComments(await data.fetchCommentsOfApost(post_Id))
            resolve(comments)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnLikes(post_Id:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const likes:likes[] = await data.fetchLikesOfpost(post_Id)
            resolve(likes)
        } catch (error) {
            console.log(error)
        }
    })
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
}
