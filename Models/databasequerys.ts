import { Console } from "console"

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
type profile = {
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
    return new Promise((resolve,reject) =>{
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
                const command = "INSERT INTO users (name,username,email,userpasswords) VALUES ('"+name+"','"+user_name+"','"+email+"','"+pass+"')"
                con.query(command,(error:any, result:user)=>{
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

function fetchPass(email:string){
    return new Promise(async (resolve,reject) =>{
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
            
        }
    })
}

function fetchAllUsers(){
    return new Promise((resolve,reject) =>{
        try {
            const query = `SELECT name,username FROM users`
            con.query(query, (error:any,result:{name:string,username:string}[], fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(result)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function fetchProfile(username:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            const query = `SELECT name,username,email FROM users WHERE user_Id = ? `
            const value = [Id[0]]
            con.query(query, value, (error:any,results:profile[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(results)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
function fetchfollowers(username:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            const query = `SELECT COUNT(*) AS followers
                FROM follows 
                WHERE follows.following = ?`
            const value = [Id[0]]
            con.query(query,value, (error:any,results:followers[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(results)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
function returnfollowing(username:string){
    return new Promise(async (resolve,reject)=>{
        try {
            const user_id = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            const query = `SELECT COUNT(*) AS following
                FROM follows 
                WHERE follows.user = ?`
            const value = [Id[0]]
            con.query(query,value, (error:any,results:following[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(results)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function get_ids(user_id:string): Promise<userid[]>{
    return new Promise((resolve,reject)=>{
        try {
            const query = `SELECT user_Id FROM users WHERE username = '`+ user_id  +`'`
            con.query(query, (error:any, result:userid[])=>{
                if(error){
                    console.log(error)
                }
                resolve(result)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function storeFollowers(user_id:string, followId:string):Promise<string>{
    return new Promise(async (resolve, reject) => {
        try {
            const userId: userid[] = await get_ids(user_id)
            const tofollowId: userid[] = await get_ids(followId)
            if(userId[0].user_Id && tofollowId[0].user_Id){
                const query = `INSERT INTO follows (user,following) VALUES ( ?, ?)`
                const values = [userId[0].user_Id,tofollowId[0].user_Id]
                con.query(query,values, (error:string,result:any)=>{
                    if(error){
                        console.log(error)
                    }
                    if(result.affectedRows){
                        resolve('true')
                    }
                })
            }else{
                reject('user not found')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function getPostDataStored(title:string,body:string,summary:string,username:string){
    return new Promise(async (resolve,reject) =>{
        try {
            const post_Id = uuidv4()
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(typeof Id[0] === "number"){
                const query = `INSERT INTO post(post_Id,title,body,summary,user_id)
                VALUES ("`+post_Id+`","`+title+`","`+body+`","`+summary+`",`+Id[0]+`)`
                con.query(query, (error:string,result:any)=>{
                    if(error){
                        console.log(error)
                    }
                    if(result.affectedRows){
                        resolve('true')
                    }
                })
            }else{
                reject('This user does not have account')
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function fetchAllPost(){
    return new Promise ((resolve,reject)=>{
        try {
            const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE (post.user_Id = users.user_Id) `
            con.query(query, (error:any,result:post[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(result)
            })
        } catch (error) {
            console.log(error)
        }
    })
}
function postOfUser(username:string):Promise<post[]>{
    return new Promise(async (reslove,reject) =>{
        try {
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(typeof Id[0] == "number"){
                const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE post.user_Id = users.user_Id and post.user_Id =`+Id[0]
                con.query(query, (error:any,result:post[],fields)=>{
                    if(error){
                        console.log(error)
                    }
                    reslove(result)
                })
            }else{
                reject('This user does not have account')
            }
        } catch (error) {
            console.log(error)
        }
    })

}
function fetchPost(post_Id:string):Promise<post[]>{
    return new Promise((resolve,reject)=>{
        const query = `SELECT post_Id,users.username,title,body,summary,date
            FROM post,users
            WHERE post.user_Id = users.user_Id AND post.post_Id = `+ `'`+post_Id+`'`
        con.query(query, (error:any,results:post[], fields)=>{
            if(error){
                console.log(error)
            }
            resolve(results)
        })
    })
} 
function fetchCommentsOfApost(post_Id:string):Promise<comment[]>{
    return new Promise((resolve,reject) =>{
        try {
            const query = `SELECT users.username,comment,comment_date 
            FROM comments,users 
            WHERE comments.user_Id = users.user_Id AND comments.post_Id = `+`'`+post_Id+`'`
            con.query(query, (error:any,results:comment[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(results)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function storeComment(username:string,comment:string,post_Id:string){
    return new Promise(async (resolve,reject) =>{
        try {
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(typeof Id[0] === "number"){
                const query = `INSERT INTO comments(comment,post_ID,user_id)
                    VALUES ( ?, ?, ? )`
                const values = [comment,post_Id,Id]
                con.query(query,values, (error:any,result:any)=>{
                    if(error){
                        console.log(error)
                    }
                    if(result.affectedRows){
                        resolve('true')
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }) 
}

function pushLike(username:string,like:string,post_Id:string){
    return new Promise( async (resolve, reject) => {
        try {
            let likenum:number = 0
            if(like === 'true'){
                likenum += 1
            }
            const user_id:userid[] = await get_ids(username)
            const Id = user_id.map(id => id.user_Id)
            if(typeof Id[0] === "number"){
                const query = `INSERT INTO likes (numberOfLikes,post_Id,user_Id) VALUES ( ?, ?, ?)`
                const values = [likenum,post_Id,Id[0]]
                con.query(query,values, (error:any,results:any,fields)=>{
                    if(error){
                        console.log(error)
                    }
                    resolve('liked')
                })
            }
        } catch (error) {
           console.log(error) 
        }
    })
}

function fetchLikesOfpost(post_Id:string){
    return new Promise((resolve,reject) =>{
        try {
            const query = `SELECT COUNT(like_Id) As likes FROM likes WHERE likes.post_Id = `+ mysql.escape(post_Id)
            con.query(query,(error:any,results:likes[],fields)=>{
                if(error){
                    console.log(error)
                }
                resolve(results)
            })
        } catch (error) {
            console.log(error)
        }
    })
}

function removefollower(username:string,tounfollow:string){
    return new Promise( async (resolve,reject)=>{
        try {
            const userId: userid[] = await get_ids(username)
            const tounfollowId: userid[] = await get_ids(tounfollow)
            if(typeof userId[0].user_Id === "number" && typeof tounfollowId[0].user_Id === "number"){
                const query = `DELETE FROM follows WHERE 
                follows.user = `+userId[0].user_Id+` AND follows.following = `+tounfollowId[0].user_Id
                con.query(query, (error:any,result:any)=>{
                    if(error){
                        console.log(error)
                    }
                    if(result.affectedRows){
                        resolve('true')
                    }
                })
            }else{
                reject('User not found')
            }
        } catch (error) {
            console.log(error)
        }
    })
}
/*
async function test(){
    /*await getPostDataStored('bugs','bugs are dirty','fuck',13).then((succ)=>{
        console.log(succ)
    }).catch((rej)=>{
        console.log(rej)
    })
    
    await fetchAllPost().then((succ)=>{
        console.log(succ)
    }).catch((rej)=>{
        console.log(rej)
    })
    const userId = await get_ids('usercaleb')
    const tofollowId = await get_ids('dragon')
    console.log(userId)
    console.log(tofollowId)
    
   await removefollower('usercaleb','userhafiz').then((succ)=>{
    console.log(succ)
   }).catch((fail)=>{
    console.log(fail)
   })
}
*/
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
    pushLike,
    fetchLikesOfpost,
    removefollower
} 