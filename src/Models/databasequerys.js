"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');
const con = mysql.createConnection({
    'host': '127.2.2.1',
    'user': 'root',
    'pass': 'Ca059le9b@',
    'database': 'myblogdb'
});
con.connect((err) => {
    if (err) {
        console.log(err);
    }
});
function check() {
    return new Promise((resolve, reject) => {
        con.query('SELECT username,email,userpasswords FROM users', (error, results, fields) => {
            if (error) {
                console.log(error);
            }
            resolve(results);
        });
    });
}
function createAcc(name, user_name, email, pass) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const blogusers = await check();
                for (let i = 0; i < blogusers.length; i++) {
                    if (blogusers[i].username === user_name || blogusers[i].email === email) {
                        reject("account exist! try login");
                        return;
                    }
                }
                const command = `INSERT INTO users (name,username,email,userpasswords) VALUES ( ?, ?, ?, ? )`;
                const values = [name, user_name, email, pass];
                con.query(command, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        resolve("Account created");
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }, 1000);
    });
}
function fetchPass(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const fetchedData = await check();
            for (let i = 0; i < fetchedData.length; i++) {
                if (fetchedData[i].email === email) {
                    const hashpassword = fetchedData[i].userpasswords;
                    resolve(hashpassword);
                    return;
                }
            }
            reject('Email not found');
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchAllUsers() {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT name,username FROM users LIMIT 50`;
            setTimeout(() => {
                con.query(query, (error, result, fields) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(result);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchProfile(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id && Id.length > 0 && Id[0] !== undefined) {
                const query = `SELECT name,username,email FROM users WHERE user_Id = ? `;
                const value = [Id[0]];
                setTimeout(() => {
                    con.query(query, value, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        resolve(results);
                    });
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchfollowers(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id && Id.length > 0 && Id[0] !== undefined) {
                const query = `SELECT COUNT(*) AS followers
                FROM follows 
                WHERE follows.following = ?`;
                const value = [Id[0]];
                setTimeout(() => {
                    con.query(query, value, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        resolve(results);
                    });
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function returnfollowing(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id && Id.length > 0 && Id[0] !== undefined) {
                const query = `SELECT COUNT(*) AS following
                FROM follows 
                WHERE follows.user = ?`;
                const value = [Id[0]];
                setTimeout(() => {
                    con.query(query, value, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        resolve(results);
                    });
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function get_ids(user_id) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT user_Id FROM users WHERE username = ? `;
            setTimeout(() => {
                con.query(query, [user_id], (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(result);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeFollowers(user_id, followId) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(user_id);
            const tofollowId = await get_ids(followId);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined &&
                tofollowId && tofollowId.length > 0 && tofollowId[0].user_Id !== undefined) {
                const query = `INSERT INTO follows (user,following) VALUES ( ?, ?)`;
                const values = [userId[0].user_Id, tofollowId[0].user_Id];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows) {
                            resolve('true');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getPostDataStored(title, body, summary, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const post_Id = uuidv4();
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id[0] && Id.length > 0 && typeof Id[0] === "number") {
                const query = `INSERT INTO post(post_Id,title,body,summary,user_id)
                VALUES ( ?, ?, ?, ?, ? )`;
                const values = [post_Id, title, body, summary, Id[0]];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows) {
                            resolve('true');
                        }
                    });
                }, 1000);
            }
            else {
                reject('This user does not have account');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchAllPost() {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE (post.user_Id = users.user_Id) `;
            setTimeout(() => {
                con.query(query, (error, result, fields) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(result);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function postOfUser(username) {
    return new Promise(async (reslove, reject) => {
        try {
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id[0] && Id.length > 0 && typeof Id[0] == "number") {
                const query = `SELECT post_Id,users.username,title,body,summary,date
                FROM post,users
                WHERE post.user_Id = users.user_Id and post.user_Id = ? `;
                setTimeout(() => {
                    con.query(query, [Id[0]], (error, result, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        reslove(result);
                    });
                }, 1000);
            }
            else {
                reject('This user does not have account');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchPost(post_Id) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT post_Id,users.username,title,body,summary,date
            FROM post,users
            WHERE post.user_Id = users.user_Id AND post.post_Id = ? `;
            setTimeout(() => {
                con.query(query, [post_Id], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(results);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchCommentsOfApost(post_Id) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT comment_Id,users.username,comment,comment_date 
            FROM comments,users 
            WHERE comments.user_Id = users.user_Id AND comments.post_Id = ? `;
            setTimeout(() => {
                con.query(query, [post_Id], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(results);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeComment(username, comment, post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id[0] && Id.length > 0 && typeof Id[0] === "number") {
                const query = `INSERT INTO comments(comment,post_ID,user_id)
                    VALUES ( ?, ?, ? )`;
                const values = [comment, post_Id, Id];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows) {
                            resolve('true');
                        }
                    });
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeLikes(username, post_Id, like) {
    return new Promise(async (resolve, reject) => {
        try {
            let likenum = 0;
            if (like) {
                likenum += 1;
            }
            const user_id = await get_ids(username);
            const Id = user_id.map(id => id.user_Id);
            if (Id[0] && Id.length > 0 && typeof Id[0] === "number") {
                const query = `INSERT INTO likes (numberOfLikes,post_Id,user_Id) VALUES ( ?, ?, ?)`;
                const values = [likenum, post_Id, Id[0]];
                setTimeout(() => {
                    con.query(query, values, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                        resolve('liked');
                    });
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function fetchLikesOfpost(post_Id) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT COUNT(like_Id) As likes FROM likes WHERE likes.post_Id = ? `;
            setTimeout(() => {
                con.query(query, [post_Id], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                    }
                    resolve(results);
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function removefollower(username, tounfollow) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            const tounfollowId = await get_ids(tounfollow);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined &&
                tounfollowId && tounfollowId.length > 0 && tounfollowId[0].user_Id !== undefined) {
                const query = `DELETE FROM follows WHERE 
                follows.user = ? AND follows.following = ? `;
                setTimeout(() => {
                    con.query(query, [userId[0].user_Id, tounfollowId[0].user_Id], (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('true');
                        }
                    });
                }, 1000);
            }
            else {
                reject('User not found or Invalid username');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeUpdatedPost(post_Id, title, body, summary, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const query = `UPDATE post SET title = ?, body = ?, summary =? 
                WHERE post.post_Id = ? AND post.user_Id =? `;
                const values = [title, body, summary, post_Id, userId[0]];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('updated');
                        }
                        else {
                            reject('post ID not found Or Invalid post ID');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found or Invelid username ');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function removePostedData(username, post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const query = `DELETE FROM post WHERE post_Id = ? AND user_Id = ?`;
                const values = [post_Id, userId[0].user_Id];
                setTimeout(() => {
                    con.query(query, values, (error, results) => {
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows > 0) {
                            resolve('true');
                        }
                        else {
                            reject('false');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found or Invelid username ');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function removestoredlike(username, post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const query = `DELETE FROM likes WHERE post_Id = ? AND user_Id = ? `;
                const values = [post_Id, userId[0].user_Id];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('true');
                        }
                        else {
                            reject('false');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found or Invelid username ');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeUpdatedcomment(comment, username, post_Id, comment_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const query = `UPDATE comments SET comment = ? 
                WHERE post_Id = ? and user_Id = ? and comment_Id = ? `;
                const values = [comment, post_Id, userId[0].user_Id, comment_Id];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('true');
                        }
                        else {
                            reject('false');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found or Invelid username ');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function deleteStoredComment(username, commentId) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const query = `DELETE FROM comments
                    WHERE comments.comment_Id = ? AND comments.user_Id = ? `;
                const values = [commentId, userId[0].user_Id];
                setTimeout(() => {
                    con.query(query, values, (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('true');
                        }
                        else {
                            reject('false');
                        }
                    });
                }, 1000);
            }
            else {
                reject('user not found or Invelid username ');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeUpdatedUserInfo(name, username) {
    return new Promise((resolve, reject) => {
        try {
            const query = `UPDATE users SET name = ? WHERE username = ?`;
            const values = [name, username];
            setTimeout(() => {
                con.query(query, values, (error, results) => {
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows > 0) {
                        resolve("true");
                    }
                    else {
                        reject('false');
                    }
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function storeUpdatedEmail(ussername, newEmail) {
    return new Promise((resolve, reject) => {
        try {
            const query = `UPDATE users SET email = ? WHERE username = ? `;
            const values = [newEmail, ussername];
            setTimeout(() => {
                con.query(query, values, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result.affectedRows > 0) {
                        resolve('true');
                    }
                    else {
                        reject('false');
                    }
                });
            }, 1000);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function removeAcountFromDb(email, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = await get_ids(username);
            if (userId && userId.length > 0 && userId[0].user_Id !== undefined) {
                const user_id = userId[0].user_Id;
                con.query(`DELETE FROM likes WHERE likes.user_Id = ? `, [user_id], (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                con.query(`DELETE FROM comments WHERE comments.user_id = ?`, [user_id], (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                con.query(`SELECT post_Id FROM post WHERE user_Id = ? `, [user_id], (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result.length > 0) {
                        const postIdList = result.map(post => post.post_Id);
                        const posIdPlaceHolders = postIdList.map(() => '?').join(',');
                        con.query(`DELETE FROM comments WHERE post_Id IN (${posIdPlaceHolders})`, postIdList, (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                        con.query(`DELETE FROM post WHERE post.user_Id = ? `, [user_id], (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                });
                con.query(`DELETE FROM follows WHERE follows.user = ? OR follows.following = ? `, [user_id, user_id], (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
                setTimeout(() => {
                    con.query(`DELETE FROM users WHERE username = ? and email = ? `, [username, email], (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        if (result.affectedRows > 0) {
                            resolve('true');
                        }
                    });
                }, 2000);
            }
            else {
                reject("Invelid username");
            }
        }
        catch (error) {
            console.log(error);
        }
    });
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
    storeUpdatedEmail,
    removeAcountFromDb
};
