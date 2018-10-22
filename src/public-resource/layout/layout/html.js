const config = require('configModule')
const layout = require('./html.ejs') // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('../../components/header/html.ejs') // 页头的模板
const footer = require('../../components/footer/html.ejs') // 页脚的模板
const logo = require('../../components/top-logo/html.ejs') // logo的模板
let statisticsHtml = require('../../components/public/bd-statistics.html') // logo的模板
/* 整理渲染公共部分所用到的模板变量 */
/* global IS_PRODUCTION:true */
if (!IS_PRODUCTION) {
    statisticsHtml = ''
}
const pf = {
    pageTitle: '',
    crumbsHtml: '',
    scriptHtml: '',
    statisticsHtml: statisticsHtml
}

const moduleExports = {
    /* 处理各个页面传入而又需要在公共区域用到的参数 */
    init({pageTitle = '', crumbsHtml = '', pageKeywords = '', pageDescription = '', canonical = config.HOME_URL, scriptHtml = '', hasLogo = true}) {
        pf.pageTitle = pageTitle
        pf.pageKeywords = pageKeywords
        pf.pageDescription = pageDescription
        pf.canonical = canonical
        pf.crumbsHtml = crumbsHtml //头部小面包屑
        pf.scriptHtml = scriptHtml //script里的固定变量
        pf.hasLogo = hasLogo //判断有没有logo栏 默认定义false 有logo栏
        return this
    },

    /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
    run(content) {
        const componentRenderData = Object.assign({}, config, pf) // 页头组件需要加载css/js等，因此需要比较多的变量
        const renderData = {
            header: header(componentRenderData),
            footer: footer(componentRenderData),
            logo: componentRenderData.hasLogo ? logo(componentRenderData) : '',
            content
        }
        return layout(renderData)
    }
}

module.exports = moduleExports
