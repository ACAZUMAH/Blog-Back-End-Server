const http = require('http')
const { json } = require('stream/consumers')
const { handlePostRequest,
        handleGetRequest,
        handlePutRequest,
        handlePatchRequest,
        handleDeleteRequest } = require('./Routes/requestHandler')
 

const server = http.createServer(function handlerequest(req,res){
    const { method } = req
    switch(method){
        case 'POST':
            return handlePostRequest(req,res)
            break 
        case 'GET':
            //console.log(req.url)
            return handleGetRequest(req,res)
            break 
        case 'PUT':
            return handlePutRequest(req,res)
            break 
        case 'PATCH':
            return handlePatchRequest(req,res)
            break
        case 'DELETE':
            return handleDeleteRequest(req,res)
            break
        default:
            res.writeHead(501, { "constent-type": "application/json"})
            res.end(JSON.stringify({"message": "Unsuporrted request"}))
    }
})

const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`Server listing on Port ${PORT}`)
}) 