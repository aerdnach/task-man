const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

function isValidMongooseId (id) {
    return mongoose.Types.ObjectId.isValid(id)
}

module.exports = {
    isValidMongooseId: isValidMongooseId
}