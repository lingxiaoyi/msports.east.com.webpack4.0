const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '我的竞猜'
const pageKeywords = '东方体育'
const pageDescription = '东方体育'
let canonical = `http://sports.eastday.com`
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
