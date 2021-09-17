require('../src/db/mongoose')

const Task = require('../src/models/Task')

const id = '614329fea8a94dd872fab5e9'

// Task.findByIdAndDelete(id,{age:1}).then((task) => Task.countDocuments({completed:true}))
// .then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    return await Task.countDocuments({ completed: true})
}

deleteTaskAndCount(id).then((count) => {
    console.log('count',count)
}).catch((e) => {
    console.log('e',e)
})