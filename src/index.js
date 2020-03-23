const express = require('express')
const mongoose = require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// USER

app.post('/users', async (req, res) => {
    console.log('POST /users received data' + JSON.stringify(req.body))
    const user = new User(req.body)
    
    try{
        await user.save()
        console.log('POST /users response data: ' + JSON.stringify(user))
        res.status(201).send(user)
    } catch (e) {
        console.log('POST /users error: ' + JSON.stringify(e))
        res.status(400).send(e)
    }

})

app.get('/users', async (req, res) => {
    console.log('GET /users received data' + JSON.stringify(req.body))

    try {
        const users = await User.find({})
        console.log('GET /users response data' + JSON.stringify(users))
        res.send(users)
    } catch (e) {
        console.log('GET /users error: ' + e)
        res.status(500).send(e)
    }

})

app.get('/users/:id', async (req, res) => {
    console.log('GET /users:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /users:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            console.log('GET /users:id cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve user')
        }

        console.log('GET /users response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log('GET /users:id error: ' + e)
        res.status(500).send(e)
    }
    
})

// TASK 

app.post('/tasks', async (req, res) => {
    console.log('POST /tasks received data' + JSON.stringify(req.body))
    const task = new Task(req.body)

    try {
        console.log('POST /tasks response data: ' + JSON.stringify(task))
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log('POST /tasks error: ' + reason)
        res.status(400).send(reason._message)
    }
})

app.get('/tasks', async (req, res) => {
    console.log('GET /tasks received data' + JSON.stringify(req.body))
    
    try {
        const tasks = await Task.find({})
        console.log('GET /tasks response data' + JSON.stringify(tasks))
        res.send(tasks)
    } catch (e) {
        console.log('GET /tasks error: ' + e)
        res.status(500).send(e)
    }
})

app.get('/tasks/:id', async (req, res) => {
    console.log('GET /utaskssers:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /tasks:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            console.log('GET /tasks:id cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve task')
        }

        console.log('GET /tasks response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log('GET /users:id error: ' + e)
        res.status(500).send(e)
    }
})

// Launch server

app.listen(port, () => {
    console.log('Server up and running on port ' + port)
})