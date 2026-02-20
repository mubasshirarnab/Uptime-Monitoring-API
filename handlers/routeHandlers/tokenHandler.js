//Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities')


//Model scarffoldiing
const handler = {}

handler.tokenHandler = (requestProperties, callback) => {
    //Acceptable methods for this handler
    const acceptedMethods = ['get', 'post', 'put', 'delete']

    //Check the method is accepted or not
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback)
    }
    else{
        callback(405)
    }
}

//Container for all the user methods
handler._token = {}

handler._token.post = (requestProperties, callback) => {
    //Sanitizing the user info
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false

    //required phone and password for creating a token
    if(phone && password){
        //Make sure the user is already exists        
        data.read('users', phone, (err, user) => {
            if(!err && user){
                const userObject = parseJSON(user)

                if(hash(password) === userObject.password){
                    //Create a token for the user
                    const tokenId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) //The token id should be 22 characters long. Math.random().toString(36).substring(2, 15) generates a random string of 13 characters. So we need to generate two random strings and concatenate them to get a token id of 22 characters long

                    //Token expires after 1 hour
                    const expires = Date.now() + 60 * 60 * 1000 //1 hour

                    //Create the token object
                    const tokenObject = {
                        phone,
                        tokenId,
                        expires
                    }        

                    //Store the token to the DB
                    data.create('tokens', tokenId, tokenObject, (err2) => {
                        if(!err2){
                            callback(200, tokenObject)
                        }
                        else{
                            callback(500, {
                                error : 'Could not create the token...'
                            })
                        }
                    })          
                }
                else{
                    callback(400, {
                        error : 'Password is not correct...'
                    })
                }
            }
            else{
                callback(400, {
                    error : 'The user is not exists...'
                })
            }
        })
    }    
}

handler._token.get = (requestProperties, callback) => {
    //Sanitizing the user info
    const tokenId = typeof(requestProperties.queryStringObject.tokenId) === 'string' && requestProperties.queryStringObject.tokenId.trim().length == 22 ? requestProperties.queryStringObject.tokenId : false

    //required tokenId for getting a token      
    if(tokenId){
        data.read('tokens', tokenId, (err, token) => {
            if(!err && token){
                const tokenObject = parseJSON(token)
                callback(200, tokenObject)
            }
            else{
                callback(400, {
                    error : 'The token is not exists...'
                })
            }       
        })
    }

}

handler._token.put = (requestProperties, callback) => {
    //Sanitizing the user info
    const tokenId = typeof(requestProperties.body.tokenId) === 'string' && requestProperties.body.tokenId.trim().length == 22 ? requestProperties.body.tokenId : false
    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend == true ? true : false  
    //required tokenId and extend for updating a token
    if(tokenId && extend){
        data.read('tokens', tokenId, (err, token) => {
            if(!err && token){
                const tokenObject = parseJSON(token)
                if(tokenObject.expires > Date.now()){
                    tokenObject.expires = Date.now() + 60 * 60 * 1000 //1 hour
                    //Store the updated token to the DB
                    data.update('tokens', tokenId, tokenObject, (err2) => {
                        if(!err2){
                            callback(200, tokenObject)
                        }
                        else{
                            callback(500, {
                                error : 'Could not update the token...'
                            })
                        }
                    })
                }
                else{
                    callback(400, {
                        error : 'The token is already expired...'
                    })
                }   
            }
            else{
                callback(400, {
                    error : 'The token is not exists...'
                })      
            }
        })  
    } 
}

handler._token.delete = (requestProperties, callback) => {
    //Sanitizing the user info
    const tokenId = typeof(requestProperties.queryStringObject.tokenId) === 'string' && requestProperties.queryStringObject.tokenId.trim().length == 22 ? requestProperties.queryStringObject.tokenId : false

    //required tokenId for deleting a token
    if(tokenId){
        data.read('tokens', tokenId, (err, token) => {
            if(!err && token){ 
                data.delete('tokens', tokenId, (err2) => {
                    if(!err2){
                        callback(200, {
                            message : 'The token deleted successfully...'
                        })
                    }
                    else{
                        callback(500, {
                            error : 'Could not delete the token...'
                        })
                    }
                })
            }
            else{
                callback(400, {
                    error : 'The token is not exists...'
                })
            }
        })
    }
    else{
        callback(400, {
            error : 'Invalid tokenId. Please try again...'
        })
    }
}


module.exports = handler