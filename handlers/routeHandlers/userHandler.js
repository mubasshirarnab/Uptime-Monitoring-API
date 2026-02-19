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

handler._user.get = (requestProperties, callback) => {
    //Sanitizing the user info
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().lenth > 0 ? requestProperties.body.firstName : false

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().lenth > 0 ? requestProperties.body.lastName : false

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().lenth == 11 ? requestProperties.body.phone : false

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().lenth > 0 ? requestProperties.body.password : false

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'string' && requestProperties.body.tosAgreement.trim().lenth > 0 ? requestProperties.body.tosAgreement : false

}

handler._user.post = () => {

}

handler._user.put = () => {

}

handler._user.delete = () => {

}


module.exports = handler