const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.get('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})


router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'name', 'age']
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperations) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => { user[update] = req.body[update] })
        await user.save()
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})



router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

router.post('/users/logout', auth,  async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token )
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

module.exports = router