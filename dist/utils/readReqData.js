
function getPostData(req){
    return new Promise((resolve,reject) =>{
        try{
            let data = ''
            req.on('data', (chunk)=>{
                data += chunk
            })

            req.on('end', ()=>{
                //console.log(data)
                resolve(data)

            })
        }catch(error){
            console.log(error)
        }
    })
}

module.exports = { 
    getPostData 
}