import './style.scss'
import FastClick from 'fastclick'
import config from 'configDir/common.config'
import _util_ from 'public/libs/libs.util'
import hcUtil from 'public/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
import 'public/logic/log.js'
import 'public/libs/lib.prototype'
//app调试用
window.myconsole = function (text) {
    $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;height:20%;">${text}</div>`)
}

/* global android:true*/
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.4.1' //内页版本号
    console.log(version)
    let {HCAPIORDER} = config.API_URL
    let {ROOT_URL_HC, ROOT_URL_HC_detail} = config
    let {generate_plan_order, buy, recharge, recharge_wxpay} = HCAPIORDER
    let {popMessageTips, getServerts, popMessagePrompt} = hcUtil
    let osType = _util_.getOsType()
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        generate_plan_order = generate_plan_order.replace('/u/', '/yqb/')
        buy = buy.replace('/u/', '/yqb/')
        recharge = recharge.replace('/u/', '/yqb/')
        recharge_wxpay = recharge_wxpay.replace('/u/', '/yqb/')
    }
    let $body = $('body')
    let {ime, position, softtype, softname, appqid, apptypeid, ver, os, appver, deviceid, ts, accid, token} = {
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
        ts: _util_.CookieUtil.get('hcts'),
        accid: _util_.CookieUtil.get('hcaccid'),
        token: _util_.CookieUtil.get('hctoken')
    }
    class EastSport {
        constructor() {
            this.id = _util_.getUrlParam('planid') || ''//方案id
            this.source = _util_.getUrlParam('isfrom7m') || '' //方案来源
            this.btype = 'mhc_xpdetail'
            this.hasLoadedYouhuiquan = false //是否加载过优惠券这个接口
            this.coupons = [] //优惠券
            this.isUseCoupon = true //默认使用优惠券
            this.balanceNum = '' //剩余元宝数
            this.SelectedcouponId = '' //优惠券id
            this.price = ''
            this.plan_sel = 0
            this.freeYuanbao = 0 //优惠的元宝数
            this.finalPrice = 0 //最后的优惠完价格
            this.buyType = 'yb' //yb或者wx或者zfb
            this.payAgreement = true //默认勾选
            this.timeInterval = 0
            this.flag = true //下方列表加载开关
            this.osname = 'H5' //充值平台
            this.order_id = '' //订单ID
            this.headImg = _util_.getUrlParam('headimg') || 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
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
                    hcid: token,
                    code: encrypted(ime, apptypeid, ts),
                    plan_id: this.id,
                    qid: qid,
                    source: this.source,
                    btype: this.btype,
                    platform: this.osname,
                    osname: this.osname,
                    ttqid: ''
                }
            }
            this.init()
        }

        init() {
            this.preload()
            this.addEventLister() //注册事件
        }

        //预加载判断
        preload() {
            let that = this
            ;(function () {
                if (!token) {
                    if (qid !== 'yqbios') {
                        hcUtil.checkAppLogin(qid, ver)
                    }
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
                }
                hcUtil.appendInfoHeader(qid, '确认订单')
            })()
            //获取服务器时间,并且将本地时间和服务器时间误差保存
            getServerts().done(function (result) {
                ts = result
                that.timeInterval = ('' + new Date().getTime()).substring(0, 10) / 1 - ts / 1
                ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
                //that.requestYouhuiquan()
            }).then(function () {
                //预生成订单
                let data = that.data()
                popMessageTips({icon: 'loading'})
                _util_.makeJsonAjax(generate_plan_order, data).done(function (result) {
                    popMessageTips({
                        remove: true
                    })
                    //myconsole(token + '====' + JSON.stringify(result))
                    if (result.code === 0) {
                        that.coupons = that.yhqFilter(result.data.coupon, result.data.saishi.price / 1)
                        that.balanceNum = result.data.balance
                        that.result = result
                        that.popPayInfoBox()
                        //赢球吧ios下隐藏支付宝微信支付
                        /*if (qid === 'yqbios') {
                            $('.recharge-sec3 .row[data-type = "wx"]').hide()
                            $('.recharge-sec3 .row[data-type = "zfb"]').hide()
                        }*/
                    } else {
                        //hcUtil.checkAppLogin(qid)
                        //window.location = `${ROOT_URL_HC}hc/login2.html`
                        popMessageTips({
                            icon: 'fail',
                            message: result.msg,
                        })
                    }
                })
            })
        }

        yhqFilter(coupons, price) {
            let arr = []
            coupons.forEach(function (v) {
                switch (v.type) {
                    case 0:
                        if (v.price / 1 <= price) {
                            arr.push(v)
                        }
                        break
                    case 1:
                        if (price <= 28) {
                            v.yuanbao = price - 1
                            arr.unshift(v)
                        }
                        break
                    case 2:
                        if (price >= 38) {
                            v.yuanbao = price - 8
                            arr.unshift(v)
                        }
                        break
                    default:
                        break
                }
            })
            return arr
        }

        addEventLister() {
            let that = this
            $body.on('click', '#couponBox .back', function () {
                $(this).parent().parent().parent().remove()
            })
            //支付方式切换
            $body.on('click', '.order-box .recharge-sec3 .row', function () {
                if ($(this).hasClass('disabled')) return
                $(this).parent().children().removeClass('sel')
                $(this).addClass('sel')
                that.buyType = $(this).attr('data-type')
            })
            /*  if (qid === 'dfttapp') {
                  $('.recharge-sec3 .row[data-type = "wx"]').hide()
                  $('.recharge-sec3 .row[data-type = "zfb"]').click()
              }*/
            $body.on('click', '#btnAgree', function () {
                if ($(this).hasClass('agree')) {
                    $(this).removeClass('agree')
                    that.payAgreement = false
                } else {
                    $(this).addClass('agree')
                    that.payAgreement = true
                }
            })
            //优惠券
            $body.on('click', '.order-box .order-row3 p', function () {
                if ($(this).hasClass('disabled')) return
                that.popCouponBox()
            })
            $body.on('click', '#couponBox .tickets li', function () {
                let $ele = $(this)
                if ($(this).children('.check').hasClass('active')) {
                    that.SelectedcouponId = ''
                    that.finalPrice = that.price
                    that.freeYuanbao = 0
                    that.isUseCoupon = false
                    $(this).children('.check').removeClass('active')
                } else {
                    $ele.parent().find('li .check').removeClass('active')
                    $ele.children('.check').addClass('active')
                    let id = $ele.attr('attr-id')
                    let idx = $ele.attr('attr-idx') / 1
                    let yuanbao = $ele.attr('attr-yuanbao')
                    //popMessagePrompt('', '确定要使用这张优惠券吗?').done(function(result) {})
                    that.SelectedcouponId = id
                    that.finalPrice = that.price - yuanbao / 1
                    that.freeYuanbao = yuanbao / 1
                    that.plan_sel = idx

                    that.isUseCoupon = true
                }
                $('#couponBox').remove()
                $('.order-box').remove()
                $('.pay-box').remove()
                that.popPayInfoBox()
                $(window).scrollTop(0)
            })
            $body.on('click', '.pay-box #btnPayOrder', function () {
                if ($(this).hasClass('disabled')) return
                if (!that.payAgreement) {
                    popMessagePrompt('', '请勾选同意内容阅读付费协议', true).done(function () {
                        $('#btnAgree').addClass('agree')
                        that.payAgreement = true
                    })
                    return
                }
                if (that.balanceNum - that.finalPrice <= 0 && qid === 'yqbios') {
                    window.webkit.messageHandlers.androidios.postMessage({
                        method: 'nativeRecharge',
                        info: ''
                    })
                    return
                }
                that.requestBuy()
            })
            $body.on('click', '.order-box .recharge-sec3 .row a', function (e) {
                if (qid === 'yqbios') {
                    window.webkit.messageHandlers.androidios.postMessage({
                        method: 'nativeRecharge',
                        info: ''
                    })
                    e.preventDefault()
                } else if (qid === 'yqbandroid') {
                    android.nativeRecharge()
                    e.preventDefault()
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
        popPayInfoBox() {
            let data = this.result.data
            let that = this
            let today = new Date().format('MM-dd')
            let html = ''
            let length = that.coupons.length
            that.price = data.saishi.price
            that.order_id = data.order_id
            if (that.isUseCoupon) {
                if (length) {
                    if (that.coupons[that.plan_sel].type === 0) {
                        html = `<p>-${that.coupons[that.plan_sel].yuanbao}元宝<i></i></p>`
                    } else {
                        html = `<p>${that.coupons[that.plan_sel].name}<i></i></p>`
                    }
                    that.finalPrice = that.price - that.coupons[that.plan_sel].yuanbao
                    that.freeYuanbao = that.coupons[that.plan_sel].yuanbao
                    that.SelectedcouponId = that.coupons[that.plan_sel].id
                } else {
                    html = '<p class="disabled">暂无可用优惠券<i></i></p>'
                    that.finalPrice = that.price
                }
            } else {
                if (length) {
                    html = `<p>请选择<i></i></p>`
                } else {
                    html = '<p class="disabled">暂无可用优惠券<i></i></p>'
                    that.finalPrice = that.price
                }
            }
            let rechargeHtml = ''
            if (that.balanceNum - that.finalPrice >= 0) {
                rechargeHtml = `<div class="row sel" data-type="yb">
                                    <i></i>元宝支付 <span>余额:${that.balanceNum}元宝</span>
                                </div>`
                that.buyType = 'yb'
            } else {
                rechargeHtml = `<div class="row disabled" data-type="yb">
                                    元宝支付 <span style="color:#fb3338; ">余额不足</span><a href="${ROOT_URL_HC}hc/recharge.html?from=qrdd_cz" suffix="qrdd_cz">${qid === 'yqbios' ? '请充值' : '首充活动充30送30'}<b></b></a>
                                </div>`
                that.buyType = 'wx'
            }
            if (qid === 'yqbios') {}/* else if (qid === 'dfttapp' && softname === 'DFTTIOS') {
                rechargeHtml += `<div class="row ${that.buyType === 'yb' ? '' : 'sel'}" data-type="zfb">
                                    <i></i>支付宝支付
                                </div>`
                that.buyType = 'zfb'
            }*/ else {
                rechargeHtml += `<div class="row ${that.buyType === 'yb' ? '' : 'sel'}" data-type="wx">
                                    <i></i>微信支付
                                </div>
                                <div class="row" data-type="zfb">
                                    <i></i>支付宝支付
                                </div>`
            }
            let line3Html = ''
            JSON.parse(data.saishi.tuijian).forEach(function (item, i) {
                let time = item.date
                let timeString = ''
                if (time.indexOf(today) > -1) {
                    timeString = time.substring(11)
                } else {
                    timeString = time.substring(5, 10)
                }
                line3Html += `<div class="line_3">
                            <div class="tag">${item.let.let[0] === '让球' ? '竞足' : item.let.let[0]}</div>
                            <div class="tag2">${item.saishi}</div>
                            <div class="tag3">
                                ${item.homeTeam} VS ${item.visitTeam}
                            </div>
                            <div class="tag4">${timeString}</div>
                        </div>`
            })
            $body.append(`<div class="order-box">
        <div class="main">
            <div class="order-num">
                <div class="l">订单编号：${data.order_id}</div>
                <div class="r">${data.create_time}</div>
            </div>
            <div class="order-content">
                <ul>
                    <li>
                        <div class="line_1">
                            <div class="img"><img src="${that.headImg}"></div>
                            <div class="info">
                                <b>${data.saishi.writer}</b>
                            </div>
                        </div>
                        <div class="line_2">
                            ${data.saishi.title}
                        </div>
                        ${line3Html}
                    </li>
                </ul>
            </div>
            <div class="order-row3">
                <h3>优惠券</h3>
                ${html}
            </div>
            <div class="recharge-sec3">
                ${rechargeHtml}
            </div>
            <footer>
                <div class="agreement">
                    <i class="agree" id="btnAgree"></i>已阅读并同意<a id="payAgreement" href="${qid === 'yqbios' ? 'http://msports.eastday.com/payagreement_yqb.html' : `${ROOT_URL_HC}hc/read_pay_agreement.html?from=qrdd_nr`}" suffix="qrdd_nr">《内容阅读付费协议》</a>。本平台非购彩平台，元宝不能购彩或提现。
                </div>
            </footer>
        </div>
    </div>
                            <div class="pay-box" style="z-index: 9999">
                                <div class="item">
                                    <p>需支付：${that.finalPrice} 元宝</p>
                                    <p>已优惠  ${that.freeYuanbao}元宝</p>
                                </div>
                                <div id="btnPayOrder" class="item">
                                  立即支付
                                </div> 
                            </div>`)
        }

        //购买方案
        requestBuy() {
            let data = this.data()
            let that = this
            let api = '' //区分元宝 支付宝 微信支付
            data.coupon_id = this.SelectedcouponId
            data.order_id = this.order_id
            data.plan_id = this.id
            data.source = this.source
            if (!that.payAgreement) {
                popMessageTips({
                    icon: 'loading',
                    message: '请勾选付费协议'
                })
                return
            }
            popMessageTips({
                icon: 'loading',
                message: '订单支付中'
            })
            if (this.buyType === 'yb') {
                api = buy
                _util_.makeJsonAjax(api, data).done(function (result) {
                    popMessageTips({remove: true})
                    if (result.code === 0) {
                        popMessageTips({
                            icon: 'suc',
                            message: '支付成功,稍等返回'
                        })
                        setTimeout(function () {
                            window.location.href = `${ROOT_URL_HC_detail}${result.data.htmlname}`
                        }, 1000)
                    } else if (result.code === 604) {
                        popMessageTips({
                            icon: 'suc',
                            message: '方案已购买',
                            timeOutRemove: true
                        })
                        setTimeout(function () {
                            window.location = `${ROOT_URL_HC}hc/order.html`
                        }, 1000)
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: '支付失败，请重试',
                            timeOutRemove: true,
                        })
                    }
                })
            } else if (this.buyType === 'zfb') {
                api = recharge
                data.trade_type = '0'
                data.goods_id = ''
                data.pay_type = '1'
                data.price = that.finalPrice
                _util_.makeJsonAjax(api, data).done(function (result) {
                    popMessageTips({remove: true})
                    if (result.code === 0) {
                        setTimeout(function () {
                            document.write(`${result.data.orderinfo}`)
                        }, 200)
                    } else if (result.code === 604) {
                        popMessageTips({
                            icon: 'suc',
                            message: result.message,
                            timeOutRemove: true
                        })
                        setTimeout(function () {
                            window.location = `${ROOT_URL_HC}hc/order.html`
                        }, 1000)
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: result.message,
                            timeOutRemove: true,
                        })
                    }
                })
            } else {
                api = recharge_wxpay
                data.trade_type = '0'
                data.goods_id = ''
                data.pay_type = '1'
                data.price = that.finalPrice
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
                            wap_url: '',
                            wap_name: '东方体育红彩H5'
                        }
                    }
                }
                _util_.makeJsonAjax(api, data).done(function (result) {
                    popMessageTips({remove: true})
                    if (result.code === 0 && result.data.result_code === 'SUCCESS' && result.data.result_code === 'SUCCESS') {
                        if (result.data.mweb_url) {
                            window.location = `${result.data.mweb_url}`
                        }
                    } else if (result.code === 604) {
                        popMessageTips({
                            icon: 'suc',
                            message: result.message,
                            timeOutRemove: true
                        })
                        window.location = `${ROOT_URL_HC}hc/order.html`
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: result.message,
                            timeOutRemove: true,
                        })
                    }
                })
            }
        }

        //优惠券窗口
        popCouponBox() {
            let html = ''
            let that = this
            html += `<div class="coupon-box" id="couponBox" style="z-index: 9999"><div>
                    <header class="info_header">
                        <i class="back" id="backCoupon">返回</i><h3>可用优惠券</h3>
                    </header>
                    <div class="main">
                        <ul class="tickets">`
            this.coupons.forEach(function (item, k) {
                switch (item.type) {
                    case 1 :
                        html += `<li attr-id="${item.id}" attr-idx="${k}" attr-yuanbao="${item.yuanbao}">
                <div class="check ${item.id === that.SelectedcouponId ? 'active' : ''}"></div>
                <div class="can_use">
                    <div class="left">
                        <div class="value"  style="font-size: .6rem"><b>万能券</div>
                    </div>
                    <div class="right">
                        <h6>${item.name}</h6>
                        <p>全平台通用，购买28元及以下的方案只需1元</p>
                        <div class="time">有效期:${item.expire_time}</div>
                    </div>
                </div>
            </li>`
                        break
                    case 2:
                        html += `<li attr-id="${item.id}" attr-idx="${k}"  attr-yuanbao="${item.yuanbao}">
                <div class="check ${item.id === that.SelectedcouponId ? 'active' : ''}"></div>
                <div class="can_use">
                    <div class="left">
                        <div class="value"  style="font-size: .6rem">万能券</div>
                    </div>
                    <div class="right">
                        <h6>${item.name}</h6>
                        <p>全平台通用，购买38元及以上的方案只需8元</p>
                        <div class="time">有效期:${item.expire_time}</div>
                    </div>
                </div>
            </li>`
                        break
                    default:
                        html += `<li attr-id="${item.id}" attr-idx="${k}"  attr-yuanbao="${item.yuanbao}">
                <div class="check ${item.id === that.SelectedcouponId ? 'active' : ''}"></div>
                <div class="can_use">
                    <div class="left">
                        <div class="value"><b>${item.yuanbao}</b>&nbsp;元宝</div>
                        <div class="type">支付直减</div>
                    </div>
                    <div class="right">
                        <h6>${item.name}</h6>
                        <p>全平台通用，红彩达人内所有方案均可使用</p>
                        <div class="time">有效期:${item.expire_time}</div>
                    </div>
                </div>
            </li>`
                        break
                }
            })
            html += `</ul></div></div></div>`
            $body.append(html)
        }
    }

    new EastSport()

    $(window).on('popstate', function () {
        if (document.referrer.indexOf(location.host) < 0) {
            location.href = '/hc/order.html'
            return false
        } else {
            history.back()
        }
    })
})
