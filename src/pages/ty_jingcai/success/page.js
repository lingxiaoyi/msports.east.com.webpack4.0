import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import JS_APP from '../../../public-resource/libs/JC.JS_APP'
import hcCommon from '../../../public-resource/libs/hc.common'
import signCode from '../../../public-resource/libs/sign.code'

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
    let $word = $('.part1 .word')
    let postMessage = function (type, data) {
        console.log(data);
        data = data || {}
        if (window.android) {
            console.log(['android', data.shareImageSrc, data.shareTitle, data.shareContent, data.shareUrl]);
            window.android.showNativeShare(data.shareImageSrc, data.shareTitle, data.shareContent, data.shareUrl)
        } else if (window.webkit) {
            window.webkit.messageHandlers.androidios.postMessage(
                {
                    method: type,
                    shareInfo: data
                }
            )
        } else {
            console.log([type, data])
        }
    }
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
            order: _util_.getUrlParam('order'),
            betid: _util_.getUrlParam('betid'),
            nick: _util_.CookieUtil.get('hcnick'),
            accid: _util_.CookieUtil.get('hcaccid'),
            image: _util_.CookieUtil.get('hcimg') || '//sports.eastday.com/jscss/v4/img/mine_default.png',
            source: _util_.CookieUtil.get('hcsource').split('_')[0] === 'DFTY' ? '1' : '2',
            osname: _util_.CookieUtil.get('hcsource')
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
            <div class="sel">我猜<b><span>${selRes}</span></b>${_util_.getUrlParam('type') === 'money' ? `，赢得<b>${res.data.output_corn / 100}</b>元` : ''}</div>
        </div>`)
                if (_util_.getUrlParam('type') === 'money') {
                    $word.html('我猜中了世界杯竞猜结果，获得现金大奖！')
                }
            }
        },
        get_share_message: function () {
            let data = {
                betid: _util_.getUrlParam('betid'),
                orderid: _util_.getUrlParam('order')
            }
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.get_share_message, data).done(pageLogic.initInfo).done(function () {
                    $share.show()
                })
            })
        }
    }
    pageLogic.get_share_message()
    $share.on('click', function () {
        console.log(location.href);
        postMessage('showNativeShare', {
            shareImageSrc: `http://sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`,
            shareTitle: pageLogic.selInfo.title,
            shareContent: '我成功参与了世界杯竞猜',
            shareUrl: `http://172.20.6.217:9527/html/ty_jingcai/share.html?orderid=${pageLogic.userData.order}&betid=${pageLogic.userData.betid}&image=${pageLogic.userData.image}&nick=${encodeURI(pageLogic.userData.nick)}&source=${pageLogic.userData.source}`
        })
    })
})
