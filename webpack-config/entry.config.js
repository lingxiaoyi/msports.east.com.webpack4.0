let path = require('path')
let dirlets = require('./base/dir-vars.config.js')
let pageArr = require('./base/page-entries.config.js')
let configEntry = {}
configEntry['static/commons/ad.channel'] = path.resolve(dirlets.libsDir, 'ad.channel.js')
pageArr.forEach((page) => {
    configEntry[page] = path.resolve(dirlets.pagesDir, page + '/page')
})

module.exports = configEntry
