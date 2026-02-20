//model scarffolding
const environments = {}

environments.staging = {
    port : 3000,
    envName : 'staging',
    SecretKey : 'dkslciulwie',
    twilio : {
        sid : 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        authToken : 'your_auth_token',
        phone : '+15005550006'
    }
}

environments.production = {
    port : 5000,
    envName : 'production',
    SecretKey : 'odsviugwsdhiu',
    twilio : {
        sid : 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        authToken : 'your_auth_token',
        phone : '+15005550006'
    }
}

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

const environmentToExportt = typeof(environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging

module.exports = environmentToExportt