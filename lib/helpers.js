/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require('crypto')
const config = require('./config')
const querystring = require('querystring')
const https = require('https')
const path = require('path')
const fs = require('fs')

// Containers for all helpers
let helpers = {}

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
        return hash
    } else {
        return false
    }
}

// Parse a json string to object
helpers.parseJsonToObject = (str) => {
    try {
        let obj = JSON.parse(str)
        return obj
    } catch (error) {
        return {}
    }
}

// Create a random string in a given string length
helpers.createRandomString = (strLength) => {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false
    if (strLength) {
        // Possible characters for string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

        // Final string
        let str = ''
        for (let index = 1; index <= strLength; index++) {
            let randomStr = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))

            str += randomStr
        }

        return str
    } else {
        return false
    }
}

// Send a SMS via Twilio API
helpers.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof (phone) == 'string' && phone.trim().length == 11 ? phone.trim() : false
    msg = typeof (msg) == 'string' && msg.trim().length && msg.trim().length < 1600 ? msg.trim() : false

    if (phone && msg) {
        // Configure the request payload
        let payload = {
            'From': config.twilio.fromPhone,
            'To': "+88" + phone,
            'Body': msg
        }

        // Stringify the payload
        let stringPayload = querystring.stringify(payload)

        // Configure the request details
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ":" + config.twilio.authToken,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        }

        // Instantiate the request object
        let req = https.request(requestDetails, (res) => {
            // res.on('data', d => {
            //     process.stdout.write(d)
            // })
            // Grab the status of the sent request
            let status = res.statusCode;
            // callback successfully if the request went through
            if (status == 200 || status == 201) {
                callback(false)
            } else {
                callback("Status code returned was " + status)
            }
        })

        // Bind the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback(e)
        })

        // Add the payload
        req.write(stringPayload)

        // End the request
        req.end()
    } else {
        callback("Given parameters are missing or invalid")
    }
}


// Get the string content of a template
helpers.getTemplate = (templateName, callback) => {
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false
    if (templateName) {
        let templateDir = path.join(__dirname, '/../templates/')
        fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length) {
                callback(false, str)
            } else {
                callback("No template found")
            }
        })
    } else {
        callback("A valid template name was not specified")
    }
}

// Export the helper
module.exports = helpers