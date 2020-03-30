const mongoose = require('../db/mongoose.js')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const authMdw = require('../middleware/auth.js')
const User = require('../models/user.js')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// Upload avatar

router.post('/avatar', authMdw, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/avatar', authMdw, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Get Avatar

router.get('/avatar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Delete avatar

router.delete('/avatar', authMdw, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Login user

router.post('/login', async (req, res) => {
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

router.post('/logout', authMdw, async (req, res) => {
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

router.post('/logoutall', authMdw, async (req, res) => {
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

router.post('/user', async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data' + JSON.stringify(req.body))
    const user = new User(req.body)
    
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        console.log(req.method + ' ' + req.path + ' response data: ' + JSON.stringify({user, token}))
        res.status(201).send({user, token})
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + JSON.stringify(e))
        res.status(400).send(e)
    }
})

// Update logged user

router.patch('/user', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))

    const requestedUpdates = Object.keys(req.body)
    const allowedField = ['name', 'email', 'age', 'password']
    const isAllowedUpdate = requestedUpdates.every((update) => allowedField.includes(update))

    if (!isAllowedUpdate) {
        console.log(req.method + + ' ' + req.path + ' invalid updates')
        return res.status(400).send('Invalid Updates')   
    }

    try {
        requestedUpdates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send(req.user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

// Delete logged user

router.delete('/user', authMdw, async (req, res) => {
    console.log(req.method + ' ' + req.path + ' received data ' + JSON.stringify(req.body))
    
    try {
        await req.user.remove()  
        sendCancelationEmail(req.user.email, req.user.name)      
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send("deleted user " + req.user.name)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(400).send(e)
    }
})

// Get logged in user

router.get('/user', authMdw, async (req, res) => {
    console.log(req.method + '  ' + req.path + ' received data' + JSON.stringify(req.body))

    try {
        console.log(req.method + ' ' + req.path + ' response data' + JSON.stringify(req.user))
        res.send(req.user)
    } catch (e) {
        console.log(req.method + ' ' + req.path + ' error: ' + e)
        res.status(500).send(e)
    }
})

module.exports = router