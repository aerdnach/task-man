const express = require('express')
const mongoose = require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// USER

app.post('/users', (req, res) => {
    console.log('POST /users received data' + JSON.stringify(req.body))
    const user = new User(req.body)
    
    user
        .save()
        .then(() => {
            console.log('POST /users response data: ' + JSON.stringify(user))
            res.status(201).send(user)
        })
        .catch((reason) => {
            console.log('POST /users error: ' + JSON.stringify(reason))
            res.status(400).send(reason)
        })
})

app.get('/users', (req, res) => {
    console.log('GET /users received data' + JSON.stringify(req.body))
    User
        .find({}).then((users) => {
            console.log('GET /users response data' + JSON.stringify(users))
            res
                .send(users)
        })
        .catch((reason) => {
            console.log('GET /users error: ' + reason)
            res
                .status(500)
                .send(reason._message)
        })
})

app.get('/users/:id', (req, res) => {
    console.log('GET /users:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /users:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    User.
        findById(req.params.id)
            .then((user) => {
                if (!user) {
                    console.log('GET /users:id cannot retrieve ' + req.params.id)
                    return res.status(400).send('cannot retrieve user')
                }

                console.log('GET /users response data' + JSON.stringify(user))
                res.send(user)
            })
            .catch((reason) => {
                console.log('GET /users:id error: ' + reason)
                res
                    .status(500)
                    .send(reason._message)
            })
})

// TASK 

app.post('/tasks', (req, res) => {
    console.log('POST /tasks received data' + JSON.stringify(req.body))
    const task = new Task(req.body)

    task
        .save()
        .then(() => {
            console.log('POST /tasks response data: ' + JSON.stringify(task))
            res
                .status(201)
                .send(task)
        })
        .catch((reason) => {
            console.log('POST /tasks error: ' + reason)
            res
                .status(400)
                .send(reason._message)
    }) 
})

app.get('/tasks', (req, res) => {
    console.log('GET /tasks received data' + JSON.stringify(req.body))
    Task
        .find({}).then((tasks) => {
            console.log('GET /tasks response data' + JSON.stringify(tasks))
            res
                .send(tasks)
        })
        .catch((reason) => {
            console.log('GET /tasks error: ' + reason)
            res
                .status(500)
                .send(reason._message)
        })
})

app.get('/tasks/:id', (req, res) => {
    console.log('GET /utaskssers:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /tasks:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    Task.
        findById(req.params.id)
            .then((task) => {
                if (!task) {
                    console.log('GET /tasks:id cannot retrieve ' + req.params.id)
                    return res.status(400).send('cannot retrieve task')
                }

                console.log('GET /tasks response data' + JSON.stringify(task))
                res.send(task)
            })
            .catch((reason) => {
                console.log('GET /users:id error: ' + reason)
                res
                    .status(500)
                    .send(reason._message)
            })
})

// Launch server

app.listen(port, () => {
    console.log('Server up and running on port ' + port)
})