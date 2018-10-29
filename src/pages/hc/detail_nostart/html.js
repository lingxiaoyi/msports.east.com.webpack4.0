const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '!{page.title}_红彩体育'
const pageKeywords = '$!{page.tags}'
const pageDescription = '$!{description}'
const canonical = 'http://sports.eastday.com/hc/fa/$!{page.htmlname}'
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
