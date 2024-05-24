import { rejects } from "assert"
import { error } from "console"

const bcrypt = require('bcrypt')
const db = require('../Models/databasequerys')
/*type usertype ={
    name: string,
    username: string,
    email: string,
    pass: string,
}*/

function hasPassword(user_password: string){
    return new Promise((resolve,reject) =>{
        const saltRounds = 10
        bcrypt.genSalt(saltRounds,(err:any,salt:string)=>{
            if(err){
                console.log(err)
            }
            bcrypt.hash(user_password,salt,(err:any,hash:string)=>{
                if(err){
                    console.log(err)
                }else{
                    resolve(hash)
                }
            })
        })
         
    }) 
}
function signup(name:string,username:string,email:string,pass:string){
    return new Promise(async (resolve,reject)=>{
        const hashedPass = await hasPassword(pass)
        await db.createAcc(name,username,email,hashedPass).then((succ:string) =>{
            resolve(succ)
        }).catch((rej:string)=>{
            if(rej){
                reject(rej)
            }
        })
    }) 
}
function checkUser(email:string, password:string) {
    return new Promise(async (resolve,reject)=>{
        try{
            const hashpass = await db.fetchPass(email)
            if(hashpass){
                const match = await bcrypt.compare(password,hashpass)
                if(match){
                    resolve('true')
                }else{
                    resolve('false')
                }
            }
        }catch(rej){
            reject(rej)
        }
    })

}
function login(email:string, password:string){
    return new Promise(async (resolve,reject) =>{
        try {
            const validate =  await checkUser(email, password)
            if(validate === 'true'){
                resolve('success')
            }else if(validate === 'false'){
                resolve('failure')
            }
        } catch (rej) {
            if(rej){
                reject(rej)
            }
        }
        //console.log(validate)
    })
}
function addFollowers(user:string, userTofollow:string){
    return new Promise(async (resolve,reject) =>{
        try {
            const followerAdded = await db.storeFollowers(user,userTofollow)
            if(followerAdded){
                resolve('added')
            }else{
                reject(followerAdded)
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function postData(title:string,body:string,summary:string,username:string){
    return new Promise(async (resolve,reject)=>{
        try {
            await db.getPostDataStored(title,body,summary,username)
            .then((succ:string)=>{
                resolve(succ)
            }).catch((rej:string)=>{
                reject(rej)
            })
        } catch (error) {
            console.log(error)
        }
        
    })

}
function addcomment(username:string,comment:string,post_Id:string){
    return new Promise( async (resolve,reject)=>{
        try {
            const pushcomment = await db.storeComment(username,comment,post_Id)
            if(pushcomment === 'true'){
                resolve(pushcomment)
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function addLike(username:string,like:string,post_Id:string){
    return new Promise(async(resolve,reject) =>{
        try {
            await db.pushLike(username,like,post_Id)
            .then((succ:string)=>{
                if(succ === 'liked'){
                    resolve('true')
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
}
/*async function test(mail:string,pass:string){
    try {
        const check = await checkUser(mail,pass)
        console.log(check)
    } catch (error) {
        console.log(error)
    }
}
*/
module.exports = {
    signup,
    login,
    addFollowers,
    postData,
    addcomment,
    addLike
}
