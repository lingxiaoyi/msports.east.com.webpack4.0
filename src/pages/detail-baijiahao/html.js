const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '$!{page.title}'
const pageKeywords = '$!{page.title}'
const pageDescription = '$!{description}'
const canonical = 'http://sports.eastday.com/a/$!{page.htmlname}'
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
