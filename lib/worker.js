//Dependencies
const data = require('./data')
const {parseJSON} = require('../helpers/utilities')

//worker object - module scaffolding
const worker = {}

worker.validateCheckData = (originalCheckData) => {
    //validate all the check data
    originalCheckData = typeof(originalCheckData) === 'object' && originalCheckData !== null ? originalCheckData : {}

    //check for the required fields
    originalCheckData.id = typeof(originalCheckData.id) === 'string' && originalCheckData.id.trim().length === 20 ? originalCheckData.id.trim() : false 

    originalCheckData.userPhone = typeof(originalCheckData.userPhone) === 'string' && originalCheckData.userPhone.trim().length === 11 ? originalCheckData.userPhone.trim() : false

    originalCheckData.protocol = typeof(originalCheckData.protocol) === 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false

    originalCheckData.url = typeof(originalCheckData.url) === 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false

    originalCheckData.method = typeof(originalCheckData.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false

    originalCheckData.successCodes = typeof(originalCheckData.successCodes) === 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false

    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) === 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false

    originalCheckData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down'

    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false

    //if all the required fields are valid then pass the data to the next process, otherwise log an error
    if(originalCheckData.id && originalCheckData.userPhone && originalCheckData.protocol && originalCheckData.url && originalCheckData.method && originalCheckData.successCodes && originalCheckData.timeoutSeconds && originalCheckData.state && originalCheckData.lastChecked !== false){
        worker.performCheck(originalCheckData)
    }
    else{
        console.log('Error: One of the checks is not properly formatted. Skipping it...')
    }
}



worker.gatherAllChecks = () => {
    //get all the checks that exist in the system
    data.list('checks', (err, checks) => { 
        if(!err && checks && checks.length > 0){
            checks.forEach((check) => {
                //read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if(!err2 && originalCheckData){
                        //pass the data to the check validator and let that function continue or log error as needed
                        worker.validateCheckData(parseJSON(originalCheckData))
                    }
                    else{
                        console.log('Error reading one of the check data...')
                    }
                })
            })
        }
        else{
            console.log('Error: Could not find any checks to process...')
        }
    })
}   


worker.loopThroughChecks = () => {
    //set up the loop to call the check process once per minute
    setInterval(() => {
        worker.gatherAllChecks()
    }, 1000 * 60)
}

worker.init = () => {
    //execute all the checks
    worker.gatherAllChecks()

    //loop through the checks and execute them
    worker.loopThroughChecks()
}


//Export the worker module
module.exports = worker