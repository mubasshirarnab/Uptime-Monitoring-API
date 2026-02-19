//Dependencies
const crypto = require('crypto')
const environments = require('./environments')
const environmentToExportt = require('./environments')

//model scarffolding
const utilities = {}

//Convert to JSON Object
utilities.parseJSON = (jsonString) => {
    let output

    try{
        output = JSON.parse(jsonString)
    } catch{
        output = {}
    }

    return output
}


//Hashing a string
utilities.hash = (string) => {
    if(typeof(string) === 'string' && string.length > 0){
        const hash = crypto.createHmac('sha256', environments.SecretKey)
               .update(string)
               .digest('hex');

               return hash
    }
    else{
        return false
    }
}


//Export
module.exports = utilities