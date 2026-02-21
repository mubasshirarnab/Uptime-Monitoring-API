//Dependencies
const http = require('http')
const https = require('https')
const URL = require('url').URL
const data = require('./data')
const {parseJSON} = require('../helpers/utilities')

//worker object - module scaffolding
const worker = {}


//Validate check data
worker.validateCheckData = (originalCheckData) => {
    //validate all the check data
    originalCheckData = typeof(originalCheckData) === 'object' && originalCheckData !== null ? originalCheckData : {}

    originalCheckData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down'

    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false

    //if all the required fields are valid then pass the data to the next process, otherwise log an error
    if(originalCheckData.state && originalCheckData.lastChecked !== false){
        worker.performCheck(originalCheckData)
    }
    else{
        console.log('Error: One of the checks is not properly formatted. Skipping it...')
    }
}


//Perform the check, send the original check data and the outcome of the check process to the next step in the process
worker.performCheck = (originalCheckData) => {
    const checkOutcome = {
        error : false,
        responseCode : false
    }

    let outcomeSent = false

    //parse the hostname and the path out of the original check data
    const parsedUrl = new URL(`${originalCheckData.protocol}://${originalCheckData.url}`)
    const hostName = parsedUrl.hostname
    const path = parsedUrl.pathname
    //construct the request
    const requestDetails = {
        protocol : originalCheckData.protocol + ':',
        hostname : hostName,
        method : originalCheckData.method.toUpperCase(),
        path : path,
        timeout : originalCheckData.timeoutSeconds * 1000
    }   

    //Instantiate the request object (using either the http or https module)
    const _moduleToUse = originalCheckData.protocol === 'http' ?  http : https
    const req = _moduleToUse.request(requestDetails, (res) => {
        //Grab the status of the sent request
        const status = res.statusCode

        //Update the check data based on the response     
        checkOutcome.responseCode = status

        //Send the check outcome to the next process if the outcome has not already been sent
        if(!outcomeSent){
            worker.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }       
    })

    //Bind to the error event so it doesn't get thrown
    req.on('error', (err) => {
        //Update the check data based on the error
        checkOutcome.error = {
            error : true,
            value : err
        }
        worker.processCheckOutcome(originalCheckData, checkOutcome)
    })

    //Bind to the timeout event
    req.on('timeout', () => {
        //Update the check data based on the timeout
        checkOutcome.error = {
            error : true,
            value : 'timeout'
        }
        worker.processCheckOutcome(originalCheckData, checkOutcome)
    })

    //End the request
    req.end()
}


//Process the check outcome, update the check data as needed, trigger an alert if needed, and log the outcome
worker.processCheckOutcome = (originalCheckData, status) => {
    //decide if the check is considered up or down
    const state = !status.error && status.responseCode && originalCheckData.successCodes.indexOf(status.responseCode) > -1 ? 'up' : 'down'

    //decide if an alert is warranted
    const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false

    //update the check data
    const checkData = originalCheckData
    checkData.state = state
    checkData.lastChecked = Date.now()
    //Save the updates to the check data
    data.update('checks', checkData.id, checkData, (err) => {
        if(!err){
            console.log('Check data updated successfully...')
        }
        else{
            console.log('Error updating the check data...')
        }
    })
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
    }, 8000)
}

worker.init = () => {
    //execute all the checks
    worker.gatherAllChecks()

    //loop through the checks and execute them
    worker.loopThroughChecks()
}


//Export the worker module
module.exports = worker