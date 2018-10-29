const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '$!{page.title}_东方体育视频'
const pageKeywords = '$!{videokeywords}'
const pageDescription = '$!{page.title}'
const canonical = '$!{pcurl}'
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
