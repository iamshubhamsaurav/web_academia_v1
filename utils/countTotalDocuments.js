const Answer = require("../models/Answer")
const Article = require("../models/Article")
const Question = require("../models/Question")
const User = require("../models/User")


exports.countTotalDocuments = async() => {
    const totalArticles = await Article.countDocuments()
    const totalQuestions = await Question.countDocuments()
    const totalAnswers = await Answer.countDocuments()
    const totalUsers = await User.countDocuments()

    const count = {
        totalArticles,
        totalQuestions,
        totalAnswers,
        totalUsers
    }

    return count
}