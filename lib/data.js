//Dependencies
const { dir } = require('console')
const fs = require('fs')
const path = require('path')

//Model scarffolding
const lib = {}

lib.basedir = path.join(__dirname, '/../.data/')

//Write data to file
lib.create = (dir, file, data, callback) =>{
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data)

            fs.writeFile(fileDescriptor, stringData, (err2) =>{
                if(!err){
                    fs.close(fileDescriptor, (err3) =>{
                        if(!err3){
                            callback(false)
                        }
                        else{
                            callback('Error closing the file...')
                        }
                    })
                }
                else{
                    callback('Error writting to the file!')
                }
            })
        }
        else{
            callback('Could not create new file. It may already exist!')
        }
    })
}

//Read data from file
lib.read = (dir, file, callback) =>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) =>{
        callback(err, data)
    })
}
module.exports = lib