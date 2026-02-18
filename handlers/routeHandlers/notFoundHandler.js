//Model scarffoldiing
const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message : 'The page is not found!'
    })
}

module.exports = handler