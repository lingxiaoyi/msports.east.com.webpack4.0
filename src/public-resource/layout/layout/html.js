const config = require('configModule')
const layout = require('./html.ejs') // 整个页面布局
const header = require('../../components/header/html.ejs') // 页头的模板
const footer = require('../../components/footer/html.ejs') // 页脚的模板

module.exports = (option) => {
    const componentRenderData = Object.assign({}, config, option)
    return layout({
        header: header(componentRenderData),
        content: componentRenderData.content(componentRenderData),
        footer: footer(componentRenderData),
    })
}
