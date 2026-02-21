//Dependencies

//worker object - module scaffolding
const worker = {}

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