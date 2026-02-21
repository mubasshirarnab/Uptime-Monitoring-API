//Dependencies
require('dotenv').config();
const server = require('./lib/server')
const workers = require('./lib/worker')



//app object - module scaffolding
const app = {}

app.init = () => {
    //Start the server
    server.init()

    //Start the workers
    workers.init()
}

//Execute
app.init()

//Export the app module
module.exports = app