//Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities')
const {verifyToken} = require('./tokenHandler')


//Model scarffoldiing
const handler = {}

handler.userHandler = (requestProperties, callback) => {
    //Acceptable methods for this handler
    const acceptedMethods = ['get', 'post', 'put', 'delete']

    //Check the method is accepted or not
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties, callback)
    }
    else{
        callback(405)
    }
}

//Container for all the user methods
handler._user = {}

handler._user.post = (requestProperties, callback) => {
    //Sanitizing the user info
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement === true ? true : false


    //required all field for creating a user
    if(firstName && lastName && phone && password && tosAgreement){
        //Make sure the user is already not exists
        data.read('users', phone, (err, user) => {
            if(err){
                //Create the user object
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    tosAgreement
                }

                //Store the user to the DB
                data.create('users', phone, userObject, (err2) => {
                    if(!err2){
                        callback(200, {
                            message : 'The user created successfully...'
                        })
                    }
                    else{
                        callback(500, {
                            error : 'Could not create user...'
                        })
                    }
                })
            }
            else{
                callback(500, {
                    error : 'The user is already exist...'
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

handler._user.get = (requestProperties, callback) => {
    //Sanitizing the user info
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false

    //required phone for getting a user
    if(phone){
        //Verify the token
        const tokenId = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false 

        verifyToken(tokenId, phone, (tokenIsValid) => {
            if(tokenIsValid){
                //Look up the user
                data.read('users', phone, (err, user) => {
                    if(!err && user){
                        //Remove the password from the user object before sending the response
                        const userObject = parseJSON(user)
                        delete userObject.password
                        callback(200, userObject)
                    }
                    else{
                        callback(404, {
                            error : 'The user is not found...'
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
        callback(404, {
            error : 'The user is not found...'
        })
    }
}


handler._user.put = (requestProperties, callback) => {
    //Sanitizing the user info
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false

    //required phone for updating a user
    if(phone){
        //Verify the token
        const tokenId = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false

        verifyToken(tokenId, phone, (tokenIsValid) => {
            if(tokenIsValid){
                //At least one field is required for updating a user
                if(firstName || lastName || password){
                    //Make sure the user is already exists
                    data.read('users', phone, (err, user) => {
                        if(!err && user){
                            //Update the user data
                            const userObject = parseJSON(user)
                            if(firstName){
                                userObject.firstName = firstName
                            }
                            if(lastName){
                                userObject.lastName = lastName
                            }
                            if(password){
                                userObject.password = hash(password)
                            }

                            //Store the updated user to the DB
                            data.update('users', phone, userObject, (err2) => {
                                if(!err2){
                                    callback(200, {
                                        message : 'The user updated successfully...'
                                    })
                                }
                                else{
                                    callback(500, {
                                        error : 'Could not update user...'
                                    })
                                }
                            })
                        }
                        else{
                            callback(400, {
                                error : 'The user is not exists...'
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
            else{
                callback(403, {
                    error : 'Authentication failed...'
                })
            }
        })
    }
    else{
        callback(400, {
            error : 'Invalid phone number. Please try again...'
        })
    }
}

handler._user.delete = (requestProperties, callback) => {
    //Sanitizing the user info
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false

    //required phone for deleting a user
    if(phone){
        //Verify the token
        const tokenId = typeof(requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false

        verifyToken(tokenId, phone, (tokenIsValid) => {
            if(tokenIsValid){
                //Make sure the user is already exists
                data.read('users', phone, (err, user) => {
                    if(!err && user){
                        //Delete the user from the DB
                        data.delete('users', phone, (err2) => {
                            if(!err2){
                                callback(200, {
                                    message : 'The user deleted successfully...'
                                })
                            }
                            else{
                                callback(500, {
                                    error : 'Could not delete the user...'
                                })
                            }
                        })
                    }
                    else{
                        callback(400, {
                            error : 'The user is not exists...'
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
            error : 'Invalid phone number. Please try again...'
        })
    }   
}


module.exports = handler