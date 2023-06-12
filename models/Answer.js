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
}, {timestamps: true} )


module.exports = mongoose.model('Answer', answerSchema)
