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
    // ttapp($)
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
    let $money_coin = $('.money_win .coin')
    let $money_lq = $('.money_win .lq')
    let $money_qd = $('.money_win .qd')
    let $money_qx = $('.money_win .qx')
    let $myjc = $('.myjc')
    let $upwinshare = $('#upwinshare')
    let $back_match = $('.back_match a')
    let $codeupwin = $('#code_upwin')
    let $codecont = $('#code_upwin .putCode')
    let $codeinput = $('#code_upwin input')
    let $codesub = $('#code_upwin button')
    let $codesucce = $('#code_upwin .succe')
    let $codefail = $('#code_upwin .fail')
    let $bbk = $('.sel_info .bbk')
    let $put_code = $('.put_code')
    let $share_code = $('#upwinshare  .code')
    let $share_link = $('.share_link')
    let $share_btn = $('.share_cont .btns .btn')
    let $link_history = $('#banner_link .history')
    let $coin_link = $('#banner_link .coin')
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
            type: '',
            usebbk: 0
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
            image: '',
            bbk: 6
        },
        share_data: {
            sharetype: 'all',
            title: '趣味猜猜猜，竞猜赢千万奖金',
            des: '参与趣味猜猜猜,瓜分千万奖金',
            image: `http://sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`,
            url: `http://${ACT_RANDOM_HOST[Math.floor(Math.random() * ACT_RANDOM_HOST.length)]}/wcup/guess.html?qid=${_util_.getUrlParam('qid')}&code=`,
            // url: `http://msports.eastday.com/jingcai/share.html?image=${pageLogic.userData.image}&nick=${encodeURI(pageLogic.userData.nick)}&order=${res.data.order_id}&betid=${pageLogic.userSel.betid}&accid=${pageLogic.userData.accid}`,
            isSystemShare: 1
        },
        /* share_data: {
             // shareUrl: "http://testing.eastday.com/cleam/dfttapp/answer/index.html?qid=yyz_hd1",
             shareUrl:'',
             shareTitle: `趣味猜猜猜`,
             shareDes: `我成功参与了趣味猜猜猜`,
             shareImg: `https://sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`,
             // 新增分享参数5个
             shareSystem: 1,
             shareType: 4,
             shareTip: '', //"我正在参加东_方_头_条全民答题活动，你也快来参加吧 ~ 每天百万现金，等你来挑战哦~",
             shareBons: null,
             // shareBgImg: null,
             shareBgImg: 'https://resources.dftoutiao.com/hongbaov2/spreadstar/img/zw_ty_v4.png',
             shareFrom: JS_APP.qidObj[_util_.getUrlParam('qid')] || '107075',
         },*/
        //获取请求数据
        getData: function (data) {
            if (this.loginData && this.clientData) {
                data.lt = this.loginData.login_token
                data.imei = this.loginData.ime
                data.qid = _util_.getUrlParam('qid') || ''
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
                pageLogic.userData.time = ts
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.JCAPI.get_match_bet, data).done(pageLogic.matchInit)
            })
        },
        //获取下注列表
        get_corn_list: function () {
            let data = this.getData({})
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                _util_.makeJson(config.API_URL.JCAPI.get_corn_list, data).done(pageLogic.cornListInit)
            })
        },
        get_user_info: function (lt) {
            _util_.makeJsonp(config.API_URL.JCAPI.get_user_info, {lt: lt}).done(function (res) {
                pageLogic.userData.bonus = res.data.bonus
                pageLogic.userData.money = res.data.money
                pageLogic.userData.bbk = res.data.card_num
                // pageLogic.initUserInfo()
            }).fail(function (err) {
                pageLogic.userData.accid = ''
                // pageLogic.initUserInfo()
                console.log('获取用户信息失败')
                console.log(err)
            })
        },
        // 购买
        buy: function () {
            if (pageLogic.userSel.state === 2) {
                $body.addClass('sure')
                return false
            }
            if (pageLogic.userSel.state === 3) {
                JS_APP.ToTaskcenter({})
                return false
            }
            $body.removeClass('sure')
            let data = this.getData({
                betid: pageLogic.userSel.betid,
                user_source: user_source,
                corn_id: pageLogic.userSel.coinid,
                input_type: pageLogic.userSel.type,
                break_even: pageLogic.userSel.usebbk || 0
            })
            pageLogic.buyFlage = true
            hcCommon.popMessageTips({
                icon: 'loading',
                message: '正在购买中'
            })
            hcCommon.getServerts().done(function (ts) {
                data.ts = ts
                data = signCode(data)
                console.log('<---购买开始--->')
                console.log(data)
                _util_.makeJson(config.API_URL.JCAPI.buy, data).done(function (res) {
                    pageLogic.buyRes(res)
                }).done(function () {
                    pageLogic.buyFlage = false
                })
            })
        },
        buyRes: function (res) {
            res.message = (res.message && JSON.parse(res.message)) || res.message
            console.log(res)
            console.log('<---购买结束--->')
            hcCommon.popMessageTips({remove: true})
            if (res.code / 1 === 0) {
                hcCommon.popMessageTips({
                    icon: 'suc',
                    remove: false,
                    timeOutRemove: true,
                    time: '1000',
                    message: '购买成功'
                })
                /*pageLogic.share_data = {
                    method: 'CallNativeShare',
                    sharetype: 'all',
                    title: pageLogic.userSel.tit,
                    des: '我成功参与了趣味猜猜猜',
                    image: `//sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`,
                    url: `${location.origin}/html/jingcai/share.html?image=${pageLogic.userData.image}&nick=${encodeURI(pageLogic.userData.nick)}&order=${res.data.order_id}&betid=${pageLogic.userSel.betid}&accid=${pageLogic.userData.accid}`,
                    // url: `http://msports.eastday.com/jingcai/share.html?image=${pageLogic.userData.image}&nick=${encodeURI(pageLogic.userData.nick)}&order=${res.data.order_id}&betid=${pageLogic.userSel.betid}&accid=${pageLogic.userData.accid}`,
                    isSystemShare: 1
                }*/
                pageLogic.reset()
                pageLogic.get_user_info(pageLogic.loginData.login_token || '')
            } else {
                let message = ''
                if (res.code / 1 === 605) {
                    message = '用户参与竞猜次数已达上限'
                } else {
                    message = '购买失败'
                }
                hcCommon.popMessageTips({
                    icon: 'fail',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500',
                    message: message
                })
            }
        },
        //倒计时
        count_down: function (betid, end) {
            setTimeout(function () {
                let $count_down = $(`.bets  .selList[betid="${betid}"]`).parent().find('.count_down b')
                let timeL = new Date(end.split('-').join('/')) / 1000 - pageLogic.userData.time
                var timeID = setInterval(function () {
                    timeL--
                    let d = Math.floor(timeL / 3600 / 24)
                    if (d) {
                        $count_down.html(`${d}天`)
                    } else {
                        let h = Math.floor(timeL / 3600)
                        h = h < 10 ? '0' + h : h
                        let m = Math.floor(timeL % 3600 / 60)
                        m = m < 10 ? '0' + m : m
                        let s = timeL % 60
                        s = s < 10 ? '0' + s : s
                        $count_down.html(`${h}:${m}:${s}`)
                    }
                    if (timeL <= 0) {
                        clearInterval(timeID)
                    }
                }, 1000)
            }, 10)
        },
        //比赛数据
        matchDataInit: function (data) {
            var end = ''
            if (data.ismatched === '1') {
                end = 'end'
            }
            var date = ['今天', '明天']
            var days = date[data.starttime.substr(8, 2) - new Date().getDate()]
            if (days) {
                days += data.starttime.substr(10, 6)
            } else {
                days = data.starttime.substr(5, 12)
            }
            return [`<div class="header">
        <div class="tit">${data.matchname.replace(/([0-9]|:)*/, '')} <span class="startTime">${days}</span></div>
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
        // 方案i
        // 方案
        betListInit: function (data, match) {
            let htmlStr = ''
            let total_corn = 0
            let total_user = 0
            let max_user = [-1, 0]
            $.each(data, function (a, b) {
                if (b.status / 1 < 2) {
                    if (max_user[1] < b.total_user / 1) {
                        max_user[1] = b.total_user / 1
                        max_user[0] = a
                    }
                }
            })
            $.each(data, function (k, v) {
                total_corn += v.total_corn / 1
                total_user += v.total_user / 1
                v.odds = JSON.parse(v.odds)
                v.odds_percentage = JSON.parse(v.odds_percentage)
                let strWin = ''
                let strTose = ''
                if (v.type / 1 === 3) {
                    strWin = '会'
                    strTose = '不会'
                } else if (v.type / 1 === 2) {
                    strWin = `大于${v.score}球`
                    strTose = `小于${v.score}球`
                } else {
                    strWin = match.home_team + '胜'
                    strTose = match.visit_team + '胜'
                }
                htmlStr += `<li class=" ${(v.status / 1 === 2) ? 'betEnd' : ''}  ${max_user[0] === k ? 'hot' : ''}">
 <div class="coin_bet">瓜分<span>${(function (total_corn) {
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
                })(v.total_corn)}</span>金币  <div class="count_down"><b>00:00:00</b>后结束</div></div>
            <span class="tit"><i></i>${v.title}</span>
            <ul class="selList sel_${v.odds.tie ? '3' : '2'}" betid="${v.betid}">
                <li type="win" class="${v.select === 'win' && 'buy'}">
                    <b>${strWin}</b>               
                    <span class="odds" > <i>${(v.odds.win / 1 === 1) ? '1.8' : v.odds.win}</i>倍收益</span>                   
                    <span class="chance"><i>${v.odds_percentage.win || 0}%</i> 人支持</span>
                </li>
                ${v.odds.tie ? `<li type="tie" class="${v.select === 'tie' && 'buy'}">
                    <b>平</b>                  
                    <span class="odds"> <i>${(v.odds.tie / 1 === 1) ? '1.8' : v.odds.tie}</i>倍收益</span>                
                    <span class="chance"><i>${v.odds_percentage.tie || 0}%</i> 人支持</span>
                </li>` : ''}
                <li type="lose"  class="${v.select === 'lose' && 'buy'}">
                    <b>${strTose}</b>                    
                    <span class="odds"> <i>${(v.odds.lose / 1 === 1) ? '1.8' : v.odds.lose}</i>倍收益</span>                    
                    <span class="chance"><i>${v.odds_percentage.lose || 0}%</i> 人支持</span>
                </li>
            </ul>
        </li>`
                pageLogic.count_down(v.betid, v.end_time)
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
            return htmlStr
        },
        //比赛相关数据
        matchInit: function (res) {
            res.data.forEach(function (data) {
                data.match_data.matchname = data.bet_list[0].matchname
                let betList = pageLogic.betListInit(data.bet_list, data.match_data)
                let Strhead = pageLogic.matchDataInit(data.match_data)
                $body.append(`<div class="match ${Strhead[1]}">${Strhead[0]}<ul class="bets">${betList}</ul></div>`)
            })
            // $.each(res.data, function (k, data) {
            //     if (pageLogic.userData.matchid === data.match_data.matchid) {
            //         data.match_data.matchname = data.bet_list[0].matchname
            //         let betList = pageLogic.betListInit(data.bet_list, data.match_data)
            //         let Strhead = pageLogic.matchDataInit(data.match_data)
            //         $body.append(`<div class="match ${Strhead[1]}">${Strhead[0]}<ul class="bets">${betList}</ul></div>`)
            //     }
            // })
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
                pageLogic.deduct(this.userData.bonus, this.userSel.coins)
            } else {
                this.userSel.state = 3
                $submit.html('零钱不足，赚取金币')
            }
        },
        //扣除
        deduct: function (coin, sel) {
            coin = Math.floor(coin / 10)
            let money = (sel / 10 - coin) / 100
            $money_coin.html(coin * 10)
            $money_lq.html(money)
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
                pageLogic.userData.shareCode = pageLogic.replaceInvite(pageLogic.userData.accid)
                // pageLogic.share_data.url = `http://${ACT_RANDOM_HOST[Math.floor(Math.random() * ACT_RANDOM_HOST.length)]}/wcup/guess.html?qid=${_util_.getUrlParam('qid')}&code=${pageLogic.replaceWord(pageLogic.userData.shareCode)}`
                pageLogic.share_data.shareUrl = `http://${ACT_RANDOM_HOST[Math.floor(Math.random() * ACT_RANDOM_HOST.length)]}/wcup/guess.html?qid=${_util_.getUrlParam('qid')}&code=${pageLogic.replaceWord(pageLogic.userData.shareCode)}`
                $userInfo.html(`<span class="user"><img src="${this.userData.image}" alt=""><span>${this.userData.nick}</span></span><span class="icon">${this.userData.bonus}</span>`)
                $balance.html(`余额:${this.userData.bonus}金币 <br> <i>零钱：${this.userData.money}元</i>`)
                $share_code.html(`<b>${pageLogic.userData.shareCode}</b><span>复制</span>`)
                $bbk.find('span').html(pageLogic.userData.bbk || 0)
                if (!pageLogic.userData.bbk) {
                    $bbk.addClass('unsel')
                } else {
                    $bbk.removeClass('unsel')
                }
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
            $bbk.removeClass('sel')
            pageLogic.userSel.usebbk = 0
            $scrollFlage = false
        },
        share: function () {
            $body.addClass('share')
        },
        replaceInvite: function (AllText) {//转换邀请码
            if (AllText == undefined || AllText == '') {
                return ''
            }
            AllText += ''
            var RedText = AllText.split("")
            //0123456789 accid分别对应7482519306
            var Invite = ''
            for (var i = 0; i < RedText.length; i++) {
                var n = RedText[i]
                if (n == '0') {
                    Invite = Invite + '7'
                } else if (n == '1') {
                    Invite = Invite + '4'
                } else if (n == '2') {
                    Invite = Invite + '8'
                } else if (n == '3') {
                    Invite = Invite + '2'
                } else if (n == '4') {
                    Invite = Invite + '5'
                } else if (n == '5') {
                    Invite = Invite + '1'
                } else if (n == '6') {
                    Invite = Invite + '9'
                } else if (n == '7') {
                    Invite = Invite + '3'
                } else if (n == '8') {
                    Invite = Invite + '0'
                } else if (n == '9') {
                    Invite = Invite + '6'
                }
            }
            // console.log(Invite)
            return Invite
        },
        replaceWord: function (str) {
            var word = 'abcdefghij'
            var strword = ''
            str.split('').forEach(function (v) {
                strword += word[v]
            })
            return strword
        },
        run: function () {
            this.InfoLoad = this.InfoLoad || 0
            this.InfoLoad++
            if (this.InfoLoad === 3) {
                pageLogic.get_match_bet()
                pageLogic.get_corn_list()
            }
        }
    }
    //页面初始化
    // 获取基本信息
    JS_APP.UserInfo(function (res) {
        console.log('用户信息拉取成功')
        if (res.accid / 1) {
            $myjc.show()
            pageLogic.userData = (res.accid && res) || pageLogic.userData
            if (res.accid && res) {
                pageLogic.userData.accid = res.accid || pageLogic.userData.accid
                pageLogic.userData.mobile = res.mobile
                pageLogic.userData.image = res.image || '//sports.eastday.com/jscss/v4/img/jc_share/userimg.png'
            }
        }
        pageLogic.run()
    })
    JS_APP.ClientInfo(function (res) {
        pageLogic.clientData = (res.version && res) || pageLogic.clientData
        pageLogic.run()
    })
    JS_APP.LogParameter(function (res) {
        pageLogic.loginData = res || pageLogic.loginData
        pageLogic.loginData.login_token && pageLogic.get_user_info(pageLogic.loginData.login_token)
        pageLogic.run()
    })
    /*页面事件绑定*/
    //选择投注方案
    $body.on('click', '.selList  li', function () {
        if (pageLogic.userData.accid / 1) {
            let $this = $(this)
            let $fangAn = $this.parent()
            $scrollFlage = true
            $this.addClass('sel')
            $body.addClass('show')
            pageLogic.userSel.betid = $fangAn.attr('betid')
            pageLogic.userSel.odds = $this.find('.odds i').html()
            pageLogic.userSel.tit = $this.find('b').html()
            pageLogic.userSel.type = $this.attr('type')
            $betting.find('.sel_list  li').eq(0).click()
            let $selLiDefult = $selList.find('li').eq(0).addClass('sel')
            pageLogic.userSel.coinid = $selLiDefult.attr('coinid')
            pageLogic.userSel.coins = $selLiDefult.find('span').html()
            pageLogic.forecast()
        } else {
            JS_APP.ToViewLogin({})
        }
    })
    //选择投注金额
    $selList.on('click', 'li', function () {
        let $this = $(this).addClass('sel')
        $this.siblings().removeClass('sel')
        pageLogic.userSel.coinid = $this.attr('coinid')
        pageLogic.userSel.coins = $this.find('span').html()
        pageLogic.forecast()
    })
    //下注
    $submit.on('click', function () {
        pageLogic.buy()
    })
    //退出操作
    $betting.on('click', function (e) {
        if (pageLogic.buyFlage) {
            return false
        }
        if (this === e.target) {
            pageLogic.reset()
        }
    })
    $money_qx.on('click', function () {
        $body.removeClass('sure')
    })
    $money_qd.on('click', function () {
        pageLogic.userSel.state = 1
        pageLogic.buy()
    })
    $upwinshare.on('click', function (e) {
        if (this === e.target) {
            $body.removeClass('share')
        }
    })
    $put_code.on('click', function () {
        if (!pageLogic.userData.accid) {
            JS_APP.ToViewLogin({})
            return false
        }
        $codeupwin.show()
        $codeinput.val('')
        $codecont.show()
        $codesucce.hide()
    })
    $share_link.on('click', function () {
        if (!pageLogic.userData.accid) {
            JS_APP.ToViewLogin({})
            return false
        }
        pageLogic.share()
    })
    /*  $share_code.on('click', function () {
          let $this = $(this)
          let code = $(`<input type="text" value="${pageLogic.userData.c}">`)
          $this.append(code)
          code.select()
          let tag = document.execCommand("Copy")
          if (tag) {
              hcCommon.popMessageTips({
                  icon: 'suc',
                  message: '复制成功',
                  remove: false,
                  timeOutRemove: true,
                  time: '1000'
              })
          } else {
              hcCommon.popMessageTips({
                  icon: 'fail',
                  remove: false,
                  timeOutRemove: true,
                  time: '200',
                  message: '复制失败，请长按复制'
              })
          }
          code.remove()
      })*/
    $coin_link.on('click', function () {
        JS_APP.ToTaskcenter({})
    })
    $codeupwin.on('click', function (e) {
        if (this === e.target) {
            $(this).hide()
        }
    })
    $codeupwin.on('click', '.close', function () {
        $codeupwin.hide()
    })
    $codesub.on('click', function () {
        JS_APP.submitInviteCode({inviteCode: $codeinput.val()}, function (res) {
            if (res / 1) {
                $codecont.hide()
                $codesucce.show()
            }
        })
        // $codesucce.show()
    })
    $share_btn.on('click', function () {
        pageLogic.share_data.sharetype = $(this).attr('type')
        JS_APP.CallNativeShare(pageLogic.share_data)
        // $.ttapp['share_' + $(this).attr('type')](pageLogic.share_data)
    })
    $bbk.on('click', function () {
        if (!pageLogic.userData.bbk) {
            $(this).removeClass('sel')
            return false
        }
        if (pageLogic.userSel.usebbk) {
            $(this).removeClass('sel')
            pageLogic.userSel.usebbk = 0
        } else {
            $(this).addClass('sel')
            pageLogic.userSel.usebbk = 1
        }
    })
    $body.on('click', 'a', function () {
        let link = $(this).attr('href')
        if (link.indexOf('javascript')) {
            location.href = $(this).attr('href') + '?qid=' + pageLogic.clientData.qid
            return false
        }
    })
    $back_match.on('click', function () {
        location.href = document.referrer
    })
    $link_history.on('click', function () {
        if (!pageLogic.userData.accid) {
            JS_APP.ToViewLogin({})
            return false
        }
    })
    window.onpopstate = function () {
        location.href = document.referrer
        return false
    }
    let consoleShowtime = 0
    $('.match_head  span').on('click', function () {
        consoleShowtime++
        if (consoleShowtime === 20) {
            $('.console').show()
            consoleShowtime = 0
        } else {
            $('.console').hide()
        }
    })
})
