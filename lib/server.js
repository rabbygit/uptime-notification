/*
 * Server related tasks
 *
 */


// Dependencies
const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const handlers = require('./handlers')
const helpers = require('./helpers')
const path = require('path')

// Instantiate the server module object
let server = {}

// Instantiate the http server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res)
})

// Options for https server
// server.httpsServerOptions = {
//     'key': fs.readFileSync(path.join(__dirname , '/../https/key.pem')),
//     'cert': fs.readFileSync(path.join(__dirname , '/../https/cert.pem'))
// }

// Instantiate the https server
// server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
//     server.unifiedServer(req, res)
// })

// Unified  server which holds all the logic for both http and https server
server.unifiedServer = (req, res) => {
    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true)

    // Get the path
    let path = parsedUrl.pathname
    let trimedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the method
    let method = req.method.toLowerCase()

    // Get the query string as an object
    let queryObj = parsedUrl.query

    // Get the headers
    let headers = req.headers

    // Get the payload if have any

    let decoder = new StringDecoder('utf-8')
    let buffer = ''

    // If request object has any payload this function will be emitted
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    // This function always emits
    req.on('end', () => {
        buffer += decoder.end()

        // Choose the handler this request should go
        let chosenHandler = typeof server.router[trimedPath] !== 'undefined' ? server.router[trimedPath] : handlers.notFound

        // Construct the data 
        let data = {
            trimedPath,
            method,
            queryObj,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by handler or default to 200
            statusCode = typeof statusCode == 'number' ? statusCode : 200;

            // Use the payload called back by handler or default to an empty object
            payload = typeof payload == 'object' ? payload : {}

            //  Convert the payload to string
            let payloadString = JSON.stringify(payload)

            //Set response to JSON
            res.setHeader('Content-Type', 'application/json')
            // Set the status code to response 
            res.writeHead(statusCode)
            // Send the response 
            res.end(payloadString)
        })
    })
}


// Define a request router
server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
}

// Init script
server.init = () => {
    // Start the http server
    server.httpServer.listen(config.httpPort, () => {
        console.log(`Server is listening on port ${config.httpPort} for http request`)
    })

    // Start the https server
    // server.httpsServer.listen(config.httpsServer , ()=>{
    //     console.log(`Server is lstening on ${config.httpsServer} for https request`)
    // })
}

// Export the module
module.exports = server