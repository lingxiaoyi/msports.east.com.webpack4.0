const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '我的竞猜'
const pageKeywords = '东方体育'
const pageDescription = '东方体育'
const canonical = ''
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
