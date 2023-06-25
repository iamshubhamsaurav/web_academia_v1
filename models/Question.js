const mongoose = require('mongoose')
const slugify = require('slugify')

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide question text'],
        trim: true
    },
    description: {
        type: String
    },
    branch: {
        type: String,
        enum: ['dca', 'commerce', 'literature', 'science'],
        required: [true, 'Please provide the branch']
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    coverImage: {
        public_id: String,
        secure_url: String
    },
    slug: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },  
},{timestamps: true},
{
    toJSON: {virtuals: true},
    toObject: {virtuals:  true}
},)

questionSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {lower: true})
    next()
})

// Deleting all the answers with the question before deleting question
// questionSchema.pre('deleteOne', async function(next) {
//     console.log(`Deleting all answers with the questionId: ${this._id}`)
//     await this.model('Answer').deleteMany({question: this._id})
//     next()
// })

questionSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'question',
    justOne: false
})

module.exports = mongoose.model('Question', questionSchema)