const content = require('./content.ejs')
const layout = require('layout')
const pageTitle = '<?=$seo["title"];?>'
const pageKeywords = '<?=$seo["keyword"];?>'
const pageDescription = '<?=$seo["description"];?>'
const canonical = 'http://sports.eastday.com<?=\\Sports\\Url::news_local($news)?>'
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
