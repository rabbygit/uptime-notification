/*
 * Workers related tasks
 *
 */

// Dependencies
const path = require('path')
const fs = require('fs')
const url = require('url')
const http = require('http')
const https = require('https')
const _data = require('./data')
const _logs = require('./logs')
const helpers = require('./helpers')



// Instantiate the worker object
let workers = {}

// Lookup all the checks , gather all the data and send to the validator
workers.gateherAllChecks = () => {
    // Get all the checks
    _data.list('checks', (err, checks) => {
        if (!err && checks && checks.length) {
            checks.forEach(check => {
                // Read the check
                _data.read('checks', check, (err, originalCheckData) => {
                    if (!err) {
                        // pass the check to validator and let the validator to continue or log if any error occurs
                        workers.validateCheckData(originalCheckData)
                    } else {
                        console.log("Error : Error reading one of the check's data.");
                    }
                })
            });
        } else {
            console.log("Error: Could not find any checks to process")
        }
    })
}

// Timer to execute the worker process once per minute
workers.loop = () => {
    setInterval(() => {
        workers.gateherAllChecks()
    }, 1000 * 60);
}

// Sanity-check check the data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof (originalCheckData) == 'object' && originalCheckData != null ? originalCheckData : {}
    originalCheckData.id = typeof (originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false
    originalCheckData.userPhone = typeof (originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 11 ? originalCheckData.userPhone.trim() : false
    originalCheckData.protocol = typeof (originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol.trim() : false
    originalCheckData.method = typeof (originalCheckData.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method.trim() : false
    originalCheckData.url = typeof (originalCheckData.url) == 'string' && originalCheckData.url.trim().length ? originalCheckData.url.trim() : false
    originalCheckData.successCodes = typeof (originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length ? originalCheckData.successCodes : false
    originalCheckData.timeoutSeconds = typeof (originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 == 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false

    // Set the key that may not be set (if the workers never seen this check before )
    originalCheckData.state = typeof (originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state.trim() : 'down'
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false

    // If all the checks pass , then pass the data along to the next process
    if (
        originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.method &&
        originalCheckData.url &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds
    ) {
        workers.performCheck(originalCheckData)
    } else {
        console.log("Error : One of the check failed validation");
    }
}

// Perform the check , Send the originalCheckData and outcome , to the next process
workers.performCheck = (originalCheckData) => {
    // Prepare the initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': false
    }

    // Mark that the outcome has not been sent yet
    let outcomeSent = false

    // Parse the original hostname and path from the originalCheckData
    let parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    let hostName = parsedUrl.hostname
    let path = parsedUrl.path // Using path not pathname , because we want the full path with querystring

    // Construct the request url
    let requestDetails = {
        'protocol': originalCheckData.protocol + ':',
        'method': originalCheckData.method.toUpperCase(),
        'hostname': hostName,
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000 // It accepts mili seconds
    }

    // Instantiate the request (using either http or https )
    let _moduleToUse = originalCheckData.protocol == 'http' ? http : https
    let req = _moduleToUse.request(requestDetails, (res) => {
        let status = res.statusCode

        // Update the checkOutcome and pass the data along to next process
        checkOutcome.responseCode = status
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })

    // Bind to the error event so it doesn't thrown
    req.on('error', (err) => {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': err
        }

        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })

    // Bind to the timeout event 
    req.on('timeout', (err) => {
        // Update the checkOutcome and pass the data along
        checkOutcome.error = {
            'error': true,
            'value': 'timeout'
        }

        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome)
            outcomeSent = true
        }
    })

    // End the request
    req.end()
}

// Process the check outcome , update the check data as needed , and trigger an alert if needed
// Special logic for accomodating a  check that has never been tested before(don't send alert on that case)
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
    // Decide if the check is up or down
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? "up" : "down"

    // Decide if an alert is last warranted
    let alertWarranted = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;

    // Log the outcome
    let timeOfCheck = Date.now()
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck)

    // Update the check data
    let newCheckData = originalCheckData
    newCheckData.state = state
    newCheckData.lastChecked = timeOfCheck

    // Save the update
    _data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            // Send the check data to  the next phase if needed
            if (alertWarranted) {
                workers.alertUserToStatusChange(newCheckData)
            } else {
                console.log("Check state is not changed so no need to send alert to the user")
            }
        } else {
            console.log("Error : Error trying to save one of the check's updates")
        }
    })
}

// Alert the user to a change in their check status
workers.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert : your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`

    // Send the sms
    helpers.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log("Success : SMS has been sent to the user to a status change in their check", msg)
        } else {
            console.log("Error : Could not send sms to a user to a status change in their check")
        }
    })
}

// Write logs to a file
workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    // Form the log data
    let logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck
    }

    // Convert the data to string
    let logString = JSON.stringify(logData)

    // Determine the name of log file
    let logFileName = originalCheckData.id

    // Append the log string to file
    _logs.append(logFileName, logString, (err) => {
        if (!err) {
            console.log("Logging to file succeeded")
        } else {
            console.log("Logging to file failed")
        }
    })
}

// Timer to execute the log rotation once per day
workers.logRotationLoop = () => {
    setInterval(() => {
        workers.rotateLogs()
    }, 1000 * 60 * 60 * 24);
}

// Rotate (compress) the logs file
workers.rotateLogs = () => {
    // list all (non compressed) the log files
    _logs.list(false, (err, logs) => {
        if (!err && logs && logs.length) {
            logs.forEach((logName) => {
                // Compress the data to a different file
                let logId = logName.replace('.log', '')
                let newFileId = logId + '-' + Date.now()

                _logs.compress(logId, newFileId, (err) => {
                    if (!err) {
                        // Truncate the log
                        _logs.truncate(logId, (err) => {
                            if (!err) {
                                console.log("Success truncating log fie")
                            } else {
                                console.log("Error truncating log file")
                            }
                        })
                    } else {
                        console.log("Error compressing one of the log files", err)
                    }
                })
            })
        } else {
            console.log("Could not find any logs to rotate")
        }
    })
}

// Workers init function
workers.init = () => {
    // Console log in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running')
    // Execute all the checks immediately as soon as server is started
    workers.gateherAllChecks()

    // Call the loop so the checks will execute later on
    workers.loop()

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so logs will be compressed later on
    workers.logRotationLoop()
}

// Export the module
module.exports = workers