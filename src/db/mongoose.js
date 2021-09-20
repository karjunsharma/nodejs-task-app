const mongoose = require('mongoose')

const connectionUrl = process.env.MONGODB_URL

mongoose.connect(connectionUrl, {
    "user": process.env.MONGODB_USER,
    "pass": process.env.MONGODB_PASSWORD,
    "useNewUrlParser": true,
    // useCreateIndex: true
})