require('../src/db/mongoose')

const User = require('../src/models/User')

const userId = '614324474938313b6ae20668'

// User.findByIdAndUpdate(userId,{age:1}).then((user) => { 
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const updateAgeAndCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{ age })
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount(userId,1).then((count) => {
    console.log("count",count)
}).catch((e) => {
    console.log("e",e)
})