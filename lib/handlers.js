/*
 * Request handlers
 *
 */

// Dependencies
const _data = require("./data")
const helpers = require("./helpers")
const config = require('./config')
const _url = require('url')
const dns = require('dns')

// Define the handlers
let handlers = {}


/*
 * HTML handlers
 *
 */

// Index handlers
handlers.index = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Uptime',
            'head.description': 'We offer free , simple uptime monitoring HTTP/HTTPS sites of all kinds.When your site goes down , we\'ll send you a text to let you know.',
            'body.class': 'index'
        }

        // Read in a template as a string
        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Signup handlers
handlers.accountCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Signup',
            'head.description': 'Signup is easy.It needs only a few seconds',
            'body.class': 'accountCreate'
        }

        // Read in a template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Create new session for user
handlers.sessionCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Login to your account.',
            'head.description': 'Please provide your phone number and password for log in',
            'body.class': 'sessionCreate'
        }

        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Session delete for user
handlers.sessionDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Logged out.',
            'head.description': 'You have been logged out',
            'body.class': 'sessionDeleted'
        }

        // Read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Account Edit
handlers.accountEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        }

        // Read in a template as a string
        helpers.getTemplate('accountEdit', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}


// Account Deleted
handlers.accountDeleted = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted'
        }

        // Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Checks Create
handlers.checksCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Create a new check',
            'body.class': 'checksCreated'
        }

        // Read in a template as a string
        helpers.getTemplate('checksCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}


// Dashboard (all checks list)
handlers.checksList = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Dashboard',
            'body.class': 'checksList'
        }

        // Read in a template as a string
        helpers.getTemplate('checksList', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}

// Checks Edit
handlers.checksEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        let templateData = {
            'head.title': 'Checks Details',
            'body.class': 'checksEdit'
        }

        // Read in a template as a string
        helpers.getTemplate('checksEdit', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        callback(200, str, 'html')
                    } else {
                        callback(500, undefined, 'html')
                    }
                })
            } else {
                callback(500, undefined, 'html')
            }
        })
    } else {
        callback(405, undefined, 'html')
    }
}



// Favicon handlers
handlers.favicon = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Read the favicon data
        helpers.getStaticAsset('favicon.ico', (err, data) => {
            if (!err && data) {
                // Callback the data
                callback(200, data, 'favicon')
            } else {
                callback(500)
            }
        })
    } else {
        callback(405)
    }
}

// Public Assets handlers
handlers.public = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Get the file name being requested
        let trimmedAssetName = data.trimedPath.replace('public/', '').trim()
        if (trimmedAssetName.length) {
            // Read the asset data
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {
                if (!err && data) {
                    // Determine the content type
                    let contentType = 'plain'

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css'
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png'
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg'
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon'
                    }
                    // callback
                    callback(200, data, contentType)
                } else {
                    callback(500)
                }
            })
        } else {
            callback(404)
        }
    } else {
        callback(405)
    }
}


/*
 * JSON API handlers
 *
 */


handlers.exampleError = (data, callback) => {
    let error = new Error('This is example error')
    throw (error)
}

// users handlers
handlers.users = (data, callback) => {
    let acceptableMethods = ['get', 'post', 'put', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405)
    }
}

// Container for users sub methods
handlers._users = {}

// users - get
// Required field : phone
// Optional fields : none
handlers._users.get = (data, callback) => {
    let phone = typeof (data.queryObj.phone) == 'string' && data.queryObj.phone.trim().length == 11 ? data.queryObj.phone.trim() : false;

    // Check the phone number is valid
    if (phone) {
        // Check token is valid
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._tokens.verify(token, phone, (validToken) => {
            if (validToken) {
                // Lookup the users directory
                _data.read("users", phone, (err, data) => {
                    if (!err && data) {
                        // Remove the hashed password from original data object
                        delete data.hashedPassword
                        callback(200, data)
                    } else {
                        callback(404, { "Error": "Could not find user." })
                    }
                })
            } else {
                callback(403, { "Error": "Token is not present in the header or an invalid token is sent" })
            }
        })
    } else {
        callback(400, { "Error": "Missing required field." })
    }
}

// users - post
// Required fields : firstName , lastName , phone , password , tosAgreement
// Optional fields : none
handlers._users.post = (data, callback) => {
    // Check that all fields are filled out
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement ? data.payload.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, (err, data) => {
            if (err) {
                // User doesn't exist and hash the password
                let hashedPassword = helpers.hash(password)

                if (hashedPassword) {
                    // Create the user object
                    let user = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement
                    }

                    // Store the user to data directory
                    _data.create('users', phone, user, (err) => {
                        if (!err) {
                            callback(200)
                        } else {
                            callback(500, { 'Error': "Could not create new user." })
                        }
                    })
                } else {
                    callback(500, { "Error": 'Could not hash the new user\'s password' })
                }
            } else {
                callback(400, { 'Error': 'User already exists.' })
            }
        })
    } else {
        callback(400, { 'Error': 'Required data does not exist.' })
    }

}

// users - put
// Required fields : phone
// Optional fields : firstName , lastName , password (at least one of them must be included)
handlers._users.put = (data, callback) => {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;

    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone) {
        if (firstName || lastName || password) {
            // Check token is valid
            let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
            handlers._tokens.verify(token, phone, (validToken) => {
                if (validToken) {
                    // Lookup the user
                    _data.read('users', phone, (err, userData) => {
                        if (!err && userData) {
                            // Update the necessary fields
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password)
                            }

                            // update the data
                            _data.update("users", phone, userData, (err) => {
                                if (!err) {
                                    callback(200)
                                } else {
                                    callback(500, { "Error": "Internal Server Error" })
                                }
                            })
                        } else {
                            callback(404, { "Error": "The specified user doesn't exist." })
                        }
                    })
                } else {
                    callback(403, { "Error": "Token is not present in the header or an invalid token is sent" })
                }
            })
        } else {
            callback(400, { "Error": "Missing data to update" })
        }
    } else {
        callback(400, { "Error": "Missing required field." })
    }
}

// users - delete
// Required field : phone
// Optional field : none
handlers._users.delete = (data, callback) => {
    let phone = typeof (data.queryObj.phone) == 'string' && data.queryObj.phone.trim().length == 11 ? data.queryObj.phone.trim() : false;
    if (phone) {
        // Check token is valid
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._tokens.verify(token, phone, (validToken) => {
            if (validToken) {
                // Lookup the user
                _data.read("users", phone, (err, userData) => {
                    if (!err && userData) {
                        // Delete the user
                        _data.delete("users", phone, (err) => {
                            if (!err) {
                                // Delete all the checks related to this user
                                let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []

                                let checksToDelete = userChecks.length
                                if (checksToDelete) {
                                    let checkDeleted = 0
                                    let deletionErrors = false

                                    // Remove each check
                                    userChecks.forEach(checkID => {
                                        _data.delete("checks", checkID, (err) => {
                                            if (err) {
                                                deletionErrors = true
                                            }
                                            checkDeleted++;
                                            if (checksToDelete == checkDeleted) {
                                                if (!deletionErrors) {
                                                    callback(200)
                                                } else {
                                                    callback(500, { "Error": "Could not delete the user's checks" })
                                                }
                                            }
                                        })
                                    });
                                } else {
                                    callback(200)
                                }
                            } else {
                                callback(500, { "Error": "Could not delete  the user" })
                            }
                        })
                    } else {
                        callback(404, { "Error": "This specified user doesn't exist." })
                    }
                })
            } else {
                callback(403, { "Error": "Token is not present in the header or an invalid token is sent" })
            }
        })
    } else {
        callback(400, { "Error": "Missing required field." })
    }
}


// tokens handlers
handlers.tokens = (data, callback) => {
    let acceptableMethods = ['get', 'post', 'put', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback)
    } else {
        callback(405)
    }
}

// Container for token sub methods
handlers._tokens = {}


// token - get
// Required fields : id
// Optional fields : none
handlers._tokens.get = (data, callback) => {
    let id = typeof (data.queryObj.id) == 'string' && data.queryObj.id.trim().length ? data.queryObj.id.trim() : false;
    // Check id
    if (id) {
        // Lookup the tokens
        _data.read("tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(404, { "Error": "Missing required field" })
    }
}

// token - post
// Create a token for a valid user
// Required fields : phone and password
// Optional fields : none
handlers._tokens.post = (data, callback) => {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {
        // Lookup the user
        _data.read("users", phone, (err, userData) => {
            if (!err && userData) {
                // Hash the user's given password and compare with the stored one
                let hashedPassword = helpers.hash(password)
                if (hashedPassword == userData.hashedPassword) {
                    // Create a new token with random string
                    // Set the expire time 1 hour
                    let tokenID = helpers.createRandomString(20)
                    let expires = Date.now() + 1000 * 60 * 60

                    // Construct token object
                    let tokenObj = {
                        phone,
                        id: tokenID,
                        expires
                    }

                    // Store the token object
                    _data.create('tokens', tokenID, tokenObj, (err) => {
                        if (!err) {
                            callback(200, tokenObj)
                        } else {
                            callback(500, { "Error": "Could not create new token." })
                        }
                    })
                } else {
                    callback(405, { "Error": "Invalid credentials." })
                }
            } else {
                callback(400, { "Error": "This user doesn\'t exist." })
            }
        })
    } else {
        callback(400, { "Error": "Missing required fields" })
    }
}

// token - put
// Required fields : id , extend
// Optional fields : none
handlers._tokens.put = (data, callback) => {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    if (id && extend) {
        // Lookup the token
        _data.read("tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                // Check the token whether expired or not
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60

                    _data.update("tokens", id, tokenData, (err) => {
                        if (!err) {
                            callback(200)
                        } else {
                            callback(500, { "Error": "Could not update token" })
                        }
                    })
                } else {
                    callback(400, { "Error": "This token is already expired and can\'t be updated" })
                }
            } else {
                callback(400, { "Error": "Token is not found" })
            }
        })
    } else {
        callback(400, { "Error": "Missing required fields." })
    }
}

// token - delete
// Required fields : id
// Optional fields : none
handlers._tokens.delete = (data, callback) => {
    let id = typeof (data.queryObj.id) == 'string' && data.queryObj.id.trim().length == 20 ? data.queryObj.id.trim() : false;

    if (id) {
        // Lookup the token
        _data.read("tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                // Delete the token
                _data.delete("tokens", id, (err) => {
                    if (!err) {
                        callback(200)
                    } else {
                        callback(500, { "Error": "Could not delete the token" })
                    }
                })
            } else {
                callback(404, { "Error": "Token doesn\'t exist" })
            }
        })
    } else {
        callback(400, { "Error": "Missing required field." })
    }
}

// Verify a given token id is valid for a given user
handlers._tokens.verify = (id, phone, callback) => {
    if (id && phone) {
        // Lookup the token
        _data.read("tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                    callback(true)
                } else {
                    callback(false)
                }
            } else {
                callback(false)
            }
        })
    } else {
        callback(false)
    }
}

// checks handlers
handlers.checks = (data, callback) => {
    let acceptableMethods = ['get', 'post', 'put', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback)
    } else {
        callback(405)
    }
}

// Container for checks sub methods
handlers._checks = {}

// Checks - post
// Required fields : protocol , URL , method , successCodes(Array) , timeoutSeconds
// Optional fields : none
handlers._checks.post = (data, callback) => {
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false
    let url = typeof (data.payload.url) == 'string' && data.payload.url.length ? data.payload.url : false
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    let timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false

    if (protocol && url && method && successCodes && timeoutSeconds) {
        let token = typeof (data.headers.token) == 'string' && data.headers.token.length ? data.headers.token : false
        // Lookup the token
        _data.read("tokens", token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = tokenData.phone

                // Lookup the user
                _data.read("users", userPhone, (err, userData) => {
                    if (!err && userData) {
                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []

                        // Checks the max-checks-per-user
                        if (userChecks.length < config.maxChecks) {

                            // verify the given url has DNS entries and therefore it resolve
                            let parsedUrl = _url.parse(protocol + '://' + url, true)
                            let hostName = typeof (parsedUrl.hostname) == 'string' && parsedUrl.hostname.length ? parsedUrl.hostname : false

                            dns.resolve(hostName, (err, records) => {
                                if (!err && records) {
                                    // Create a random id for checks
                                    let checkID = helpers.createRandomString(20)

                                    // Create the check object and keep the phone as user's reference
                                    let checkObj = {
                                        "id": checkID,
                                        userPhone,
                                        protocol,
                                        method,
                                        url,
                                        successCodes,
                                        timeoutSeconds
                                    }

                                    // Store the check object 
                                    _data.create("checks", checkID, checkObj, (err) => {
                                        if (!err) {
                                            // Add the check id to the user's object
                                            userData.checks = userChecks
                                            userData.checks.push(checkID)

                                            // Update the check object
                                            _data.update("users", userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200, checkObj)
                                                } else {
                                                    callback(500, { "Error": "Could not update the user with new check." })
                                                }
                                            })
                                        } else {
                                            callback(500, { "Error": "Could not create check for this user." })
                                        }
                                    })
                                } else {
                                    callback(400, { "Error": "The hostname of the url entered did not resolve any DNS entries" })
                                }
                            })
                        } else {
                            callback(400, { "Error": "This user has already used maximum number of checks" })
                        }
                    } else {
                        callback(403)
                    }
                });
            } else {
                callback(403)
            }
        })
    } else {
        callback(403, { "Error": "Missing required fields" })
    }
}


// Checks-get
// Required fields : id(checkID)
// Optional fields : none
handlers._checks.get = (data, callback) => {
    let id = typeof (data.queryObj.id) == 'string' && data.queryObj.id.trim().length == 20 ? data.queryObj.id : false

    if (id) {
        // lookup the check
        _data.read("checks", id, (err, checkData) => {
            if (!err && checkData) {
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
                // Check valid token for that check to access
                handlers._tokens.verify(token, checkData.userPhone, (validToken) => {
                    if (validToken) {
                        callback(200, checkData)
                    } else {
                        callback(403, { "Error": "Token is missing in the headers or token is invalid." })
                    }
                })
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, { "Error": "Missing required fields" })
    }
}

// checks - put
// Required fields : id(checkID)
// Optional fields : protocol , URL , method , successCodes(Array) , timeoutSeconds
handlers._checks.put = (data, callback) => {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id : false

    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false
    let url = typeof (data.payload.url) == 'string' && data.payload.url.length ? data.payload.url : false
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    let timeoutSeconds = typeof (data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the checks
            _data.read("checks", id, (err, checkData) => {
                if (!err && checkData) {
                    // Get the token to check authenticity
                    let token = typeof (data.headers.token) == 'string' ? data.headers.token : false

                    // Check token
                    handlers._tokens.verify(token, checkData.userPhone, (validToken) => {
                        if (validToken) {
                            if (protocol) {
                                checkData.protocol = protocol
                            }
                            if (method) {
                                checkData.method = method
                            }
                            if (url) {
                                checkData.url = url
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds
                            }

                            // Store the new update
                            _data.update("checks", id, checkData, (err) => {
                                if (!err) {
                                    callback(200, checkData)
                                } else {
                                    callback(500, { "Error": "Could not update the checks" })
                                }
                            })
                        } else {
                            callback(403, { "Error": "Token is missing or Invalid token." })
                        }
                    })
                } else {
                    callback(404, { "Error": "Check does not exist" })
                }
            })
        } else {
            callback(400, { "Error": "Missing fields to update" })
        }
    } else {
        callback(400, { "Error": "Missing required field." })
    }
}

// Checks - delete
// required fields: id(checkID)
// Optional fields : none
handlers._checks.delete = (data, callback) => {
    let id = typeof (data.queryObj.id) == 'string' && data.queryObj.id.trim().length == 11 ? data.queryObj.id.trim() : false;
    if (id) {
        // Lookup check
        _data.read("checks", id, (err, checkData) => {
            if (condition) {
                // Check token is valid
                let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
                handlers._tokens.verify(token, checkData.userPhone, (validToken) => {
                    if (validToken) {
                        // Delete the checks
                        _data.delete("checks", id, (err) => {
                            if (!err) {
                                // Lookup the user
                                _data.read("users", checkData.userPhone, (err, userData) => {
                                    if (!err && userData) {
                                        let userChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []

                                        // Remove the deleted check if from the user's checks
                                        let checkPosition = userChecks.indexOf(id)
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1)
                                            // Update the user data
                                            _data.update("users", checkData.userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200)
                                                } else {
                                                    callback(500, { "Error": "Could not update the user's checks" })
                                                }
                                            })
                                        } else {
                                            callback(500, { "Error": "Could not remove the check from user's checks list." })
                                        }
                                    } else {
                                        callback(500, { "Error": "This specified user doesn't exist." })
                                    }
                                })
                            } else {
                                callback(500, { "Error": "Could delete the check" })
                            }
                        })
                    } else {
                        callback(403, { "Error": "Token is not present in the header or an invalid token is sent" })
                    }
                })
            } else {
                callback(404, { "Error": "Check does not exist." })
            }
        })

    } else {
        callback(400, { "Error": "Missing required field." })
    }
}


// ping handler
handlers.ping = (data, callback) => {
    // Callback a http status code and payload object
    callback(200, { 'name': 'Rabby' })
}

// NotFound handlers
handlers.notFound = (data, callback) => {
    callback(404)
}

module.exports = handlers