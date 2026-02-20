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

handler._check.post = (requestProperties, callback) => {
    

}

handler._check.get = (requestProperties, callback) => {
    
}


handler._check.put = (requestProperties, callback) => {
   
}

handler._check.delete = (requestProperties, callback) => {
    
}


module.exports = handler