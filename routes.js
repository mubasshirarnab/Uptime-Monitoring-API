//Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler')
const {userHandler} = require('./handlers/routeHandlers/userHandler')
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler')



//Tracking the Routes
const routes = {
    sample : sampleHandler,
    user : userHandler,
    token : tokenHandler
}

module.exports = routes