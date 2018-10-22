import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import _util_ from '../../../public-resource/libs/libs.util'
import config from 'configModule'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    // let version = '1.1.1' //首页版本号
    // console.log(version)
    // let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    // let {DOMAIN} = config
    // let _domain_ = DOMAIN
    let $account = $('.account')
    let $password = $('.password')
    let $get_code = $('.get_code')
    let $load_btn = $('.load_btn ')
    let $pass_toggle = $('.pass_toggle ')
    let $verification = $('.verification')
    let $all_input = $('.load_form input')
    let $tips = $('.tips')

    // 业务逻辑部分 logical processes
    const pageLogic = {
        api: config.API_URL.userLogin, //全部的用户系统接口
        // 密码验证
        pass_test: function (pass) {
            console.log(pass)
            if (!(pass && pass.match(/.{6,12}/))) {
                pageLogic.show_tips('密码格式不正确')
                return false
            } else {
                return true
            }
        },
        //手机号码验证
        phone_test: function (phone) {
            console.log(phone)
            if (phone && phone.match(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).length) {
                return true
            } else {
                pageLogic.show_tips('手机号格式不正确')
                return false
            }
        },
        //获取验证码
        get_code: function (account) {
            let data = {
                phone: account,
                type: 2,
            }
            // pageLogic.show_tips('验证码已发送')
            _util_.makeJsonp(this.api.get_code, data).done(function (res) {
                console.log(res);
                pageLogic.show_tips(res.message)
            })
        },
        //展示提示
        show_tips: function (message) {
            $tips.html(message).show()
            setTimeout(function () {
                $tips.hide()
            }, 1500)
        },
        //重置密码
        reset_pass: function (account, code, password) {
            let data = {
                phone: account,
                password_new: password,
                vcode: code,
            }
            this.phone_test(account) && this.pass_test(password) && _util_.makeJsonp(config.API_URL.userLogin.reset_pass, data).done(function (res) {
                console.log(res);
            })
            // this.show_tips('密码重置成功')
        }
    }

    // 事件绑定部分
    // 监听输入，判断能否点击登录
    $all_input.on('input', function () {
        $load_btn.attr('class', 'load_btn ' + ($account.val() && $password.val().length && $verification.val() ? 'red' : ''))
    })
    //获取验证码
    $get_code.on('click', function () {
        let _this = $(this)
        if (!pageLogic.phone_test($account.val())) {
            return false
        }
        let a = true
        if (a) {
            _this.addClass('wait')
            pageLogic.get_code($account.val())
            let S = 60
            let get_code_TimeId = setInterval(function () {
                S--
                _this.html(S + 's后重试')
                if (S < 1) {
                    clearInterval(get_code_TimeId)
                    _this.removeClass('wait')
                    _this.html('获取验证码')
                }
            }, 1000)
        }
    })

    //密码显示隐藏
    $pass_toggle.on('click', function () {
        let _this = $(this)
        if (_this.hasClass('show')) {
            _this.removeClass('show')
            $password.attr('type', 'password')
        } else {
            _this.addClass('show')
            $password.attr('type', 'text')
        }
    })

    //登录
    $load_btn.on('click', function () {
        $(this).hasClass('red') && pageLogic.reset_pass($account.val(), $verification.val(), $password.val())
    })

})
