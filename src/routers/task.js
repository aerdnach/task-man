const mongoose = require('../db/mongoose.js')
const express = require('express')
const router = new express.Router()
const authMdw = require('../middleware/auth.js')
const Task = require('../models/task.js')

// Create Task

router.post('/task', authMdw, async (req, res) => {
    console.log('POST ' + req.path + ' received data' + JSON.stringify(req.body))
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        console.log('POST ' + req.path + ' response data: ' + JSON.stringify(task))
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log('POST ' + req.path + ' error: ' + reason)
        res.status(400).send(reason._message)
    }
})

// Get all task for logged user

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc

router.get('/task', authMdw, async (req, res) => {
    const match = {}
    const sort = {}

    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.query))
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user.tasks))
        res.send(req.user.tasks)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(500).send(e)
    }
})

// Get Task By ID for logged user

router.get('/task/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve task')
        }

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(500).send(e)
    }
})

// Update task by ID for logged user

router.patch('/task/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.params))
    
    const requestedUpdates = Object.keys(req.body)
    const allowedField = ['description', 'completed']
    const isAllowedUpdate = requestedUpdates.every((update) => allowedField.includes(update))

    if (!isAllowedUpdate) {
        console.log(req.method + ' ' + req.path + ' invalid updates')
        return res.status(400).send('Invalid Updates')   
    }

    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('Task not found')
        }

        allowedField.forEach((update) => task[update] = req.body[update])
        await task.save()

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log(req.method + ' ' + req.path + 'd error: ' + e)
        res.status(400).send(e)
    }
})

// Delete task by ID for logged user  

router.delete('/task/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve task')
    }
    
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            console.log(req.method + ' ' + req.path + ' cannot retrieve user ' + req.params.id)
            return res.status(404).send('Task not found')
        }
        
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(task))
        res.send(task)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

module.exports = router