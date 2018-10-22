const content = require('./content.ejs')
const layout = require('layout')
const config = require('configModule')
const pageTitle = '东方体育手机版_NBA直播|CBA直播|足球直播|英超直播吧|CCTV5在线直播'
const pageKeywords = '体育赛事，体育赛程，赛程预告，赛程表'
const pageDescription = '东方体育赛程频道提供最新的篮球赛程表，足球赛程表，帮助球迷及时了解最新的体育赛事，不错过每一次精彩的体育赛事。'
const hasLogo = false
let canonical = `http://sports.eastday.com/download-app.html`
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    hasLogo,
    canonical
}).run(content(config))
