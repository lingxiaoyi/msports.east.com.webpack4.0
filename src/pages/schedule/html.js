const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '体育赛事直播|体育赛程预告_东方体育'
const pageKeywords = '体育赛事，体育赛程，赛程预告，赛程表'
const pageDescription = '东方体育赛程频道提供最新的篮球赛程表，足球赛程表，帮助球迷及时了解最新的体育赛事，不错过每一次精彩的体育赛事。'
let canonical = `http://msports.eastday.com/schedule.html`
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical
}).run(content(config))
