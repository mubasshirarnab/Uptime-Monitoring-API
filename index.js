//Dependencies
require('dotenv').config();
const server = require('./lib/server')
const worker = require('./lib/worker')



//app object - module scaffolding
const app = {}

app.init = () => {
    //Start the server


    //Start the worker

}

//Execute
app.init()

//Export the app module
module.exports = app