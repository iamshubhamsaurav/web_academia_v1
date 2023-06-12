const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const cloudinary = require('cloudinary')
const mailHelper = require('../utils/mailHelper')
const crypto = require('crypto')
const cookieToken = require('../utils/cookieToken')


exports.getSignup = catchAsync(async (req, res, next) => {
    res.render('auth/sign_up')
})

exports.signup = catchAsync(async (req, res, next) => {

    const {name, email, password, course, registerNo, sem} = req.body

    if(!email || !name || !password || !course || !registerNo || !sem) {
        return next(new AppError("Name, email, course, registerNo and sem and password are required", 400))
    }

    const userExist = await User.findOne({email})

    if(userExist) {
        return next(new AppError('User Already Exist. Please try with another email', 404))
    }
    
    let uploadedProfilePicture;
    let uploadedIDCard;
    if(req.files.profilePicture) {
        // Tell the front end dev to send the file with photo name attribute
        let profilePictureFile = req.files.profilePicture
        uploadedProfilePicture = await cloudinary.v2.uploader.upload(profilePictureFile.tempFilePath,{
            folder: "web_academia/users/profilePictures",
            width: 150,
            crop: "scale"
        })
    }

    if(req.files.idCard) {
        // Tell the front end dev to send the file with photo name attribute
        let idCardFile = req.files.idCard
        uploadedIDCard = await cloudinary.v2.uploader.upload(idCardFile.tempFilePath,{
            folder: "web_academia/users/idCards"
        })
    }
    
    

    const user = await User.create({
        name,
        email,
        password,
        course,
        registerNo,
        sem,
        profilePicture: {
            public_id: uploadedProfilePicture.public_id,
            secure_url: uploadedProfilePicture.secure_url
        },
        idCard: {
            public_id: uploadedIDCard.public_id,
            secure_url: uploadedIDCard.secure_url
        }
    })

    cookieToken(user, res)
})

exports.getLogin = catchAsync(async (req, res, next) => {
    res.render('auth/login')
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password) {
        return next(new AppError("Please provide email and password", 400))
    }

    const user = await User.findOne({email}).select("+password")
    if(!user) {
        return next(new AppError("Invalid email or password", 404))
    }

    const isPasswordCorrect = await user.correctPassword(password)

    if(!isPasswordCorrect) {
        return next(new AppError("Invalid email or password", 400))
    }
    // everything is alright, user is loggedin. Send the token...
    cookieToken(user, res)

})

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logout successfull..."
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user) {
        return next(new AppError('Email is not registered', 400))
    }

    const forgotToken = user.getForgotPasswordToken()

    // save as token expiry is generated but not saved into the db
    await user.save({validateBeforeSave: false})
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`
    const message = `Use this link to reset your password ${myUrl}`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password Reset Mail",
            message
        })
        res.status(200).json({
            success: true,
            message: 'Email sent successfully.'
        })
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})
        return next(new AppError(error.message, 500))
    }
})

exports.passwordReset = catchAsync(async (req, res, next) => {
    const token = req.params.token

    const encryToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: encryToken,
        forgotPasswordExpiry: {$gt: Date.now()},
    })
    

    if(!user) {
        return next(new AppError('Token is invalid or expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new AppError('Password and confirm password do not match', 400))
    }

    
    // update the password 
    user.password = req.body.password

    // reset token fields
    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined
    console.log("After changing password and before save")
    console.log(user)
    // save the new password
    await user.save()

    // send response 
    cookieToken(user, res)
})

exports.getLoggedInUserDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

// Updating user passsword
exports.changePassword = catchAsync(async (req, res, next) => {
    const userId = req.user.id

    const user = await User.findById(userId).select('+password')

    if(!user) {
        return next(new AppError("User does not exist", 404))
    }

    // checking old password
    const isOldPasswordCorrect = await user.correctPassword(req.body.oldPassword)
    if(!isOldPasswordCorrect) {
        return next("Old password is incorrect", 400)
    }

    // changing the password
    user.password = req.body.password

    // saving the password
    await user.save()
    cookieToken(user, res)

})
