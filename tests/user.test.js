const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { setupDatabase, userOne, userOneId } = require('./fixtures/db')



beforeEach(setupDatabase)


test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Arjun',
        email: 'arjun@example.com',
        password: 'mypqwerty123'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Arjun',
            email: 'arjun@example.com'
        },
    })

    expect(user.password).not.toBe('mypqwerty123')

})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexisting user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: "bad pass"
    }).expect(400)

    console.log(response.body)
})

test('Should get profile for user', async () => {

    console.log(userOne.tokens)
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})


test('Should update valid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({name: 'Arjun Sharma'})
        .expect(200)

    const user = await User.findById(userOneId)    

    expect(user.name).toBe('Arjun Sharma')

})



test('Should update valid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Arjun Sharma' })
        .expect(200)

    const user = await User.findById(userOneId)

    expect(user.name).toEqual('Arjun Sharma')

})


test('Should not update invalid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Jaipur' })
        .expect(400)

})

test('Should not get profile for unauthrnticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})



test('Should not delete account unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar','tests/fixtures/Capture.PNG')
      .expect(200)

     const user  = await User.findById(userOneId)
     expect(user.avatar).not.toBeNull() 
     expect(user.avatar).toEqual(expect.any(Buffer))
})