const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

function isValidMongooseId (id) {
    return mongoose.Types.ObjectId.isValid(id)
}

module.exports = {
    isValidMongooseId: isValidMongooseId
}