const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '$!{tiltle}'
const pageKeywords = '$!{keywords}'
const pageDescription = '$!{livedescription}'
const canonical = 'http://sports.eastday.com/live/$!{page.htmlname}'
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
