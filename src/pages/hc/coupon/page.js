import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'
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
    let version = '1.1.2' //首页版本号
    console.log(version)
    let qid = _util_.getPageQid()
    let timeInterval = 0
    hcUtil.appendInfoHeader(qid, '我的优惠券')
    let $tab_nav = $('.tab_nav li')
    let tab_idx = 0
    let $tab_list_length = $('.tab_nav li span')
    let $ticket_list = $('.tickets')
    let $libao = $('#libao')
    let userhaslibao = false
    const osType = _util_.getOsType()
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
    // 页面逻辑
    const logic_page = {
        // 获取优惠券
        get_coupon: function (type) {
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                ime: ime,
                type: type,
                price: 0,
                softname: 'DFTYAndroid',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                accid: _util_.CookieUtil.get('accid'),
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken')
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: '正在获取优惠券列表',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })
            if (qid === 'yqbios') {
                config.API_URL.HCAPI.get_coupon_list = config.API_URL.HCAPI.get_coupon_list.replace('/u/', '/yqb/')
            }
            _util_.makeJson(config.API_URL.HCAPI.get_coupon_list, data).done(function (res) {
                hcUtil.popMessageTips({remove: true})
                if (res.message === '请登录') {
                    /*hcUtil.popMessagePrompt('', '请登录', true).done(function (result) {})*/
                    window.location = `./login.html`
                } else {
                    if (tab_idx === type) {
                        logic_page.init_list(res.data.list, type)
                    }
                }
            })
        },
        init_list: function (list, type) {
            let str = ''
            $libao.siblings().remove()
            $tab_list_length.html('').eq(type).html('(' + list.length + ')')
            if (!list.length) {
                $ticket_list.append(`<li class="no_data">没有相关优惠券</li>`)
                userhaslibao || $ticket_list.find('.no_data').hide()
                return false
            }
            $.each(list, function (k, v) {
                if (v.yhq_id === '21') {
                    str += `<li class="${(type === 1) || (type === 2 && 'un_use') || 'can_use'}">
            <div class="left">
                <div class="value" style="font-size: .6rem">万能券</div>
                <div class="type"></div>
            </div>
            <div class="right">
                <h6>${v.name}</h6>
                <p>全平台通用，购买38元及以上的方案只需8元</p>
                <div class="time">有效期:${v.expire_time.split('-')[0] / 1 - 2018 > 50 ? '永久' : v.expire_time}</div>
            </div>
        </li>`
                } else if (v.yhq_id === '20') {
                    str += `<li class="${(type === 1) || (type === 2 && 'un_use') || 'can_use'}">
            <div class="left"  style="">
                <div class="value"  style="font-size: .6rem">万能券</div>
                <div class="type"></div>
            </div>
            <div class="right">
                <h6>${v.name}</h6>
                <p>全平台通用，购买28元及以下的方案只需1元</p>
                <div class="time">有效期:${v.expire_time.split('-')[0] / 1 - 2018 > 50 ? '永久' : v.expire_time}</div>
            </div>
        </li>`
                } else {
                    str += `<li class="${(type === 1) || (type === 2 && 'un_use') || 'can_use'}">
            <div class="left">
                <div class="value"><b>${v.yuanbao}</b>&nbsp;元宝</div>
                <div class="type">${(v.price / 1) ? `满${v.price}元可用` : '支付直减'}</div>
            </div>
            <div class="right">
                <h6>${v.name}</h6>
                <p>全平台通用，专家推荐内所有方案均可使用</p>
                <div class="time">有效期:${v.expire_time.split('-')[0] / 1 - 2018 > 50 ? '永久' : v.expire_time}</div>
            </div>
        </li>`
                }
            })
            $ticket_list.append(str)
        }, //判断用户是否领取过优惠券
        haslibao: function () {
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                ime: ime,
                softname: softname,
                apptypeid: apptypeid,
                os: os,
                ts: ts,
                hd_id: $libao.attr('hd_id'),
                accid: _util_.CookieUtil.get('accid'),
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken')
            }
            if (qid === 'yqbios') {
                config.API_URL.HCAPI.has_libao = config.API_URL.HCAPI.has_libao.replace('/u/', '/yqb/')
            }
            _util_.makeJson(config.API_URL.HCAPI.has_libao, data).done(function (res) {
                // console.log(res.data.has_libao);
                if (res.data.has_libao) {
                    $libao.hide()
                    $ticket_list.find('.no_data').hide()
                    userhaslibao = true
                } else {
                    $libao.show()
                }
            })
        },
        get_libao: function () {
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                ime: ime,
                price: 0,
                softname: 'DFTYAndroid',
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                accid: _util_.CookieUtil.get('accid'),
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken'),
                'hd_id': $libao.attr('hd_id')
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: '正在领取',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })

            _util_.makeJson(config.API_URL.HCAPI.get_libao, data).done(function (res) {
                hcUtil.popMessageTips({remove: true})
                switch (res.code) {
                    case 0:
                        hcUtil.popMessageTips({
                            icon: 'loading',
                            message: '领取成功',
                            remove: false,
                            timeOutRemove: true,
                            time: '1000'
                        })
                        setTimeout(function () {
                            location.reload()
                        }, 1000)
                        break
                    default:
                        break
                }
            })
        }
    }
    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        logic_page.haslibao()
        // 事件绑定
        $tab_nav.on('click', function () {
            let _this = $(this)
            if (_this.hasClass('sel')) return false
            _this.siblings().removeClass('sel')
            tab_idx = _this.addClass('sel').index()
            logic_page.get_coupon(tab_idx)
        }).eq(0).click()
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })

    $($libao).on('click', logic_page.get_libao)
})
