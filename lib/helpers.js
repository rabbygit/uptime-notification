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
const { type } = require('os')
const { callbackify } = require('util')

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
helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false
    data = typeof (data) == 'object' && data != null ? data : {};

    if (templateName) {
        let templateDir = path.join(__dirname, '/../templates/')
        fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length) {
                // Do interpolation on the string
                let finalString = helpers.interpolate(str, data)
                callback(false, finalString)
            } else {
                callback("No template found")
            }
        })
    } else {
        callback("A valid template name was not specified")
    }
}

// Add the header and footer to a string and pass the provided data object to header and footer
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : false;
    data = typeof (data) == 'object' && data != null ? data : {};

    // Get the header
    helpers.getTemplate('_header', data, (err, headerStr) => {
        if (!err && headerStr.length) {
            // Get the footer
            helpers.getTemplate('_footer', data, (err, footerStr) => {
                if (!err && footerStr.length) {
                    // Add them all together
                    let fullStr = headerStr + str + footerStr
                    callback(false, fullStr)
                } else {
                    callback("Could not find the footer")
                }
            })
        } else {
            callback("Could not find the header")
        }
    })
}

// Get a given string and a data object , then find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof (str) == 'string' && str.length > 0 ? str : false;
    data = typeof (data) == 'object' && data != null ? data : {};

    // Add the templateGlobals to the data object , preparing their key with global config value
    for (const key in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(key)) {
            data['global.' + key] = config.templateGlobals[key]
        }
    }

    // For each key value in data object , insert it's value into the string at the corresponding placeholder
    for (const key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) == 'string') {
            let replace = data[key]
            let find = '{' + key + '}'
            str = str.replace(find, replace)
        }
    }

    console.log("Str", str)

    return str;
}

// Export the helper
module.exports = helpers