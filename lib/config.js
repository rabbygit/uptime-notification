/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
let environments = {}

// Staging(Default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'aSecretKey',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC184997a403a3df657efccb605b850d05',
        'authToken': 'ba53f7377730cf3e3b08fe60dfdbf3c6',
        'fromPhone': '+19125515831'
    }
}

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'alsoSecretKey',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC184997a403a3df657efccb605b850d05',
        'authToken': 'ba53f7377730cf3e3b08fe60dfdbf3c6',
        'fromPhone': '+19125515831'
    }
}

// Determine which environment is passed as command line arguments
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is one of the environments above , if not , then default to staging
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport