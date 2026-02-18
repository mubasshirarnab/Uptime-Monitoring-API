//Dependencies
const url = require('url')
const {StringDecoder} = require('string_decoder')
const { buffer } = require('stream/consumers')
const routes = require('./routes')
const {sampleHandler} = require('./handlers/sampleHandler')
const {notFoundHandler} = require('./handlers/notFoundHandler')

//Model scurffolding
const handler = {}

//Request and Response handler
handler.hadleReqRes = (req, res) => {
    //handling the Request

    //Getting the URL and Parse it
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '') 
    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query
    const headersObject = req.headers

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }

    const decoder = new StringDecoder('utf-8')
    let realData = ''


    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler


    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof(statusCode) === 'number' ? statusCode : 500
        payload = typeof(payload) === 'object' ? payload : {}
    })


    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })

    req.on('end', () =>{
        realData += decoder.end()
        console.log(realData)

        //Handling the response
        res.end("Hello World!!!!")
    })  
}

module.exports = handler