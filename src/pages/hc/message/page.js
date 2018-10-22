import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HCAPI} = config.API_URL
    let {get_new_msg, get_notice} = HCAPI
    let {popMessageTips, getServerts} = hcUtil
    let $body = $('body')
    let $mainul = $body.find('.main ul')
    let qid = _util_.getPageQid()
    let osType = _util_.getOsType()
    hcUtil.appendInfoHeader(qid, '我的消息')
    let myTs = ('' + new Date().getTime()).substring(0, 10)
    let {ime, position, softtype, softname, apptypeid, ver, os, appver, deviceid, ts, accid, token} = {
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
    class EastSport {
        constructor() {
            this.timeInterval = 0
            this.flag = true //下方列表加载开关
            this.osname = 'H5' //充值平台
            this.btype = 'mhc_xpdetail'
            this.data = function() {
                let ts = ('' + new Date().getTime()).substring(0, 10) / 1 - this.timeInterval
                return {
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
                    token: token,
                    userid: accid,
                    hcid: token,
                    code: encrypted(ime, apptypeid, ts),
                    qid: qid,
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
        }
        preload() {
            let that = this
            //获取服务器时间,并且将本地时间和服务器时间误差保存
            getServerts().done(function(result) {
                ts = result
                that.timeInterval = myTs / 1 - ts / 1
                that.request()
            })
        }
        request() {
            let that = this
            let data = that.data()
            if (token) {
                data.status = '1'
            } else {
                data.status = '0'
            }
            popMessageTips({icon: 'loading'})
            _util_.makeJsonAjax(get_new_msg, data).done(function(result) {
                popMessageTips({remove: true})
                if (result.code === 0) {
                    if (result.data.notice) {
                        $mainul.append(`<li class="clearfix">
                                <a href="message_detail.html?type=xt">
                                    <div class="img"></div>
                                    <div class="info">
                                        <h3>系统消息 <span>${getSpecialTimeStr(result.data.notice.update_time)}</span></h3>
                                        <p>${result.data.notice.content}</p>
                                    </div>
                                </a>
                            </li>`)
                    }
                    if (result.data.feedback) {
                        $mainul.append(` <li class="clearfix">
                                <a href="message_detail.html?type=fk">
                                    <div class="img"></div>
                                    <div class="info">
                                        <h3>反馈通知 <span>${getSpecialTimeStr(result.data.notice.update_time)}</span></h3>
                                        <p>${result.data.feedback.content}</p>
                                    </div>
                                </a>
                            </li>`)
                    }
                }
            })
            function getSpecialTimeStr(str) {
                function timeToString(t, splitStr) {
                    return dateToString(timeToDate(t), splitStr)
                }

                function timeToDate(t) {
                    return new Date(t)
                }

                function dateToString(d, splitStr) {
                    let month = (d.getMonth() + 1).toString()
                    let day = d.getDate().toString()
                    let h = d.getHours().toString()
                    let m = d.getMinutes().toString()
                    month = month.length > 1 ? month : ('0' + month)
                    day = day.length > 1 ? day : ('0' + day)
                    h = h.length > 1 ? h : ('0' + h)
                    m = m.length > 1 ? m : ('0' + m)
                    // let str = year + '-' + month + '-' + day + ' ' + h + ':' + m; // yyyy-MM-dd HH:mm
                    let str = month + '-' + day + ' ' + h + ':' + m // MM-dd HH:mm
                    if (splitStr) {
                        str = str.replace(/-/g, splitStr)
                    }
                    return str
                }

                let targetTime = new Date(str.replace(/-/g, '/')).getTime() / 1
                if (!targetTime) {
                    return false
                }
                let currentTime = new Date().getTime()
                let tdoa = Number(currentTime - targetTime)
                let dayTime = 24 * 60 * 60 * 1000 // 1天
                let hourTime = 60 * 60 * 1000 // 1小时
                let minuteTime = 60 * 1000 // 1分钟

                if (tdoa >= dayTime) { // 天
                    let h = Math.floor(tdoa / dayTime)
                    if (h > 30) {
                        return timeToString(targetTime)
                    }
                    if (h >= 1 && h <= 30) {
                        return h + '天前'
                    }
                } else if (tdoa >= hourTime) { // 小时
                    return Math.floor(tdoa / hourTime) + '小时前'
                } else if (tdoa >= minuteTime) {
                    return Math.floor(tdoa / minuteTime) + '分钟前'
                } else {
                    return '刚刚'
                }
            }
        }
    }
    new EastSport()
})
