//Model scarffoldiing
const handler = {}

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties)
    
    callback(200, {
        message : 'This is a sample URL'
    })
}



module.exports = handler