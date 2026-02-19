//model scarffolding
const utilities = {}

utilities.parseJSON = (jsonString) => {
    let output

    try{
        output = JSON.parse(jsonString)
    } catch{
        output = {}
    }

    return output
}


//Export
module.exports = utilities