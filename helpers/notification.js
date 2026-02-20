//Dependencies
const https = require('https')
const environments = require('./environments')

//Model scarffolding
const notifications = {}

//Send SMS via Twilio
notifications.sendTwilioSMS = (phone, msg, callback) => {
    //Validate the parameters
    const userPhone = typeof(phone) === 'string' && phone.trim().length == 11 ? phone.trim() : false
    const message = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false 

    //If the parameters are valid, send the SMS
    if(userPhone && message){
        //Configure the request payload
        const payload = {
            From : environments.twilio.phone,
            To : `+88${userPhone}`,
            Body : message
        }
        
        //Stringify the payload
        const stringPayload = JSON.stringify(payload)

        //Configure the request details
        const requestDetails = {
            hostname : 'api.twilio.com',
            method : 'POST',
            path : `/2010-04-01/Accounts/${environments.twilio.sid}/Messages.json`,  
            auth : `${environments.twilio.sid}:${environments.twilio.authToken}`,
            headers : {
                'Content-Type' : 'application/json'
            }
        }   
        
        //Instantiate the request object
        const req = https.request(requestDetails, (res) => {
            //Get the status of the sent message
            const status = res.statusCode

            //Callback successfully if the message was sent successfully
            if(status == 200 || status == 201){
                callback(false)
            }
            else{
                callback(`Status code returned was ${status}`)
            }
        })

        //Error handling
        req.on('error', (err) => {
            callback(err)
        })

        //Write the payload to the request body
        req.write(stringPayload)
        req.end()
    }
    else{
        callback('There is a problem in your request...')
    }
}

//Export the module
module.exports = notifications