//Dependencies
const http = require('http')
const url = require('url')

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
    //handling the Request

    //Getting the URL and Parse it
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '') 
    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query
    const header = req.headers



    console.log(method)


    //Handling the response
    res.end("Hello World!!!!")
}

//start the server
app.createServer()