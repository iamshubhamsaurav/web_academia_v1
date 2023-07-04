const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please provide answer text'],
    },
    article: {
        type: mongoose.Schema.ObjectId,
        ref: 'Article',
        required: [true, 'Please provide Article']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
}, {timestamps: true} )


module.exports = mongoose.model('Comment', commentSchema)
