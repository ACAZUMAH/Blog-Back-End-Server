import { Console, profile } from "console"
import { resolve } from "path"

const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid')

const con = mysql.createConnection({
    'host': '127.2.2.1',
    'user': 'root',
    'pass': 'Ca059le9b@',
    'database': 'myblogdb'
})
con.connect((err:string) =>{
    if (err){
        console.log(err)
    }
})
type user = {
    username:string,
    email:string,
    userpasswords:string
}
type userprofile = {
    name:string,
    username:string
    email:string 
}
type post = {
    id: string,
    username: string,
    title: string,
    body: string,
    summary:string  
    date: string | number
}
type comment = {
    comment_Id:number
    username: string,
    comment: string,
    comment_date: string | number
}
type userid = {
    user_Id: number
}
type following = {
    following: number
}
type followers ={
    followers: number 
}
type likes ={
    likes: number
}
function check(): Promise<user[]>{
    return new Promise((resolve,reject): void =>{
        con.query('SELECT username,email,userpasswords FROM users', (error:string, results:user[], fields) =>{
            if(error){
                console.log(error)
            }
            resolve(results)
        })
    })
}

function createAcc(name:string,user_name:string,email:string,pass:string):Promise<string>{
    return new Promise((resolve,reject) =>{
        setTimeout(async ():Promise<void>=>{
            try{
                const blogusers: user[] = await check()
                for (let i = 0; i < blogusers.length; i++){
                    if(blogusers[i].username === user_name || blogusers[i].email === email){
                        reject("account exist! try login")
                        return
                    }
                }
                const command = `INSERT INTO users (name,username,email,userpasswords) VALUES ( ?, ?, ?, ? )`
                const values = [name, user_name, email, pass]
                con.query(command,(error:any, result:user): void =>{
                    if(error){
                        console.log(error)
                    }else{
                        resolve("Account created")
                    }
                })
            }catch(error){
                console.log(error)
            }
        },1000)
    })
    
} 

function fetchPass(email:string):Promise<string>{
    return new Promise(async (resolve,reject):Promise<void> =>{
        try {
            const fetchedData:user[] = await check()
            for (let i = 0; i < fetchedData.length; i++){
                if (fetchedData[i].email === email){
                    const hashpassword:string = fetchedData[i].userpasswords
                    resolve(hashpassword)
                    return 
                }
            }
            reject('Email not found')
        } catch (error) {
            console.log(error)
        }
    })
}

function fetchAllUsers(): Promise<{name:string,username:string}[]>{
    return new Promise((resolve,reject): void =>{
        try {
            const query = `SELECT name,username FROM users LIMIT 50`
            setTimeout((): void =>{
                con.query(query, (error:any,result:{name:string,username:string}[], fields)=>{
                    if(error){
                        console.log(error)
                    }
                    resolve(result)
                })
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    })
}

function fetchProfile(username:string):Promise<userprofile[]>{
    return new Promise(async (resolve,reject): Promise<void>=>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id && Id.length > 0 && Id[0] !== undefined){
                const query = `SELECT name,username,email FROM users WHERE user_Id = ? `
                const value = [Id[0]]
                setTimeout((): void =>{
                    con.query(query, value, (error:any,results:userprofile[],fields):void =>{
                        if(error){
                           console.log(error)
                        }
                        resolve(results)
                    })
                },1000)
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function fetchfollowers(username:string): Promise<followers[]>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id && Id.length > 0 && Id[0] !== undefined){
                const query = `SELECT COUNT(*) AS followers
                FROM follows 
                WHERE follows.following = ?`
                const value = [Id[0]]
                setTimeout((): void =>{
                    con.query(query,value, (error:any,results:followers[],fields): void =>{
                        if(error){
                            console.log(error)
                        }
                        resolve(results)
                    })
                },1000)
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function returnfollowing(username:string): Promise<following[]>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id && Id.length > 0 && Id[0] !== undefined){
                const query = `SELECT COUNT(*) AS following
                FROM follows 
                WHERE follows.user = ?`
                const value = [Id[0]]
               setTimeout((): void =>{
                    con.query(query,value, (error:any,results:following[],fields): void =>{
                        if(error){
                            console.log(error)
                        }
                        resolve(results)
                    })
                },1000)
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function get_ids(user_id:string): Promise<userid[]>{
    return new Promise((resolve,reject):void =>{
        try {
            const query = `SELECT user_Id FROM users WHERE username = ? `
            setTimeout((): void =>{
                con.query(query,[user_id], (error:any, result:userid[]):void =>{
                    if(error){
                        console.log(error)
                    }
                    resolve(result)
                })
            },1000)
        } catch (error) {
            console.log(error)
        }
    })
}

function storeFollowers(user_id:string, followId:string):Promise<string>{
    return new Promise(async (resolve, reject): Promise<void> => {
        try {
            const userId: userid[] = await get_ids(user_id)
            const tofollowId: userid[] = await get_ids(followId)
            if( userId && userId.length > 0 && userId[0].user_Id !== undefined &&
                tofollowId && tofollowId.length > 0 && tofollowId[0].user_Id !== undefined){
                const query = `INSERT INTO follows (user,following) VALUES ( ?, ?)`
                const values = [userId[0].user_Id,tofollowId[0].user_Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:string,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows){
                            resolve('true')
                        }
                    })
                },1000)
            }else{
                reject('user not found')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function getPostDataStored(title:string,body:string,summary:string,username:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const post_Id = uuidv4()
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id[0] && Id.length > 0 && typeof Id[0] === "number"){
                const query = `INSERT INTO post(post_Id,title,body,summary,user_id)
                VALUES ( ?, ?, ?, ?, ? )`
                const values = [post_Id, title, body, summary, Id[0]]
                setTimeout((): void =>{
                    con.query(query,values, (error:string,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows){
                            resolve('true')
                        }
                    })
                },1000)
            }else{
                reject('This user does not have account')
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function fetchAllPost():Promise<post[]>{
    return new Promise ((resolve,reject):void =>{
        try {
            const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE (post.user_Id = users.user_Id) `
            setTimeout(():void =>{
                con.query(query, (error:any,result:post[],fields): void =>{
                    if(error){
                        console.log(error)
                    }
                    resolve(result)
                })
            },1000)
        } catch (error) {
            console.log(error)
        }
    })
}
function postOfUser(username:string):Promise<post[]>{
    return new Promise(async (reslove,reject): Promise<void> =>{
        try {
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id[0] && Id.length > 0 && typeof Id[0] == "number"){
                const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE post.user_Id = users.user_Id and post.user_Id = ? `
                setTimeout(():void =>{
                    con.query(query,[Id[0]], (error:any,result:post[],fields): void =>{
                        if(error){
                            console.log(error)
                        }
                        reslove(result)
                    })
                },1000)
            }else{
                reject('This user does not have account')
            }
        } catch (error) {
            console.log(error)
        }
    })

}
function fetchPost(post_Id:string):Promise<post[]>{
    return new Promise((resolve,reject): void =>{
        try {
            const query = `SELECT post_Id,users.username,title,body,summary,date
            FROM post,users
            WHERE post.user_Id = users.user_Id AND post.post_Id = ? `
            setTimeout((): void =>{
                con.query(query,[post_Id], (error:any,results:post[], fields): void =>{
                    if(error){
                        console.log(error)
                    }
                    resolve(results)
                }) 
            },1000)
        } catch (error) {
            console.log(error)
        }
        
    })
} 
function fetchCommentsOfApost(post_Id:string):Promise<comment[]>{
    return new Promise((resolve,reject): void =>{
        try {
            const query = `SELECT comment_Id,users.username,comment,comment_date 
            FROM comments,users 
            WHERE comments.user_Id = users.user_Id AND comments.post_Id = ? `
            setTimeout((): void =>{
                con.query(query, [post_Id], (error:any,results:comment[],fields): void =>{
                    if(error){
                        console.log(error)
                    }
                    resolve(results)
                })
            },1000)
        } catch (error) {
            console.log(error)
        }
    })
}

function storeComment(username:string,comment:string,post_Id:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(Id[0] && Id.length > 0 && typeof Id[0] === "number"){
                const query = `INSERT INTO comments(comment,post_ID,user_id)
                    VALUES ( ?, ?, ? )`
                const values = [comment,post_Id,Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:any,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows){
                            resolve('true')
                        }
                    })
                }, 1000)
            }
        } catch (error) {
            console.log(error)
        }
    }) 
}

function storeLikes(username:string,post_Id:string,like:boolean): Promise<string>{
    return new Promise( async (resolve, reject): Promise<void> => {
        try {
            let likenum:number = 0
            if(like){
                likenum += 1
            }
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if( Id[0] && Id.length > 0 && typeof Id[0] === "number"){
                const query = `INSERT INTO likes (numberOfLikes,post_Id,user_Id) VALUES ( ?, ?, ?)`
                const values = [likenum,post_Id,Id[0]]
                setTimeout((): void =>{
                    con.query(query,values, (error:any,results:any,fields): void =>{
                        if(error){
                            console.log(error)
                        }
                        resolve('liked')
                    })
                }, 1000)
            }
        } catch (error) {
           console.log(error) 
        }
    })
}

function fetchLikesOfpost(post_Id:string): Promise<likes[]> {
    return new Promise((resolve,reject): void =>{
        try {
            const query = `SELECT COUNT(like_Id) As likes FROM likes WHERE likes.post_Id = ? `
            setTimeout((): void =>{
                con.query(query,[post_Id],(error:any,results:likes[],fields):void =>{
                    if(error){
                        console.log(error)
                    }
                    resolve(results)
                })
            },1000)
        } catch (error) {
            console.log(error)
        }
    })
}

function removefollower(username:string,tounfollow:string): Promise<string>{
    return new Promise( async (resolve,reject): Promise<void> =>{
        try {
            const userId: userid[] = await get_ids(username)
            const tounfollowId: userid[] = await get_ids(tounfollow)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined &&
                tounfollowId && tounfollowId.length > 0 && tounfollowId[0].user_Id !== undefined){
                const query = `DELETE FROM follows WHERE 
                follows.user = ? AND follows.following = ? `
                setTimeout((): void =>{
                    con.query(query,[userId[0].user_Id,tounfollowId[0].user_Id], (error:any,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows > 0){
                            resolve('true')
                        }
                    })
                },1000)
            }else{
                reject('User not found or Invalid username')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function storeUpdatedPost(post_Id:string,title:string,body:string,summary:string,username:string): Promise<string>{
    return new Promise(async(resolve,reject): Promise<void> =>{
        try {
            const userId: userid[] = await get_ids(username)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined){
                const query = `UPDATE post SET title = ?, body = ?, summary =? 
                WHERE post.post_Id = ? AND post.user_Id =? `
                const values = [title,body,summary,post_Id,userId[0]]
                setTimeout((): void =>{
                    con.query(query,values, (error:any, result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows > 0){
                            resolve('updated')
                        }else{
                            reject('post ID not found Or Invalid post ID')
                        }
                    })
                },1000)
                
            }else{
                reject('user not found or Invelid username ')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function removePostedData(username:string,post_Id:string): Promise<string>{
    return new Promise(async (resolve,reject) : Promise<void> =>{
        try {
            const userId: userid[] = await get_ids(username)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined){
                const query = `DELETE FROM post WHERE post_Id = ? AND user_Id = ?`
                const values = [post_Id, userId[0].user_Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:any, results:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(results.affectedRows > 0){
                            resolve('true')
                        }else{
                            reject('false')
                        }
                    })
                },1000)
            }else{
                reject('user not found or Invelid username ')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function removestoredlike(username:string,post_Id:string): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void>=>{
        try {
            const userId: userid[] = await get_ids(username)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined){
                const query = `DELETE FROM likes WHERE post_Id = ? AND user_Id = ? `
                const values = [post_Id,userId[0].user_Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:any,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows > 0){
                            resolve('true')
                        }else{
                            reject('false')
                        }
                    })
                },1000)
            }else{
                reject('user not found or Invelid username ')
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function storeUpdatedcomment(comment:string|number,username:string, post_Id:string,comment_Id:number): Promise<string>{
    return new Promise(async (resolve,reject): Promise<void> =>{
        try {
            const userId: userid[] = await get_ids(username)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined){
                const query = `UPDATE comments SET comment = ? 
                WHERE post_Id = ? and user_Id = ? and comment_Id = ? `
                const values = [comment,post_Id,userId[0].user_Id,comment_Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:any,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows > 0){
                            resolve('true')
                        }else{
                          reject('false')
                        }
                    })
                },1000)
            }else{
                reject('user not found or Invelid username ')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function deleteStoredComment(username:string, commentId:number): Promise<string>{
    return new Promise(async (resolve, reject): Promise<void> => {
        try {
            const userId: userid[] = await get_ids(username)
            if(userId && userId.length > 0 && userId[0].user_Id !== undefined){
                const query = `DELETE FROM comments
                    WHERE comments.comment_Id = ? AND comments.user_Id = ? `
                const values = [commentId, userId[0].user_Id]
                setTimeout((): void =>{
                    con.query(query,values, (error:any,result:any): void =>{
                        if(error){
                            console.log(error)
                        }
                        if(result.affectedRows > 0){
                            resolve('true')
                        }else{
                          reject('false')
                        }
                    })
                },1000)
            }else{
                reject('user not found or Invelid username ')
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function storeUpdatedUserInfo(name:string,username:string):Promise<string>{
    return new Promise((resolve,reject):void =>{
        try {
            const query = `UPDATE users SET name = ? WHERE username = ?`
            const values = [name, username]
            setTimeout((): void =>{
                con.query(query,values, (error:any,results:any): void =>{
                    if(error){
                        console.log(error)
                    }
                    if(results.affectedRows > 0){
                        resolve("true")
                    }else{
                        reject('false')
                    }
                })
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    })
}
function storeUpdatedEmail(ussername:string, newEmail:string): Promise<string>{
    return new Promise((resolve,reject): void =>{
        try {
            const query = `UPDATE users SET email = ? WHERE username = ? `
            const values = [newEmail,ussername]
            setTimeout((): void =>{
                con.query(query,values, (error:any, result:any): void =>{
                    if(error){
                        console.log(error)
                    }
                    if(result.affectedRows > 0){
                        resolve('true')
                    }else{
                        reject('false')
                    }
                })
            },1000)
        } catch (error) {
            console.log(error)
        }
    })
}
module.exports = {
    createAcc,
    fetchPass,
    fetchProfile,
    fetchfollowers,
    returnfollowing,
    fetchAllUsers,
    storeFollowers,
    fetchAllPost,
    getPostDataStored,
    postOfUser,
    fetchCommentsOfApost,
    fetchPost,
    storeComment,
    storeLikes,
    fetchLikesOfpost,
    removefollower,
    storeUpdatedPost,
    removePostedData,
    removestoredlike,
    storeUpdatedcomment,
    deleteStoredComment,
    storeUpdatedUserInfo,
    storeUpdatedEmail
} 
