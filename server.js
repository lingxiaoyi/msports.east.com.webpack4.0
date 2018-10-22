/**
 * Created by tmy on 2016/12/11.
 */
const fs = require('fs')
const http = require('http')
const path = require('path')
const mime = require('mime')
const server = http.createServer()

// lambda 表达式
// 读作 goes to
server.on('request', (req, res) => {
    const url = req.url.split('?')[0]

    //console.log(get_client_ip(req))
    console.log(url)

    if (url === '/') {
        fs.readFile('build/html/index.html', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': mime.lookup(url)
                })
                res.end(url + '没有找到')
            } else {
                res.writeHead(200, {
                    'Content-Type': mime.lookup('build/html/index.html')
                })
                res.end(data)
            }
        })
    } else if (url === 'index.html') {
        fs.readFile('src/index.html', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': mime.lookup(url)
                })
                res.end(url + '没有找到')
            } else {
                res.writeHead(200, {
                    'Content-Type': mime.lookup(url)
                })
                res.end(data)
            }
        })
    } else {
        fs.readFile(/*'build/' + */url.substr(1), (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': mime.lookup(url)
                })
                res.end(url + '没有找到')
            } else {
                res.writeHead(200, {
                    'Content-Type': mime.lookup(url)
                })
                res.end(data)
            }
        })
    }
})
server.listen('3000', () => {
    console.log('server is running at port 3000.')
})
