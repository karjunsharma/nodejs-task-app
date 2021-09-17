const {MongoClient, ObjectId} = require('mongodb')

const connectionUrl = 'mongodb://admin:admin@localhost:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(error)
    }

    const db = client.db(databaseName)

    //6142dcbccaef7cf288a219c0
    // db.collection('users').updateOne({ _id: new ObjectId("6142dcbccaef7cf288a219c0")},{
    //     $set: {
    //         name: 'Vikram Sharma'
    //     },
    //     $inc :{
    //         age: -11
    //     }
    // }).then((result) => {
    //     console.log("Success",result)
    // }).catch((err) => {
    //     console.log(err)
    // })

    db.collection('users').deleteMany({age: 29}).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    })


    db.collection('tasks').updateMany({ completed: false }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log("Success", result)
    }).catch((err) => {
        console.log(err)
    })

    // db.collection('users').findOne({ _id: new ObjectId("6142dc4b0926fcf359634d97")},(err,result) => {
    //     if(err){
    //         return console.log(err)
    //     }

    //     console.log(result)
    // })

    // db.collection('users').find({age: 29}).toArray((err,users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({ age: 29 }).count((err, count) => {
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectId("6142d9448e8b05799ecfe0a2")}, (err,task) => {
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((err,tasks) => {
    //     console.log(tasks)
    // })
    // db.collection('users').insertOne({
    //     name: 'Vikram',
    //     age: 29
    // },(error,result) => {
    //     if (error){
    //         return console.log(error)
    //     }
    //     console.log(result)
    // })

    //     db.collection('users').insertMany([{
    //         name: 'Arjun',
    //         age: 29
    //     },
    //     {
    //         name: 'Abhi',
    //         age: 20
    //     }
    // ], (error , result ) => {
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(result)
    // })




})