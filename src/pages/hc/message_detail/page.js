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
    let {reply_list, get_notice} = HCAPI
    let {popMessageTips, getServerts} = hcUtil
    let $body = $('body')
    let $mainul = $body.find('.main ul')
    let qid = _util_.getPageQid()
    let osType = _util_.getOsType()
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
    let type = _util_.getUrlParam('type')
    if (type === 'xt') {
        hcUtil.appendInfoHeader(qid, '系统通知')
    } else {
        hcUtil.appendInfoHeader(qid, '反馈通知')
    }
    class EastSport {
        constructor() {
            this.timeInterval = 0
            this.flag = true //下方列表加载开关
            this.osname = 'H5' //充值平台
            this.btype = 'mhc_xpdetail'
            this.page = 1
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
                    page: this.page,
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
            // 页面事件绑定
            $(window).scroll(function() {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                }
            })
        }
        request() {
            let that = this
            let data = that.data()
            let api = ''
            if (token) {
                data.type = '1'
            } else {
                data.type = '0'
            }
            popMessageTips({icon: 'loading'})
            if (type === 'xt') {
                api = get_notice
            } else {
                api = reply_list
            }
            _util_.makeJsonAjax(api, data).done(function(result) {
                popMessageTips({remove: true})
                if (result.code === 0) {
                    if (!result.data.list.length) {
                        $mainul.append(`<li id="nodata" class="" style="text-align: center;line-height: 1rem;font-size: 0.3rem">无更多订单了</li>`)
                        return
                    }
                    result.data.list.forEach(function(item) {
                        let time = ''
                        if (type === 'xt') {
                            time = new Date((item.begin_time + '000') / 1).format('MM-dd HH:mm')
                        } else {
                            time = new Date((item.update_time + '000') / 1).format('MM-dd HH:mm')
                        }
                        $mainul.append(`<li class="clearfix">
                                        <div class="time">${time} </div>
                                        <div class="row clearfix ${type === 'xt' ? '' : 'feedback'}">
                                            <div class="img"></div>
                                            <div class="info">
                                                <p>${item.content} ${type === 'xt' ? `<a href="http://${item.link}">详情点击></a>` : ``}</p>
                                                 ${type === 'xt' ? '' : `<h4>${item['reply_content']}</h4>`}
                                            </div>
                                        </div>
                                    </li>`)
                    })
                }
            })
        }
    }
    new EastSport()
})
