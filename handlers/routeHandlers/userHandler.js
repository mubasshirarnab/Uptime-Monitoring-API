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
    callback(200)
}

handler._user.post = () => {

}

handler._user.put = () => {

}

handler._user.delete = () => {

}


module.exports = handler