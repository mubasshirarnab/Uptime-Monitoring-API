//Dependencies
const http = require('http')
const {hadleReqRes} = require('../helpers/handleReqRes')
const environments = require('..helpers/environments')


//server object - module scaffolding
const server = {}

//create a server
server.createServer = () => {
    const createServerVar = http.createServer(server.handleReqRes)
    createServerVar.listen(environments.port, () => {
        console.log(`Listening to port no ${environments.port}`)
    }) 
    
}

//handle Request and Response
server.handleReqRes = hadleReqRes

//start the server
server.createServer()

server.init = () => {
    //Start the server
    server.createServer()
}

//Export the server module
module.exports = server