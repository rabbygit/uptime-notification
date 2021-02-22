/*
 * Primary file for the API
 *
 */

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/workers')
const cli = require('./lib/cli')

// Declare the app
let app = {}

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