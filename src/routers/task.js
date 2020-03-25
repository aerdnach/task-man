const mongoose = require('../db/mongoose.js')
const express = require('express')
const router = new express.Router()
const Task = require('../models/task.js')

router.post('/tasks', async (req, res) => {
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

router.get('/tasks', async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
    console.log('GET /tasks/:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /tasks/:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            console.log('GET /tasks/:id cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve task')
        }

        console.log('GET /tasks/:id response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log('GET /tasks/:id error: ' + e)
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    console.log('PATCH /tasks/:id received data ' + JSON.stringify(req.params))
    
    const requestedUpdates = Object.keys(req.body)
    const allowedField = ['description', 'completed']
    const isAllowedUpdate = requestedUpdates.every((update) => allowedField.includes(update))

    if (!isAllowedUpdate) {
        console.log('PATCH /users/:id invalid updates')
        return res.status(400).send('Invalid Updates')   
    }

    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('PATCH /tasks/:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }

    try {
        const task = await Task.findById(req.params.id)
        allowedField.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task) {
            return res.status(404).send('Task not found')
        }

        console.log('PATCH /tasks/:id response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log('PATCH /tasks/:id error: ' + e)
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    console.log('DELETE /tasks/:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('DELETE /tasks/:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            console.log('DELETE /tasks/:id cannot retrieve user ' + req.params.id)
            return res.status(404).send('Task not found')
        }
        
        console.log('DELETE /tasks/:id response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log('DELETE /tasks/:id error: ' + e)
        res.status(400).send(e)
    }
})

module.exports = router