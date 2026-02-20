//Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')


//Model scarffoldiing
const handler = {}

handler.checkHandler = (requestProperties, callback) => {
    //Acceptable methods for this handler
    const acceptedMethods = ['get', 'post', 'put', 'delete']

    //Check the method is accepted or not
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._check[requestProperties.method](requestProperties, callback)
    }
    else{
        callback(405)
    }
}

//Container for all the check methods
handler._check = {}

//Create a check - post
handler._check.post = (requestProperties, callback) => {
    //Validating the inputs

    //Sanitizing the user info
    const protocol = typeof(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false  

    const url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false

    const method = typeof(requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false

    const successCodes = typeof(requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array && requestProperties.body.successCodes.length > 0 ? requestProperties.body.successCodes : false

    const timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false

    //Required fields protocol, url, method, successCodes, timeoutSeconds for creating a check
    if(protocol && url && method && successCodes && timeoutSeconds){
        //Get the token from the headers
        const tokenId = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false  

        //Lookup the user by reading the token    
        data.read('tokens', tokenId, (err, tokenData) => {     
            //Verify the token and the user is the owner of the token
            if(!err && tokenData){
                const tokenObject = parseJSON(tokenData)
                const userPhone = tokenObject.phone 
                //Verify the token
                tokenHandler._token.verify(tokenId, userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        //Create a random id for the check
                        const checkId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) //The check id should be 22 characters long. Math.random().toString(36).substring(2, 15) generates a random string of 13 characters. So we need to generate two random strings and concatenate them to get a check id of 22 characters long   

                        //Create the check object and include the user's phone
                        const checkObject = {
                            id : checkId,
                            userPhone,
                            protocol,
                            url,
                            method,
                            successCodes,
                            timeoutSeconds
                        }       

                        //Save the object
                        data.create('checks', checkId, checkObject, (err2) => {
                            if(!err2){
                                //Add the check id to the user's object
                                data.read('users', userPhone, (err3, userData) => {
                                    if(!err3 && userData){
                                        const userObject = parseJSON(userData)

                                        //Check if the user already has checks
                                        userObject.checks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : []

                                        //Add the check id to the user's object
                                        userObject.checks.push(checkId)
                                        //Save the new user data
                                        data.update('users', userPhone, userObject, (err4) => {
                                            if(!err4){
                                                //Return the data about the new check
                                                callback(200, checkObject)
                                            }
                                            else{
                                                callback(500, {
                                                    error : 'Could not update the user with the new check...'
                                                })
                                            }   
                                        })
                                    }
                                    else{
                                        callback(500, {
                                            error : 'Could not find the user who created the check...'
                                        })
                                    }
                                })
                            }
                            else{
                                callback(500, {
                                    error : 'Could not create the new check...'
                                })
                            }
                        })
                    }
                    else{
                        callback(403, {
                            error : 'Authentication failed...'
                        })
                    }
                })
            }
            else{
                callback(403, {
                    error : 'Authentication failed...'
                })
            }
        })
    }
    else{
        callback(400, {
            error : 'You have a problem in your request...'
        })
    }   
}

handler._check.get = (requestProperties, callback) => {
    //Sanitizing the user info
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length == 22 ? requestProperties.queryStringObject.id : false

    //Required id for getting a check
    if(id){
        //Look up the check
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData){
                //Parse the check data
                const checkObject = parseJSON(checkData)

                //Get the token from the headers
                const tokenId = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false
                
                //Verify the token and the user is the owner of the token
                tokenHandler._token.verify(tokenId, checkObject.userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        //Return the check data
                        callback(200, checkObject)
                    }
                    else{
                        callback(403, {
                            error : 'Authentication failed...'
                        })
                    }
                })
            }
            else{
                callback(404, {
                    error : 'Check not found...'
                })
            }
        })
    }
}


handler._check.put = (requestProperties, callback) => {
   
}

handler._check.delete = (requestProperties, callback) => {
    
}


module.exports = handler