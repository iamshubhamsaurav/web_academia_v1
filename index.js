const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const AppError = require('./utils/appError')
require('dotenv').config({path: './config/.env'})
const connectDB = require('./config/db')
const errorHandler = require('./utils/errorHandler')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const path = require('path')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')

// Connecting with the database
connectDB()

cloudinary.config({
    cloud_name: "duiaomn93",
    api_key: "631715326945545",
    api_secret: "S9Zi3kAwUdrLJ5N4j91Xj1htRkY"
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public/')))

// File upload middlewares
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

//importing routers
const homeRouter = require('./routes/homeRoute')
const articleRouter = require('./routes/articleRoute')
const questionRouter = require('./routes/questionRoute')
const answerRouter = require('./routes/answerRoute')
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')

//routers
// Home routes
app.use('/api/v1/', homeRouter)
// Other routes
app.use('/api/v1/articles', articleRouter)
app.use('/api/v1/questions', questionRouter)
app.use('/api/v1/answers', answerRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)


app.all('*', (req, res, next) => {
    // console.log('404')
    // return next(
    //   new AppError(`Resource ${req.originalUrl} not found on the server`, 404)
    // );
    res.render('errors/404')
});
  
app.use(errorHandler);



const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening to server on port: ${PORT}`.green)
})