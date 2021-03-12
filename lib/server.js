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
const util = require('util');
const debug = util.debuglog('server');

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

        // Check if requested route contains public path
        chosenHandler = trimedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler


        // Construct the data 
        let data = {
            trimedPath,
            method,
            queryObj,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        // Route the request to the handler specified in the router
        try {
            chosenHandler(data, function (statusCode, payload, contentType) {
                server.processHandlerResponse(res, method, trimedPath, statusCode, payload, contentType);

            });
        } catch (e) {
            debug(e);
            server.processHandlerResponse(res, method, trimedPath, 500, { 'Error': 'An unknown error has occured' }, 'json');
        }
    })
}

// Process the response from the handler
server.processHandlerResponse = function (res, method, trimedPath, statusCode, payload, contentType) {
    // Determine the type of response (fallback to JSON)
    contentType = typeof (contentType) == 'string' ? contentType : 'json';

    // Use the status code returned from the handler, or set the default status code to 200
    statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

    // Return the response parts that are content-type specific
    var payloadString = '';
    if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof (payload) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
    }

    if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof (payload) == 'string' ? payload : '';
    }

    if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }

    if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }

    if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }

    if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }

    if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof (payload) !== 'undefined' ? payload : '';
    }

    // Return the response-parts common to all content-types
    res.writeHead(statusCode);
    res.end(payloadString);

    // If the response is 200, print green, otherwise print red
    if (statusCode == 200) {
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimedPath + ' ' + statusCode);
    } else {
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimedPath + ' ' + statusCode);
    }
};



// Define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checksList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'example/error': handlers.exampleError,
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