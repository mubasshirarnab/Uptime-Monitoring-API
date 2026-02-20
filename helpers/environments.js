//model scarffolding
const environments = {}

environments.staging = {
    port : 3000,
    envName : 'staging',
    SecretKey : 'dkslciulwie',
    twilio : {
        sid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phone : '+15005550006'
    }
}

environments.production = {
    port : 5000,
    envName : 'production',
    SecretKey : 'odsviugwsdhiu',
     twilio : {
        sid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phone : '+15005550006'
    }
}

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

const environmentToExportt = typeof(environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging

module.exports = environmentToExportt