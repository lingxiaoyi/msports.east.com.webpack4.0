const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '$!{tiltle}'
const pageKeywords = '$!{keywords}'
const pageDescription = '$!{livedescription}'
const hasLogo = false //判断有没有logo栏
scriptHtml = scriptHtml()
const canonical = 'http://sports.eastday.com/live/$!{page.htmlname}'
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    scriptHtml,
    hasLogo,
    canonical
}).run(content(config))
