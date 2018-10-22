import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import hcCommon from '../../../public-resource/libs/hc.common'
import signCode from '../../../public-resource/libs/sign.code'
import JS_APP from "public/libs/JC.JS_APP";

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
    let $share = $('.part2 .share')
    let $userInfo = $('.userInfo')
    let $content = $('.part1 .content')
    let browserType = _util_.browserType()
    let $title = $('title')
    let $desc = $('meta[name="description"]')
    let urlfrome = document.referrer
    let is_ios = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    let appStore = ['', 'http://sj.qq.com/myapp/detail.htm?apkName=com.songheng.eastsports', 'http://sj.qq.com/myapp/detail.htm?apkName=com.songheng.starsports']
    let $console = $('.console .content')
    window.console.log = function (res) {
        if (typeof res === 'object') {
            res = JSON.stringify(res)
        }
        $console.append('<br>')
        $console.append(res)
    }
    window.onerror = function (err, file, line) {
        window.console.log(`<--error--
        --${err}--
        --${file}--
        --${line}--
--error-->`)
    }
    const pageLogic = {
        userData: {
            image: _util_.getUrlParam('image'),
            nick: _util_.getUrlParam('nick'),
        },
        initInfo: function (res) {
            pageLogic.selInfo = res.data
            if (res.data) {
                let selRes = ''
                if (res.data.type / 1 === 3) {
                    switch (res.data.user_select) {
                        case 'win':
                            selRes = '能'
                            break
                        case 'lose':
                            selRes = '不能'
                            break
                        default:
                            break
                    }
                } else if (res.data.type / 1 === 2) {
                    switch (res.data.user_select) {
                        case 'win':
                            selRes = `大于${res.data.score}球`
                            break
                        case 'lose':
                            selRes = `小于${res.data.score}球`
                            break
                        default:
                            break
                    }
                } else {
                    switch (res.data.user_select) {
                        case 'win':
                            selRes = res.data.home_team + '胜'
                            break
                        case 'lose':
                            selRes = res.data.visit_team + '胜'
                            break
                        default:
                            selRes = '平'
                            break
                    }
                }
                $userInfo.html(` <div class="img">
            <img src="${pageLogic.userData.image}" alt=""></div>
            <p class="name">${pageLogic.userData.nick}</p>`)
                $content.html(`<div class="left">
            <div class="h">
                <img src="${res.data.home_logoname}" alt="">
                ${res.data.home_team}
            </div>
            <div class="vs">VS</div>
            <div class="v">
                <img src="${res.data.visit_logoname}" alt="">
                ${res.data.visit_team}
            </div>
        </div>
        <div class="right">
            <div class="title">${res.data.title}</div>
            <div class="sel">我猜<b><span>${selRes}</span></b></div>
        </div>`)
                $title.html('俄罗斯世界杯')
                $desc.attr('content', pageLogic.userData.nick + '成功参与了竞猜')
            }
        },
        get_share_message: function () {
            let data = {
                betid: _util_.getUrlParam('betid'),
                orderid: _util_.getUrlParam('orderid')
            }
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.get_share_message, data).done(pageLogic.initInfo)
            })
        }
    }
    $share.eq(0).show()
    pageLogic.get_share_message()
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
        window.location.href = urlfrome
    })
    $share.on('click', function () {
        location.href = appStore[_util_.getUrlParam('source') / 1]
    })
})
