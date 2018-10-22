import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
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
    let $console = $('.console .content')
    window.console.log = function (res) {
        console.info(res)
        if (typeof res === 'object') {
            res = JSON.stringify(res)
        }
        $console.append('<br>')
        $console.append(res)
    }
    window.onerror = function (err, file, line) {
        window.console.log(`<--error----${err}----${file}----${line}----error-->`)
    }
    let $number = $('.number input')
    let $name = $('.name input')
    let $input = $('input')
    let $saveBtn = $('.saveBtn ')
    let userali = {}

    function getData(data) {
        data = data || {}
        data.accid = _util_.CookieUtil.get('hcaccid')
        data.source = (_util_.CookieUtil.get('hcsource') || '').split('_')[0] === 'DFTY' ? '1' : '2'
        return data
    }

    function ali_info() {
        hcCommon.getServerts().done(function (ts) {
            var data = {ts: ts}
            getData(data)
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.get_bind_info, data).done(function (res) {
                    userali.num = res.data.account
                    userali.nam = res.data.realname
                    $number.val(res.data.account)
                    $name.val(decodeURI(res.data.realname))
                    $saveBtn.html('更改')
                })
            })
        })
    }

    ali_info()
    $input.on('input', function () {
        if ($number.val() && $name.val()) {
            if (userali.num === $number.val() && userali.nam === $name.val()) {
                $saveBtn.removeClass('red')
            } else {
                $saveBtn.addClass('red')
            }
        } else {
            $saveBtn.removeClass('red')
        }
    })
    $saveBtn.on('click', function () {
        if ($saveBtn.hasClass('red')) {
            var data = {
                account: $number.val(),
                realname: encodeURI($name.val()),
            }
            if (!data.account.match(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/) && !data.account.match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/)) {
                hcCommon.popMessageTips({
                    icon: 'fail',
                    message: '账号格式错误',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500'
                })
                return false
            }
            getData(data)
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                console.log(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.bind, data).done(function (res) {
                    console.log(res)
                    if (res.code / 1 === 0) {
                        hcCommon.popMessageTips({
                            icon: 'suc',
                            message: '绑定成功',
                            remove: false,
                            timeOutRemove: false,
                            time: '3000'
                        })
                        setTimeout(function () {
                            history.go(-1)
                            history.back()
                        }, 500)
                    } else {
                        hcCommon.popMessageTips({
                            icon: 'fail',
                            message: '绑定失败，请稍后重试',
                            remove: false,
                            timeOutRemove: true,
                            time: '1500'
                        })
                    }
                })
            })
        }
    })
    let clicksss = 20
    $('.rule .tit').on('click', function () {
        clicksss--
        if (clicksss < 0) {
            $('.console').show()
            clicksss = 20
        } else {
            $('.console').hide()
        }
    })
})
