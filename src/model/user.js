const schema = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Task = require('./task')

const userSchema = schema.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('invalid email!')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('conatins "password"!')
        }
    },
    tokens: [{
        token: {
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')) user.password = await bcrypt.hash(user.password, 10)
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = schema.model('User', userSchema)

module.exports = User