/*
 * Unit test
 *
 */


// Dependencies
const helpers = require('../lib/helpers')
const assert = require('assert')
const logs = require('../lib/logs')
const exampleDebuggingProblem = require('../lib/exampleDebuggingProblem')

// Container
let unit = {}

// Assert that getANumber function return a number
unit['helper.getANumber should return a number'] = (done) => {
    let val = helpers.getANumber()
    assert.strictEqual(typeof (val), 'number')
    done()
}

// Assert that getANumber function return 1
unit['helper.getANumber should return 1'] = (done) => {
    let val = helpers.getANumber()
    assert.strictEqual(val, 1)
    done()
}

// Assert that getANumber function return 2
unit['helper.getANumber should return 2'] = (done) => {
    let val = helpers.getANumber()
    assert.strictEqual(val, 2)
    done()
}

// Logs.list should callback an array and false error
unit['logs.list should callback a false error and an array of log names'] = (done) => {
    logs.list(true, (error, logFileNames) => {
        assert.strictEqual(error, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    })
}

// Logs.truncate should not throw if the logId doesnt exist
unit['logs.truncate should not throw if the logId does not exist, should callback an error instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I do not exist', function (err) {
            assert.ok(err);
            done();
        })
    }, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw when called'] = function (done) {
    assert.doesNotThrow(function () {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
};


// Export the module
module.exports = unit