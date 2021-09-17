const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: 'String',
        required: true,
        trim: true
    },
    age: {
        type: 'Number',
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be + number')
            }
        }
    },
    email: {
        type: 'String',
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validator(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error(`password should not contains "password"`)
            }
        },
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString() },"myhashsalt")
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

userSchema.statics.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// Hash for plain text password
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User