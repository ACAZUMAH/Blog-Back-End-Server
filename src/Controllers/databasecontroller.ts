import { rejects } from "assert"
import { error } from "console"
import { resolve } from "path"

const bcrypt = require('bcrypt')
const db = require('../Models/databasequerys')

function hasPassword(user_password: string):Promise<string>{
    return new Promise((resolve,reject):void =>{
        const saltRounds = 10
        bcrypt.genSalt(saltRounds,(err:any,salt:string):void =>{
            if(err){
                console.log(err)
            }
            bcrypt.hash(user_password,salt,(err:any,hash:string):void =>{
                if(err){
                    console.log(err)
                }else{
                    resolve(hash)
                }
            })
        })
         
    }) 
}
function signup(name:string,username:string,email:string,pass:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void>=>{
        const hashedPass = await hasPassword(pass)
        await db.createAcc(name,username,email,hashedPass).then((succ:string): void  =>{
            resolve(succ)
        }).catch((rej:string):void =>{
            if(rej){
                reject(rej)
            }
        })
    }) 
}
function checkUser(email:string, password:string): Promise<string> {
    return new Promise(async (resolve,reject): Promise<void> =>{
        try{
            const hashpass = await db.fetchPass(email)
            if(hashpass !== 'Email not found'){
                const match = await bcrypt.compare(password,hashpass)
                if(match){
                    resolve('true')
                }else{
                    resolve('false')
                }
            }else{
                reject(hashpass)
            }
        }catch(rej){
            reject(rej)
        }
    })
}
function login(email:string, password:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
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
    })
}
function pushupdatedInfo(name:string,email:string,password:string,username:string):Promise<String>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try {
            const validatePass = await checkUser(email,password)
            if(validatePass === 'true'){
                await db.storeUpdatedUserInfo(name,username).then((success:string):void =>{
                    if(success == 'true'){
                        resolve(success)
                    }
                }).catch((failure:string): void =>{
                    if(failure === 'false'){
                        reject("Invalid username couldn't update profile")        
                    }
                })
            }else{
               reject('Invalid email or password')
            }
        } catch (error) {
            reject(error) 
            //console.log(error)
        }
    })
}
function pushUpdatedEmail(oldEmail:string, newEmail:string, password: string, username: string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const validate = await checkUser(oldEmail,password)
            if(validate === 'true'){
                await db.storeUpdatedEmail(username,newEmail).then((success:string):void =>{
                    if(success === 'true'){
                        resolve(success)
                    }
                }).catch((failure:string):void =>{
                    if(failure === 'false'){
                        reject("Invalid username couldn't update email")
                    }
                })
            }else{
                reject('Invalid email or password')
            }
        } catch (error) {
            reject(error)
            //console.log(error)
        }

    })
}
function addFollowers(user:string, userTofollow:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
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
function postData(title:string,body:string,summary:string,username:string): Promise<string> {
    return new Promise(async (resolve,reject)=>{
        try {
            await db.getPostDataStored(title,body,summary,username)
            .then((succ:string):void =>{
                resolve(succ)
            }).catch((rej:string): void =>{
                reject(rej)
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
        
    })

}
function addcomment(username:string,comment:string,post_Id:string): Promise<string>{
    return new Promise( async (resolve,reject): Promise<void>=>{
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
function addLike(username:string,post_Id:string,like:boolean): Promise<string>{
    return new Promise(async(resolve,reject) =>{
        try {
            await db.storeLikes(username,post_Id,like)
            .then((succ:string): void =>{
                if(succ === 'liked'){
                    resolve('true')
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function unfollowerUser(username:string,tounfollow:string): Promise<string>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try {
            await db.removefollower(username,tounfollow).then((success:string)=>{
                if(success){
                    resolve('true')
                }
            }).catch((failure:string): void =>{
                reject(failure)
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
function makeUpdate(post_Id:string,title:string,body:string,summary:string,username:string): Promise<string> {
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            await db.storeUpdatedPost(post_Id,title,body,summary,username).then((success:string):void =>{
                if(success === 'updated'){
                    resolve('true')
                }
            }).catch((failure:string): void =>{
                reject(failure)
            })
        } catch (error) {
            console.log(error)
            reject(error) 
        }
    })
}
function removePostData(username:string,posrt_Id:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            await db.removePostedData(username,posrt_Id).then((success:string):void =>{
                if(success === 'true'){
                    resolve('Post deleted')
                }
            }).catch((failure:string):void =>{
                if(failure === 'false'){
                    reject('Post not found or Invalid post Id ')
                }else{
                    reject(failure)
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
}
function removeLike(username:string,post_Id:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void>=>{
        try {
            await db.removestoredlike(username,post_Id).then((success:string): void =>{
                if(success === 'true'){
                    resolve(success)
                }
            }).catch((failure:string): void =>{
                if(failure === 'false'){
                    reject("Post not found or Invalid post id")
                }else{
                    reject(failure)
                }
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
function pushupdatedComment(comment:string|number,username:string,post_Id:string,commentId:number): Promise<string> {
    return new Promise (async (resolve,reject): Promise<void> =>{
        try {
            await db.storeUpdatedcomment(comment,username,post_Id,commentId).then((success:string): void =>{
                if(success === 'true'){
                    resolve(success)
                }
            }).catch((failure:string): void =>{
                if(failure === 'false'){
                    reject('Invalid post Id or comment Id')
                }else{
                    reject(failure)
                }
            })
        } catch (error) {
          console.log(error)
        }
    })
}
function deleteCommentData(username:string,commentId:number) : Promise<string>{
    return new Promise(async (resolve,reject) : Promise<void> =>{
        try {
            await db.deleteStoredComment(username,commentId).then((success:string): void=>{
                if(success ===  'true'){
                    resolve(success)
                }
            }).catch((failure:string): void =>{
                if(failure === 'false'){
                    reject('comment not found or Invalid comment Id')
                }else{
                    reject(failure)
                }
            })
        } catch (error) {
            console.log(error)
        }
    })

}
function removeAccount(email:string,password:string,username:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const validate = await checkUser(email,password)
            if(validate === 'true'){
                await db.removeAcountFromDb(email,username).then((success:string): void =>{
                    if(success === 'true'){
                        resolve(success)
                    }
                }).catch((failure:string): void =>{
                    if(failure === 'false'){
                        reject('Invalid username')
                    }else{
                        reject(failure)
                    }
                })

            }else{
                reject("Invalid password")
            }
        } catch (error) {
            reject(error)
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
    unfollowerUser,
    postData,
    addcomment,
    addLike,
    makeUpdate,
    removePostData,
    removeLike,
    pushupdatedComment,
    deleteCommentData,
    pushupdatedInfo,
    pushUpdatedEmail,
    removeAccount
}
