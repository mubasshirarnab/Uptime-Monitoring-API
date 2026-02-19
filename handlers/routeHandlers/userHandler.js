//Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')

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

handler._user.get = () => {

}

handler._user.put = () => {

}

handler._user.delete = () => {

}


module.exports = handler