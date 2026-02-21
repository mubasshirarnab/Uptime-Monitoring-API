//Dependencies
const data = require('./data')
const {parseJSON} = require('../helpers/utilities')

//worker object - module scaffolding
const worker = {}



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