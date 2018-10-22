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
    // let urlfrome = document.referrer
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
            accid: _util_.getUrlParam('accid'),
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
            <div class="sel">我猜<b><span>${selRes}</span></b>，投注<b><span>${res.data.input_corn}</span>金币</b></div>
        </div>`)
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
                _util_.makeJson(config.API_URL.JCAPI.get_share_message, data).done(pageLogic.initInfo).done(function() {
                    if (pageLogic.userData.money) {
                        $share.on('click', function () {
                            JS_APP.CallNativeShare({
                                method: 'CallNativeShare',
                                sharetype: 'all',
                                title: pageLogic.selInfo.title,
                                des: '我成功参与了世界杯竞猜',
                                image: `http://sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`,
                                // url: location.href + `&image=${pageLogic.userData.image}&nick=${pageLogic.userData.nick}`,
                                url: `http://msports.eastday.com/jingcai/share.html?image=${pageLogic.userData.image}&nick=${encodeURI(pageLogic.userData.nick)}&betid=${_util_.getUrlParam('betid')}&orderid=${_util_.getUrlParam('order')}`,
                                isSystemShare: 1
                            })
                        })
                    } else {
                        $share.on('click', function() {
                            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastnews&ckey=CK1370365014873'
                        })
                    }
                })
            })
        }
    }
    JS_APP.UserInfo(function(res) {
        if (res.accid === pageLogic.userData.accid) {
            pageLogic.userData = (res.accid && res) || pageLogic.userData
        } else {
            // $share.html('点击参与奖金瓜分')
        }
        $share.show()
        pageLogic.get_share_message()
    })
})
