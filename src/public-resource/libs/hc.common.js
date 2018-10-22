import libsUtil from './libs.util.js'
import config from 'configDir/common.config'
import JS_APP from './JC.JS_APP.js'
import encrypted from './encrypted.code.js'

let {GETSERVERTS, HCAPIORDER} = config.API_URL
let {ROOT_URL_HC} = config
let {tt_login} = HCAPIORDER
/*if (window.location.href.indexOf('/hc/') >= 0) {
    window.location.href = `${ROOT_URL_HC}hc/stop_notice.html`
}*/

let util = {
    //获取ts
    getServerts() {
        let deferred = $.Deferred()
        libsUtil.makeJsonAjax(GETSERVERTS, {}).done(function (result) {
            deferred.resolve(result.ts)
        }).fail(function () {
            deferred.reject('失败')
        })
        return deferred.promise()
    },
    /**
     *  小信息窗口 提示窗
     * @param icon loading suc fail icon
     * @param message ''
     * @param remove true删除 false加载  默认加载
     * @param timeOutRemove 延时消失 true消失
     */
    popMessageTips(option) {
        let defaultOption = {
            icon: '',
            message: '加载中',
            remove: false,
            timeOutRemove: false,
            time: '3000'
        }
        option = Object.assign({}, defaultOption, option)
        if (option.remove) {
            $(`.message-tips`).remove()
        } else {
            $('body').append(`<div class="message-tips ${option.icon}"><p>${option.icon ? '<i></i>' : ''}${option.message}</p></div>`)
            if (option.timeOutRemove) {
                setTimeout(function () {
                    $(`.message-tips`).remove()
                }, 3000)
            }
        }
    },
    //弹窗提示 标题,消息
    popMessagePrompt(title, message, isSingle) {
        title = title || '提示'
        message = message || '确定执行此操作?'
        isSingle = isSingle || false
        let deferred = $.Deferred()
        let $body = $('body')
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
        <div class="close"></div>
    </div>
</div>
</div>`)
        $body.on('click', '.mint-msgbox-btns .mint-msgbox-btn', function () {
            let index = $(this).index()
            deferred.resolve(index)
            $(this).parent().parent().parent().parent().remove()
        })
        $body.on('click', '.mint-msgbox .close', function () {
            $(this).parent().parent().parent().remove()
        })
        return deferred.promise()
    },
    //下方tab栏目
    fixedTabs(num, islogin) {
        return `<div class="tab-btns">
    <ul class="clearfix">
        <li class="${num === 1 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}index.html">
                <icon></icon>
                <p>首页</p>
            </a>
        </li>
        <li  class="${num === 2 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}saishi.html">
            <icon></icon>
            <p>赛程</p>
            </a>
        </li>
        <li  class="${num === 3 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}hc/index.html">
            <icon></icon>
            <p>发现</p>
            </a>
        </li>
        <li  class="${num === 4 ? 'active' : ''}">
            <a href="${islogin ? `${ROOT_URL_HC}hc/personal.html` : `${ROOT_URL_HC}hc/login.html`}">
                <icon></icon>
                <p>我的</p>
            </a>
        </li>
    </ul>
</div>`
    },
    fixedTabs2(num, islogin) {
        return `<div class="tab-btns">
    <ul class="clearfix">
        <li class="${num === 1 ? 'active' : ''}" style="width:50%">
            <a href="${ROOT_URL_HC}index.html">
                <icon></icon>
                <p>首页</p>
            </a>
        </li>
        <li  class="${num === 3 ? 'active' : ''}" style="width:50%">
            <a href="${ROOT_URL_HC}hc/index.html">
            <icon></icon>
            <p>发现</p>
            </a>
        </li>
    </ul>
</div>`
    },
    checkAppLogin(qid) {
        let that = this, watcher = $.Deferred()
        if (qid === 'dfttapp') {
            JS_APP.ClientInfo(function (res) {
                if (res.version) {
                    JS_APP.LogParameter(function (res) {
                        if (res.ttaccid === libsUtil.CookieUtil.get('hcaccid')) {
                            watcher.resolve()
                        } else if (res['login_token']) {
                            let data = {
                                ime: res.ime,
                                appqid: res.appqid,
                                deviceid: res.deviceid,
                                token: res['login_token'],
                                position: res.position,
                                os: res.os,
                                softname: res.softname,
                                softtype: res.softtype,
                                apptypeid: res.apptypeid,
                                ver: res.ver,
                                accid: res.ttaccid,
                                phone: '0',
                                ts: 0,
                            }
                            that.tt_login(data).done(function (res) {
                                watcher.resolve()
                            })
                        } else {
                            JS_APP.ToViewLogin({})
                        }
                    })
                } else if (qid === 'dfsphcad' || qid === 'yqbandroid') {
                    android.getinfoToApp()
                } else if (qid === 'dfsphcios' || qid === 'yqbios') {
                    window.webkit.messageHandlers.androidios.postMessage({
                        method: 'nativeUserLogin',
                        info: ''
                    })
                } else {
                    window.location.href = `${ROOT_URL_HC}hc/login.html`
                }
            })
        } else {
            if (qid === 'dfsphcad' || qid === 'yqbandroid') {
                android.getinfoToApp()
            } else if (qid === 'dfsphcios' || qid === 'yqbios') {
                window.webkit.messageHandlers.androidios.postMessage({
                    method: 'nativeUserLogin',
                    info: ''
                })
            } else {
                window.location.href = `${ROOT_URL_HC}hc/login.html`
            }
        }
        return watcher
    },
    nativeUserFollow(qid, ver) {
        if (qid === 'dfsphcad') {
            android.nativeUserFollow()
        } else if (qid === 'dfsphcios') {
            window.webkit.messageHandlers.androidios.postMessage({
                method: 'nativeUserFollow',
                info: ''
            })
        } else {
            window.location.href = './expertslist.html'
        }
    },
    appendInfoHeader(qid, text) {
        if (qid !== 'dfsphcios' && qid !== 'dfsphcad' && qid !== 'yqbios' && qid !== 'yqbandroid' && qid !== 'dfttapp') {
            $('body').prepend(`<header class="info_header">
    <i class="back">返回</i><h3>${text}</h3>
</header>`)
            $('.info_header .back').click(function () {
                if (document.referrer) {
                    window.history.go(-1)
                } else {
                    window.location.href = `${ROOT_URL_HC}hc/`
                }
            })
        }
        try {
            if (qid === 'dfsphcad' || qid === 'yqbandroid') {
                android.nativeTitle(text)
            } else if (qid === 'dfsphcios' || qid === 'yqbios') {
                window.webkit.messageHandlers.androidios.postMessage({
                    method: 'nativeTitle',
                    info: text
                })
            }
        } catch (e) {
            console.log(e)
        }
    },
    tt_login(data) {
        let that = this
        data.ts = ('' + new Date().getTime()).substring(0, 10) / 1 + 3
        data.code = encrypted(data.ime, data.apptypeid, data.ts)
        return libsUtil.makeJsonAjax(tt_login, data).done(function (res) {
            if (res.code === 0) {
                libsUtil.CookieUtil.set('hctoken', res.data.token)
                libsUtil.CookieUtil.set('hcime', data.ime)
                libsUtil.CookieUtil.set('hcos', data.os)
                libsUtil.CookieUtil.set('hcappver', data.ver)
                libsUtil.CookieUtil.set('hcdeviceid', data.deviceid)
                libsUtil.CookieUtil.set('hcaccid', data.accid)
                libsUtil.CookieUtil.set('hcsoftname', data.softname)
                libsUtil.CookieUtil.set('hcappqid', data.appqid)
                libsUtil.CookieUtil.set('hcapptypeid', data.apptypeid)
                libsUtil.CookieUtil.set('hcsofttype', data.softtype)
                libsUtil.CookieUtil.set('hcposition', data.position)
            }
        })
    },
    upwin() {
        let flage = libsUtil.CookieUtil.get('hcactive_upwin_10_1')
        if (flage) {
            return
        }
        libsUtil.CookieUtil.set('hcactive_upwin_10_1', 1, 24)
        $('body').append(`<div class="hc_upwin">
    <div class="content">
        <a href="http://msports.eastday.com/hc/active10_1.html?from=tj_hd"></a>
        <div class="colse"></div>
    </div>
</div>`)
        $('body').on('click', '.hc_upwin .colse', function () {
            $('.hc_upwin').remove()
        })
    },
}

module.exports = util
