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
    var $person_info = $('.person-info')
    var $orderList = $('.main ul')
    let $upwin = $('.upwin')
    let $upwin_close = $('.upwin button')
    let $console = $('.console .content')
    let $linka = $('a')
    let $userimg = $('.person-info .img')
    let $usernick = $('.person-info .info h3')
    let $bind = $('.person-info a')
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
    const pageLogic = {
        getList: function () {
            let _this = this
            if (this.listLoadIng) {
                return
            }
            this.listLoadIng = !this.listLoadIng
            let data = this.getData({page: this.listPage})
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.get_user_bet, data, 'list').done(_this.initList).done(function (res) {
                    if (res.data.list.length) {
                        _this.listLoadIng = !_this.listLoadIng
                        _this.listPage++
                    }
                })
            })
        },
        getMoney: function (data, dom) {
            this.getData(data)
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.pay_award, data).done(function (res) {
                    if (res.code / 1 === 0) {
                        hcCommon.popMessageTips({
                            icon: 'suc',
                            message: '领取成功',
                            remove: false,
                            timeOutRemove: false,
                            time: '3000'
                        })
                        location.href = `success.html?order=${data.orderid}&betid=${data.betid}&type=money`
                    } else {
                        $upwin.show()
                        dom.addClass('end fail').html('领奖失败')
                    }
                })
            })
        },
        //客户端数据
        clientData: {
            imei: undefined,
            machine: undefined,
            oem: undefined,
            plantform: undefined,
            qid: undefined,
            qidwithtime: undefined,
            version: false
        },
        //登录数据
        loginData: {},
        //用户数据
        userData: {
            bonus: '0',
            money: '0',
            token: _util_.CookieUtil.get('hctoken') || '',
            image: _util_.CookieUtil.get('hcimg') || '//sports.eastday.com/jscss/v4/img/mine_default.png',
            nick: _util_.CookieUtil.get('hcnick'),
            accid: _util_.CookieUtil.get('hcaccid'),
            source: _util_.CookieUtil.get('hcsource').split('_')[0] === 'DFTY' ? '1' : '2',
            alipay: 0
        },
        listPage: 0,
        listLoadIng: false,
        //获取请求数据
        getData: function (data) {
            data = data || {}
            if (this.loginData && this.clientData) {
                data.accid = this.userData.accid
                data.source = this.userData.source
            }
            return data
        },
        initList: function (res) {
            if (res.code / 1 === 0) {
                let htmlStr = ''
                if (res.data.list.length && pageLogic.listPage === 0) {
                    $orderList.html('')
                }
                $.each(res.data.list, function (k, v) {
                    let useAnswer = ''//用户答案
                    let trueAnswer = ''//正确答案
                    let selState = ''
                    let result = 0
                    if (v.type / 1 === 3) {
                        switch (v.user_select) {
                            case 'win':
                                useAnswer = '能'
                                break
                            default:
                                useAnswer = '不能'
                                break
                        }
                        switch (v.bet_result) {
                            case 'win':
                                trueAnswer = '能'
                                break
                            case 'lose':
                                trueAnswer = '不能'
                                break
                            default:
                                trueAnswer = '未公布'
                                break
                        }
                    } else {
                        switch (v.user_select) {
                            case 'win':
                                useAnswer = v.home_team + '胜'
                                break
                            case 'lose':
                                useAnswer = v.visit_team + '胜'
                                break
                            default:
                                useAnswer = '平'
                                break
                        }
                        switch (v.bet_result) {
                            case 'win':
                                trueAnswer = v.home_team + '胜'
                                break
                            case 'lose':
                                trueAnswer = v.visit_team + '胜'
                                break
                            case 'tie':
                                trueAnswer = '平'
                                break
                            default:
                                trueAnswer = '未公布'
                                break
                        }
                    }
                    let button = ''
                    switch (v.status / 1) {
                        case 2:
                            if (v.button_open / 1) {
                                result = 3
                                button = `<button class="get_moeny " orderid="${v.orderid || k}" betid="${v.betid}">领奖</button>`
                            }
                            break
                        case 3:
                            button = `<button class="get_moeny  end">已领取</button>`
                            break
                        case 4:
                            button = `<button class="get_moeny  end fail">领奖失败</button>`
                            break
                        case 6:
                            button = `<button class="get_moeny  end">已失效</button>`
                            break
                        default:
                            break
                    }
                    htmlStr += `<li class="result${result || v.status}">
            <div class="row1 ">
                <div class="tag guessing">猜中</div>
                <div class="tag waiting">待开奖</div>
                <div class="tag cancel">已取消</div>
                <div class="tag wrong">猜错</div>
                <span> ${v.home_team}  VS  ${v.visit_team}</span>
                <div class="time">${v.starttime.substr(5, 11).replace('-', '/')}</div>
            </div>
            <div class="row2">
                <h3>${v.title}</h3>
                <div class="items clearfix">
                    <div class="item">
                        我的答案：<span>${useAnswer}</span>
                    </div>
                    <div class="item">
                        正确答案：<span>${trueAnswer}</span>
                    </div>               
                    <div class="item bonus">
                        中奖金额：<span>${v.output_corn / 100}元</span>
                    </div>
                    ${button}                                  
                </div>
            </div>
            <!--<div class="watermark zhong"></div>-->
        </li>`
                })
                $orderList.append(htmlStr)
                pageLogic.userData.alipay = pageLogic.userData.alipay || res.data.ali_info
                pageLogic.initperson(pageLogic.userData.alipay)
            }
        },
        initperson: function(alipay) {
            $userimg.html(`<img src="${this.userData.image}" alt="">`)
            $usernick.html(this.userData.nick)
            $bind.html(alipay ? '点击更换支付宝' : '绑定支付宝，奖金直接入账')
        },
        bind: function () {
            let _this = this
            let $win = $(window)
            let $winH = $win.height()
            $win.on('scroll', function () {
                let $last = $orderList.children().last()
                if ($(window).scrollTop() + $winH > $last.offset().top) {
                    _this.getList()
                }
            })
        },
        run: function () {
            pageLogic.getList()
            pageLogic.bind()
        }
    }
    pageLogic.run()
    $body.on('click', '.get_moeny', function () {
        let $this = $(this)
        if ($this.hasClass('end')) {
            return false
        }
        if (pageLogic.userData.alipay) {
            pageLogic.getMoney({orderid: $this.attr('orderid'), betid: $this.attr('betid')}, $this)
        } else {
            location.href = 'alipay.html'
        }
    })
    $upwin_close.on('click', function () {
        $upwin.hide()
    })
    $linka.on('click', function () {
        location.href = $(this).attr('href')
        return false
    })
})
