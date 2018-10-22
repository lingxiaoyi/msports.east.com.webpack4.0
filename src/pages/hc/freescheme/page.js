import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import Swiper from 'swiper'
import _util_ from 'public/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from "public/libs/encrypted.code";

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {dfsportswap_lottery, freescheme} = config.API_URL.HCAPI
    let {DOMAIN, ROOT_URL_HC_detail} = config
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
    let token = _util_.CookieUtil.get('hctoken')
    let timeInterval = 0
    let list_load = false
    let startkey = ''
    let order_page = 0
    if (token) {
        $body.append(hcUtil.fixedTabs(3, 1))
    } else {
        $body.append(hcUtil.fixedTabs(3, 0))
    }
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfsphcad'
        android.nativeTitle('免费方案')
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfsphcios'
        window.webkit.messageHandlers.androidios.postMessage({
            method: 'nativeTitle',
            info: '免费方案'
        })
    }
    hcUtil.appendInfoHeader(qid, '免费方案')
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
            let that = this
            $(window).scroll(function () {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.loadFollowList()
                }
            })
        }

        init() {
            this.loadFollowList()
            this.loadExList()
            this.addEventlister()
        }

        loadFollowList() {
            if (list_load) return false
            list_load = !list_load
            let data = {
                os: 'H5',
                userid: _util_.CookieUtil.get('accid'),
                maxNum: 20,
                pgNum: order_page,
                startkey: startkey,
            }
            _util_.makeJsonp(freescheme, data).done(function (res) {
                if (!res.data.length && !order_page) {
                    $main.addClass('noFollow')
                    return false
                } else {
                    startkey = res.endkey
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
                                            <a href="${ROOT_URL_HC_detail}${item.htmlname}">
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
                                                ${item.price === 0 ? `<div class="end">免费</div>` : `<div class="yb">${item.price}元宝</div>`}
                                            </div>
                                            </a>
                                        </li>`
                    })
                    $fanganBox.append(htmlStr)
                }
                order_page++
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
                <a href="../experts_page.html?expertId=${v.expertId}">
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
    new EastSport()
})
