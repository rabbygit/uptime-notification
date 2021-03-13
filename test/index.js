/*
 * Test runner
 * To run this file run -> node test
 */

// Application logic for the test runner
_app = {}

// Container for the test
_app.tests = {}

// Add on the unit test
_app.tests.unit = require('./unit')

// Count all the tests
_app.countTests = () => {
    let counter = 0

    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key]

            for (const testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++
                }
            }
        }
    }

    return counter
}

// Product a test outcome report
_app.produceTestReport = function (limit, successes, errors) {
    console.log("");
    console.log("--------BEGIN TEST REPORT--------");
    console.log("");
    console.log("Total Tests: ", limit);
    console.log("Pass: ", successes);
    console.log("Fail: ", errors.length);
    console.log("");

    // If there are errors, print them in detail
    if (errors.length > 0) {
        console.log("--------BEGIN ERROR DETAILS--------");
        console.log("");
        errors.forEach(function (testError) {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log("");
        });
        console.log("");
        console.log("--------END ERROR DETAILS--------");
    }


    console.log("");
    console.log("--------END TEST REPORT--------");

};

// Run all the tests and collect the errors and success
_app.runTests = () => {
    let errors = []
    let successes = 0
    let limit = _app.countTests()
    let counter = 0

    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key]

            for (const testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function () {
                        let tempTestName = testName;
                        let testValue = subTests[testName]

                        // Call the test
                        try {
                            testValue(function () {
                                // If it calls back then it succeeded and log it in green
                                console.log('\x1b[32m%s\x1b[0m', tempTestName)
                                counter++
                                successes++
                                if (limit == counter) {
                                    _app.produceTestReport(limit, successes, errors)
                                }
                            })
                        } catch (error) {
                            // Catch the error and log it in red
                            errors.push({
                                name: testName,
                                error
                            })

                            console.log('\x1b[31m%s\x1b[0m', tempTestName)
                            counter++
                            if (limit == counter) {
                                _app.produceTestReport(limit, successes, errors)
                            }
                        }
                    })()
                }
            }
        }
    }
}

// Run the test
_app.runTests()