const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
let scriptHtml = require('./templates/script-var.ejs')
const pageTitle = '<?=$seo["title"];?>'
const pageKeywords = '<?=$seo["keyword"];?>'
const pageDescription = '<?=$seo["description"];?>'
const canonical = 'http://sports.eastday.com<?=\\Sports\\Url::news_local($news)?>'
const hasLogo = false
scriptHtml = scriptHtml()
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    scriptHtml,
    hasLogo
}).run(content(config))
