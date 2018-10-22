const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '足球篮球专家_篮彩|足彩分析专家_红彩达人'
const pageKeywords = '足球专家,足彩分析,足球推荐'
const pageDescription = '东方红彩达人足球专家栏目汇集百余位足球专家，按照命中率从高到底排列，包括足球评论员、足彩盈利高手、竞彩专家、足球解说员、金球奖评委、体坛记者、前足球球星、足彩实战家等，即时可查询足球比分、足球预测分析等详细方案，专业的足球专家方案即时更新，精准定位和分析满足你的足彩世界。'
let canonical = `http://msports.eastday.com/saishi.html`
const hasLogo = false
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
