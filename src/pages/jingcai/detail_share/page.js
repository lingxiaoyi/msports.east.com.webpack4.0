import './style.scss'
import '../../../public-resource/sass/hc/message.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import JS_APP from '../../../public-resource/libs/JC.JS_APP'
import hcCommon from '../../../public-resource/libs/hc.common'
import signCode from '../../../public-resource/libs/sign.code'

$(() => {
    // location.href = 'http://172.20.6.217:9527/html/ty_jingcai/detail.html'
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    window.signCode = signCode
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let $body = $('body')
    let qid = _util_.getPageQid()
    let $selList = $('.betting .sel_list') // 下注选项
    let $submit = $('.betting .submit') // 下注按钮
    //页面逻辑
    let $userInfo = $('#userInfo')
    let $balance = $('.betting  .balance')
    let $bet_tit = $('.betting  .sel_info .tit')
    let $bet_coin = $('.betting  .sel_info .coin')
    let $money_coin = $('.money_win .coin')
    let $money_lq = $('.money_win .lq')
    let $scrollFlage = false
    let $console = $('.console .content')
    window.console.log = function (res) {
        if (typeof res === 'object') {
            res = JSON.stringify(res)
        }
        $console.append('<br>')
        $console.append(res.toString())
    }
    window.onerror = function (err, file, line) {
        window.console.log(`<--error--
        --${err}--
        --${file}--
        --${line}--
--error-->`)
    }
    const pageLogic = {
        //用户选择数据
        userSel: {
            coins: 0,
            odds: 0,
            forecast: 0,
            tit: '',
            betid: '',
            type: ''
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
            bonus: 0,
            money: 0,
            nick: '',
            accid: '',
            mobile: '',
            image: ''
        },
        share_data: {},
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
        //获取比赛，方案相关
        get_match_bet: function () {
            let data = this.getData({})
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.JCAPI.get_match_bet, data).done(pageLogic.matchInit)
            })
        },
        //比赛数据
        matchDataInit: function (data) {
            var end = ''
            if (data.ismatched === '1') {
                end = 'end'
            }
            return [`<div class="header">
        <div class="tit">${data.matchname} <span class="startTime">${data.starttime.substr(5, 12)}</span></div>
        <div class="duel">
            <div class="homeT">
                <img src="${data.home_logoname}" alt=""><b>${data.home_team}</b>
            </div>
            <div class="part_in">
                <div class="coin"><span>${data.total_corn}</span>金币</div><div class="num">${data.total_user}人次参与</div>
            </div>
            <div class="visitT">
                <img src="${data.visit_logoname}" alt=""><b>${data.visit_team}</b>
            </div>
        </div>
    </div>`, end]
        },
        // 方案
        betListInit: function (data, match) {
            let htmlStr = ''
            let total_corn = 0
            let total_user = 0
            $.each(data, function (k, v) {
                total_corn += v.total_corn / 1
                total_user += v.total_user / 1
                v.odds = JSON.parse(v.odds)
                v.odds_percentage = JSON.parse(v.odds_percentage)
                let strWin = ''
                let strTose = ''
                if (v.type / 1 === 3) {
                    strWin = '能'
                    strTose = '不能'
                } else if (v.type / 1 === 2) {
                    strWin = `大于${v.score}球`
                    strTose = `小于${v.score}球`
                } else {
                    strWin = match.home_team + '胜'
                    strTose = match.visit_team + '胜'
                }
                htmlStr += `<li class=" ${(v.status / 1 === 2) ? 'betEnd' : ''}">
            <div class="coin_bet">${(function (total_corn) {
                    let str = ''
                    let i = 0
                    total_corn = (total_corn + '').split('')
                    while (total_corn.length) {
                        i++
                        str = total_corn.pop() + str
                        if ((i % 3 === 0) && total_corn.length) {
                            str = ',' + str
                        }
                    }
                    return str
                })(v.total_corn)}<span>金币</span></div>
            <div class="tit">${v.title}</div>
            <ul class="selList sel_${v.odds.tie ? '3' : '2'}" betid="${v.betid}">
                <li type="win" class="${v.select === 'win' && 'buy'}">
                    <b>${strWin}</b>
                    <br>
                    <span class="odds" >赔率： <i>${(v.odds.win / 1 === 1) ? '1.8' : v.odds.win}</i></span>
                    <br>
                    <span class="chance"><i>${v.odds_percentage.win || 0}%</i> 人支持</span>
                </li>
                ${v.odds.tie ? `<li type="tie" class="${v.select === 'tie' && 'buy'}">
                    <b>平</b>
                    <br>
                    <span class="odds">赔率： <i>${(v.odds.tie / 1 === 1) ? '1.8' : v.odds.tie}</i></span>
                    <br>
                    <span class="chance"><i>${v.odds_percentage.tie || 0}%</i> 人支持</span>
                </li>` : ''}
                <li type="lose"  class="${v.select === 'lose' && 'buy'}">
                    <b>${strTose}</b>
                    <br>
                    <span class="odds">赔率： <i>${(v.odds.lose / 1 === 1) ? '1.8' : v.odds.lose}</i></span>
                    <br>
                    <span class="chance"><i>${v.odds_percentage.lose || 0}%</i> 人支持</span>
                </li>
            </ul>
        </li>`
            })
            total_corn = (function () {
                let str = ''
                let i = 0
                total_corn = (total_corn + '').split('')
                while (total_corn.length) {
                    i++
                    str = total_corn.pop() + str
                    if ((i % 3 === 0) && total_corn.length) {
                        str = ',' + str
                    }
                }
                return str
            })(total_corn)
            match.total_corn = total_corn
            match.total_user = total_user
            // $bets.html(htmlStr)
            return htmlStr
        },
        //比赛相关数据
        matchInit: function (res) {
            $.each(res.data, function (k, data) {
                data.match_data.matchname = data.bet_list[0].matchname
                let betList = pageLogic.betListInit(data.bet_list, data.match_data)
                let Strhead = pageLogic.matchDataInit(data.match_data)
                $body.append(`<div class="match ${Strhead[1]}">${Strhead[0]}<ul class="bets">${betList}</ul></div>`)
            })
        },
        //下注金币列表
        cornListInit: function (res) {
            let htmlStr = ''
            $.each(res.data, (k, v) => {
                htmlStr += `<li coinID="${v.id}"><span>${v.corn}</span>金币</li>`
            })
            $selList.html(htmlStr)
        },
        //添加用户信息
        initUserInfo: function () {
            if (this.userData.accid / 1) {
                $userInfo.html(`<img src="${this.userData.image}" alt=""><span class="info">${this.userData.bonus}金币</span>`)
                $balance.html(`余额:${this.userData.bonus}金币 <br> <i>零钱：${this.userData.money}元</i>`)
            } else {
                $userInfo.html(`<img src="//sports.eastday.com/jscss/v4/img/jc_share/userimg.png" alt=""><span class="info">请登录</span>`)
                $userInfo.on('click', function () {
                    JS_APP.ToViewLogin({})
                })
            }
        },
        unlogin: function () {
            this.run()
        },
        reset: function () {
            $selList.find(' li').removeClass('sel')
            $('.selList li').removeClass('sel')
            $body.removeClass('show')
            $scrollFlage = false
        },
        run: function () {
            this.InfoLoad = this.InfoLoad || 0
            this.InfoLoad++
            if (this.InfoLoad === 3) {
                pageLogic.get_match_bet()
                pageLogic.initUserInfo()
            }
        }
    }
    //页面初始化
    pageLogic.InfoLoad = 2
    pageLogic.unlogin()
    $body.on('click', '.selList  li,#userInfo', function () {
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.songheng.eastnews&ckey=CK1370365014873'
    })

})
