const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/user.js')

const userId = new mongoose.Types.ObjectId()
const user = {
    _id: userId,
    name: 'Kid A',
    email: 'kida@email.com',
    password: 'bestpassev4!',
    tokens: [{
        token: jwt.sign({_id: userId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(user).save()
})

test('Should signup a new user', async () => {
    const response = 
    await 
        request(app)
        .post('/user')
        .send({
            name: 'Piero Scamarcio',
            email: 'pscama@email.com',
            password: 'bestpassev4!'
        })
        .expect(201)

        // Assert that the database was changed correctly
        const retUser = await User.findById(response.body.user._id)
        expect(retUser).not.toBeNull()
        
        console.log(response.body)

        // Assertions about the responsew
        expect(response.body).toMatchObject({
            user: {
                name: 'Piero Scamarcio',
                email: 'pscama@email.com'
            },
            token: retUser.tokens[0].token
        })
        expect(retUser.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = 
    await 
        request(app)
        .post('/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(200)

        const retUser = await User.findById(userId)
        expect(response.body.token).toBe(retUser.tokens[1].token)
})

test('Should not login not existing user', async () => {
    await 
        request(app)
        .post('/login')
        .send({
            email: 'notexistinguser@email.com',
            password: 'averystrongpsw22!'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await 
        request(app)
        .get('/user')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauth user', async () => {
    await 
        request(app)
        .get('/user')
        .send()
        .expect(401)
})

test('Should not delete unauthenticated user', async () => {
    await 
        request(app)
        .delete('/user')
        .expect(401)
})

test('Should delete authenticated user', async () => {
    await 
        request(app)
        .delete('/user')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .expect(200)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/avatar')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const retUser = await User.findById(userId)
    expect(retUser.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/user')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

    const retUser = await User.findById(userId)
    expect(retUser.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/user')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})

/* afterEach(() => {
    
}) */