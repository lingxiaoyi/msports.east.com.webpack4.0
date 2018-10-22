import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import config from 'configModule'
import encrypted from '../../../public-resource/libs/encrypted.code'
import GVerify from '../../../public-resource/libs/gverify'
import 'public/libs/sign.code'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    /*let version = '1.1.1' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN*/
    // 判断默认登录方式
    // let logtype = _util_.getUrlParam('logtype') || 'code'
    let timeInterval = 0 //客户端和服务器时间间隔
    let logtype = 'code'
    $('#' + logtype + '_login').removeClass('none')
    let {ROOT_URL_HC} = config
    let $account = $('.account ')
    let $password = $('.password')
    let $load_btn = $('.load_btn ')
    let $pass_toggle = $('.pass_toggle ')
    let $verification = $('.verification ')
    let $load_form = $('.load_form')
    let $get_code = $('.get_code')
    let $slide_verify = $('#slide_verify')
    let get_code_TimeId
    let verifyCode = new GVerify("v_container")
    let $verifybutton = $('#verifybutton')
    let $verify_input = $('#verify_input')
    let $verify_box = $('#verify_box')
    let $info = $('#verify_box .info')
    let $refresh = $('#refresh')
    // 业务逻辑部分 logical processes
    $('.load_form .back').click(function () {
        if (document.referrer) {
            window.history.go(-1)
        } else {
            window.location.href = `${ROOT_URL_HC}hc/`
        }
    })
    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
    let $body = $('body')
    let token = _util_.CookieUtil.get('hctoken')
    if (token) {
        window.location.href = `${ROOT_URL_HC}hc/`
        $body.append(hcUtil.fixedTabs(4, 1))
    } else {
        $body.append(hcUtil.fixedTabs(4, 1))
    }
    const pageLogic = {
        api: config.API_URL.userLogin, //全部的用户系统接口
        //获取验证码
        get_code: function (account) {
            let ime = '123456'
            let apptypeid = 'DFTY'
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                ime: ime,
                softname: 'DFTY',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                accid: _util_.CookieUtil.get('accid') || '',
                code: encrypted(ime, apptypeid, ts),
                phone: account,
                vcode: 1,
                token: _util_.CookieUtil.get('hctoken') || '',
            }
            _util_.makeJson(this.api.get_code, data).done(function (res) {
                hcUtil.popMessageTips({
                    icon: res.code ? 'fail' : 'suc',
                    message: res.message,
                    remove: false,
                    timeOutRemove: true,
                    time: '1500'
                })
                if (!res.code) {
                    let T = 60
                    $get_code.addClass('wait').html(T + 's')
                    get_code_TimeId = setInterval(function () {
                        $get_code.html(T + 's')
                        if (T <= 0) {
                            clearInterval(get_code_TimeId)
                            get_code_TimeId = 0
                            $account.eq(1).val() && $get_code.removeClass('wait').html('获取验证码')
                        }
                        T--
                    }, 1000)
                }
            })
        },
        //验证码登录
        code_login: function (account, code) {
            let Number = account.match(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)
            let ime = '123456'
            // let ime = '863167039343887'
            let apptypeid = 'DFTY'
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                phone: account,
                vcode: code,
                ime: ime,
                softname: 'DFTY',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                device: 'DFTYH5',
                accid: _util_.CookieUtil.get('accid') || '',
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken') || '',
            }
            if (Number && Number) {
                _util_.makeJson(this.api.by_code, data).done(function (res) {
                    if (res.code === 0) {
                        let data = res.data
                        for (let k in data) {
                            _util_.CookieUtil.set((k === 'token' && 'hctoken') || k, data[k])
                            _util_.CookieUtil.set((k === 'accid' && 'hcaccid') || k, data[k])
                        }
                        hcUtil.popMessageTips({
                            icon: 'suc',
                            message: '登录成功',
                            remove: false,
                            timeOutRemove: true,
                            time: '1500'
                        })
                        // location.href
                        setTimeout(function () {
                            //window.location.href = document.referrer || './yuanbao.html'
                            if (document.referrer) {
                                window.location.href = document.referrer
                            } else {
                                window.location.href = `${ROOT_URL_HC}hc/`
                            }
                        }, 300)
                    } else {
                        hcUtil.popMessageTips({
                            icon: 'fail',
                            message: res.message,
                            remove: false,
                            timeOutRemove: true,
                            time: '1500'
                        })
                    }
                })
            } else {
                hcUtil.popMessageTips({
                    icon: 'fail',
                    message: '手机号不正确',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500'
                })
            }
        },
        //密码登录
        pass_login: function (account, password) {
            let ime = '123456'
            // let ime = '863167039343887'
            let apptypeid = 'DFTY'
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                phone: account,
                password: password.MD5(32),
                ime: ime,
                softname: 'DFTY',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                device: 'DFTYH5',
                accid: _util_.CookieUtil.get('accid') || '',
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken') || '',
            }
            _util_.makeJson(this.api.by_pass, data).done(function (res) {
                if (res.code === 0) {
                    let data = res.data
                    for (let k in data) {
                        _util_.CookieUtil.set((k === 'token' && 'hctoken') || k, data[k])
                        _util_.CookieUtil.set((k === 'accid' && 'hcaccid') || k, data[k])
                    }
                    hcUtil.popMessageTips({
                        icon: 'suc',
                        message: '登录成功',
                        remove: false,
                        timeOutRemove: true,
                        time: '1500'
                    })
                    // location.href
                    setTimeout(function () {
                        //window.location.href = document.referrer || './yuanbao.html'
                        if (document.referrer) {
                            window.location.href = document.referrer
                        } else {
                            window.location.href = `${ROOT_URL_HC}hc/`
                        }
                    }, 300)
                } else {
                    hcUtil.popMessageTips({
                        icon: 'fail',
                        message: res.message,
                        remove: false,
                        timeOutRemove: true,
                        time: '1500'
                    })
                }
            })
            // util.makeJsonp()
        },
        //滑动验证
        success: function () {
            $verify_box.hide()
            this.get_code($account.eq(1).val())
        },
        fail: function () {
            $info.addClass('show')
            setTimeout(function () {
                $info.removeClass('show')
            }, 2000)
        }
    }

    // 事件绑定部分
    // 监听输入，判断能否点击登录
    $account.on('input', function () {
        let idx = $account.indexOf(this)
        $load_btn.eq(idx).attr('class', 'load_btn ' + (!get_code_TimeId && $account.eq(idx).val() && $password.eq(idx).val() ? 'red' : ''))
    })
    $password.on('input', function () {
        let idx = $password.indexOf(this)
        $load_btn.eq(idx).attr('class', 'load_btn ' + ($account.eq(idx).val() && $password.eq(idx).val() ? 'red' : ''))
    })
    // 验证手机号，通过验证请求验证码
    $account.eq(1).on('input', function () {
        if (get_code_TimeId) return false
        let Number = $(this).val().match(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)
        Number && Number.length ? $get_code.removeClass('wait') : $get_code.addClass('wait')
    })
    //密码显示隐藏
    $pass_toggle.on('click', function () {
        let _this = $(this)
        if (_this.hasClass('show')) {
            _this.removeClass('show')
            $password.eq(0).attr('type', 'password')
        } else {
            _this.addClass('show')
            $password.eq(0).attr('type', 'text')
        }
    })
    //登录方式的切换
    $verification.on('click', function () {
        $load_form.addClass('none').eq(1 - $verification.indexOf(this)).removeClass('none')
        $account.val('')
        $password.val('')
        $load_btn.removeClass('red')
        get_code_TimeId && clearInterval(get_code_TimeId)
        $get_code.addClass('wait').html('获取验证码')
    })
    //点击获取验证码
    $get_code.on('click', function () {
        let _this = $get_code
        if (_this.hasClass('wait')) {
            return false
        }
        $verify_box.show()
    })
    //登录
    $load_btn.on('click', function () {
        if (!$(this).hasClass('red')) return false
        let idx = $load_btn.index(this)
        let account = $account.eq(idx).val()
        let password = $password.eq(idx).val()
        if (idx) {
            pageLogic.code_login(account, password)
        } else {
            pageLogic.pass_login(account, password)
        }
    })

    $verifybutton.on('click', function () {
        if (!$verifybutton.hasClass('red')) {
            return false
        }
        if (verifyCode.validate($verify_input.val())) {
            pageLogic.success()
        } else {
            pageLogic.fail()
        }
        $verify_input.val('')
        $verifybutton.removeClass('red')
    })
    $verify_input.on('input', function () {
        if ($verify_input.val()) {
            $verifybutton.addClass('red')
        } else {
            $verifybutton.removeClass('red')
        }
    })
    $verify_box.on('click', function (e) {
        if (e.target === this) {
            $verify_box.hide()
        }
    })
    $refresh.on('click', function () {
        verifyCode.refresh()
    })
})
