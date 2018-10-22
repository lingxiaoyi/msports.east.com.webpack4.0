import 'pages/detail_nostart/style.scss'
import FastClick from 'fastclick'
import config from 'configDir/common.config'
import _util_ from '../libs/libs.util'
import hcUtil from '../libs/hc.common'
import encrypted from '../libs/encrypted.code'
import './log.js'
import JS_APP from '../libs/JC.JS_APP.js'
import '../../public-resource/libs/lib.prototype'
/* global _plan_free:true _ismatched:true _match_time:true _is_from_7m:true _match_time:true _yuanbao:true android:true*/
window.myconsole = function(text) {
    $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;height:20%;">${text}</div>`)
}
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.0.3' //内页版本号
    console.log(version)
    let {HOST, HCAPI} = config.API_URL
    let {NAV_URL, wap_url} = config
    let {youhuiquan, plan_content, buy, h5_recharge, recharge_wxpay, wx_payed, experts_guanzhu, getgzexpert} = HCAPI
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    const osType = _util_.getOsType()
    const recgid = _util_.getUid()
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    let startkey = ''
    let $title = $('.sec1 .title')
    let $sec3 = $('.sec3')
    let $sec3con = $sec3.children('.con')
    let $body = $('body')
    let $sec2row1 = $('.sec2 .row1')
    let $sec2row3 = $('.sec2 .row3')
    //let $sec2row3Li = $sec2row3.find('ul li')
    $body.append(`<section class="recommend"><h3>热门推荐</h3><ul></ul></section>`)
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $loading = $('#J_loading')
    let $fanganBox = $('.recommend ul')
    let timestampnow = Date.parse(new Date())
    let timestampCha = _match_time / 1 - timestampnow
    let myTs = ('' + new Date().getTime()).substring(0, 10)
    //getUserInfo()
    let {ime, position, softtype, softname, appqid, apptypeid, ver, os, appver, deviceid, ts, accid, code, token, nickname} = {
        ime: _util_.CookieUtil.get('hcime') || '123456',
        position: _util_.CookieUtil.get('hcposition'),
        softtype: _util_.CookieUtil.get('hcsofttype') || 'dongfangtiyu',
        softname: _util_.CookieUtil.get('hcsoftname') || 'DFTYH5',
        appqid: _util_.CookieUtil.get('hcappqid'),
        apptypeid: _util_.CookieUtil.get('hcapptypeid') || 'DFTY',
        ver: _util_.CookieUtil.get('hcver'),
        os: _util_.CookieUtil.get('hcos') || osType,
        appver: _util_.CookieUtil.get('hcappver'),
        deviceid: _util_.CookieUtil.get('hcdeviceid'),
        ts: _util_.CookieUtil.get('hcts') /*|| ('' + myTs).substring(0, 10)*/,
        accid: _util_.CookieUtil.get('hcaccid'),
        code: _util_.CookieUtil.get('hccode'),
        token: _util_.CookieUtil.get('hctoken'),
        nickname: _util_.CookieUtil.get('nickname')
    }
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfsphcad'
        android.nativeTitle('方案详情')
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfsphcios'
        window.webkit.messageHandlers.androidios.postMessage({
            method: 'nativeTitle',
            info: '方案详情'
        })
    }
    if (!code) {
        code = encrypted(ime, apptypeid, myTs)
    }
    let osname = 'H5'
    //添加下方tab栏目
    if (qid === 'dfsphcios') {
        osname = 'IOS_H5'
    } else if (qid === 'dfsphcad') {
        osname = 'Android_H5'
    } else {
        /*if (token) {
            $body.append(hcUtil.fixedTabs(0, 1))
        } else {
            $body.append(hcUtil.fixedTabs(0, 0))
        }*/
        $body.prepend(`<header class="info_header">
    <i class="back"></i><h3>方案详情</h3><a href="//msports.eastday.com/hc/"><icon></icon></a>
</header>`)
        $('.info_header .back').click(function() {
            if (document.referrer) {
                window.history.go(-1)
            } else {
                window.location.href = '//msports.eastday.com/hc/'
            }
        })
    }
    if (!token && qid !== 'dfsphcios' && qid !== 'dfsphcad') {
        $body.append(`<div class="pack-red">
    <div class="icon-pack"></div>
</div>`)
        $('.icon-pack').click(function() {
            hcUtil.checkAppLogin(qid, ver)
        })
    }
    /* global _expert_id:true _stutas:true*/
    let {popMessageTips, getServerts} = hcUtil
    class EastSport {
        constructor() {
            this.isInApp = (qid === 'dfsphcios' || qid === 'dfsphcad')
            this.hasLoadedYouhuiquan = false //是否加载过优惠券这个接口
            this.coupons = [] //优惠券
            this.balanceNum = '' //剩余元宝数
            this.SelectedcouponId = '' //优惠券id
            this.Selectedtext = '' //优惠券text
            this.finalPrice = _yuanbao //最后的价格
            //以下是充值需要的配置
            this.selectYuanbaoNum = 1 //默认选中元宝的id
            this.selectYuanbaoText = '30元宝' //默认选中text
            this.buyType = 'zfb' //wx或者zfb
            this.payAgreement = true //默认勾选
            this.timeInterval = 0
            this.flag = true //下方列表加载开关
            this.init()
        }
        init() {
            this.addPayagreement()
            this.getTs()
            this.addEventLister() //注册事件
            this.loadHcList() //相关推荐
            this.loadMatchState() //判断比赛状态
            if (_plan_free === '1' || _ismatched === '2') {
                return false
            } else {
                this.loadConent() //收费方案加载内容
            }
        }
        addPayagreement() {
            let url = ''
            if (qid === 'dfsphcad') {
                url = `//msports.eastday.com/hc/payagreement.html?qid=dfsphcad`
            } else if (qid === 'dfsphcios') {
                url = `//msports.eastday.com/hc/payagreement.html?qid=dfsphcios`
            } else {
                url = `//msports.eastday.com/hc/payagreement.html`
            }
            $sec3.children('.advice').html(`<span>倡导理性购彩。</span><a href="${url}">查看风险及免责声明></a>`)
            //添加专家页面链接
            $body.find('.sec1 .info').wrap(`<a href="http://msports.eastday.com/experts_page.html?expertId=${_expert_id}"></a>`)
            //添加专家关注按钮
            let ts = (new Date() / 1 + '').substring(0, 10) - this.timeInterval
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                token: token,
                userid: accid,
                ids: _expert_id,
                hcid: token,
                code: encrypted(ime, apptypeid, ts),
            }
            _util_.makeJsonAjax(getgzexpert, data).done(function(result2) {
                let operate
                if (result2.data.length) {
                    $body.find('.sec1').append(`<div id="attention" class="attention active">已关注</div>`)
                } else {
                    $body.find('.sec1').append(`<div id="attention" class="attention ">+关注</div>`)
                }
                $('#attention').click(function() {
                    if (!token) {
                        hcUtil.checkAppLogin(qid, ver)
                    }
                    let that = this
                    let data = {
                        expertsid: _expert_id,
                        userid: accid,
                        operate: '0',
                        ime: ime,
                        position: position,
                        softtype: softtype,
                        softname: softname,
                        appqid: qid,
                        apptypeid: apptypeid,
                        ver: ver,
                        appver: appver,
                        deviceid: deviceid,
                        ts: ts,
                        accid: accid,
                        token: token,
                        code: encrypted(ime, apptypeid, ts),
                    }
                    if ($(this).hasClass('active')) {
                        operate = '1'
                    } else {
                        operate = '0'
                    }
                    if (qid === 'dfsphcad') {
                        android.focusExpert(_expert_id, operate)
                    } else if (qid === 'dfsphcios') {
                        window.webkit.messageHandlers.androidios.postMessage({
                            method: 'focusExpert',
                            info: {
                                expertsid: _expert_id,
                                operate: operate,
                            }
                        })
                    } else {
                        let data = {
                            expertsid: _expert_id,
                            userid: accid,
                            operate: operate,
                            ime: ime,
                            position: position,
                            softtype: softtype,
                            softname: softname,
                            appqid: qid,
                            apptypeid: apptypeid,
                            ver: ver,
                            appver: appver,
                            deviceid: deviceid,
                            ts: ts,
                            accid: accid,
                            token: token,
                            code: encrypted('123456', 'DFTY', ts),
                        }
                        if (operate === '1') {
                            hcUtil.popMessagePrompt('', '是否取消关注', false).done(function(result) {
                                if (result === 1) {
                                    request()
                                }
                            })
                        } else {
                            request()
                        }
                        function request() {
                            _util_.makeJsonAjax(experts_guanzhu, data).done(function(result) {
                                if (result.code === 0) {
                                    if (data.operate === '0') {
                                        $(that).addClass('active').text('已关注')
                                    } else {
                                        $(that).removeClass('active').text('+关注')
                                    }
                                }
                            })
                        }
                    }
                })
                window.focusExpert = function(operate) {
                    if (operate / 1 === 1) {
                        $('#attention').addClass('active').text('已关注')
                    } else {
                        $('#attention').removeClass('active').text('+关注')
                    }
                }
            })
        }
        popupPayInfo() {
            let trade_type = _util_.getUrlParam('trade_type')
            let out_trade_no = _util_.getUrlParam('out_trade_no')
            let that = this
            if (trade_type && out_trade_no) {
                //this.popMessagePrompt('', '支付已完成', true).done(function() {
                    let data = {
                        ime: ime,
                        position: position,
                        softtype: softtype,
                        softname: softname,
                        appqid: qid,
                        apptypeid: apptypeid,
                        ver: ver,
                        os: os,
                        appver: appver,
                        deviceid: deviceid,
                        ts: ts,
                        accid: accid,
                        code: code,
                        token: token
                    }
                    data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
                    data.code = encrypted(ime, apptypeid, data.ts)
                    data.out_trade_no = out_trade_no
                    popMessageTips({
                        icon: 'loading',
                        message: '数据加载中'
                    })
                    _util_.makeJsonAjax(wx_payed, data).done(function(result) {
                        popMessageTips({
                            remove: true
                        })
                        if (result.code === 0) {
                            that.popMessagePrompt('', '充值成功,请刷新页面', true).done(function() {
                                window.location.replace(`//${window.location.host + window.location.pathname}`)
                            })
                        } else {
                            that.popMessagePrompt('', '充值失败,请重新充值', true).done(function() {
                                window.location.replace(`//${window.location.host + window.location.pathname}`)
                            })
                        }
                    })
                //})
            }
        }
        getTs() {
            let that = this
            getServerts().done(function(result) {
                ts = result
                that.timeInterval = myTs / 1 - ts / 1
                ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
                that.popupPayInfo() //判断是否微信支付返回的链接
            })
        }
        loadMatchState() {
            //0未开始，1进行中，2已结算，3延时
            if (_ismatched === '2') {
                $sec2row1.append(`<div class="tag">已结束</div>`)
            } else if (_ismatched === '3') {
                $sec2row1.append(`<div class="tag">已延期</div>`)
            } else {
                if (timestampCha < 0) {
                    $sec2row1.append(`<div class="tag">直播中</div>`)
                } else {
                    $sec2row1.append(`<div class="tag">未开始</div>`)
                }
            }
            //撤回显示状态
            try {
                if (_stutas === '1' && _plan_free === '0') {
                    this.popPricePrompt() //购买窗口
                }
            } catch (e) {
                console.log(e)
            }
        }
        /*loadConent() {
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                code: code,
                token: token,
                plan_id: _plan_id,
                source: _is_from_7m
            }
            let that = this
            _util_.makeJsonAjax(plan_content, data).done(function(result) {
                if (result.code === 0) {
                    result.data.tuijian.forEach(function(item, i) {
                        if (item.win === '1') {
                            $sec2row3.eq(i).find('li').eq(1).addClass('blue')
                        }
                        if (item.draw === '1') {
                            $sec2row3.eq(i).find('li').eq(2).addClass('blue')
                        }
                        if (item.lose === '1') {
                            $sec2row3.eq(i).find('li').eq(3).addClass('blue')
                        }
                    })
                    $sec3con.html(`<p class="team mt30">${$title.text()}</p><p class="detail">${result.data.content}<br></p>`)
                } else {
                    if (timestampCha < 0) {
                        $sec3con.html(`<p class="topic">已停止售卖，下次比赛前来购买吧~</p>`)
                    } else {
                        timestampCha = timestampCha / 1000
                        timemove()
                        setInterval(timemove, 1000)
                        //that.popPricePrompt() //购买窗口
                    }
                    that.loadDownApp()
                }
            })
            function timemove() {
                var s = timestampCha % 60
                var m = Math.floor(timestampCha / 60)
                var h = Math.floor(m / 60)
                //var d = Math.floor(h / 24)
                $sec3con.html(`<p class="topic">支付后显示投注方案及理由</p>
                <div class="time">
                    <span>距离售卖截至还有</span>
                    <div class="box">${h}</div><i>:</i>
                    <div class="box">${m % 60}</div><i>:</i>
                    <div class="box">${s % 60}</div>
                </div>`)
                timestampCha--
                if (timestampCha < 3) {
                    window.location.reload()
                }
            }
        }*/
        loadConent() {
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                code: code,
                token: token,
                plan_id: _plan_id,
                source: _is_from_7m
            }
            let that = this
            getServerts().done(function(result) {
                ts = result
                myTs = ('' + new Date().getTime()).substring(0, 10)
                that.timeInterval = myTs / 1 - ts / 1
                data.ts = myTs / 1 - that.timeInterval
                data.code = encrypted(ime, apptypeid, data.ts)
                _util_.makeJsonAjax(plan_content, data).done(function(result) {
                    if (result.code === 0) {
                        result.data.tuijian.forEach(function(item, i) {
                            if ($sec2row3.eq(i).find('li').length > 3) {
                                if (item.win == '1') {
                                    $sec2row3.eq(i).find('li').eq(1).addClass('blue')
                                }
                                if (item.draw == '1') {
                                    $sec2row3.eq(i).find('li').eq(2).addClass('blue')
                                }
                                if (item.lose == '1') {
                                    $sec2row3.eq(i).find('li').eq(3).addClass('blue')
                                }
                            } else {
                                if (item.win == '1') {
                                    $sec2row3.eq(i).find('li').eq(0).addClass('blue')
                                }
                                if (item.draw == '1') {
                                    $sec2row3.eq(i).find('li').eq(1).addClass('blue')
                                }
                                if (item.lose == '1') {
                                    $sec2row3.eq(i).find('li').eq(2).addClass('blue')
                                }
                            }
                        })
                        $sec3con.html(`<p class="team mt30">${$title.text()}</p><p class="detail">${result.data.content}<br></p>`)
                        $('#btnPay').html('<a href="/hc/personal.html" style="color:#fff;">查看退款</a>').css({
                            background: '#ff3333'
                        })
                    } else {
                        if (timestampCha < 0) {
                            $sec3con.html(`<p class="topic">已停止售卖，下次比赛前来购买吧~</p>`)
                            if (_ismatched === '3') {
                                that.popPricePrompt() //购买窗口
                            }
                        } else {
                            timestampCha = timestampCha / 1000
                            timemove()
                            setInterval(timemove, 1000)
                            try {
                                if (typeof _stutas === 'undefined' || _stutas !== '1') {
                                    that.popPricePrompt() //购买窗口
                                }
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        //that.loadDownApp()
                    }
                })
                function timemove() {
                    var s = timestampCha % 60
                    var m = Math.floor(timestampCha / 60)
                    var h = Math.floor(m / 60)
                    //var d = Math.floor(h / 24)
                    $sec3con.html(`<p class="topic">支付后显示投注方案及理由</p>
                        <div class="time">
                            <span>距离售卖截至还有</span>
                            <div class="box">${h}</div><i>:</i>
                            <div class="box">${m % 60}</div><i>:</i>
                            <div class="box">${s % 60}</div>
                        </div>`)
                    timestampCha--
                    if (timestampCha < 3) {
                        window.location.reload()
                    }
                }
            }).fail(function() {
                that.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function() {
                        window.location.reload()
                })
            })
        }
        loadHcList() {
            let that = this
            /* global _match_id:true _plan_id:true*/
            _match_id.forEach(function(item) {})
            let data = {
                    os: os,
                    recgid: recgid,
                    qid: qid,
                    domain: DOMAIN,
                    startkey: startkey,
                    planid: _plan_id,
                    hcmatchid: _match_id[0],
                }
            if (startkey === 'end') return
            $loading.show()
            //wap/detailplans
            _util_.makeJsonp(dfsportswap_lottery + 'wap/getzdscheme', data).done(function(data) {
                $loading.hide()
                startkey = data.endkey
                if (data.data.length) {
                    data.data.forEach(function(item) {
                        if (!item.schemeTitle) {
                            if (item.match_type[0].type === '让球') {
                                item.schemeTitle = '发布让球简介'
                            } else {
                                item.schemeTitle = '发布大小球简介'
                            }
                        }
                        let today = new Date().format('MM-dd')
                        let html = ''
                        let honghei = ''
                        if (item.honghei === '1') {
                            honghei = 'red'
                        } else if (item.honghei === '2') {
                            honghei = 'black'
                        } else if (item.honghei === '3') {
                            honghei = 'zou'
                        }
                        item.matchList.forEach(function(item2, i) {
                            let timeString = ''
                            if (item2.date.indexOf(today) > -1) {
                                timeString = item2.date.substring(11)
                            } else {
                                timeString = item2.date.substring(5, 10)
                            }
                            html += `<div class="line_3">
                                        <div class="tag">${item.match_type[i].type.replace('让球', '竞足')}</div>
                                        <div class="tag2">${item2.saishi}</div>
                                        <div class="tag3">
                                         ${item.status === '3' ? `${item2.homeTeam + ' ' + item2.homeScore + ':' + item2.visitScore + ' ' + item2.visitTeam}` : `${item2.homeTeam + ' VS ' + item2.visitTeam}`}
                                         </div>
                                        <div class="tag4">${timeString}</div>
                                    </div>`
                        })
                        $fanganBox.append(`<li>
                                            <a href="//msports.eastday.com/hc/fa/${item.htmlname}">
                                            <div class="line_1">
                                                <div class="img"><img src="${item.expert.expertImg.replace('http:', 'https:')}" alt=""></div>
                                                <div class="info">
                                                    <b>${item.expert.expertName}</b>
                                                    <div class="tag b">近${item.expert.jin}场中${item.expert.zhong}场</div>
                                                    <div class="tag r">${item.expert.lianhong}连红</div>
                                                </div>
                                                <div class="mz">
                                                    <span><b>${item.expert.rate}</b>% <br>命中率</span>
                                                </div>
                                            </div>
                                            <div class="line_2">
                                                ${item.schemeTitle}
                                            </div>
                                            ${html}
                                            <div class="line_4">
                                                <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}发布</div>
                                                ${item.status === '3' ? `<div class="end">已结束</div><div class="mark ${honghei}"></div>` : `<div class="yb">${item.price}元宝</div>`}
                                            </div>
                                            </a>
                                        </li>`)
                    })
                } else {
                    $fanganBox.append(`<li class="no-comment" style="text-align: center;border: 0;">无更多数据...</li>`)
                    startkey = 'end'
                }
            }).always(function() {
                that.flag = true
            })
        }
        addEventLister() {
            let that = this
            $body.on('click', '.popup .btn-close', function() {
                $('.popup-box').remove()
            })
            $body.on('click', '.pay-box #btnPay', function() {
                if ($(this).hasClass('disabled')) return
                if (qid === 'dfsphcad') {
                    if (token) {
                        that.loadH5PayProcess()
                    } else {
                        that.addAppMethod()
                    }
                } else if (qid === 'dfsphcios') {
                    if (token) {
                        that.loadH5PayProcess()
                    } else {
                        window.webkit.messageHandlers.androidios.postMessage({
                            method: 'nativeUserLogin',
                            info: ''
                        })
                    }
                } else {
                    that.loadH5PayProcess()
                }
            })
            /*$(window).scroll(function() {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    that.loadHcList()
                }
            })*/
        }
        //下方支付价格按钮横幅
        popPricePrompt() {
            if (typeof _stutas === 'undefined') {
                let _stutas = 0
                $body.append(`<div class="pay-box" style="${qid === 'dfsphcios' || qid === 'dfsphcad' ? 'bottom:0;' : ''}">
                                <div class="item">
                                    <p style="${_stutas !== '1' ? 'line-height:1rem;margin:0;' : ''}">需支付：${_yuanbao} 元宝</p>
                                    ${_stutas === '1' ? '<p>方案已撤销</p>' : ''}
                                </div>
                                <div id="btnPay" class="item ${_stutas === '1' ? 'disabled' : ''}">
                                    立即支付
                                </div> 
                            </div>`)
            } else {
                $body.append(`<div class="pay-box" style="${qid === 'dfsphcios' || qid === 'dfsphcad' ? 'bottom:0;' : ''}">
                                <div class="item">
                                    <p style="${_stutas !== '1' ? 'line-height:1rem;margin:0;' : ''}">需支付：${_yuanbao} 元宝</p>
                                    ${_stutas === '1' ? '<p>方案已撤销</p>' : ''}
                                </div>
                                <div id="btnPay" class="item ${_stutas === '1' || _ismatched === '3' ? 'disabled' : ''}">
                                    立即支付
                                </div> 
                            </div>`)
            }

                $body.append('<div class="empty-box"></div>')
            /*if (this.isInApp) {} else {
                this.loadDownApp()
            }*/
        }
        //h5支付流程
        loadH5PayProcess() {
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                code: code,
                token: token,
                type: 0,
                price: _yuanbao
            }
            let that = this
            //先请求优惠券和余额
            if (that.hasLoadedYouhuiquan) {
                that.popPayInfoBox(that.finalPrice, that.Selectedtext)
                return
            }
            popMessageTips({icon: 'loading'})
            data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
            data.code = encrypted(ime, apptypeid, data.ts)
            _util_.makeJsonAjax(youhuiquan, data).done(function(result) {
                    //alert(result.code)
                    popMessageTips({
                        remove: true
                    })
                    if (result.code === 0) {
                        that.coupons = result.data.list
                        that.balanceNum = result.data.yuanbao
                        that.hasLoadedYouhuiquan = true
                        that.popPayInfoBox(_yuanbao)
                    } else {
                        window.location = `${NAV_URL}hc/login.html`
                    }
                })
        }
        /**
         *  支付弹窗
         * @param balanceNum 账户余额
         * @param price 当前计算所需价格
         * @param text 优惠券
         * @returns {*} prosime
         */
        popPayInfoBox(price, text = '') {
            let deferred = $.Deferred()
            let that = this
            $('.PayInfoBox').remove()
            $body.append(`<div class="popup-box PayInfoBox">
    <div class="popup">
        <div class="title">方案购买<div class="btn-close"></div></div>
        <div class="main">
            <ul>
                <!--<li>火箭 VS 勇士</li>-->
                <li  class="btnCoupons">
                    <div class="l">优惠券：</div>
                    ${text ? `<div class="r"><p>${text}<i></i></p>` : `${this.coupons.length ? `<div class="r"><p>${this.coupons.length}张可用优惠券<i></i></p></div>` : '<div class="r">暂无可用优惠券</div>'}`}
                </li>
                <li>
                    <div class="l">支付金额：</div>
                    <div class="r"><span class="num">${price}</span>元宝</div>
                </li>
                <li>
                    <div class="l">支付方式：</div>
                    <div class="r">
                        <div class="yuanbao"><i></i>元宝</div>
                        <span>剩余${that.balanceNum}</span>
                    </div>
                </li>
            </ul>
            <div class="btn btnConfirm">${that.balanceNum - price >= 0 ? '确认支付' : '元宝不足，立即充值'}</div>
        </div>
    </div>
</div>`)
            $('.btnCoupons').on('click', function() {
                if (!that.coupons.length) return
                that.popCouponBox()
            })
            $('.btnConfirm').on('click', function() {
                if (that.balanceNum - price >= 0) {
                    //console.log(that.SelectedcouponId)
                    that.requestBuy()
                    $('.pay-box').hide()
                    $('.PayInfoBox').remove()
                } else {
                    that.popRechargeBox()
                }
                deferred.resolve()
            })
            return deferred.promise()
        }
        //购买方案
        requestBuy() {
            /*if (_is_from_7m === '2') {
                _is_from_7m = '1'
            }*/
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                code: code,
                token: token,
                type: 0,
                id: _plan_id,
                osname: osname,
                source: _is_from_7m,
                yhq_id: this.SelectedcouponId,
                qid: qid,
                btype: 'mhc_xpdetail',
            }
            let that = this
            popMessageTips({
                icon: 'loading',
                message: '订单支付中'
            })
            data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
            data.code = encrypted(ime, apptypeid, data.ts)
            _util_.makeJsonAjax(buy, data).done(function(result) {
                popMessageTips({remove: true})
                if (result.code === 0) {
                    popMessageTips({
                        icon: 'suc',
                        message: '支付成功,稍等刷新'
                    })
                    setTimeout(function() {
                        window.location.reload()
                    }, 1000)
                } else if (result.code === 1) {
                    that.popMessagePrompt('', '请登录', true).done(function(result) {
                        window.location = `${NAV_URL}hc/login.html`
                    })
                } else {
                    popMessageTips({
                        icon: 'fail',
                        message: '支付失败，请重试',
                        timeOutRemove: true,
                    })
                    $('.pay-box').show()
                }
            })
        }
        //优惠券窗口
        popCouponBox() {
            let deferred = $.Deferred()
            let html = ''
            let that = this
            html += `<div class="coupon-box" id="couponBox">
                    <header class="info_header">
                        <i class="back" id="backCoupon">返回</i><h3>可用优惠券</h3>
                    </header>
                    <div class="main">
                        <ul class="tickets">`
            this.coupons.forEach(function(item) {
                html += `<li attr-id="${item.id}" attr-yuanbao="${item.yuanbao}">
                <div class="check ${item.id === that.SelectedcouponId ? 'active' : ''}"></div>
                <div class="can_use">
                    <div class="left">
                        <div class="value"><b>${item.yuanbao}</b>&nbsp;元宝</div>
                        <div class="type">支付直减</div>
                    </div>
                    <div class="right">
                        <h6>${item.name}</h6>
                        <p>全平台通用，东方红彩内所有方案均可使用</p>
                        <div class="time">有效期:${item.expire_time}</div>
                    </div>
                </div>
            </li>`
            })
            html += `</ul></div></div>`
            $body.append(html)
            let $couponBox = $('#couponBox')
            $couponBox.on('click', '.tickets li', function() {
                let $ele = $(this)
                $ele.parent().find('li .check').removeClass('active')
                $ele.children('.check').addClass('active')
                let id = $ele.attr('attr-id')
                let yuanbao = $ele.attr('attr-yuanbao')
                let text = $ele.find('h6').text()
                that.popMessagePrompt('', '确定要使用这张优惠券吗?').done(function(result) {
                    if (result) {
                        that.SelectedcouponId = id
                        that.Selectedtext = text
                        that.finalPrice = _yuanbao - yuanbao / 1
                        $('.coupon-box').remove()
                        that.popPayInfoBox(that.finalPrice, text)
                    } else {
                        $ele.children('.check').removeClass('active')
                        that.SelectedcouponId = ''
                        that.Selectedtext = `${that.coupons.length}张可用优惠券`
                        that.finalPrice = _yuanbao
                    }
                })
            })
            $('#backCoupon').on('click', function() {
                $('.coupon-box').remove()
                that.popPayInfoBox(that.finalPrice, that.Selectedtext)
            })
            return deferred.promise()
        }
        //充值窗口
        popRechargeBox() {
            let deferred = $.Deferred()
            let html = ''
            let that = this
            let height = $body.height()
            html += `<div class="coupon-box" id="rechargeBox" style="height:${height}px">
                    <div class="recharge-box">
    <header>
        <i class="back"></i><h3>充值</h3>
    </header>
    <div class="main">
        <div class="sec1">
            <p>充值账号：${nickname}</p>
            <p>当前元宝：<span>${this.balanceNum}</span> 元宝 <i></i></p>
        </div>
        <div class="recharge-sec2">
            <h3>充值金额</h3>
            <ul>
                <li class="sel" data-num="1">
                    <h4>30元宝</h4>
                    <p>30元</p>
                </li>
                <li data-num="2">
                    <h4>60元宝</h4>
                    <p>60元</p>
                </li>
                <li data-num="3">
                    <h4>80元宝</h4>
                    <p>80元</p>
                </li>
                <li data-num="4">
                    <h4>188元宝</h4>
                    <p>188元</p>
                </li>
                <li data-num="5">
                    <h4>1188元宝</h4>
                    <p>998元/<span>1188元</span></p>
                </li>
                <li data-num="6">
                    <h4>2488元宝</h4>
                    <p>1998元/<span>2488元</span></p>
                </li>
            </ul>
        </div>
        <div class="recharge-sec3">
            <h3>选择支付方式</h3>
            <div class="row sel" data-type="zfb">
                <i></i>支付宝支付
            </div>
            <div class="row" data-type="wx">
                <i></i>微信支付
            </div>
        </div>
        <footer>
            <div class="pay_btn" id="pay_btn">确认支付 ￥<b>30</b></div>
            <div class="agreement">
                <i class="agree" id="btnAgree"></i>支付即表示同意<span id="payAgreement">《充值协议》</span>
            </div>
            <h6>温馨提示：</h6>
            <p>1. 东方红彩非购彩平台，元宝一经充值成功，只可用于购买专家方案，不支持提现、购彩等操作。</p>
            <p>2. 元宝充值和消费过程中遇到问题，请及时联系东方红彩客服，客服电话：021-86688666（客服时间：09:00-23:00）客服邮箱：chenxiyang@021.com</p>
        </footer>
    </div>
</div>
                       </div>`
            $body.append(html)
            let $rechargeBox = $('#rechargeBox')
            let $sec2 = $rechargeBox.find('.recharge-sec2')
            let $sec3 = $rechargeBox.find('.recharge-sec3')
            let $pay_btn = $rechargeBox.find('#pay_btn')
            let $btnAgree = $rechargeBox.find('#btnAgree')
            let $payAgreement = $('#payAgreement')
            $('html, body').scrollTop(0)
            //充值协议
            $payAgreement.on('click', function() {
                $('html, body').scrollTop(0)
                $body.append(
                    `<div class="coupon-box">
<header>
    <i class="back" id="btnAgreementClose"></i><h3>免责声明</h3>
</header>
<div class="content-main">
    <div class="txt">
                    <p>风险提示：</p>
                    <p>购彩仅为娱乐，请量力而行！</p>
                    <p>本公司已力求本资讯内容的客观、公正，但文中的观点、结论和建议仅供参考，不包含本公司对投注建议的确定性判断。彩民朋友不应将本资讯作为投注决策的唯一参考因素，亦不应认为本资讯可以取代自己的判断。本资讯不构成个人投注建议，也没有考虑到个别客户特殊的投注目标、财务状况或需求。客户应考虑本资讯中的任何意见或建议是否符合其特定状况。彩民朋友在使用本资讯时，应注意甄别、慎重、正确使用本 资讯，独立进行投注决策，防止被误导。</p>
                    <br>
                    <p>免责声明：</p>
                    <p>本资讯基于独立、客观、公正和审慎的原则制作，信息均来源于公开资料，本公司对这些信息的准确性和完整性不作任何保证。在任何情况下，本资讯中的信息或所表达的意见并不构成对任何人的投注建议，本公司及其雇员不对使用本资讯及其内容所引发的任何直接或间接损失负任何责任。本资讯所载的资料、意见及推测仅反映本公司于发布本资讯当日的判断；在不同时期，本公司可发出与资讯所载资料、意见及推测不一致的其他资讯；本公司不保证本资讯所含信息保持在最新状态。同时，本公司对本资讯所含信息可在不发出通知的情况下作出修改，彩民朋友应当自行关注相应的更新或修改。本资讯版权归本公司所有。本公司保留所有权利。未经本公司事先书面许可，任何机构和个人均不得以任何形式翻版、复制、引用或转载，否则，本公司将保留随时追究其法律责任的权利。</p>
                </div>
</div>
</div>`
                )
                $('#btnAgreementClose').click(function() {
                    $(this).parent().parent().remove()
                })
            })
            $rechargeBox.on('click', '.back', function() {
                $('.coupon-box').remove()
            })
            $sec2.on('click', 'ul li', function() {
                let num = $(this).attr('data-num')
                let text = $(this).children('h4').text()
                $(this).parent().children().removeClass('sel')
                $(this).addClass('sel')
                let btnNum = 30
                switch (num) {
                    case '1':
                        btnNum = 30
                        break
                    case '2':
                        btnNum = 60
                        break
                    case '3':
                        btnNum = 80
                        break
                    case '4':
                        btnNum = 188
                        break
                    case '5':
                        btnNum = 998
                        break
                    case '6':
                        btnNum = 1998
                        break
                }
                $pay_btn.html(`确认支付 ￥<b>${btnNum}</b>`)
                that.selectYuanbaoNum = num
                that.selectYuanbaoText = text
            })
            $sec3.on('click', '.row', function() {
                let type = $(this).attr('data-type')
                $(this).parent().children().removeClass('sel')
                $(this).addClass('sel')
                that.buyType = type
            })
            $btnAgree.on('click', function() {
                if ($(this).hasClass('agree')) {
                    $(this).removeClass('agree')
                    that.payAgreement = false
                } else {
                    $(this).addClass('agree')
                    that.payAgreement = true
                }
            })
            //请求支付接口
            $pay_btn.on('click', function() {
                if (that.payAgreement) {
                    that.popMessagePrompt('', `您确定要充值${that.selectYuanbaoText}吗?`, false).done(function(result) {
                        if (result === 1) {
                            _util_.CookieUtil.set('pay_page', window.location.href)
                            that.requestBuyYuanBao()
                        }
                    })
                } else {
                    that.popMessagePrompt('', '请勾选充值协议', true)
                }
            })
            return deferred.promise()
        }
        //充值元宝
        requestBuyYuanBao() {
            let data = {
                ime: ime,
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                accid: accid,
                code: code,
                token: token,
                good_id: this.selectYuanbaoNum,
                osname: osname,
                qid: qid,
                btype: 'mhc_xpdetail',
            }
            let that = this
            popMessageTips({
                icon: 'loading',
                message: '正在支付中'
            })
            data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
            data.code = encrypted(ime, apptypeid, data.ts)
            let api = ''
            if (that.buyType === 'zfb') {
                api = h5_recharge
            } else {
                api = recharge_wxpay
                data.trade_type = 'MWEB'
                data.url = window.location.href
                if (qid === 'dfsphcios') {
                    data.scene_info = {
                        h5_info: {
                            type: 'OS',
                            app_name: '王者荣耀',
                            bundle_id: 'com.tencent.wzryIOS'
                        }
                    }
                } else if (qid === 'dfsphcad') {
                    data.scene_info = {
                        h5_info: {
                            type: 'Android',
                            app_name: '王者荣耀',
                            package_name: 'com.tencent.tmgp.sgame'
                        }
                    }
                } else {
                    data.scene_info = {
                        h5_info: {
                            type: 'Wap',
                            wap_url: wap_url,
                            wap_name: '东方体育红彩H5'
                        }
                    }
                    console.log(wap_url)
                }
            }
            if (that.buyType === 'zfb') {
                _util_.makeJsonAjax(api, data).done(function(result) {
                    popMessageTips({remove: true})
                    if (result.code === 0) {
                        /*that.popMessagePrompt('', '支付成功', true).done(function(result) {
                            window.history.go(-1)
                        })*/
                        if (result.data.form) {
                            document.write(`${result.data.form}`)
                            /*var formStart=`<form id=\"userForm\" name=\"userForm\" action="${result.data.url}"  method=\"POST\">`;
                            var content="<input type=\"hidden\" name=\"id\" value=\"20\"/>";
                            var formEnd="</form>";
                            var submitJs="<script>document.forms['userForm'].submit();</script>";
                            var completeForm=formStart+content+formEnd+submitJs;*/
                            //window.location = `${result.data.url}`
                        }
                    } else if (result.code === 1) {
                        that.popMessagePrompt('', '请登录', true).done(function(result) {
                            window.location = `${NAV_URL}login.html`
                        })
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: '支付失败，请重试',
                            timeOutRemove: true,
                        })
                    }
                })
            } else {
                _util_.makeJsonAjax(api, data).done(function(result) {
                    popMessageTips({remove: true})
                    if (result.result_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
                        /*that.popMessagePrompt('', '支付成功', true).done(function(result) {
                            window.history.go(-1)
                        })*/
                        if (result.mweb_url) {
                            window.location = `${result.mweb_url}`
                        }
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: '支付失败，请刷新重试',
                            timeOutRemove: true,
                        })
                    }
                })
            }
        }
        //弹窗提示 标题,消息
        popMessagePrompt(title, message, isSingle) {
            title = title || '提示'
            message = message || '确定执行此操作?'
            isSingle = isSingle || false
            let deferred = $.Deferred()
            $body.append(`<div class="popup-box">
<div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2021;">
    <div class="mint-msgbox" style="">
        <div class="mint-msgbox-header">
            <div class="mint-msgbox-title">${title}</div>
        </div>
        <div class="mint-msgbox-content">
            <div class="mint-msgbox-message">${message}</div>
            <div class="mint-msgbox-input" style="display: none;"><input placeholder="" type="text">
                <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
            </div>
        </div>
        <div class="mint-msgbox-btns">
            <button class="mint-msgbox-btn mint-msgbox-cancel " style="${isSingle === true ? 'display:none' : ''}"  >取消</button>
            <button class="mint-msgbox-btn mint-msgbox-confirm ">确定</button>
        </div>
    </div>
</div>
</div>`)
            $body.on('click', '.mint-msgbox-btns .mint-msgbox-btn', function() {
                let index = $(this).index()
                deferred.resolve(index)
                $(this).parent().parent().parent().parent().remove()
            })
            return deferred.promise()
        }
        addAppMethod() {
            android.getinfoToApp()
        }
        loadDownApp() {
            $body.append(`<div class="down-load">
                            <a href="//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=hcdetail&from=H5zhixf">
                            <div class="img-l"></div>
                            <div class="info">
                                <p>App内购买，</p>
                                <p>享188元新人大礼!</p>
                            </div>
                            <div class="btn">限时领取</div>
                            </a>
                        </div>`)
            $body.append('<div class="empty-box"></div>')
        }
    }
    function getUserInfo() {
        JS_APP.UserInfo(function(res) {
            myconsole(JSON.stringify(res))
            if (res.accid / 1) {
                _util_.CookieUtil.set('nickname', res.nickname)

            }
        })
        JS_APP.ClientInfo(function (res) {
            pageLogic.clientData = (res.version && res) || pageLogic.clientData
            pageLogic.run()
        })
        JS_APP.LogParameter(function (res) {
            pageLogic.loginData = res || pageLogic.loginData
            if (res) {
                pageLogic.run()
                if (!((pageLogic.userData.money + pageLogic.userData.bonus) / 1)) {
                    pageLogic.get_user_info(res.login_token)
                }
            }
        })
    }

    new EastSport()
})
