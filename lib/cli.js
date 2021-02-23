/*
 * CLI related tasks
 *
 */

// Dependencies
const readline = require('readline')
const util = require('util')
const debug = util.debuglog('cli')
const events = require('events')
const { type } = require('os')
class _events extends events { }
const e = new _events()

// Instantiate the cli object
const cli = {}

// Input handlers
e.on('man', (str) => {
    cli.responders.help();
});

e.on('help', (str) => {
    cli.responders.help();
});

e.on('exit', (str) => {
    cli.responders.exit();
});

e.on('stats', (str) => {
    cli.responders.stats();
});

e.on('list users', (str) => {
    cli.responders.listUsers();
});

e.on('more user info', (str) => {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
    cli.responders.listChecks(str);
});

e.on('more check info', (str) => {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', () => {
    cli.responders.listLogs();
});

e.on('more log info', (str) => {
    cli.responders.moreLogInfo(str);
});


// Responders object
cli.responders = {}


// Help / Man
cli.responders.help = () => {
    // Codify the commands and their explanations
    var commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underlying operating system and resource utilization',
        'List users': 'Show a list of all the registered (undeleted) users in the system',
        'More user info --{userId}': 'Show details of a specified user',
        'List checks --up --down': 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
        'More check info --{checkId}': 'Show details of a specified check',
        'List logs': 'Show a list of all the log files available to be read (compressed and uncompressed)',
        'More log info --{logFileName}': 'Show details of a specified log file',
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (const key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key]
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (let index = 0; index < padding; index++) {
                line += " ";
            }
            line += value
            console.log(line)
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();
};

// Create vertical line
cli.verticalSpace = (lines) => {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (let index = 0; index < lines; index++) {
        console.log('')
    }
}

// Create horizontal line across the line
cli.horizontalLine = () => {

    // Get the available screen size
    let width = process.stdout.columns;
    let line = ''
    for (let index = 0; index < width; index++) {
        line += '-'
    }
    console.log(line)
}

// Create centered text on the screen
cli.centered = (str) => {
    str = typeof (str) == 'string' && str.trim().length ? str.trim() : ""

    // Get the available width of the screen
    let width = process.stdout.columns

    // Calculate the left padding
    let leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let lines = ""
    for (let index = 0; index < leftPadding; index++) {
        lines += ' '
    }
    lines += str
    console.log(lines)
}

// Exit
cli.responders.exit = () => {
    process.exit(0);
};

// Stats
cli.responders.stats = () => {
    console.log("You asked for stats");
};

// List Users
cli.responders.listUsers = () => {
    console.log("You asked to list users");
};

// More user info
cli.responders.moreUserInfo = (str) => {
    console.log("You asked for more user info", str);
};

// List Checks
cli.responders.listChecks = () => {
    console.log("You asked to list checks");
};

// More check info
cli.responders.moreCheckInfo = (str) => {
    console.log("You asked for more check info", str);
};

// List Logs
cli.responders.listLogs = () => {
    console.log("You asked to list logs");
};

// More logs info
cli.responders.moreLogInfo = (str) => {
    console.log("You asked for more log info", str);
};




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