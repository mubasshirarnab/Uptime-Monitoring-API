//Model scarffoldiing
const handler = {}

handler.userHandler = (requestProperties, callback) => {
    
    callback(200, {
        message : 'This is a user URL'
    })
}


module.exports = handler