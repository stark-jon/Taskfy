const schema = require('mongoose')

const taskSchema = schema.Schema({
    task_name: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        trim: true,
        default: false
    },
    priority: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ['low','normal','high'],
        default: 'normal',
    },
    owner: {
        type: schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})


module.exports = schema.model('Task', taskSchema)