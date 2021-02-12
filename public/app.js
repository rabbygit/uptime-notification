/*
 * Javascript logic for front end
 *
 */

// Container for frontend application
const app = {}

// Config
app.config = {
    'sessionToken': false
}

// AJAX client for RESTful API
app.client = {};

// Interface for making API calls
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {

    // Set defaults
    headers = typeof (headers) == 'object' && headers !== null ? headers : {}
    path = typeof (path) == 'string' ? path : '/'
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET'
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {}
    payload = typeof (payload) == 'object' && payload !== null ? payload : {}
    callback = typeof (callback) == 'function' ? callback : false;

    // For each query string parameter sent , add it to the path
    let requestUrl = path + '?';
    let counter = 0;
    for (const key in queryStringObject) {
        if (queryStringObject.hasOwnProperty(key)) {
            counter++;
            // If at least one parameter already added , then add a and(&) sign
            if (counter > 1) {
                requestUrl += '&'
            }
            // Add the key and value
            requestUrl += key + '=' + queryStringObject[key]
        }
    }

    // Form the http request as JSON
    let xhr = new XMLHttpRequest()
    xhr.open(method, requestUrl, true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    // For each header sent , add to the header
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key])
        }
    }

    // If there is a session token set , add to the header
    if (app.config.sessionToken) {
        xhr.setRequestHeader('token', app.config.sessionToken.id)
    }

    // When response comes back . handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let statusCode = xhr.status;
            let responseReturned = xhr.responseText

            // Callback if requested
            if (callback) {
                try {
                    let parsedResponse = JSON.parse(responseReturned)
                    callback(statusCode, parsedResponse)
                } catch (error) {
                    callback(statusCode, false)
                }
            }
        }
    }

    //Send the payload as JSON
    let payloadString = JSON.stringify(payload)
    xhr.send(payloadString)
}
