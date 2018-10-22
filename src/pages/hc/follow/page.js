import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from 'public/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from "public/libs/encrypted.code"

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {dfsportswap_lottery, gzexpertup} = config.API_URL.HCAPI
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let $banner = $('#swiperContainer')
    let $body = $('body')
    let $fanganBox = $body.find('.part_4 ul')
    let $main = $('.main')
    let $part_2 = $body.find('.part_2 ul')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $loading = $('#J_loading')
    let timeInterval = 0
    let list_load = false
    let startkey = ''
    let order_page = 0
    let $login = $('.login')
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
    if (token) {
        $body.append(hcUtil.fixedTabs(3, 1))
    } else {
        $body.append(hcUtil.fixedTabs(3, 0))
    }
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfsphcad'
        android.nativeTitle('专家方案')
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfsphcios'
        window.webkit.messageHandlers.androidios.postMessage({
            method: 'nativeTitle',
            info: '专家方案'
        })
    }
    hcUtil.appendInfoHeader(qid, '关注')

    class EastSport {
        constructor() {
            this.flag = true
            this.hcmatchid = '' //红彩matchid
            this.startkey = '' //红彩分页
            this.pgNum = 1 //红彩分页
            this.pageSize = 20 //红彩分页
            this.init()
        }

        addEventlister() {
            /*let that = this
            $(window).scroll(function () {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    // that.loadHcList()
                }
            })
            $login.on('click', function () {
                hcUtil.checkAppLogin(qid, ver)
            })*/
            $('.follow').on('click', function () {
                hcUtil.nativeUserFollow(qid, ver)
            })
        }

        init() {
            this.addEventlister()
            token ? this.loadFollowList() : $main.addClass('noLogin')
            this.loadExList()
        }

        loadFollowList() {
            if (list_load) return false
            list_load = !list_load
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            // let ime = '863167039343887'
            let data = {
                ime: ime,
                softname: softname,
                apptypeid: apptypeid,
                os: 'H5',
                ts: ts,
                accid: accid,
                code: encrypted(ime, apptypeid, ts),
                token: _util_.CookieUtil.get('hctoken'),
                maxNum: 20,
                pgNum: order_page,
                startkey: startkey,
                userid: accid
            }
            _util_.makeJson(gzexpertup, data).done(function (res) {
                if (!res.data.length) {
                    $main.addClass('noFollow')
                    return false
                } else {
                    list_load = !list_load
                    let htmlStr = ''
                    res.data.forEach(function (item, k) {
                        let html = ''
                        item.matchList.forEach(function (item2, i) {
                            let timeString = item2.date.substring(5, 10)
                            html += `<div class="line_3">
                                        <div class="tag">${item.match_type[i].type.replace('让球', '竞足')}</div>
                                        <div class="tag2">${item2.saishi}</div>
                                        <div class="tag3">
                                         ${item.status === '3' ? `${item2.homeTeam + ' ' + item2.homeScore + ':' + item2.visitScore + ' ' + item2.visitTeam}` : `${item2.homeTeam + ' VS ' + item2.visitTeam}`}
                                         </div>
                                        <div class="tag4">${timeString}</div>
                                    </div>`
                        })
                        htmlStr += `<li>
                                            <a href="//msports.eastday.com/hc/fa/${item.htmlname}?from=gz_fa_${k + 1}" suffix="gz_fa_${k + 1}">
                                            <div class="line_1">
                                                <div class="img"><img src="${item.expert.expertImg.replace('http:', 'https:')}" alt=""></div>
                                                <div class="info">
                                                    <b>${item.expert.expertName}</b>
                                                    <div class="tag b">近${item.expert.jin}场中${item.expert.zhong}场</div>
                                                    <div class="tag r">${item.expert.lianhong}连红</div>
                                                </div>
                                                <div class="mz">
                                                    <span><b>${item.expert.rate}</b>% <br>命中率</span>
                                                </div>
                                            </div>
                                            <div class="line_2">
                                                ${item.schemeTitle}
                                            </div>
                                            ${html}
                                            <div class="line_4">
                                                <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}发布</div>
                                                ${item.price / 1 ? `<div class="yb">${item.price}元宝</div>` : '<div class="free">免费</div>'}
                                            </div>
                                            </a>
                                        </li>`
                    })
                    $fanganBox.append(htmlStr)
                }
            }).fail(function () {
                $main.addClass('unLoad')
            })
        }

        loadExList() { //专家列表
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
            }
            // if (this.startkey === 'end') return
            // $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'recexperts', data).done(function (res) {
                let html = ''
                if (!res.data.length) {
                    $part_2.hide()
                }
                res.data.forEach(function (v, k) {
                    if (k >= 8) {
                        return false
                    }
                    html += `<li>
                <a href="./experts_page.html?expertId=${v.expertId}?from=gz_zj_${k + 1}" suffix="gz_zj_${k + 1}">
                    <div class="img"><img src="${v.expertImg}" alt=""></div>
                    <div class="name">${v.expertName}</div>
                </a>
            </li>`
                })
                $part_2.html(html)
            }).fail(function () {
                $part_2.hide()
            })
        }
    }

    //获取服务器时间
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
        new EastSport()
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })
})
