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

//Update existing file
lib.update = (dir, file, data, callback) =>{
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data)

            fs.ftruncate(fileDescriptor, (err2) =>{
                if(!err2){
                    fs.writeFile(fileDescriptor, stringData, (err3) =>{
                        if(!err3){
                            fs.close(fileDescriptor, (err4) =>{
                                if(!err4){
                                    callback(false)
                                }
                                else{
                                    callback('Error closing the file..')
                                }
                            })
                        }
                        else{
                            callback('Error writting to file')
                        }
                    })
                }
                else{
                    callback('Error trauncating the file...')
                }
            })
        }
        else{
            callback('Error updating in the file. File may not exists..')
        }
    })
}            

//Delete existing file 
lib.delete = (dir, file, callback) =>{
    //unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) =>{
        if(!err){
            callback(false)
        }
        else{
            callback('Error deleting file...')
        }
    })
}



//Export the lib module
module.exports = lib