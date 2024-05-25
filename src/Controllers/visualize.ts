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
type user = {
    username:string,
    email:string,
    userpasswords:string
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
type profileinfo = {
    name: string,
    username: string,
    email: string,
    followers: number,
    following: number
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
function sortPostByDate(postArr:general[]): general[]{
    postArr.sort((a,b):number => new Date(b.date).getTime() - new Date(a.date).getTime())
    postArr.forEach(post => post.date = new Date(post.date).toString())
    return postArr
}
function sortComments(comments:comment[]): comment[]{
    comments.sort((a,b):number => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime())
    comments.forEach(comment => comment.comment_date = new Date(comment.comment_date).toString())
    return comments
}
function getUserProfile(username:string):Promise<profileinfo>{
    return new Promise(async (resolve,reject): Promise<void> =>{
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
function allUsers():Promise<user[]>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try {
            const users = await data.fetchAllUsers()
            resolve(users)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnAllPost(): Promise<general[]>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try{
            const post = await data.fetchAllPost()
            const sortedByDate = sortPostByDate(post)
            resolve(sortedByDate)
        }catch(error){
            console.log(error)
        }
    })
}
function returnPostbyUsername(username:string):Promise<general[]>{
    return new Promise(async (resolve,reject):Promise<void> =>{
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
function Post(post_Id:string): Promise<general[]>{
    return new Promise(async (resolve,reject):Promise<void>=>{
        try {
            const post = sortPostByDate(await data.fetchPost(post_Id))
            resolve(post)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnPostComments(post_Id:string): Promise<comment[]>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try {
            const comments = sortComments(await data.fetchCommentsOfApost(post_Id))
            resolve(comments)
        } catch (error) {
            console.log(error)
        }
    })
}
function returnLikes(post_Id:string): Promise<likes[]>{
    return new Promise(async (resolve,reject): Promise<void>=>{
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
