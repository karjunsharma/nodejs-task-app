const mongoose = require('mongoose')

const connectionUrl = 'mongodb://localhost:27017/tasks-manager-api?authSource=admin'

mongoose.connect(connectionUrl, {
    "user": "admin",
    "pass": "admin",
    "useNewUrlParser": true,
    // useCreateIndex: true
})