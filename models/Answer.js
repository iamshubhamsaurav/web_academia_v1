const mongoose = require('mongoose')

const answerSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please provide answer text'],
    },
    coverImage: {
        public_id: String,
        secure_url: String
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: [true, 'Please provide question']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
}, {timestamps: true} )


module.exports = mongoose.model('Answer', answerSchema)
