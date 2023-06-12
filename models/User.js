const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the name."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide the email"],
        trim: true,
        unique: [true, 'Email already exists. Please use a different email.'],
        validate: [validator.isEmail, 'Please provide an email']
    },
    password: {
        type: String,
        required: [true, "Please provide the password"],
    },
    role: {
        type: String,
        default: 'student'
    },
    profilePicture: {
        public_id: String,
        secure_url: String
    },
    passwordResetToken: String,
    tokenExpiresIn: String,
    sem: {
        type: Number,
        min: 1,
        max: 8,
        default: 1,
    },
    course: {
        type: String,
        required: [true, 'Please provide course.']
    },
    registerNo: {
        type: String,
        required: [true, 'Please provide the register no.'],
        unique: [true, 'Register no must be unique']
    },
    verified: {
        type: Boolean,
        default: false,
    },
    idCard: {
        public_id: String,
        secure_url: String
    }
}, {timestamps: true} )



// encrypt password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.correctPassword = async function(enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password)
}

userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// Generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function() {
    const forgotToken = crypto.randomBytes(20).toString('hex')

    // generating a hash to send back
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')

    // time of token
    // 2 hr * 60 min * 60 sec * 1000 millisec
    this.forgotPasswordExpiry = Date.now() + 2 * 60 * 60 * 1000
    
    return forgotToken
}


module.exports = mongoose.model('User', userSchema)