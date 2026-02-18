//Dependencies
const http = require('http')
const {hadleReqRes} = require('./helpers/handleReqRes')
const environments = require('./helpers/environments')
const data = require('./lib/data')

//app object - module scaffolding
const app = {}

//testing file system
data.create('test', 'newFile', {name : 'Bangladesh', Language : 'Bangla'}, (err) =>{
    console.log(`Error was`, err)
})

//create a server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(environments.port, () => {
        console.log(`Listening to port no ${environments.port}`)
    }) 
    
}

//handle Request and Response
app.handleReqRes = hadleReqRes

//start the server
app.createServer()