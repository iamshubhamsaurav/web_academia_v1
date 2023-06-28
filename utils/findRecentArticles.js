const Article = require("../models/Article")

exports.findRecentArticles = async () => {
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(5).populate({
        path: 'user',
        select: 'name _id'
    })

    return recentArticles
}