import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'
import JS_APP from "public/libs/JC.JS_APP";
//app调试用
window.myconsole = function (text) {
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
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HCAPIORDER} = config.API_URL
    let {ROOT_URL_HC, ROOT_URL_HC_detail} = config
    let {get_order_list, cancel_order} = HCAPIORDER
    let timeInterval = 0
    let $list = $('.order_list')
    let order_page = [
        0,
        0,
        0,
        0,
        0
    ]
    let navindex = 0
    let flag = true
    let $body = $('body')
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        get_order_list = get_order_list.replace('/u/', '/yqb/')
        cancel_order = cancel_order.replace('/u/', '/yqb/')
    }
    let osType = _util_.getOsType()
    hcUtil.appendInfoHeader(qid, '我的订单')
    let {ime, position, softtype, softname, apptypeid, ver, os, appver, deviceid, accid, token} = {
        ime: _util_.CookieUtil.get('hcime') || '123456',
        position: _util_.CookieUtil.get('hcposition'),
        softtype: _util_.CookieUtil.get('hcsofttype') || 'dongfangtiyu',
        softname: _util_.CookieUtil.get('hcsoftname') || 'DFTYH5',
        apptypeid: _util_.CookieUtil.get('hcapptypeid') || 'DFTY',
        ver: _util_.CookieUtil.get('hcver'),
        os: _util_.CookieUtil.get('hcos') || osType,
        appver: _util_.CookieUtil.get('hcappver'),
        deviceid: _util_.CookieUtil.get('hcdeviceid'),
        ts: _util_.CookieUtil.get('hcts'),
        accid: _util_.CookieUtil.get('hcaccid'),
        token: _util_.CookieUtil.get('hctoken')
    }
    // 页面逻辑
    const logic_page = {
        //获取订单列表
        order_list: function (page, status) {
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            if (status === '4') {
                status = '5'
            }
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
                code: encrypted(ime, apptypeid, ts),
                page: page || 0,
                token: token,
                status: status
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: page ? '加载更多' : '正在获取订单列表',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })
            _util_.makeJson(get_order_list, data).done(function (res) {
                if (res.code === 0) {
                    hcUtil.popMessageTips({remove: true})
                    logic_page.loadOrderList(res)
                } else {
                    if (qid !== 'yqbios') {
                        hcUtil.checkAppLogin(qid)
                    }
                }
            })
        },
        initList: function (list, day) {
            let str = ''
            $.each(list, function (k, v) {
                str += logic_page.strMode.init(v)
            })
            let $daylist = $list.find(`li[date='${day}']`)
            if (!$daylist.length) {
                $daylist = $(`<li date="${day}"><div class="date">${day}</div><ul class="day_list"></ul></li>`)
                $list.append($daylist)
            }
            $daylist.find('.day_list').append(str)
        },
        loadOrderList: function (res) {
            if (!res.data.length) {
                if (!$list.eq(navindex).children().length) {
                    $list.eq(navindex).append('<li class="no_data">暂无订单</li>')
                } else {
                    $('#nodata').remove()
                    $list.eq(navindex).append('<li id="nodata" class="" style="text-align: center;line-height: 1rem;font-size: 0.3rem">无更多订单了</li>')
                }
                return
            }
            let str = ''
            res.data.forEach(function (item) {
                str += logic_page.strMode.init(item)
            })
            $list.eq(navindex).append(str)
            order_page[navindex]++
            flag = true
        },
        strMode: {
            init: function (v) {
                return this.hc(v)
            },
            hc: function (v) {
                let state = ''
                let state_class = ''
                let info = ''
                switch (v.status) {
                    case '1':
                        state = '待付款'
                        state_class = 'wait'
                        break
                    case '2':
                        state = '支付成功'
                        state_class = 'success'
                        break
                    case '3':
                        state = '交易关闭'
                        state_class = 'fail'
                        break
                    case '4': //下线
                        state = '交易关闭'
                        state_class = 'fail'
                        info = '<div class="ch" style="color:#ff4646;padding-left:0.25rem">该方案已被专家撤回</div>'
                        break
                    case '5':
                        state = '下线并退款'
                        state_class = 'fail'
                        info = '<div class="ch" style="color:#ff4646;padding-left:0.25rem">该方案已被专家撤回</div>'
                        break
                    default:
                        break
                }
                if (!v.title) {
                    v.title = '发布简介'
                }
                let today = new Date().format('MM-dd')
                let html = ''
                let honghei = ''
                let match_status = ''
                let color = ''
                if (v.honghei === '1') {
                    honghei = 'red'
                } else if (v.honghei === '2') {
                    honghei = 'black'
                } else if (v.honghei === '3') {
                    honghei = 'zou'
                } else if (v.honghei === '5') {
                    match_status = '已延期'
                    color = '#ff7043'
                } else {
                    honghei = ''
                }
                v.saishi.forEach(function (item2) {
                    let timeString = ''
                    if (item2.match_time.indexOf(today) > -1) {
                        timeString = item2.match_time.substring(6)
                    } else {
                        timeString = item2.match_time.substring(0, 5)
                    }
                    html += `<div class="line_3">
                                        <div class="tag">${item2.type.replace('让球', '竞足')}</div>
                                        <div class="tag2">${item2.saishi}</div>
                                        <div class="tag3">
                                         ${v.status === '3' ? `${item2.homeTeam + ' ' + item2.homeScore + ':' + item2.visitScore + ' ' + item2.visitTeam}` : `${item2.homeTeam + ' VS ' + item2.visitTeam}`}
                                         </div>
                                        <div class="tag4">${timeString}</div>
                                    </div>`
                })
                if (v.match_status === '0') {
                    match_status = '未开始'
                    color = '#ff7043'
                } else if (v.match_status === '1') {
                    match_status = '进行中 '
                    color = '#4f95fe'
                } else if (v.match_status === '2') {
                    match_status = '已结束'
                    color = '#999999'
                } else if (v.match_status === '3') {
                    match_status = '已延期'
                    color = '#ff7043'
                }
                return `<li>
                            <a href="${ROOT_URL_HC_detail + v.htmlname}">
                            <div class="order-num">
                                <div class="l">订单编号：${v.order_id}</div> <div class="r">${v.create_time}</div>
                            </div>
                            <div class="line_1 clearfix">
                                <div class="img"><img src="${v.imgurl.replace('http:', 'https:')}" alt=""></div>
                                <div class="info">
                                    <b>${v.expert_name}</b>
                                </div>
                                <div class="mz fr">
                                    <p>
                                        <span class="state ${state_class}">${state}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="line_2">
                                ${v.title}
                            </div>
                            ${html}
                            <div class="line_4">
                                <div class="col1" style="color: ${color}">${match_status}</div>
                                <div class="col2"> <b>|</b>${v.status === '1' || v.status === '3' || v.status === '4' ? '方案金额：' : '实付：'} <span>${v.status === '1' || v.status === '3' || v.status === '4' ? v.yuanbao : v.real_yuanbao}元宝</span></div>
                                ${info}
                                ${v.status === '1' ? `
                                <div class="btns" data-planid="${v.plan_id}" data-isfrom7m="${v.source}" data-orderid="${v.order_id}" data-imgurl="${v.imgurl}">
                                    <div class="btn">取消订单</div>
                                    <div class="btn">立即支付</div>
                                </div>` : `${v.status === '5' ? '' : `<div class="mark ${honghei}"></div>`}`}
                            </div>
                            </a>
                        </li>`
            }
        }
    }
    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        logic_page.order_list(order_page[navindex], navindex)
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
    // 页面事件绑定
    $(window).scroll(function () {
        let $liveboxHeight = $('body').height()
        let $liveboxScrollTop = $(this).scrollTop()
        let clientHeight = $(this).height()
        if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && flag) { // 距离底端80px是加载内容
            flag = false
            logic_page.order_list(order_page[navindex], '' + navindex)
        }
    })
    $body.on('click', '.main nav li', function () {
        flag = true
        navindex = $(this).index()
        $(this).parent().children().removeClass('active')
        $(this).addClass('active')
        $list.hide()
        $list.eq(navindex).show()
        if (!$list.eq(navindex).children().length) {
            logic_page.order_list(order_page[navindex], '' + navindex)
        }
    })
    $body.on('click', '.main .order_list li .btns .btn', function (e) {
            let index = $(this).index()
            e.preventDefault()
            let order_id = $(this).parent().attr('data-orderid')
            let planid = $(this).parent().attr('data-planid')
            let isfrom7m = $(this).parent().attr('data-isfrom7m')
            let headimg = $(this).parent().attr('data-imgurl')
            if (index === 0) {
                let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
                let ime = '123456'
                let apptypeid = 'DFTY'
                let data = {
                    ime: ime,
                    softname: 'DFTYH5',
                    apptypeid: apptypeid,
                    os: 'H5',
                    ts: ts,
                    accid: _util_.CookieUtil.get('accid'),
                    code: encrypted(ime, apptypeid, ts),
                    order_id: order_id,
                    token: _util_.CookieUtil.get('hctoken'),
                    status: status
                }
                hcUtil.popMessageTips({
                    icon: 'loading',
                    message: '正在取消订单',
                    remove: false,
                    timeOutRemove: false,
                    time: '3000'
                })
                _util_.makeJson(cancel_order, data).done(function (res) {
                    hcUtil.popMessageTips({remove: true})
                    if (res.code === 0) {
                        hcUtil.popMessageTips({
                            icon: 'suc',
                            message: '订单取消成功'
                        })
                    }
                    setTimeout(function () {
                        window.location.reload()
                    }, 1000)
                })
                //取消订单
            } else {
                if (qid === 'dfttapp') {
                    let host = 'http://msports.eastday.com'
                    if (location.host === 'test-msports.dftoutiao.com') {
                        host = 'http://test-msports.dftoutiao.com/msports.east.com/build/html'
                    }
                    JS_APP.openbyh5({
                        url: host + `/hc/order-single.html?qid=${qid}&planid=${planid}&isfrom7m=${isfrom7m}&headimg=${headimg}`
                    })
                } else {
                    window.location.href = `${ROOT_URL_HC}hc/order-single.html?qid=${qid}&planid=${planid}&isfrom7m=${isfrom7m}&headimg=${headimg}`
                }
            }
        }
    )
})
