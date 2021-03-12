/*
 * Primary file for the API
 *
 */


// Strict mode
'use strict'


// Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')

// Declare the app
let app = {}


// if this program runs in normal mode , the above line will not throw error but if it runs in strict mode it will throw reference error
foo = 'bar'

// Init function
app.init = () => {
    // Start the server
    server.init()

    // Start the workers
    workers.init()

    // Start the cli
    setTimeout(function () {
        cli.init()
    }, 50)
}


// Execute
app.init()

// Export the app
module.exports = app