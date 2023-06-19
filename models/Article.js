const mongoose = require('mongoose')
const slugify = require('slugify')

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide subject title.'],
        trim: true,
        maxLength: [512, 'Subject title must be less than 256 characters']
    },
    body: {
        type: String,
        required: [true, 'Please provide subject description.'],
        trim: true,
    },
    branch: {
        type: String,
        enum: ['dca', 'commerce', 'literature', 'science', 'others'],
        required: [true, 'Please provide the branch'],
        default: 'others'
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        default: 'others'
    },
    coverImage: {
        public_id: String,
        secure_url: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    slug: String,
}, {timestamps: true} )

articleSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {lower: true})   
    next() 
})

module.exports = mongoose.model('Article', articleSchema)