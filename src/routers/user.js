const User = require('../models/user')
const multer = require('multer')
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

router.patch('/users/me',auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'name', 'age']
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperations) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        updates.forEach((update) => { req.user[update] = req.body[update] })
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }

})



router.delete('/users/me', auth , async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
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


const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg)$/)){
            cb(new Error('Please upload a png file'))
        }

        cb(undefined,true)
    }
})


router.post("/users/me/avatar",auth, upload.single('avatar') ,async (req,res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})


router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get("/users/:id/avatar", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('Avatar not found')
        }
        
        res.set('Content-type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send({})
    }
})

module.exports = router