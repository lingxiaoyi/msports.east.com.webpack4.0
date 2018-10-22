import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
import JS_APP from '../../../public-resource/libs/JC.JS_APP'

window.myconsole = function (text) {
    $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;height:20%;">${text}</div>`)
}

window.consoletmy = function (res) {
    console.info(res)
    if (typeof res === typeof {}) {
        res = '<pre>' + JSON.stringify(res, null, 2) + '</pre>'
    } else {
        res = '<pre>' + res + '</pre>'
    }
    document.querySelector('#console .content').innerHTML = document.querySelector('#console .content').innerHTML + res
}
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.0.7' //首页版本号
    console.log(version)
    let {HCAPIORDER, HCAPI} = config.API_URL
    let {ROOT_URL_HC, wap_url} = config
    let {generate_plan_order, buy, tt_login, recharge, query, recharge_wxpay, wx_payed} = HCAPIORDER
    let {get_user_yuanbao} = HCAPI
    const osType = _util_.getOsType()
    //const recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        generate_plan_order = generate_plan_order.replace('/u/', '/yqb/')
        recharge = recharge.replace('/u/', '/yqb/')
        query = query.replace('/u/', '/yqb/')
        recharge_wxpay = recharge_wxpay.replace('/u/', '/yqb/')
        wx_payed = wx_payed.replace('/u/', '/yqb/')
        get_user_yuanbao = get_user_yuanbao.replace('/u/', '/yqb/')
    }
    let $body = $('body')
    let $sec1 = $('.sec1')
    let $sec1P = $sec1.children('p')
    let $sec2 = $('.recharge-sec2')
    let $sec3 = $('.recharge-sec3')
    let $pay_btn = $('#pay_btn')
    let $btnAgree = $('#btnAgree')
    let $paynum = $('.paynum')
    let myTs = new Date().getTime()
    let {ime, position, softtype, softname, appqid, apptypeid, ver, os, appver, deviceid, ts, accid, code, token} = {
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
        code: _util_.CookieUtil.get('hccode'),
        token: _util_.CookieUtil.get('hctoken'),
        phone: 0
    }
    if (!code) {
        code = encrypted(ime, apptypeid, myTs)
    }
    let osname = 'H5'
    if (qid === 'dfsphcios') {
        osname = 'IOS_H5'
    } else if (qid === 'dfsphcad') {
        osname = 'Android_H5'
    } else if (qid === 'yqbios') {
        osname = 'IOS_H5_yqb'
    } else if (qid === 'yqbandroid') {
        osname = 'Android_H5_yqb'
    }
    hcUtil.appendInfoHeader(qid, '充值')
    let {popMessageTips, getServerts} = hcUtil

    class EastSport {
        constructor() {
            this.isInApp = (qid === 'dfsphcios' || qid === 'dfsphcad')
            this.selectYuanbaoNum = 1 //默认选中元宝的id
            this.selectYuanbaoText = '30元宝' //默认选中text
            this.buyType = 'wx' //wx或者zfb
            this.payAgreement = true //默认不勾选
            this.timeInterval = 0 //本地时间和服务器时间间隔
            this.osname = osname
            this.btype = 'mhc_xprecharge'
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
                    ttqid: '',
                    goods_id: this.selectYuanbaoNum,
                    'pay_type': 2
                }
            }
            this.init()
        }

        init() {
            //this.removeWxPay()
            this.getServertsTs() //获取服务器时间
            this.paysure()
            this.addEventLister()
            this.requestSurplusYuanBao()
            /*if (qid === 'dfttapp' && softname === 'DFTTIOS') {
                $sec3.find('.row').eq(0).remove()
                this.buyType = 'zfb'
                $sec3.find('.row').eq(0).addClass('sel')
            }*/
        }

        //预加载判断
        preload() {
            let that = this
            !(function () {
                let agent = navigator.userAgent.toLowerCase()
                if (agent.indexOf('dftyandroid') >= 0) {
                    qid = 'dfsphcad'
                    android.nativeTitle('确认订单')
                } else if (agent.indexOf('dftyios') >= 0) {
                    qid = 'dfsphcios'
                    window.webkit.messageHandlers.androidios.postMessage({
                        method: 'nativeTitle',
                        info: '确认订单'
                    })
                }
                //判断osname和加载上方导航
                if (qid === 'dfsphcios') {
                    that.osname = 'IOS_H5'
                } else if (qid === 'dfsphcad') {
                    that.osname = 'Android_H5'
                } else {
                    debugger
                    $body.prepend(`
<header class="info_header">
    <i class="back"></i><h3>确认订单</h3>
</header>`)
                    $('.info_header .back').click(function () {
                        if (document.referrer.indexOf(location.host) > -1) {
                            window.history.go(-1)
                        } else {
                            window.location.href = `${ROOT_URL_HC}hc/index.html`
                        }
                    })
                }
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
                    if (result.code === 0) {
                        that.coupons = result.data.coupon
                        that.balanceNum = result.data.balance
                        that.result = result
                        that.popPayInfoBox()
                    } else {
                        //window.location = `${ROOT_URL_HC}hc/login2.html`
                    }
                })
            })
        }

        paysure() {
            let that = this,
                result = {
                    type: _util_.getUrlParam('type'),
                    order_id: _util_.getUrlParam('recharge_order_id')
                }
            if (!result.type || !result.order_id) return
            if (result.type === 'wx_back') {
                this.popMessagePrompt('', `请确认支付是否已完成`, false).done(function (res) {
                    if (res === 1) {
                        that.payresult(result)
                    }
                })
            } else {
                that.payresult(result)
            }
        }

        //支付结果查询
        payresult(result) {
            let that = this
            result = result || {
                type: _util_.getUrlParam('type'),
                order_id: _util_.getUrlParam('recharge_order_id')
            }
            this.queryTimes = this.queryTimes || false
            setTimeout(() => {
                that.queryTimes = true
            }, 5000)
            if (result.type && result.order_id) {
                let data = this.data()
                data.recharge_order_id = result.order_id
                data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - this.timeInterval
                data.code = encrypted(ime, apptypeid, data.ts)
                popMessageTips({
                    icon: 'loading',
                    message: '充值结果查询中'
                })
                if (result.type === 'zfb_back') {
                    _util_.makeJsonAjax(query, data).done((res) => {
                        that.payresSet(res)
                    })
                } else if (result.type === 'wx_back') {
                    data.trade_type = 0
                    _util_.makeJsonAjax(wx_payed, data).done((res) => {
                        that.payresSet(res)
                    })
                }
            }
        }

        payresSet(result) {
            let that = this
            if (result.code === 0) {
                hcUtil.popMessageTips({
                    icon: 'suc',
                    message: '支付成功',
                    remove: false,
                    timeOutRemove: false,
                    time: '3000'
                })
                location.replace(location.pathname)
                return
            }
            if (this.queryTimes) {
                popMessageTips({
                    remove: true
                })
                this.popMessagePrompt('', '充值失败，请稍后查看元宝或加客服<br>QQ:2880263957', true).done(function () {
                    location.replace(location.pathname)
                })
            } else {
                setTimeout(function () {
                    that.payresult()
                }, 1000)
            }
        }

        popupPayInfo() {
            let trade_type = _util_.getUrlParam('trade_type')
            let out_trade_no = _util_.getUrlParam('out_trade_no')
            let that = this
            if (trade_type && out_trade_no) {
                ///this.popMessagePrompt('', '支付已完成', true).done(function() {
                let data = {
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
                _util_.makeJsonAjax(wx_payed, data).done(function (result) {
                    popMessageTips({
                        remove: true
                    })
                    if (result.code === 0) {
                        that.popMessagePrompt('', '充值成功,请刷新页面', true).done(function () {
                            window.location.replace(`//${window.location.host + window.location.pathname}`)
                        })
                    } else {
                        that.popMessagePrompt('', '充值失败,请重新充值', true).done(function () {
                            window.location.replace(`//${window.location.host + window.location.pathname}`)
                        })
                    }
                })
            }
        }

        getServertsTs() {
            let that = this
            getServerts().done(function (result) {
                ts = result
                myTs = ('' + new Date().getTime()).substring(0, 10)
                that.timeInterval = myTs / 1 - ts / 1
                that.popupPayInfo() //判断是否微信支付返回的链接
            }).fail(function () {
                that.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
                    window.location.reload()
                })
            })
        }

        addEventLister() {
            let that = this
            $sec2.on('click', 'ul li', function () {
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
                        btnNum = 80
                        break
                    case '3':
                        btnNum = 158
                        break
                    case '4':
                        btnNum = 288
                        break
                    case '5':
                        btnNum = 888
                        break
                    case '6':
                        btnNum = 1288
                        break
                }
                $paynum.html(`应支付：${btnNum}元`)
                // $pay_btn.html(`确认支付 ￥<b>${btnNum}</b>`)
                that.selectYuanbaoNum = num
                that.selectYuanbaoText = btnNum
            })
            $sec3.on('click', '.row', function () {
                let type = $(this).attr('data-type')
                $(this).parent().children().removeClass('sel')
                $(this).addClass('sel')
                that.buyType = type
            })
            $btnAgree.on('click', function () {
                if ($(this).hasClass('agree')) {
                    $(this).removeClass('agree')
                    $pay_btn.addClass('unagree')
                    that.payAgreement = false
                } else {
                    $(this).addClass('agree')
                    $pay_btn.removeClass('unagree')
                    that.payAgreement = true
                }
            })
            //请求支付接口
            $pay_btn.on('click', function () {
                if (!token) {
                    hcUtil.checkAppLogin(qid, ver)
                    return
                }
                if (that.payAgreement) {
                    that.popMessagePrompt('', `您确定要充值${that.selectYuanbaoText}元宝吗?`, false).done(function (result) {
                        if (result === 1) {
                            _util_.CookieUtil.set('pay_page', window.location.href)
                            that.requestBuyYuanBao()
                        }
                    })
                } else {
                    that.popMessagePrompt('', '请勾选充值协议', true)
                }
            })
            /*  if (qid === 'dfttapp') {
                  $('.recharge-sec3 .row[data-type = "wx"]').hide()
                  $('.recharge-sec3 .row[data-type = "zfb"]').click()
              }*/
        }

        //请求剩余元宝
        requestSurplusYuanBao() {
            let data = {
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
                code: code,
                token: token
            }
            let that = this
            $sec2.find('ul li').eq(0).addClass('shouchong').html(`<h6>充30元</h6><h5>送<b>30</b>元宝</h5>`)
            data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
            data.code = encrypted(ime, apptypeid, data.ts)
            //myconsole(JSON.stringify(data))
            _util_.makeJsonAjax(get_user_yuanbao, data).done(function (result) {
                if (result.code === 0) {
                    $sec1P.eq(0).text(`充值账号：${result.data.nickname}`)
                    if (that.yuanbao && that.yuanbao < result.data.yuanbao) {
                        that.yuanbao = result.data.yuanbao
                    }
                    $sec1P.eq(1).html(`当前元宝：<span>${result.data.yuanbao}</span> 元宝 <i></i>`)
                    if (result.data.sc === 0) {
                        $sec2.find('ul li').eq(0).addClass('shouchong').html(`<h6>充30元</h6><h5>送<b>30</b>元宝</h5>`)
                    } else {
                        $sec2.find('ul li').eq(0).removeClass('shouchong').html(`<h4>30元宝</h4>`)
                    }
                }/* else {
                    that.popMessagePrompt('', '请登录', true).done(function (result) {
                        if (qid === 'dfsphcad') {
                            that.addAppMethod()
                        } else if (qid === 'dfsphcios') {
                            window.webkit.messageHandlers.androidios.postMessage({
                                method: 'nativeUserLogin',
                                shareInfo: ''
                            })
                        } else if (qid === 'dfttapp') {
                            JS_APP.ToViewLogin({})
                        } else {
                            window.location = `login.html`
                        }
                    })
                }*/
            })
        }

        //充值元宝
        requestBuyYuanBao() {
            let data = this.data()
            let that = this
            data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - that.timeInterval
            data.code = encrypted(ime, apptypeid, data.ts)
            popMessageTips({
                icon: 'loading',
                message: '正在支付中'
            })
            let api = ''
            if (that.buyType === 'zfb') {
                api = recharge
                data.trade_type = '0'
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
                            message: result.message
                        })
                        window.location = `${ROOT_URL_HC}hc/recharge.html`
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: result.message,
                            timeOutRemove: true
                        })
                    }
                })
            } else {
                api = recharge_wxpay
                data.trade_type = '0'
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
                            message: result.message
                        })
                        window.location = `${ROOT_URL_HC}hc/recharge.html`
                    } else {
                        popMessageTips({
                            icon: 'fail',
                            message: result.message,
                            timeOutRemove: true
                        })
                    }
                })
            }
        }

        /**
         * 弹窗提示 标题,消息
         * @param title ''
         * @param message ''
         * @param isSingle true or false
         * @returns {*}
         */
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
            $body.on('click', '.mint-msgbox-btns .mint-msgbox-btn', function () {
                let index = $(this).index()
                deferred.resolve(index)
                $(this).parent().parent().parent().parent().remove()
            })
            return deferred.promise()
        }

        addAppMethod() {
            android.getinfoToApp(_plan_id, _yuanbao, _is_from_7m)
        }
    }

    new EastSport()

    $(window).on('popstate', function () {
        if (document.referrer.indexOf(location.host) < 0) {
            location.href = '/hc/yuanbao.html'
            return false
        } else {
            history.back()
        }
    })

})
