const content = require('./content.ejs') // 调取存放本页面实际内容的模板文件
const layout = require('layout')
const pageTitle = '红彩达人重置密码'
const pageKeywords = '红彩达人'
const pageDescription = '红彩达人'
let canonical = `http://sports.eastday.com`
module.exports = layout({
    pageTitle,
    pageKeywords,
    pageDescription,
    canonical,
    content
})
