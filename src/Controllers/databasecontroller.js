"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const db = require('../Models/databasequerys');
/*type usertype ={
    name: string,
    username: string,
    email: string,
    pass: string,
}*/
function hasPassword(user_password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                console.log(err);
            }
            bcrypt.hash(user_password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                else {
                    resolve(hash);
                }
            });
        });
    });
}
function signup(name, username, email, pass) {
    return new Promise(async (resolve, reject) => {
        const hashedPass = await hasPassword(pass);
        await db.createAcc(name, username, email, hashedPass).then((succ) => {
            resolve(succ);
        }).catch((rej) => {
            if (rej) {
                reject(rej);
            }
        });
    });
}
function checkUser(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const hashpass = await db.fetchPass(email);
            if (hashpass !== 'Email not found') {
                const match = await bcrypt.compare(password, hashpass);
                if (match) {
                    resolve('true');
                }
                else {
                    resolve('false');
                }
            }
            else {
                reject(hashpass);
            }
        }
        catch (rej) {
            reject(rej);
        }
    });
}
function login(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const validate = await checkUser(email, password);
            if (validate === 'true') {
                resolve('success');
            }
            else if (validate === 'false') {
                resolve('failure');
            }
        }
        catch (rej) {
            if (rej) {
                reject(rej);
            }
        }
        //console.log(validate)
    });
}
function pushupdatedInfo(name, email, password, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const validatePass = await checkUser(email, password);
            if (validatePass === 'true') {
                await db.storeUpdatedUserInfo(name, username).then((success) => {
                    if (success == 'true') {
                        resolve(success);
                    }
                }).catch((failure) => {
                    if (failure === 'false') {
                        reject("Invalid username couldn't update profile");
                    }
                });
            }
            else {
                reject('Invalid email or password');
            }
        }
        catch (error) {
            reject(error);
            //console.log(error)
        }
    });
}
function pushUpdatedEmail(oldEmail, newEmail, password, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const validate = await checkUser(oldEmail, password);
            if (validate === 'true') {
                await db.storeUpdatedEmail(username, newEmail).then((success) => {
                    if (success === 'true') {
                        resolve(success);
                    }
                }).catch((failure) => {
                    if (failure === 'false') {
                        reject("Invalid username couldn't update email");
                    }
                });
            }
            else {
                reject('Invalid email or password');
            }
        }
        catch (error) {
            reject(error);
            //console.log(error)
        }
    });
}
function addFollowers(user, userTofollow) {
    return new Promise(async (resolve, reject) => {
        try {
            const followerAdded = await db.storeFollowers(user, userTofollow);
            if (followerAdded) {
                resolve('added');
            }
            else {
                reject(followerAdded);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function postData(title, body, summary, username) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.getPostDataStored(title, body, summary, username)
                .then((succ) => {
                resolve(succ);
            }).catch((rej) => {
                reject(rej);
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
function addcomment(username, comment, post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const pushcomment = await db.storeComment(username, comment, post_Id);
            if (pushcomment === 'true') {
                resolve(pushcomment);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function addLike(username, post_Id, like) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.storeLikes(username, post_Id, like)
                .then((succ) => {
                if (succ === 'liked') {
                    resolve('true');
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function unfollowerUser(username, tounfollow) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.removefollower(username, tounfollow).then((success) => {
                if (success) {
                    resolve('true');
                }
            }).catch((failure) => {
                reject(failure);
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
function makeUpdate(post_Id, title, body, summary, username) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.storeUpdatedPost(post_Id, title, body, summary, username).then((success) => {
                if (success === 'updated') {
                    resolve('true');
                }
            }).catch((failure) => {
                reject(failure);
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
function removePostData(username, posrt_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.removePostedData(username, posrt_Id).then((success) => {
                if (success === 'true') {
                    resolve('Post deleted');
                }
            }).catch((failure) => {
                if (failure === 'false') {
                    reject('Post not found or Invalid post Id ');
                }
                else {
                    reject(failure);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function removeLike(username, post_Id) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.removestoredlike(username, post_Id).then((success) => {
                if (success === 'true') {
                    resolve(success);
                }
            }).catch((failure) => {
                if (failure === 'false') {
                    reject("Post not found or Invalid post id");
                }
                else {
                    reject(failure);
                }
            });
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
function pushupdatedComment(comment, username, post_Id, commentId) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.storeUpdatedcomment(comment, username, post_Id, commentId).then((success) => {
                if (success === 'true') {
                    resolve(success);
                }
            }).catch((failure) => {
                if (failure === 'false') {
                    reject('Invalid post Id or comment Id');
                }
                else {
                    reject(failure);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function deleteCommentData(username, commentId) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.deleteStoredComment(username, commentId).then((success) => {
                if (success === 'true') {
                    resolve(success);
                }
            }).catch((failure) => {
                if (failure === 'false') {
                    reject('comment not found or Invalid comment Id');
                }
                else {
                    reject(failure);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });
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
    pushUpdatedEmail
};
