import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
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
    const osType = _util_.getOsType()
    let {get_user_yuanbao} = config.API_URL.HCAPI
    let qid = _util_.getPageQid()
    let {DOMAIN} = config
    let _domain_ = DOMAIN
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
        token: _util_.CookieUtil.get('hctoken')
    }
    let {popMessageTips, getServerts} = hcUtil
    if (!code) {
        code = encrypted(ime, apptypeid, myTs)
    }
    let myTs = new Date().getTime()
    let timeInterval = 0 //本地时间和服务器时间间隔
    let $body = $('body')
    if (qid === 'dfttapp') {
        $('.log-out').hide()
    }
    if (token) {
        $body.append(hcUtil.fixedTabs(4, 1))
    } else if (qid === 'dfttapp') {
        hcUtil.checkAppLogin(qid, ver).done(function () {
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
            $body.append(hcUtil.fixedTabs(4, 1))
        })
    } else {
        $body.append(hcUtil.fixedTabs(4, 0))
    }
    $('.sec1 .head-img img').attr('src', _util_.CookieUtil.get('headpic') === 'null' ? 'https://msports.eastday.com/h5/img/i-logo.png' : _util_.CookieUtil.get('headpic'))
    //hcUtil.upwin()
    getServertsTs()

    function getServertsTs() {
        getServerts().done(function (result) {
            ts = result
            myTs = ('' + new Date().getTime()).substring(0, 10)
            timeInterval = myTs / 1 - ts / 1
            requestSurplusYuanBao()
        }).fail(function () {
            hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
                window.location.reload()
            })
        })
    }

    //请求剩余元宝
    function requestSurplusYuanBao() {
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
        data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 - timeInterval
        data.code = encrypted(ime, apptypeid, data.ts)
        _util_.makeJsonAjax(get_user_yuanbao, data).done(function (result) {
            if (result.code === 0) {
                let $sec1Item = $('.sec1 .info .item h3')
                $('.sec1 .name').text(result.data.nickname)
                $sec1Item.eq(0).text(result.data.jinbi)
                $sec1Item.eq(1).html(result.data.yuanbao)
            } else {
                //hcUtil.popMessagePrompt('', '请登录', true).done(function(result) {})
                window.location = `login.html`
            }
        })
    }

    $('.log-out').click(function () {
        hcUtil.popMessagePrompt('', '小主,你要退出登录吗?', false).done(function (res) {
            if (res === 1) {
                _util_.CookieUtil.set('hctoken', '')
                window.location.href = './'
            }
        })
    })
})
