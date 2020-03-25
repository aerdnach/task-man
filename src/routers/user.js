const mongoose = require('../db/mongoose.js')
const express = require('express')
const router = new express.Router()
const authMdw = require('../middleware/auth.js')
const User = require('../models/user.js')

// Login user

router.post('/users/login', async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        console.log(req.method + ' ' + req.path + ' response data: ' + JSON.stringify({user, token}))
        res.send({ user, token })
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + JSON.stringify(e.toString()))
        res.status(400).send('login error')
    }
})

// Logout user

router.post('/users/logout', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))

    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        console.log(req.method + ' ' + req.path + ' logout done for user ' + req.user._id + ' ' + req.user.name)
        res.send('logout done for user ' + req.user._id + ' ' + req.user.name)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error ' + JSON.stringify(e))
        res.status(500).send('logout error')
    }
})

// Logout user from all sessions

router.post('/users/logoutall', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))

    try  {
        req.user.tokens = []
        await req.user.save()
        console.log(req.method + ' ' + req.path + ' logout done for user ' + req.user._id + ' ' + req.user.name)
        res.send('logout done for all sessions for user ' + req.user._id + ' ' + req.user.name)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error ' + JSON.stringify(e))
        res.status(500).send('logout error')
    }
})

// Create user 

router.post('/users', async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data' + JSON.stringify(req.body))
    const user = new User(req.body)
    
    try{
        await user.save()
        const token = await user.generateAuthToken()
        console.log(req.method + ' ' + req.path + ' response data: ' + JSON.stringify({user, token}))
        res.status(201).send({user, token})
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + JSON.stringify(e))
        res.status(400).send(e)
    }
})

// Update logged user

router.patch('/users/me', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))

    const requestedUpdates = Object.keys(req.body)
    const allowedField = ['name', 'email', 'age', 'password']
    const isAllowedUpdate = requestedUpdates.every((update) => allowedField.includes(update))

    if (!isAllowedUpdate) {
        console.log(req.method + + ' ' + req.path + ' invalid updates')
        return res.status(400).send('Invalid Updates')   
    }

    try {
        allowedField.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send(req.user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

// Delete logged user

router.delete('/users/me', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))
    
    try {
        await req.user.remove()        
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send("deleted user " + req.user.name)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

// Get logged in user

router.get('/users/me', authMdw, async (req, res) => {
    console.log(req.method + '  ' + req.path + ' received data' + JSON.stringify(req.body))

    try {
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send(req.user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(500).send(e)
    }
})

// Get all users

router.get('/users', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data' + JSON.stringify(req.body))

    try {
        const users = await User.find({})
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(users))
        res.send(users)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(500).send(e)
    }
})

// Get User by ID

router.get('/users/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            console.log(req.method + ' ' + req.path +  ' cannot retrieve ' + req.params.id)
            return res.status(400).send('cannot retrieve user')
        }

        console.log(req.method + ' ' + req.path +  ' response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log(req.method + ' ' + req.path +  ' error: ' + e)
        res.status(500).send(e)
    }
})

// Update user by ID

router.patch('/users/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' ' + JSON.stringify(req.params))
    
    const requestedUpdates = Object.keys(req.body)
    const allowedField = ['name', 'email', 'age', 'password']
    const isAllowedUpdate = requestedUpdates.every((update) => allowedField.includes(update))

    if (!isAllowedUpdate) {
        console.log(req.method + ' /users/:id invalid updates')
        return res.status(400).send('Invalid Updates')   
    }

    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }

    try {
        const user = await User.findById(req.params.id)
        allowedField.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
            return res.status(404).send('User not found')
        }

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

// Delete User By ID

router.delete('/users/:id', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.params))
    
    if (!mongoose.isValidMongooseId(req.params.id)) {
        console.log(req.method + ' ' + req.path + ' cannot retrieve ' + req.params.id)
        return res.status(400).send('cannot retrieve user')
    }
    
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            console.log(req.method + ' ' + req.path + ' cannot retrieve user ' + req.params.id)
            return res.status(404).send('User not found')
        }
        
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(user))
        res.send(user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

module.exports = router