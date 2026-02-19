//Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities')


//Model scarffoldiing
const handler = {}

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']

    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties, callback)
    }
    else{
        callback(405)
    }
}

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
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false

    if(phone){
        data.read('users', phone, (err, user) => {
            if(!err && user){
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
        callback(404, {
            error : 'The user is not found...'
        })
    }
}

handler._user.put = (requestProperties, callback) => {
    //Sanitizing the user info
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false

    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false

    //required phone for updating a user
    if(phone){
        if(firstName || lastName || password){
            data.read('users', phone, (err, user) => {
                if(!err && user){
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
        callback(400, {
            error : 'Invalid phone number. Please try again...'
        })
    }
}

handler._user.delete = (requestProperties, callback) => {

}


module.exports = handler