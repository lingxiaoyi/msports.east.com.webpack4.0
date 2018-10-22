import './style.scss'
import '../../../public-resource/sass/hc/message.scss'
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
    window.signCode = signCode
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let $body = $('body')
    let qid = _util_.getPageQid()
    let apptypeid = 'DFTY'
    let $betting = $('.betting') // 投注窗口
    let $selList = $('.betting .sel_list') // 下注选项
    let $match = $('.match') //比赛
    // let $matchHeader = $('.match .header') //比赛
    // let $part_in = $('.part_in') //金币，参与
    let $submit = $('.betting .submit') // 下注按钮
    //页面逻辑
    let $userInfo = $('#userInfo')
    let $balance = $('.betting  .balance')
    let $bet_tit = $('.betting  .sel_info .tit')
    let $bet_coin = $('.betting  .sel_info .coin')
    let $scrollFlage = false
    let $console = $('.console .content')
    let $linka = $('a')
    let $myjc = $('.myjc')
    let postMessage = function (type, data) {
        data = data || {}
        if (window.android) {
            if (type === "nativeUserLogin") {
                window.android.nativeUserLogin()
            } else {
                window.android.pageNeedReload(true)
            }
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
    window.console.log = function (res) {
        console.info(res)
        if (typeof res === 'object') {
            res = JSON.stringify(res)
        }
        $console.append(`<p>${res.toString()}</p>`)
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
        //用户数据
        userData: {
            bonus: 0,
            money: 0,
            nick: _util_.CookieUtil.get('hcnick'),
            accid: _util_.CookieUtil.get('hcaccid'),
            image: _util_.CookieUtil.get('hcimg') || '//sports.eastday.com/jscss/v4/img/mine_default.png',
            source: (_util_.CookieUtil.get('hcsource') || '').split('_')[0] === 'DFTY' ? '1' : '2',
            osname: _util_.CookieUtil.get('hcsource')
        },
        //获取请求数据
        getData: function (data) {
            data = data || {}
            data.accid = this.userData.accid
            data.source = this.userData.source
            return data
        },
        //获取比赛，方案相关
        get_match_bet: function () {
            let data = this.getData()
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.get_match_bet, data).done(pageLogic.matchInit)
            })
        },
        //获取下注列表
        // 购买
        buy: function () {
            let data = this.getData({
                osname: this.userData.osname,
                betid: this.userSel.betid,
                input_type: this.userSel.type,
                user_source: this.userData.source
            })
            pageLogic.buyFlage = true
            hcCommon.popMessageTips({
                icon: 'loading',
                message: '提交中'
            })
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.ty_JCAPI.tywa_buy, data).done(pageLogic.buyRes).done(function () {
                    pageLogic.buyFlage = false
                })
            })
        },
        buyRes: function (res) {
            if (res.code / 1 === 0) {
                hcCommon.popMessageTips({remove: true})
                hcCommon.popMessageTips({
                    icon: 'suc',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500',
                    message: '参与成功'
                })
                setTimeout(function () {
                    location.href = `success.html?order=${res.data.order_id}&betid=${pageLogic.userSel.betid}&accid=${pageLogic.userData.accid}`
                }, 100)
            } else {
                let message
                if (res.code / 1 === 606) {
                    message = '你已经参与过竞猜'
                } else {
                    message = '参与失败'
                }
                hcCommon.popMessageTips({remove: true})
                hcCommon.popMessageTips({
                    icon: 'fail',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500',
                    message: message
                })
            }
        },
        //比赛数据
        matchDataInit: function (data) {
            if (data.ismatched === '1') {
                $match.addClass('end')
            }
            return `<div class="header">
        <div class="tit">${data.starttime.substr(5, 5)}  ${data.matchname} <span class="startTime">${data.total_user}人次参与</span></div>
        <div class="duel">
            <div class="homeT">
                <img src="${data.home_logoname}" alt=""><b>${data.home_team}</b>
            </div>
            <div class="part_in">
                <div class="coin"><span>${Math.floor(data.total_user * 3.7)}</span>元</div><div class="num">奖池</div>
            </div>
            <div class="visitT">
                <img src="${data.visit_logoname}" alt=""><b>${data.visit_team}</b>
            </div>
        </div>
    </div>`
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
                htmlStr += `<li class=" ${(v.status / 1 === 2) ? 'betEnd' : ''}   ${v.user_select ? 'selEd' : ''}">
            <div class="tit">${v.title}</div>
            <ul class="selList  sel_${v.odds.tie ? '3' : '2'}" betid="${v.betid}">
                <li type="win" class="${v.user_select === 'win' && 'buy'}">
                    <b>${strWin}</b>
                    <br>
                    <!--<span class="odds" >赔率： <i>${(v.odds.win / 1 === 1) ? '1.8' : v.odds.win}</i></span>-->
                    <!--<br>-->
                    <span class="odds">${v.odds_percentage.win || 0}%人支持</span>
                </li>
                ${v.odds.tie ? `<li type="tie" class="${v.user_select === 'tie' && 'buy'}">
                    <b>平</b>
                    <br>
                    <!--<span class="odds">赔率： <i>${(v.odds.tie / 1 === 1) ? '1.8' : v.odds.tie}</i></span>-->
                    <!--<br>-->
                    <span class="odds">${v.odds_percentage.tie || 0}%人支持</span>
                </li>` : ''}
                <li type="lose"  class="${v.user_select === 'lose' && 'buy'}">
                    <b>${strTose}</b>
                    <br>
                    <!--<span class="odds">赔率： <i>${(v.odds.lose / 1 === 1) ? '1.8' : v.odds.lose}</i></span>-->
                    <!--<br>-->
                    <span class="odds">${v.odds_percentage.lose || 0}%人支持</span>
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
                $body.append(`<div class="match ">${Strhead}<ul class="bets">${betList}</ul></div>`)
            })
        },
        //预计获得
        forecast: function () {
            this.userSel.forecast = Math.round((this.userSel.coins / 1) * (this.userSel.odds / 1) * returnRate)

            $bet_tit.html(this.userSel.tit)
            $bet_coin.html(this.userSel.forecast)
            if (this.userData.bonus / 1 - this.userSel.coins / 1 >= 0) {
                this.userSel.state = 1
                $submit.html('投注')
            } else if (this.userData.bonus / 1 + this.userData.money / 1 * 1000 - this.userSel.coins / 1 >= 0) {
                this.userSel.state = 2
                $submit.html('金币不足，用零钱转换')
            } else {
                this.userSel.state = 3
                $submit.html('零钱不足，赚取金币')
            }
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
            if (this.userData.accid) {
                $myjc.show()
                $userInfo.html(`<img src="${this.userData.image}" alt=""><span class="info">${this.userData.nick}</span>`)
            } else {
                $userInfo.html(`<img src="${this.userData.image}" alt=""><span class="info">请登录</span>`)
            }
        },
    }
    /*pageLogic.userData = {
        bonus: 0,
        money: 0,
        nick: '新用户036fqz',
        accid: '100000011',
        mobile: '15670383375',
        token: 'cXRDb2pnRi93Vkt3QkRFVmV3THRPRzFaNWZPSUtKYXN5aHhVY1F2R0pLM21TdG5jRDFjL29nbFExM0xZSktkNDNEVC92aTh4ZFp0a3VoVDZTTW8yNjJGU1FySmplRVFIMnZzRTl6NGtnckNoSWFPYkpKaG1ML1hwSHVaYzZlUXg5eXdSUDN0M3ZBT09UZXAzV01zamMvWmZyNlZkQVplZFgvV0hjSyt6QzNrPQ%3D%3D',
        image: '//sports.eastday.com/jscss/v4/img/mine_default.png'
    }*/
    //页面初始化
    pageLogic.initUserInfo()
    pageLogic.get_match_bet()
    /*页面事件绑定*/
    // 页面滚动
    $(window).on('scroll', function () {
        if ($scrollFlage) {
            return false
        }
    })
    //选择投注方案
    $body.on('click', '.selList  li', function () {
        let $this = $(this)
        let $fangAn = $this.parent()
        $scrollFlage = true
        $this.addClass('sel')
        $betting.addClass('show')
        pageLogic.userSel.betid = $fangAn.attr('betid')
        pageLogic.userSel.odds = $this.find('.odds i').html()
        pageLogic.userSel.tit = $this.find('b').html()
        pageLogic.userSel.type = $this.attr('type')
        $betting.find('.sel_list  li').eq(0).click()
        let $selLiDefult = $selList.find('li').eq(0).addClass('sel')
        pageLogic.userSel.coinid = $selLiDefult.attr('coinid')
        pageLogic.userSel.coins = $selLiDefult.find('span').html()
        $balance.html('我支持:' + pageLogic.userSel.tit)
    })
    //选择投注金额
    // $selList.on('click', 'li', function () {
    //     let $this = $(this).addClass('sel')
    //     $this.siblings().removeClass('sel')
    //     pageLogic.userSel.coinid = $this.attr('coinid')
    //     pageLogic.userSel.coins = $this.find('span').html()
    //     pageLogic.forecast()
    // })
    //下注
    $submit.on('click', function () {
        if (!pageLogic.userData.accid) {
            postMessage('nativeUserLogin')
        } else {
            pageLogic.buy()
        }
    })
    //退出操作
    $betting.on('click', function (e) {
        if (pageLogic.buyFlage) {
            return false
        }
        if (this === e.target) {
            $selList.find(' li').removeClass('sel')
            $('.selList li').removeClass('sel')
            $betting.removeClass('show')
            $scrollFlage = false
        }
    })
    $userInfo.on('click', function () {
        if (!pageLogic.userData.accid) {
            postMessage('nativeUserLogin')
        }
    })
    $linka.on('click', function () {
        location.href = $(this).attr('href')
        return false
    })
    postMessage('pageNeedReload', {isReload: 'yes'})
})
