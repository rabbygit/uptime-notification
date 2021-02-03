/*
 * Library for creating and editing data
 *
 */

// Dependencies
const fs = require('fs')
const path = require('path')
const { fileURLToPath } = require('url')
const helpers = require('./helpers')

// Set the base directory for data storing
let baseDir = path.join(__dirname, '/../.data/')

// Container for the module to be exported
let lib = {}

// Write data to a file
lib.create = (dir, file, data, callback) => {
    // Open the file
    fs.open(`${baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert the data to string
            let stringData = JSON.stringify(data)

            // write on the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    // Close the file
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false)
                        } else {
                            callback("Error in closing the file.")
                        }
                    })
                } else {
                    callback("Error in writing data to file.")
                }
            })
        } else {
            callback('Could not open file.It may already exist.')
        }
    })
}

// Read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err && data) {
            let parsedData = helpers.parseJsonToObject(data)
            callback(false, parsedData)
        } else {
            callback(err, data)
        }
    })
}

// Update the file and write
lib.update = (dir, file, data, callback) => {
    // Open the file
    fs.open(`${baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert the data to string
            let stringData = JSON.stringify(data)

            // Truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    // Write data to file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            // Close the file
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback("Error in closing the file")
                                }
                            })
                        } else {
                            callback("Error in writing file.")
                        }
                    })
                } else {
                    callback("Error in truncating the file.")
                }
            })
        } else {
            callback('Could not open the file.It may not exist.')
        }
    })
}


lib.delete = (dir, file, callback) => {
    // Unlink the file from file system
    fs.unlink(`${baseDir}${dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback("Error in deleting the file.")
        }
    })
}

// List the files of a directory
lib.list = (dir, callback) => {
    fs.readdir(baseDir + dir + '/', (err, data) => {
        if (!err && data.length) {
            let fileNames = []
            data.forEach(fileName => {
                fileNames.push(fileName.replace(".json", ""))
            });

            callback(false, fileNames)
        } else {
            callback(err, data)
        }
    })
}

// Export the module
module.exports = lib