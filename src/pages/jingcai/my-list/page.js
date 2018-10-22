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
    var $person_info = $('.person-info')
    var $orderList = $('.main ul')
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
                _util_.makeJson(config.API_URL.JCAPI.get_user_bet, data, 'list').done(_this.initList).done(function () {
                    _this.listLoadIng = !_this.listLoadIng
                    _this.listPage++
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
            bonus: '1000',
            money: '3.25',
            nick: '隔壁老王',
            accid: '2147483647',
            mobile: '',
            image: '//00.imgmini.eastday.com/dcminisite/portrait/8a936e37eb9570cf76f3507d42c0322b.jpg'
        },
        listPage: 0,
        listLoadIng: false,
        //获取请求数据
        getData: function (data) {
            if (this.loginData && this.clientData) {
                data.lt = this.loginData.login_token
                data.imei = this.loginData.ime
                data.qid = this.clientData.qid
                data.version = this.loginData.ver
                data.plat = this.clientData.plantform
                data.machine = this.clientData.machine
                data.accid = this.loginData.ttaccid
                data.source = '0'
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
                    if (v.type / 1 === 3) {
                        switch (v.user_select) {
                            case 'win':
                                useAnswer = '会'
                                break
                            default:
                                useAnswer = '不会'
                                break
                        }
                        switch (v.bet_result) {
                            case 'win':
                                trueAnswer = '会'
                                break
                            case 'lose':
                                trueAnswer = '不会'
                                break
                            default:
                                trueAnswer = '未公布'
                                break
                        }
                    } else if (v.type / 1 === 2) {
                        switch (v.user_select) {
                            case 'win':
                                useAnswer = `大于${v.score}球`
                                break
                            default:
                                useAnswer = `小于${v.score}球`
                                break
                        }
                        switch (v.bet_result) {
                            case 'win':
                                trueAnswer = `大于${v.score}球`
                                break
                            case 'lose':
                                trueAnswer = `小于${v.score}球`
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
                    htmlStr += `<li class="result${v.status}">
            <div class="row1 ">
                <span>${v.starttime.split('-').join('/')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${v.home_team}&nbsp;&nbsp;VS&nbsp;&nbsp;${v.visit_team}</span>
            </div>
            <div class="row2">
                <h3>
                    <span class="tag guessing">猜&nbsp;中</span>
                    <span class="tag waiting">待开奖</span>
                    <span class="tag cancel">已取消</span>
                    <span class="tag wrong">猜&nbsp;错</span>
                    ${v.title}
                </h3>
                <div class="items clearfix">
                    <div class="item">
                        <span>我猜</span><b>${useAnswer}</b>
                    </div>
                        <div class="item">
                        <span>投注</span><b>${v.input_corn}金币</b>&nbsp;&nbsp;${v.break_even / 1 ? '<i>(已使用保本卡)</i>' : ''}
                    </div>
                    <div class="item">
                        <span>正确答案</span><b>${trueAnswer}</b>
                    </div>               
                    <div class="item bonus">
                        <span>奖励金币</span><b>${v.output_corn}金币</b>
                    </div>
                </div>
            </div>
            <div class="watermark zhong"></div>
        </li>`
                })
                $orderList.append(htmlStr)
            }
        },
        initperson: function () {
            $person_info.html(
                `<div class="img">
            <img src="${this.userData.image}" alt="">
        </div>
        <div class="info">
            <h3>${this.userData.nick}</h3>
            <p><i></i>${this.userData.bonus}金币</p>
        </div>`
            )
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
            this.InfoLoad = this.InfoLoad || 0
            this.InfoLoad++
            if (this.InfoLoad === 3) {
                pageLogic.initperson()
                pageLogic.getList()
                pageLogic.bind()
            }
        }
    }
    JS_APP.UserInfo(function (res) {
        pageLogic.userData = (res.accid && res) || pageLogic.userData
        pageLogic.run()
    })
    JS_APP.ClientInfo(function (res) {
        pageLogic.clientData = (res.version && res) || pageLogic.clientData
        pageLogic.run()
    })
    JS_APP.LogParameter(function (res) {
        pageLogic.loginData = res || pageLogic.loginData
        if (res) {
            pageLogic.run()
        } else {
        }
    })
    $person_info.on('click', function () {

    })
})
