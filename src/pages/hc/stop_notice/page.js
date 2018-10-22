import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../../public-resource/libs/libs.util'
$(() => {
    let {ROOT_URL_HC} = config
    let util = {
        //获取ts
        getServerts() {
            let deferred = $.Deferred()
            libsUtil.makeJsonAjax(GETSERVERTS, {}).done(function(result) {
                deferred.resolve(result.ts)
            }).fail(function() {
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
                    setTimeout(function() {
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
            $body.on('click', '.mint-msgbox-btns .mint-msgbox-btn', function() {
                let index = $(this).index()
                deferred.resolve(index)
                $(this).parent().parent().parent().parent().remove()
            })
            $body.on('click', '.mint-msgbox .close', function() {
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
        checkAppLogin(qid, ver) {
            if (qid === 'dfsphcad') {
                android.getinfoToApp()
            } else if (qid === 'dfsphcios') {
                window.webkit.messageHandlers.androidios.postMessage({
                    method: 'nativeUserLogin',
                    info: ''
                })
            } else {
                window.location.href = `${ROOT_URL_HC}hc/login.html`
            }
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
            if (qid !== 'dfsphcios' && qid !== 'dfsphcad') {
                $('body').prepend(`<header class="info_header">
    <i class="back">返回</i><h3>${text}</h3>
</header>`)
                $('.info_header .back').click(function() {
                    if (document.referrer) {
                        window.history.go(-1)
                    } else {
                        window.location.href = `${ROOT_URL_HC}hc/`
                    }
                })
            }
        }
    }
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
    let qid = _util_.getPageQid()
    let $body = $('body')
    $body.append(util.fixedTabs(3, 0))
})
