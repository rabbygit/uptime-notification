/*
 * CLI related tasks
 *
 */

// Dependencies
const readline = require('readline')
const util = require('util')
const debug = util.debuglog('cli')
const events = require('events')
class _events extends events { }
const e = new _events()

// Instantiate the cli object
const cli = {}


// input processor
cli.processInput = (str) => {
    str = typeof (str) == 'string' && str.trim().length ? str.trim() : false

    // Only process the input if user actually wrote something
    if (str) {
        // Codify the unique strings that identify the different unique questions allowed be the asked
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        // Go through the possible inputs, emit event when a match is found
        let matchFound = false
        let counter = 0

        uniqueInputs.some(input => {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true
                // Emit event matching the unique input, and include the full string given
                e.emit(input, str);
                return true
            }
        })

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log("Sorry, try again");
        }
    }
}

// init script
cli.init = () => {
    // Send to console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

    // Start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    })

    // Create an initial prompt
    _interface.prompt()

    // handle each line of input separately
    _interface.on('line', (str) => {
        // Send to the input processor
        cli.processInput(str)

        // Re initialize the prompt
        _interface.prompt()
    })

    //If the user stops the CLI , kill associated processes
    _interface.on('close', () => {
        process.exit(0)
    })
}


// Export the module
module.exports = cli