const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', function (req, res) {
    res.send('This is an API collection. Plese see <a href="https://github.com/aerdnach/task-man">github.com/aerdnach/task-man</a> for istruction about how to use it.');  
});

module.exports = app