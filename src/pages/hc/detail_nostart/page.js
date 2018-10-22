import './style.scss'
import FastClick from 'fastclick'
import config from 'configDir/common.config'
import _util_ from 'public/libs/libs.util'
import hcUtil from 'public/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
import 'public/logic/log.js'
import 'public/libs/lib.prototype'
import JS_APP from 'public/libs/JC.JS_APP'
/* global _plan_free:true _ismatched:true _match_time:true _is_from_7m:true _match_time:true _yuanbao:true android:true global _expert_id:true _stutas:true _match_id:true _plan_id:true*/
//app调试用
window.myconsole = function (text) {
    if (!$('#infoBox').length) {
        $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;min-height:10%;width:100%;"><p>${text}</p></div>`)
    } else {
        $('#infoBox').append(`<p>${JSON.stringify(text)}</p>`)
    }
    $('#infoBox').click(function() {
        $(this).remove()
    })
}

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.0.6' //内页版本号
    console.log(version)
    let {HCAPI, HCAPIORDER} = config.API_URL
    let {ROOT_URL_HC} = config
    let {plan_content, yqb_plan_content_audit, yqb_plan_content, experts_guanzhu, getgzexpert} = HCAPI
    let {query, wx_payed} = HCAPIORDER
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    let {popMessageTips, getServerts} = hcUtil
    let osType = _util_.getOsType()
    let recgid = _util_.getUid()
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        plan_content = plan_content.replace('/u/', '/yqb/')
        yqb_plan_content_audit = yqb_plan_content_audit.replace('/u/', '/yqb/')
        yqb_plan_content = yqb_plan_content.replace('/u/', '/yqb/')
        experts_guanzhu = experts_guanzhu.replace('/u/', '/yqb/')
        getgzexpert = getgzexpert.replace('/u/', '/yqb/')
        query = query.replace('/u/', '/yqb/')
        wx_payed = wx_payed.replace('/u/', '/yqb/')
    }
    let startkey = ''
    let isReview = _util_.getUrlParam('isReview')
    //let $sec1 = $('.sec1')
    let $title = $('.sec1 .title')
    let $sec3 = $('.sec3')
    let $sec3con = $sec3.children('.con')
    let $body = $('body')
    let $sec2row1 = $('.sec2 .row1')
    //let $sec2row2 = $('.sec2 .row2')
    let $sec2row3 = $('.sec2 .row3')
    let $loading = ''
    let $fanganBox = $('.recommend ul')
    let timestampnow = Date.parse(new Date())
    let timestampCha = _match_time / 1 - timestampnow
    let myTs = ('' + new Date().getTime()).substring(0, 10)
    let {ime, position, softtype, softname, apptypeid, appqid, ver, os, appver, deviceid, ts, accid, token, balanceNum, appStoreReview} = {
        ime: _util_.CookieUtil.get('hcime') || '123456',
        position: _util_.CookieUtil.get('hcposition'),
        softtype: _util_.CookieUtil.get('hcsofttype') || 'dongfangtiyu',
        softname: _util_.CookieUtil.get('hcsoftname') || 'DFTYH5',
        apptypeid: _util_.CookieUtil.get('hcapptypeid') || 'DFTY',
        appqid: _util_.CookieUtil.get('hcappqid'),
        ver: _util_.CookieUtil.get('hcver'),
        os: _util_.CookieUtil.get('hcos') || osType,
        appver: _util_.CookieUtil.get('hcappver'),
        deviceid: _util_.CookieUtil.get('hcdeviceid'),
        ts: _util_.CookieUtil.get('hcts'),
        accid: _util_.CookieUtil.get('hcaccid'),
        token: _util_.CookieUtil.get('hctoken'),
        balanceNum: _util_.CookieUtil.get('hcbalanceNum'),
        appStoreReview: _util_.CookieUtil.get('appStoreReview'),
    }
    class EastSport {
        constructor() {
            this.hasLoadedYouhuiquan = false //是否加载过优惠券这个接口
            this.coupons = [] //优惠券
            this.balanceNum = '' //剩余元宝数
            this.SelectedcouponId = '' //优惠券id
            this.freeYuanbao = 0 //优惠的元宝数
            this.finalPrice = _yuanbao //最后的优惠完价格
            this.buyType = 'yb' //yb或者wx或者zfb
            this.payAgreement = true //默认勾选
            this.timeInterval = 0
            this.flag = true //下方列表加载开关
            this.osname = 'H5' //充值平台
            this.orderInfo = [] //方案信息
            this.btype = 'mhc_xpdetail'
            this.t = ''
            this.data = function () {
                let ts = ('' + new Date().getTime()).substring(0, 10) / 1 - this.timeInterval
                return {
                    ime: ime,
                    position: position,
                    softtype: softtype,
                    softname: softname,
                    appqid: appqid,
                    apptypeid: apptypeid,
                    ver: ver,
                    os: os,
                    appver: appver,
                    deviceid: deviceid,
                    ts: ts,
                    accid: accid,
                    token: token,
                    userid: accid,
                    ids: _expert_id,
                    hcid: token,
                    code: encrypted(ime, apptypeid, ts),
                    plan_id: _plan_id,
                    qid: qid,
                    source: _is_from_7m,
                    btype: this.btype,
                    platform: this.osname,
                    osname: this.osname,
                    ttqid: ''
                }
            }
            let that = this
            if (qid === 'dfttapp') {
                JS_APP.ClientInfo(function (res) {
                    if (res.version) {
                        _util_.CookieUtil.set('tyh5qid', 'dfttapp')
                        qid = _util_.CookieUtil.get('tyh5qid')
                        hcUtil.checkAppLogin(qid).done(function () {
                            ime = _util_.CookieUtil.get('hcime') || '123456'
                            position = _util_.CookieUtil.get('hcposition')
                            softtype = _util_.CookieUtil.get('hcsofttype') || 'dongfangtiyu'
                            softname = _util_.CookieUtil.get('hcsoftname') || 'DFTYH5'
                            appqid = _util_.CookieUtil.get('hcappqid')
                            apptypeid = _util_.CookieUtil.get('hcapptypeid') || 'DFTY'
                            ver = _util_.CookieUtil.get('hcver')
                            appver = _util_.CookieUtil.get('hcappver')
                            deviceid = _util_.CookieUtil.get('hcdeviceid')
                            accid = _util_.CookieUtil.get('hcaccid')
                            token = _util_.CookieUtil.get('hctoken')
                        })
                    }
                })
            }
            that.init()
        }

        init() {
            this.preload()
            this.warning()
            this.addEventLister() //注册事件
            if (isReview === '1') {
                $('.recommend').remove()
                $('.advice').html('  ')
            } else {
                this.loadHcList() //相关推荐
            }
            //东方体育APP 方案标题下方加提示
            if (qid === 'dfsphcad' || qid === 'yqbandroid' || qid === 'dfsphcios' || qid === 'yqbios') {
                $title.after(`<p style="font-size: 0.28rem;margin-top: 0.1rem;color: #666;">本平台非购彩平台，专家方案是专家对于比赛的分析预测和解读，方案意见仅供参考。</p>`)
            }
            this.loadMatchState() //判断比赛状态
        }

        //预加载判断
        preload() {
            let that = this
            ;(function () {
                $body.append(`<section class="recommend"><h3>热门推荐</h3><ul></ul></section>`)
                $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
                $loading = $('#J_loading')
                $fanganBox = $('.recommend ul')
                try {
                    if (qid === 'dfsphcad' || qid === 'yqbandroid') {
                        android.nativeTitle('方案详情')
                    } else if (qid === 'dfsphcios' || qid === 'yqbios') {
                        window.webkit.messageHandlers.androidios.postMessage({
                            method: 'nativeTitle',
                            info: '方案详情'
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
                //判断osname和加载上方导航
                if (qid === 'dfsphcios') {
                    that.osname = 'IOS_H5'
                } else if (qid === 'dfsphcad') {
                    that.osname = 'Android_H5'
                } else if (qid === 'yqbios') {
                    that.osname = 'IOS_H5_yqb'
                } else if (qid === 'yqbandroid') {
                    that.osname = 'Android_H5_yqb'
                } else if (qid === 'dfttapp') {} else {
                    $body.prepend(`
<header class="info_header">
    <i class="back"></i><h3>方案详情</h3><a href="${ROOT_URL_HC}hc/index.html?faxq_sy" suffix="faxq_sy"><icon></icon></a>
</header>`)
                    $('.info_header .back').click(function () {
                        if (document.referrer) {
                            window.history.go(-1)
                        } else {
                            window.location.href = `${ROOT_URL_HC}hc/index.html`
                        }
                    })
                }
                //没有登录,app之外加载红包gif
                /*if (!token && qid !== 'dfsphcios' && qid !== 'dfsphcad' && qid !== 'yqbandroid' && qid !== 'yqbios') {
                    let sc = _util_.CookieUtil.get('sc')
                    if (sc / 1 !== 1) {
                        $body.append(`<div class="pack-red">
                                    <div class="icon-pack"></div>
                                </div>`)
                        $('.icon-pack').click(function () {
                            //hcUtil.checkAppLogin(qid, ver)
                            window.location.href = `${ROOT_URL_HC}hc/recharge.html`
                        })
                    }
                }*/
            })()
            //获取服务器时间,并且将本地时间和服务器时间误差保存
            getServerts().done(function (result) {
                ts = result
                that.timeInterval = myTs / 1 - ts / 1
                ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
                that.popupPayInfo() //判断是否微信支付返回的链接
                if (_ismatched === '2') {
                    return false
                } else {
                    if (qid === 'yqbandroid' || qid === 'yqbios' || qid === 'dfsphcad' || qid === 'yqbandroid') {
                        that.loadConent()
                        return
                    }
                    if (_plan_free === '1' && !token) {
                        $sec3con.html(`<p class="topic"><icon class="login"></icon>登录后才能查看哦~</p>`)
                        $sec3con.addClass('fuzzy')
                        $sec3con.find('.topic').attr('id', 'btnLogin')
                    } else {
                        that.loadConent() //收费方案加载内容
                    }
                }
            })
            //加风险声明
            ;(function () {
                let url = ''
                if (qid === 'dfsphcad') {
                    url = `http://msports.eastday.com/hc/payagreement.html?qid=dfsphcad`
                } else if (qid === 'dfsphcios') {
                    url = `http://msports.eastday.com/hc/payagreement.html?qid=dfsphcios`
                } else {
                    url = `http://msports.eastday.com/hc/payagreement.html`
                }
                if (qid === 'yqbios') {
                    $sec3.children('.advice').html(`<span>倡导理性购彩</span><a href="http://msports.eastday.com/payagreement_yqb.html">查看风险及免责声明></a>`)
                } else {
                    $sec3.children('.advice').html(`<span>倡导理性购彩。</span><a href="${url}">查看风险及免责声明></a>`)
                }
            })()
            //添加专家页面链接
            if (qid === 'yqbios' || qid === 'yqbandroid') {} else {
                $body.find('.sec1 .info').wrap(`<a href="${ROOT_URL_HC}hc/experts_page.html?expertId=${_expert_id}" suffix="fadetail_fa"></a>`)
                //添加专家关注按钮
                let data = that.data()
                _util_.makeJsonAjax(getgzexpert, data).done(function (result2) {
                    let operate
                    if (result2.data.length) {
                        $body.find('.sec1').append(`<div id="attention" class="attention active">已关注</div>`)
                    } else {
                        $body.find('.sec1').append(`<div id="attention" class="attention ">+关注</div>`)
                    }
                    $('#attention').click(function () {
                        if (!token) {
                            hcUtil.checkAppLogin(qid, ver)
                        }
                        let $el = $(this)
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
                            if (operate === '1') {
                                hcUtil.popMessagePrompt('', '是否取消关注', false).done(function (result) {
                                    if (result === 1) {
                                        request.call(that, $el, operate)
                                    }
                                })
                            } else {
                                request.call(that, $el, operate)
                            }
                        }
                    })

                    /**
                     * 获取关注
                     * @param $el 操作元素
                     * @param operate 关注状态
                     */
                    function request($el, operate) {
                        let data = that.data()
                        data.expertsid = _expert_id
                        data.operate = operate
                        _util_.makeJsonAjax(experts_guanzhu, data).done(function (result) {
                            if (result.code === 0) {
                                if (result.data.guanzhu === 1) {
                                    $el.addClass('active').text('已关注')
                                } else {
                                    $el.removeClass('active').text('+关注')
                                }
                            }
                        })
                    }

                    window.focusExpert = function (operate) {
                        if (operate / 1 === 1) {
                            $('#attention').addClass('active').text('已关注')
                        } else {
                            $('#attention').removeClass('active').text('+关注')
                        }
                    }
                })
            }
        }

        //微信支付完判断支付成功与否 方法放getServerts里是因为参数ts必须异步获取的
        popupPayInfo() {
            let type = _util_.getUrlParam('type')
            let that = this
            let data = that.data()
            data.recharge_order_id = _util_.getUrlParam('recharge_order_id')
            data.coupon_id = _util_.getUrlParam('coupon_id')
            data.plan_order_id = _util_.getUrlParam('plan_order_id')
            if (type === 'zfb_back') {
                request(query, data)
            } else if (type === 'wx_back') {
                data.trade_type = '0'
                hcUtil.popMessagePrompt('', '请确认微信支付是否完成', true).done(function () {
                    $body.append('<div class="popup-box" style="z-index: 99999999999"></div>')
                    request(wx_payed, data)
                })
            }

            function request(wx_payed, data) {
                popMessageTips({
                    icon: 'loading',
                    message: '数据加载中'
                })
                _util_.makeJsonAjax(wx_payed, data).done(function (result) {
                    popMessageTips({
                        remove: true
                    })
                    setTimeout(function () {
                        popMessageTips({
                            icon: 'fail',
                            message: '订单购买失败',
                        })
                        setTimeout(function () {
                            window.location.replace(`${ROOT_URL_HC}hc/order.html`)
                        }, 1000)
                    }, 5000)
                    if (result.code === 0) {
                        popMessageTips({
                            icon: 'suc',
                            message: '购买成功',
                            timeOutRemove: true,
                        })
                        setTimeout(function () {
                            window.location.replace(`//${window.location.host + window.location.pathname}`)
                        }, 1000)
                    } else if (result.code === 604) {
                        popMessageTips({
                            icon: 'suc',
                            message: result.msg,
                            timeOutRemove: true,
                        })
                        setTimeout(function () {
                            window.location.replace(`//${window.location.host + window.location.pathname}`)
                        }, 1000)
                    } else {
                        popMessageTips({
                            icon: 'loading',
                            message: '订单查询中',
                        })
                        if (!$('.popup-box').length) {
                            $body.append('<div class="popup-box" style="z-index: 99999999999"></div>')
                        }
                        setTimeout(function () {
                            request(data)
                        }, 1000)
                    }
                })
            }
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

        //加载支付完成的内容 方法放getServerts里是因为参数ts必须异步获取的
        loadConent() {
            let that = this
            let data = that.data()
            data.plan_id = _plan_id
            data.source = _is_from_7m
            let api = plan_content
            if (qid === 'yqbandroid' || qid === 'yqbios' || qid === 'dfsphcad' || qid === 'yqbandroid') {
                if (_plan_free === '1') {
                    api = yqb_plan_content
                }
            }
            if (qid === 'yqbios' && appStoreReview == 1) {
                try {
                    window.webkit.messageHandlers.androidios.postMessage({
                        method: 'getPayed',
                        info: _plan_id
                    })
                    window.getContent = function(res) {
                        if (res === '1' || _plan_free === '1') {
                            getPlan.call(that)
                            function getPlan() {
                                let that = this
                                let data = that.data()
                                data.plan_id = _plan_id
                                data.source = _is_from_7m
                                let api = yqb_plan_content_audit
                                hcUtil.popMessageTips({
                                    icon: 'loading',
                                    message: '加载中',
                                    remove: false,
                                    timeOutRemove: true,
                                    time: '1000'
                                })
                                _util_.makeJsonAjax(api, data).done(function(result) {
                                    hcUtil.popMessageTips({remove: true})
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
                                    }
                                })
                            }
                        } else {
                            if (timestampCha < 0) {
                                $sec3con.html(`<p class="topic">已停止售卖，下次比赛前来购买吧~</p>`)
                                if (_ismatched === '3') {
                                    that.popPricePrompt() //购买窗口
                                }
                            } else {
                                timestampCha = timestampCha / 1000
                                timemove()
                                that.t = setInterval(timemove, 1000)
                                try {
                                    if (typeof _stutas === 'undefined' || _stutas !== '1') {
                                        that.popPricePrompt() //购买窗口
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                            function timemove() {
                                let s = timestampCha % 60
                                let m = Math.floor(timestampCha / 60)
                                let h = Math.floor(m / 60)
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
                        }
                    }
                } catch (e) {
                    if (timestampCha < 0) {
                        $sec3con.html(`<p class="topic">已停止售卖，下次比赛前来购买吧~</p>`)
                        if (_ismatched === '3') {
                            that.popPricePrompt() //购买窗口
                        }
                    } else {
                        timestampCha = timestampCha / 1000
                        timemove()
                        that.t = setInterval(timemove, 1000)
                        try {
                            if (typeof _stutas === 'undefined' || _stutas !== '1') {
                                that.popPricePrompt() //购买窗口
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                return
            }
            _util_.makeJsonAjax(api, data).done(function (result) {
                if (result.code === 0) {
                    result.data.tuijian.forEach(function (item, i) {
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
                    $sec3con.html(`<p class="team mt30">${$title.text()}</p><p class="detail">${result.data.content}<br></p><!--<a href="https://mcp.eastday.com/?agent=3037&flag=7#/" class="banner"></a>-->`)
                    $('#btnPay').html(`<a href="${ROOT_URL_HC}hc/yuanbao.html" style="color:#fff;">查看退款</a>`).css({
                        background: '#ff3333'
                    })
                } else {
                    if (_plan_free === '1') {
                        if (qid === 'yqbios' || qid === 'yqbandroid') {
                            $sec3con.html(`<p class="topic">数据错误,请刷新页面</p>`)
                        } else {
                            $sec3con.html(`<p class="topic"><icon id="btnLogin" class="login"></icon>登录后才能查看哦~</p>`)
                            $sec3con.addClass('fuzzy')
                        }
                        return
                    }
                    if (timestampCha < 0) {
                        $sec3con.html(`<p class="topic">已停止售卖，下次比赛前来购买吧~</p>`)
                        if (_ismatched === '3') {
                            that.popPricePrompt() //购买窗口
                        }
                    } else {
                        timestampCha = timestampCha / 1000
                        timemove()
                        that.t = setInterval(timemove, 1000)
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
                let s = timestampCha % 60
                let m = Math.floor(timestampCha / 60)
                let h = Math.floor(m / 60)
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
        }

        loadHcList() {
            let that = this
            let data = {
                os: os,
                recgid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: startkey,
                planid: _plan_id,
                hcmatchid: _match_id[0],
            }
            let pathname = window.location.pathname
            if (startkey === 'end') return
            $loading.show()
            //原先的无限下拉信息流接口 wap/detailplans
            _util_.makeJsonp(dfsportswap_lottery + 'wap/getzdscheme', data).done(function (data) {
                $loading.hide()
                startkey = data.endkey
                if (data.data.length) {
                    data.data.forEach(function (item, i) {
                        if (pathname.indexOf(item.htmlname) >= 0) {
                            return
                        }
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
                        item.matchList.forEach(function (item2, i) {
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
                                            <a href="//msports.eastday.com/hc/fa/${item.htmlname}?from=faxq_list_fa_${i}" suffix="faxq_list_fa_${i}">
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
            }).always(function () {
                that.flag = true
            })
        }

        addEventLister() {
            let that = this
            $body.on('click', '.popup .btn-close', function () {
                $('.popup-box').remove()
            })
            $body.on('click', '.pay-box #btnPay', function () {
                if ($(this).hasClass('disabled')) return
                if (qid === 'dfttapp') {
                    /*let host = 'http://msports.eastday.com'
                    if (location.host === 'test-msports.dftoutiao.com') {
                        host = 'http://test-msports.dftoutiao.com/msports.east.com/build/html'
                    } else if (location.host === '172.20.6.219:8080') {
                        host = 'http://172.20.6.219:8080/html'
                    } else if (location.host === '172.20.6.219:8080') {
                        host = 'http://172.20.6.219:8080/html'
                    }*/
                    window.location.href = `${ROOT_URL_HC}hc/order-single.html?from=faxq_zf&qid=${qid}&planid=${_plan_id}&isfrom7m=${_is_from_7m}&headimg=${$('.sec1').find('.header img').attr('src')}`
                    /*JS_APP.openbyh5({
                        url: `${host}/hc/order-single.html?from=faxq_zf&qid=${qid}&planid=${_plan_id}&isfrom7m=${_is_from_7m}&headimg=${$('.sec1').find('.header img').attr('src')}`
                    })*/
                } else if (qid === 'dfsphcad' || qid === 'yqbandroid') {
                    if (token) {
                        window.location.href = `${ROOT_URL_HC}hc/order-single.html?from=faxq_zf&qid=${qid}&planid=${_plan_id}&isfrom7m=${_is_from_7m}&headimg=${$('.sec1').find('.header img').attr('src')}`
                    } else {
                        android.getinfoToApp()
                    }
                } else if (qid === 'dfsphcios' || qid === 'yqbios') {
                    /*if (qid === 'yqbios' && appStoreReview == 1) {
                        if (balanceNum > _yuanbao / 1) {
                            getPlan.call(that)
                        } else {
                            window.webkit.messageHandlers.androidios.postMessage({
                                method: 'nativeRecharge',
                                info: ''
                            })
                        }
                        return
                        function getPlan() {
                            let that = this
                            let data = that.data()
                            data.token = ''
                            data.plan_id = _plan_id
                            data.source = _is_from_7m
                            let api = yqb_plan_content_audit
                            hcUtil.popMessageTips({
                                icon: 'loading',
                                message: '支付中',
                                remove: false,
                                timeOutRemove: true,
                                time: '1000'
                            })
                            _util_.makeJsonAjax(api, data).done(function (result) {
                                hcUtil.popMessageTips({
                                    icon: 'suc',
                                    message: '支付成功',
                                    timeOutRemove: true,
                                    time: '1000'
                                })
                                setTimeout(function() {
                                    hcUtil.popMessageTips({remove: true})
                                }, 300)
                                if (result.code === 0) {
                                    result.data.tuijian.forEach(function (item, i) {
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
                                    clearInterval(that.t)
                                    $('.pay-box').remove()
                                    window.webkit.messageHandlers.androidios.postMessage({
                                        method: 'planPayedSuccess',
                                        info: _plan_id,
                                        goldNum: -(_yuanbao / 1)
                                    })
                                }
                            })
                        }
                    }*/
                    if (token || qid === 'yqbios') {
                        window.location.href = `${ROOT_URL_HC}hc/order-single.html?from=faxq_zf&qid=${qid}&planid=${_plan_id}&isfrom7m=${_is_from_7m}&headimg=${$('.sec1').find('.header img').attr('src')}`
                    } else {
                        window.webkit.messageHandlers.androidios.postMessage({
                            method: 'nativeUserLogin',
                            info: ''
                        })
                    }
                } else {
                    if (token) {
                        window.location.href = `${ROOT_URL_HC}hc/order-single.html?from=faxq_zf&qid=${qid}&planid=${_plan_id}&isfrom7m=${_is_from_7m}&headimg=${$('.sec1').find('.header img').attr('src')}`
                    } else {
                        window.location.href = `${ROOT_URL_HC}hc/login.html`
                    }
                }
            })
            $body.on('click', '.coupon-box .back', function () {
                $(this).parent().parent().parent().remove()
            })
            $body.on('click', '.pay-box #btnPayOrder', function () {
                if ($(this).hasClass('disabled')) return
                that.requestBuy()
            })
            $body.on('click', '#btnLogin', function() {
                hcUtil.checkAppLogin(qid)
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
        }

        //下载app
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

        warning() {
            let v = ver === '1.2.12'
            let reff = document.referrer.indexOf('experts_page') < 0

            if (v && reff) {
                hcUtil.popMessagePrompt('', '系统维护中，请去东方体育电脑或移动端网站购买。', true).done(function () {
                    history.back()
                })
            }
        }
    }

    /*function getUserInfo() {
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
    }*/
    new EastSport()
})
