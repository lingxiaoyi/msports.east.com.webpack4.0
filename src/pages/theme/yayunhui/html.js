
const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '2018亚运会_雅加达亚运会赛程|新闻_东方体育'
const pageKeywords = '2018亚运会,雅加达亚运会,亚运会赛程,亚运会直播,亚运会新闻'
const pageDescription = '2018年雅加达亚运会将于8月18日到9月2日开赛，亚运会赛程包括男篮、男足、女排、乒乓球、羽毛球、游泳、田径、电竞等体育项目。东方体育将全程为您报道最新亚运会赛程战况、最新比赛直播和资讯。快来抢先看男篮的周琦、丁彦雨航，朱婷、孙杨、张玉宁、苏炳添、樊振东、UZI、老帅等体育明星在雅加达亚运会的精彩表现吧!'
let canonical = `http://sports.eastday.com`
const hasLogo = false //判断有没有logo栏
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    hasLogo,
}).run(content())
