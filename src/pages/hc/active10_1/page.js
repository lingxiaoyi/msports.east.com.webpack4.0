import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../../public-resource/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'
import JS_APP from "public/libs/JC.JS_APP";

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {ten_yhq_info, get_ten_yhq} = config.API_URL.HCAPI
    let {DOMAIN, ROOT_URL_HC_detail} = config
    let qid = _util_.getPageQid()
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let $banner = $('#swiperContainer')
    let timeInterval = 0
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
    let $ruleOpen = $('.rule')
    let $ruleColse = $('.rule_win .colse')
    let $rule_win = $('.rule_win')
    let $main = $('.main')
    let $part1 = $('.part1')
    let $win = $(window)
    let $timeLine = $('.top p')
    let $yhq = $('.yuq')
    let noDownqids = ['dfsphcad', 'yqbandroid', 'dfsphcios', 'yqbios', 'dfsphcad', 'yqbandroid', 'dfsphcios', 'yqbios', 'dfttapp']
    if (noDownqids.indexOf(qid) < 0) {
        $main.addClass('downApp ')
    }

    class active101 {
        constructor() {
            this.addevent()
            this.yhqLoad()
        }

        yhqLoad() {
            let that = this
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                qid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                uid: accid,
                token: token,
                userid: accid,
                domain: 'dfsports_h5',
                ime: ime,
                code: encrypted(ime, apptypeid, ts)
            }
            _util_.makeJson(ten_yhq_info, data).done(function (res) {
                let data = res.data
                let timeTo = data.start_time - data.now_time
                if (timeTo > 0) {
                    that.djs(timeTo)
                }
                that.changeStatus(data)
                that.termValidity(data.start_time, data.now_time, data.stop_time)
            })
        }

        yhqGet(type, $sel) {
            let that = this
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: qid,
                qid: qid,
                apptypeid: apptypeid,
                ver: ver,
                os: os,
                appver: appver,
                deviceid: deviceid,
                ts: ts,
                uid: accid,
                token: token,
                userid: accid,
                // hcid: token,
                domain: 'dfsports_h5',
                ime: ime,
                code: encrypted(ime, apptypeid, ts),
                type: type
            }
            console.log(data)
            _util_.makeJson(get_ten_yhq, data).done(function (res) {
                if (res.code === 0) {
                    $sel.removeClass('s2').addClass('s3')
                    hcUtil.popMessageTips({
                        icon: 'suc',
                        message: res.message,
                        remove: false,
                        timeOutRemove: true,
                        time: '300'
                    })
                } else {
                    hcUtil.popMessageTips({
                        icon: 'fail',
                        message: res.message,
                        remove: false,
                        timeOutRemove: true,
                        time: '300'
                    })

                }
            })
        }

        termValidity(start, now, stop) {
            let nowTime = new Date((now + '000') / 1)
            let StartTime = new Date((start + '000') / 1)
            let StopTime = new Date((stop + '000') / 1)
            if (nowTime.getTime() < StartTime.getTime()) {
                $('.yuq p span').html(`活动暂未开始`)
            } else if (nowTime.getTime() > StopTime.getTime()) {
                $('.yuq').removeClass('s1').removeClass('s2').removeClass('s3').addClass('s4')
                $('.yuq p span').html(`活动已经结束`)
            } else {
                $('.yuq p span').html(`仅限${nowTime.getMonth() + 1}月${nowTime.getDate()}日使用`)
            }
        }

        addevent() {
            let _this = this
            $ruleOpen.on('click', function () {
                $rule_win.show()
            })
            $ruleColse.on('click', function () {
                $rule_win.hide()
            })
            $yhq.on('click', function () {
                if (!token) {
                    hcUtil.checkAppLogin(qid)
                    return false
                }
                let idx = $yhq.indexOf(this) + 1
                if ($(this).hasClass('s1')) {
                    hcUtil.popMessageTips({
                        icon: 'fail',
                        message: '活动暂未开始',
                        remove: false,
                        timeOutRemove: true,
                        time: '300'
                    })
                }
                if ($(this).hasClass('s2')) {
                    _this.yhqGet(idx, $(this))
                }
                if ($(this).hasClass('s3')) {
                    location.href = '//msports.eastday.com/hc/'
                }
            })
            let maxTop = $part1.offset().top - $win.width() / 7.5 * 0.8
            $win.on('scroll', function () {
                if ($win.scrollTop() >= maxTop) {
                    $main.addClass('fixed')
                } else {
                    $main.removeClass('fixed')
                }
            })
        }

        changeStatus(data) {
            $yhq.removeClass('s1').each(function (k, v) {
                $(v).addClass('s' + data[k + 1].status)
            })
        }

        djs(timeTo) {
            if (timeTo <= 0) {
                this.yhqLoad()
                $main.removeClass('noTime')
                return false
            }
            $main.addClass('noTime')
            let _this = this
            let h = Math.floor(timeTo / 3600)
            let m = Math.floor(timeTo % 3600 / 60)
            let s = Math.floor(timeTo % 60)
            h = h > 9 ? h : '0' + h
            m = m > 9 ? m : '0' + m
            s = s > 9 ? s : '0' + s
            $timeLine.html(`<span class="s">${s}</span><span class="m">${m}</span><span class="h">${h}</span>`)

            setTimeout(function () {
                timeTo--
                _this.djs(timeTo)
            }, 1000)
        }

        init() {
        }
    }

    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        //开始加载
        new active101()
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
})
