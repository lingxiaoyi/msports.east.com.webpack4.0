const config = require('configModule')
const noJquery = require('withoutJqueryModule')
const layout = require('./html.ejs')
const header = require('../../components/header/html.ejs') // 页头的模板
const footer = require('../../components/footer/html.ejs') // 页脚的模板
let statisticsHtml = require('../../components/public/bd-statistics.html') // logo的模板
/* 整理渲染公共部分所用到的模板变量 */
/* global IS_PRODUCTION:true */
if (!IS_PRODUCTION) {
    statisticsHtml = ''
}
const pf = {
    pageTitle: '',
    scriptHtml: '',
    statisticsHtml: statisticsHtml,
    constructInsideUrl: noJquery.constructInsideUrl
}

const moduleExports = {
    /* 处理各个页面传入而又需要在公共区域用到的参数 */
    init({pageTitle = '', scriptHtml = '', pageKeywords = '', pageDescription = ''}) {
        pf.pageTitle = pageTitle
        pf.pageKeywords = pageKeywords
        pf.pageDescription = pageDescription
        pf.scriptHtml = scriptHtml //script里的固定变量
        return this
    },

    /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
    run(content) {
        const componentRenderData = Object.assign({}, config, pf) // 页头组件需要加载css/js等，因此需要比较多的变量
        const renderData = {
            header: header(componentRenderData),
            footer: footer(componentRenderData),
            content
        }
        return layout(renderData)
    }
}

module.exports = moduleExports
