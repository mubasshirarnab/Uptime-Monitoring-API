//Dependencies
const http = require('http')

//app object - module scaffolding
const app = {}

//configaration
app.config = {
    port : 3000
}

//create a server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`Listening to port no ${app.config.port}`)
    }) 
    
}

//handle Request and Response
app.handleReqRes = (req, res) => {
    res.end("Hello World")
}

//start the server
app.createServer()