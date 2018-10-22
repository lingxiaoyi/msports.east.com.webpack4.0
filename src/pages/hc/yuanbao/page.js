import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'
import JS_APP from "public/libs/JC.JS_APP"

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
    let $balance = $('.balance b')
    let $list = $('.detailed > ul')
    let $win = $(window)
    let timeInterval = 0
    let yuanbao_page = 0
    let list_load = false
    $balance.html(_util_.CookieUtil.get('yuanbao'))
    let $body = $('body')
    let qid = _util_.getPageQid()
    let agent = navigator.userAgent.toLowerCase()
    let $recharge = $('.links .link').eq(0)
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfsphcad'
        android.nativeTitle('我的元宝')
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfsphcios'
        window.webkit.messageHandlers.androidios.postMessage({
            method: 'nativeTitle',
            info: '我的元宝'
        })
    }
    hcUtil.appendInfoHeader(qid, '我的元宝')
    const logic_page = {
        //获取元宝明细
        get_yuanbao_list: function (page) {
            if (list_load) {
                return
            }
            list_load = !list_load
            let ts = (new Date() / 1 + '').substring(0, 10)
            let ime = _util_.CookieUtil.get('hcime') || '123456'
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
                page: page || 0,
                token: _util_.CookieUtil.get('hctoken'),
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: yuanbao_page ? '加载中...' : '加载更多',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })
            if (qid === 'yqbios') {
                config.API_URL.HCAPI.get_yuanbao_list = config.API_URL.HCAPI.get_yuanbao_list.replace('/u/', '/yqb/')
            }
            _util_.makeJson(config.API_URL.HCAPI.get_yuanbao_list, data).done(function (res) {
                if (res.code === 0) {
                    hcUtil.popMessageTips({remove: true})
                    logic_page.initList(res)
                } else {
                    if (qid !== 'yqbios') {
                        hcUtil.checkAppLogin(qid)
                    }
                }
            })
        },
        nodata: function () {
            $list.append('<li class="no_data">暂无相关记录</li>')
        },
        //添加数据到页面
        initList: function (res) {
            $balance.html(res.data.yuanbao)
            _util_.CookieUtil.set('yuanbao', res.data.yuanbao)
            if (!res.data.list.length) {
                hcUtil.popMessageTips({
                    icon: yuanbao_page ? '' : 'fail',
                    message: yuanbao_page ? '没有更多记录' : '暂无相关记录',
                    remove: false,
                    timeOutRemove: true,
                    time: '1500'
                })
                yuanbao_page || logic_page.nodata()
                return false
            }
            yuanbao_page++
            list_load = !list_load
            let str = ''
            $.each(res.data.list, function (k, v) {
                str += `<li>
                <p class="type">${v.pay_type}<span>${v.yuanbao}</span></p>
                <p class="info">${v.pay_time.substr(5, 11)}<span></span></p>
            </li>`
            })
            $list.append(str)
        }
    }

    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        logic_page.get_yuanbao_list(yuanbao_page)
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
    $(window).on('scroll', function () {
        let $last = $list.children().last()
        let maxScroll = $last.offset().top - $win.height()
        let Scroll = $win.scrollTop()
        if (maxScroll < Scroll) {
            logic_page.get_yuanbao_list(yuanbao_page)
        }
    })
    $recharge.on('click', function () {
        if (qid === 'dfttapp') {
            let host = 'http://msports.eastday.com'
            if (location.host === 'test-msports.dftoutiao.com') {
                host = 'http://test-msports.dftoutiao.com/msports.east.com/build/html'
            }
            JS_APP.openbyh5({
                url: host + '/hc/recharge.html'
            })
            return false
        } else if (qid === 'yqbandroid') {
            android.nativeRecharge()
            return false
        } else if (qid === 'yqbios') {
            window.webkit.messageHandlers.androidios.postMessage({
                method: 'nativeRecharge',
                info: ''
            })
            return false
        }
    })
})
