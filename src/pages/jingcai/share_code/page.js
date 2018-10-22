import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let $body = $('body')
    let qid = _util_.getPageQid()
    let $code = $('#code b')
    let arr = 'abcdefghij'
    let code = _util_.getUrlParam('code')
    let shareCode = ''
    code.split('').forEach(function (v) {
        shareCode += arr.indexOf(v)
    })
    $code.html(shareCode)
    var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    var data = {
        invite_code: shareCode,
        qqid: isiOS ? "iosyyz_hd31" : "yyz_hd31",
        qid:isiOS ? "iosyyz_hd31" : "yyz_hd31",
        channel:isiOS ? "iosyyz_hd31" : "yyz_hd31",
        // from: "102077",
        f: "115",
    }
    var m = new ShareInstall({
        appKey: isiOS ? "2FBKAFF6FFRKBA" : "AKBKB62BF2F7RF",  //formal
        buttonId: "openinstall"
    }, data)
})
