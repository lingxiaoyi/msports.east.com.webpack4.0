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
    let version = '1.0.0' //首页版本号
    console.log(version)
    let {HCAPI} = config.API_URL
    let {NAV_URL, wap_url} = config
    let {get_user_yuanbao, h5_recharge, recharge_wxpay} = HCAPI
    const osType = _util_.getOsType()
    //const recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    let $body = $('body')
    let $sec1 = $('.sec1')
    let $sec1P = $sec1.children('p')
    let $sec2 = $('.sec2')
    let $sec3 = $('.sec3')
    let $pay_btn = $('#pay_btn')
    let $btnAgree = $('#btnAgree')
    let myTs = new Date().getTime()
    let $main = $('.main')
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
        ts: _util_.CookieUtil.get('hcts') || ('' + myTs).substring(0, 10),
        accid: _util_.CookieUtil.get('hcaccid'),
        code: _util_.CookieUtil.get('hccode'),
        token: _util_.CookieUtil.get('hctoken')
    }
    if (!code) {
        code = encrypted(ime, apptypeid, myTs)
    }
    let osname = 'H5'
    if (qid === 'dfsphcios') {
        osname = 'IOS_H5'
    } else if (qid === 'dfsphcad') {
        osname = 'Android_H5'
    }
    let $button = $('.links .back')

    if (_util_.getUrlParam('status') / 1 === 1) {
        $main.addClass('state1')
    }
    $button.click(function() {
        if (!_util_.CookieUtil.get('pay_page')) {
            window.history.go(-1)
        } else {
            location.href = _util_.CookieUtil.get('pay_page')
            _util_.CookieUtil.del('pay_page')
        }
    })
})
