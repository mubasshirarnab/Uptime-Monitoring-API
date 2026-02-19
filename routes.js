//Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler')
const {userHandler} = require('./handlers/routeHandlers/userHandler')


//Tracking the Routes
const routes = {
    sample : sampleHandler,
    user : userHandler,
}

module.exports = routes