
const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '用户协议'
const pageKeywords = '用户协议'
const pageDescription = '用户协议'
let canonical = ``
const hasLogo = false //判断有没有logo栏
module.exports = layout.init({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    hasLogo,
}).run(content())
