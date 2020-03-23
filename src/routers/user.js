const mongoose = require('../db/mongoose.js')
const express = require('express')
const router = new express.Router()
const User = require('../models/user.js')

router.post('/users', async (req, res) => {
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

router.get('/users', async (req, res) => {
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

router.get('/users/:id', async (req, res) => {
    console.log('GET /users/:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('GET /users/:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            console.log('GET /users/:id cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve user')
        }

        console.log('GET /users/:id response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log('GET /users/:id error: ' + e)
        res.status(500).send(e)
    }
    
})

router.patch('/users/:id', async (req, res) => {
    console.log('PATCH /users/:id ' + JSON.stringify(req.params))
    
    try {
        const requetedUpdates = Object.keys(req.body)
        const allowedField = ["name", "email", "age", "password"]
        const isAllowedUpdate = requetedUpdates.every((update) => allowedField.includes(update))

        if (!isAllowedUpdate) {
            console.log('PATCH /users/:id invalid updates')
            return res.status(400).send('Invalid Updates')   
        }

        if (!mongoose.isValidMongooseId(req.params.id)) {
            console.log('PATCH /users/:id cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve user')
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if (!user) {
            console.log('PATCH /users/:id cannot retrieve ' + req.params.id)
            return res.status(404).send('User not found')
        }

        console.log('PATCH /users/:id response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log('PATCH /users/:id error: ' + e)
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    console.log('DELETE /users/:id received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log('DELETE /users/:id cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            console.log('DELETE /users/:id cannot retrieve user ' + req.params.id)
            return res.status(404).send('User not found')
        }
        
        console.log('DELETE /users/:id response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log('DELETE /users/:id error: ' + e)
        res.status(400).send(e)
    }
})

module.exports = router