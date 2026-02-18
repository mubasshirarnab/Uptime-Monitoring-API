//Dependencies
const http = require('http')
const {hadleReqRes} = require('./helpers/handleReqRes')


//app object - module scaffolding
const app = {}


//create a server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Listening to port no ${app.config.port}`)
    }) 
    
}

//handle Request and Response
app.handleReqRes = hadleReqRes

//start the server
app.createServer()