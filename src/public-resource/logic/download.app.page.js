import 'zepto/src/deferred'
import 'zepto/src/callbacks'
import 'pages/schedule/style.scss'
import './log.js'
import FastClick from 'fastclick'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let u = navigator.userAgent
    /*let app = navigator.appVersion*/
    let ua = navigator.userAgent.toLowerCase()
    let $J_download = $('#J_download')
    function makeJsonp(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'json'
        })
    }
    function getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg) // 匹配目标参数
        if (r != null) return decodeURI(r[2])
        return null // 返回参数值
    }

    if (getUrlParam('qid') === 'pcqr') {
        if (ua.match(/MicroMessenger/i) === 'micromessenger') { //微信下
            $J_download.attr('href', '//a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastsports')
            window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastsports'
        } else {
            if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) { //苹果
                $J_download.attr('href', 'https://itunes.apple.com/cn/app/id1239732694?mt=8')
                window.location.href = 'https://itunes.apple.com/cn/app/id1239732694?mt=8'
            } else { //安卓
                $J_download.attr('href', '//msports.eastday.com/data/apk/dongfangtiyu_pc.apk')
                window.location.href = '//msports.eastday.com/data/apk/dongfangtiyu_pc.apk'
            }
        }
    } else {
        makeJsonp('//msports.eastday.com/data/log_app/log_h5.js', {}).done(function(result) {
            var download_url = result[0].download_url
            if (ua.indexOf('micromessenger') !== -1) { //微信下
                $J_download.attr('href', '//a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastsports')
                window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastsports'
            } else {
                if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) { //苹果
                    $J_download.attr('href', 'https://itunes.apple.com/cn/app/id1239732694?mt=8')
                    window.location.href = 'https://itunes.apple.com/cn/app/id1239732694?mt=8'
                } else { //安卓
                    $J_download.attr('href', download_url)
                    window.location.href = download_url
                }
            }
        })
    }
})
