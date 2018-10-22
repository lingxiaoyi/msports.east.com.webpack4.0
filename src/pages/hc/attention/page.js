import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {mygetgzexpert, experts_guanzhu} = config.API_URL.HCAPI
    let timeInterval = 0
    let $list = $('.order_list')
    let $win = $(window)
    let order_page = 0
    let list_load = false
    let $body = $('body')
    let qid = _util_.getPageQid()
    let startkey = ''
    let {ime, position, softtype, softname, appqid, apptypeid, ver, appver, deviceid, ts, accid, code, token, nickname} = {
        ime: _util_.CookieUtil.get('hcime') || '123456',
        position: _util_.CookieUtil.get('hcposition'),
        softtype: _util_.CookieUtil.get('hcsofttype') || 'dongfangtiyu',
        softname: _util_.CookieUtil.get('hcsoftname') || 'DFTYH5',
        appqid: _util_.CookieUtil.get('hcappqid'),
        apptypeid: _util_.CookieUtil.get('hcapptypeid') || 'DFTY',
        ver: _util_.CookieUtil.get('hcver'),
        appver: _util_.CookieUtil.get('hcappver'),
        deviceid: _util_.CookieUtil.get('hcdeviceid'),
        ts: _util_.CookieUtil.get('hcts') /*|| ('' + myTs).substring(0, 10)*/,
        accid: _util_.CookieUtil.get('hcaccid'),
        code: _util_.CookieUtil.get('hccode'),
        token: _util_.CookieUtil.get('hctoken'),
        nickname: _util_.CookieUtil.get('nickname')
    }
    hcUtil.appendInfoHeader(qid, '我的专家')
    // 页面逻辑
    const logic_page = {
        //获取订单列表
        order_list: function (page) {
            if (list_load) return false
            list_load = !list_load
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let ime = '123456'
            // let ime = '863167039343887'
            let apptypeid = 'DFTY'
            let data = {
                ime: ime,
                softname: 'DFTYAndroid',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                accid: _util_.CookieUtil.get('accid'),
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken'),
                maxNum: 20,
                startkey: startkey,
                userid: _util_.CookieUtil.get('accid')
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: page ? '加载更多' : '正在获取数据',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })
            _util_.makeJsonp(mygetgzexpert, data).done(function (res) {
                if (res.data.length) {
                    hcUtil.popMessageTips({remove: true})
                    logic_page.listLefine(res)
                    startkey = res.endkey
                } else {
                    logic_page.nodata()
                    if (!res.data.length) {
                        hcUtil.popMessageTips({
                            icon: order_page ? '' : 'fail',
                            message: order_page ? '没有更多数据' : '没有关注记录',
                            remove: false,
                            timeOutRemove: true,
                            time: '1000'
                        })
                        return false
                    }
                }
            })
        },
        nodata: function () {
            $list.append('<li class="no_data">无更多数据</li>')
        },
        strMode: {
            init: function (v) {
                return this.hc(v)
            }
        }, //列表按照日期细化
        listLefine: function (res) {
            list_load = !list_load
            res.data.forEach(function (item) {
                $list.append(`<li>
                                <a href="./experts_page.html?expertId=${item.expert.expertId}" class="clearfix">
                                <div class="img"><img src="${item.expert.expertImg}" alt=""></div>
                                <p>${item.expert.expertName}</p>
                                </a>
                                <div class="btn id${item.expert.expertId} active" data-id="${item.expert.expertId}">已关注</div>
                            </li>`)
            })
        }
    }
    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        logic_page.order_list(order_page)
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
    // 页面事件绑定
    $(window).on('scroll', function () {
        let $last = $list.children().last()
        let maxScroll = $last.offset().top - $win.height()
        let Scroll = $win.scrollTop()
        if (maxScroll < Scroll) {
            logic_page.order_list(order_page)
        }
    })
    //关注
    $body.on('click', '.main .order_list li .btn', function () {
        let id = $(this).attr('data-id')
        let that = this
        let data = {
            expertsid: id,
            userid: accid,
            operate: '0',
            ime: ime,
            position: position,
            softtype: softtype,
            softname: softname,
            appqid: qid,
            apptypeid: apptypeid,
            ver: ver,
            os: 'H5',
            appver: appver,
            deviceid: deviceid,
            accid: accid,
            token: token
        }
        if ($(this).hasClass('active')) {
            data.operate = '1'
        } else {
            data.operate = '0'
        }
        if (data.operate === '1') {
            hcUtil.popMessagePrompt('', '是否取消关注', false).done(function (result) {
                if (result === 1) {
                    request()
                }
            })
        } else {
            request()
        }

        function request() {
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            data.ts = ts
            data.code = encrypted(data.ime, data.apptypeid, ts)
            _util_.makeJsonAjax(experts_guanzhu, data).done(function (result) {
                if (result.code === 0) {
                    if (data.operate === '0') {
                        $(that).addClass('active').text('已关注')
                    } else {
                        $(that).removeClass('active').text('+关注')
                    }
                }
            })
        }
    })
})
