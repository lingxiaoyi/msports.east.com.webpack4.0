import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import Swiper from 'swiper'
import _util_ from 'public/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
import circleChart from 'public/libs/circleChart'
window.myconsole = function (text) {
    if (!$('#infoBox').length) {
        $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;min-height:10%;width:100%;"><p>${text}</p></div>`)
    } else {
        $('#infoBox').append(`<p>${JSON.stringify(text)}</p>`)
    }
    $('#infoBox').click(function() {
        $(this).remove()
    })
}
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.11' //首页版本号
    console.log(version)
    let {dfsportswap_lottery, scupinfo, get_quan_info, get_quan} = config.API_URL.HCAPI
    let {DOMAIN, ROOT_URL_HC_detail} = config
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        get_quan_info = get_quan_info.replace('/u/', '/yqb/')
        get_quan = get_quan.replace('/u/', '/yqb/')
    }
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let $banner = $('#swiperContainer')
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
    let timeInterval = 0
    let $body = $('body')
    let $fanganBox = $body.find('.part_4 ul')
    let $part_2 = $body.find('.part_2 ul')
    let $part_3 = $body.find('.part_3')
    let $separate_line = $('.separate-line')
    let $receiveRate = $('#receiveRate')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $loading = $('#J_loading')
    let $gift_packs = $('.gift-packs')
    let $hcBanner = $('#hcBanner')
    if (token || qid === 'dfttapp') {
        $body.append(hcUtil.fixedTabs(3, 1))
    } else {
        $body.append(hcUtil.fixedTabs(3, 0))
    }

    class EastSport {
        constructor() {
            this.flag = true
            this.hcmatchid = '' //红彩matchid
            this.startkey = '' //红彩分页
            this.pgNum = 1 //红彩分页
            this.pageSize = 20 //红彩分页
            let that = this
            if (!token && qid === 'dfttapp') {
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
                    that.init()
                })
            } else {
                this.init()
            }
        }

        init() {
            //hcUtil.upwin()
            this.addEventlister()
            this.loadHcList()
            this.scupinfo()
            this.loadExList()
            // this.loadYouhuiq()
            this.loadSwiper()
            this.loadExpertList()
            // this.loadgifActivity()
        }
        addEventlister() {
            let that = this
            $(window).scroll(function () {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    that.loadHcList()
                }
            })
            $gift_packs.on('click', '.banner2', function () {
                if (token) {
                    that.getYouhuiq()
                } else {
                    hcUtil.checkAppLogin(qid, ver)
                }
            }).on('click', '.banner', function () {
                location.href = './login.html?from=tj_hd'
            }).on('click', '.banner3', function () {
                location.href = './coupon.html?from=tj_hd'
            }).on('click', '.banner1', function () {
                hcUtil.popMessagePrompt('优惠券', '活动暂未开始', true)
            }).on('click', '.banner4', function () {
                hcUtil.popMessagePrompt('优惠券', '优惠券已经被抢光啦', true)
            })
        }
        // 加载免费和关注方案数
        scupinfo() {
            let that = this
            let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
            let data = {
                position: position,
                softtype: softtype,
                softname: softname,
                appqid: appqid,
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
                hcid: token,
                domain: 'dfsports_h5',
                ime: ime,
                code: encrypted(ime, apptypeid, ts)
            }

            /*if (token) {
                _util_.makeJsonp(scupinfo, data).done(function (res) {
                    if (!res || !res.hascare) {
                        $part_3.hide()
                        $separate_line.show()
                        return
                    } else {
                        if (res.hascare) {
                            $part_3.find('.fl').html(`<a href="./follow.html?from=tj_nav_0"><b>${res.isupdate ? '有新增专家方案' : '专家还没新增方案'}</b><br>准确率提高87%</a>`)
                        } else {
                            $part_3.find('.fl').html(`<a href="./expertslist.html?from=tj_nav_1"><b>您还未关注</b><br>关注专家方案</a>`)
                        }
                        $part_3.find('.fr').html(`<a href="./freescheme.html?from=tj_nav_1"><b>${res.freecount ? res.freecount + '个方案' : '暂无'} </b><br>免费方案</a>`)
                    }
                }).fail(function (res) {
                    $part_3.hide()
                    $separate_line.show()
                })
            } else {}*/
        }

        loadHcList() { //红彩列表
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: this.startkey,
                pageNum: this.pgNum,
                maxNum: this.pageSize,
            }
            if (this.startkey === 'end') return
            $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'wap/schemelist', data).done(function (data) {
                that.startkey = data.endkey
                that.pgNum++
                that.flag = true
                $loading.hide()
                if (data.data.length) {
                    data.data.forEach(function (item, k) {
                        that.listLength = that.listLength || 0
                        that.listLength++
                        if (!item.schemeTitle) {
                            if (item.match_type[0].type === '让球') {
                                item.schemeTitle = '发布让球简介'
                            } else {
                                item.schemeTitle = '发布大小球简介'
                            }
                        }
                        let today = new Date().format('MM-dd')
                        let html = ''
                        let honghei = ''
                        if (item.honghei === '1') {
                            honghei = 'red'
                        } else if (item.honghei === '2') {
                            honghei = 'black'
                        } else if (item.honghei === '3') {
                            honghei = 'zou'
                        }
                        item.matchList.forEach(function (item2, i) {
                            let timeString = ''
                            if (item2.date.indexOf(today) > -1) {
                                timeString = item2.date.substring(11)
                            } else {
                                timeString = item2.date.substring(5, 10)
                            }
                            html += `<div class="line_3">
                                        <div class="tag">${item.match_type[i].type.replace('让球', '竞足')}</div>
                                        <div class="tag2">${item2.saishi}</div>
                                        <div class="tag3">
                                         ${item.status === '3' ? `${item2.homeTeam + ' ' + item2.homeScore + ':' + item2.visitScore + ' ' + item2.visitTeam}` : `${item2.homeTeam + ' VS ' + item2.visitTeam}`}
                                         </div>
                                        <div class="tag4">${timeString}</div>
                                    </div>`
                        })
                        $fanganBox.append(`<li>
                                            <a href="${ROOT_URL_HC_detail}${item.htmlname}?from=tj_list_fa_${k + 1}"  suffix="tj_list_fa_${that.listLength}">
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
                                                ${item.status === '3' ? `<div class="end">已结束</div><div class="mark ${honghei}"></div>` : `${item.price === 0 ? `<div class="end">免费</div>` : `<div class="yb">${item.price}元宝</div>`}`}
                                            </div>
                                            </a>
                                        </li>`)
                    })
                } else {
                    $fanganBox.append(`<li class="no-comment" style="text-align: center;border: 0;padding:0.3rem;">无更多数据...</li>`)
                    that.startkey = 'end'
                }
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
                <a href="./experts_page.html?expertId=${v.expertId}&from=tj_zj_${k + 1}" suffix="tj_zj_${k + 1}">
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

        loadExpertList() {
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: this.startkey,
                pageNum: this.pgNum,
                maxnum: this.pageSize,
            }
            $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + '/wap/expertscheme', data).done(function (data) {
                $loading.hide()
                if (data.data.length) {
                    data.data.forEach(function (item) {
                        $fanganBox.append(`<li>
                <a href="#">
                    <img src="http://00.imgmini.eastday.com/dcminisite/portrait/09d263cee4ca52451eefea898a653adc.jpg" alt="">
                    <div class="name">洪旭到人</div>
                </a>
            </li>`)
                    })
                }
            })
        }

        loadSwiper() {
            /*const items = [
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e899f25e8937969e36691f7f6f79e26d_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-18/10a40f358400d8e6c10a8a63be3a0c51_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e899f25e8937969e36691f7f6f79e26d_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-18/10a40f358400d8e6c10a8a63be3a0c51_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e34e0a98ff08549bf202d65865a9b139_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
            ]
            let html = ''
            items.forEach(function (v) {
                html += `<div class="swiper-slide"><a href="${v.url}" class="slide-wrap">
                <img src="${v.img}" class="swiper-lazy" />
             </a></div>`
            })
            $banner.append(`
    <div class="swiper-wrapper">
            ${html}
            <!--<div class="info">
                <h3><span>1</span><span>/</span><span>5</span>  梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀</h3>
                <p>上半场，丹尼斯-苏亚雷斯推射稍稍偏出。易边再战，保利尼奥疑似受伤被换下场。罗贝托造点，梅西主罚的点球被迭戈-洛佩斯扑出。</p>
            </div>-->

    </div><div class="swiper-pagination"></div>`)*/
            let swiper = new Swiper('#swiperContainer', {
                loop: true, /* spaceBetween: 10, */
                centeredSlides: true,
                autoplay: 4000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination'
            })
            //swiper.slideTo(0, 0)
        }

        loadYouhuiq() {
            //优惠券
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
                code: encrypted(ime, apptypeid, ts)
            }
            _util_.makeJson(get_quan_info, data).done(function (res) {
                let data = res.data
                $gift_packs.removeClass('no')
                switch (data['status'] / 1) {
                    case 1:
                        $hcBanner.attr('class', 'banner1')
                        let timeLine = data['begin_time'] - data['now_time']
                        if (timeLine <= 300 && timeLine > 0) {
                            let reloadId = setInterval(function () {
                                timeLine--
                                $hcBanner.find('.btn').html(`<div class="n">0${Math.floor(timeLine / 60)}:${(function (s) {
                                    return s < 10 ? '0' + s : s
                                })(timeLine % 60)}</div><br>后开抢`)
                                if (timeLine <= 0) {
                                    clearInterval(reloadId)
                                    that.loadYouhuiq()
                                    console.log(timeLine)
                                }
                            }, 1000)
                        } else if (timeLine < 0) {
                            that.loadYouhuiq()
                        }
                        break
                    case 2:
                        $hcBanner.find('.num span').html(
                            `已领<br>${100 - Math.floor(data['count'] / data['total'] * 100)}%`)
                        that.receiveRate(100 - Math.floor(data['count'] / data['total'] * 100), 100)
                        $hcBanner.attr('class', 'banner2')
                        break
                    case 3:
                        $hcBanner.attr('class', 'banner3')
                        break
                    case 4:
                        $hcBanner.attr('class', 'banner4')
                        break
                    default:
                        break
                }
                $hcBanner.find('.info').html(
                    `<h1>￥<span>${data['jian']}</span></h1>
                            <div class="text">
                            <h3>满${data['man']}元可用</h3>
                             <p>每周五&nbsp;&nbsp;限量<span>开抢</span></p>
                         </div>`
                )
            }).fail(function () {
            })
        }

        getYouhuiq() { //领取优惠券
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
                hcid: token,
                domain: 'dfsports_h5',
                ime: ime,
                code: encrypted(ime, apptypeid, ts)
            }
            hcUtil.popMessageTips({
                icon: 'loading',
                message: '领取中',
                remove: false,
                timeOutRemove: false,
                time: '3000'
            })
            _util_.makeJson(get_quan, data).done(function (res) {
                if (res.code / 1 === 0) {
                    $hcBanner.attr('class', 'banner3')
                    hcUtil.popMessageTips({
                        icon: 'suc',
                        message: res.message,
                        remove: false,
                        timeOutRemove: true,
                        time: '3000'
                    })
                } else {
                    hcUtil.popMessageTips({
                        icon: 'fail',
                        message: res.message,
                        remove: false,
                        timeOutRemove: true,
                        time: '3000'
                    })
                }
            }).fail(function () {
                hcUtil.popMessageTips({
                    icon: 'fail',
                    message: '领取失败,请稍后重试',
                    remove: false,
                    timeOutRemove: true,
                    time: '3000'
                })
            })
        }

        receiveRate(num, max) { //领取进度
            let jqDom = $('#receiveRate')
            if (!num) {
                jqDom.hide()
                return
            } else {
                jqDom.show()
            }
            let s = 138, e = (403 - 138) / max * num + 138
            let pushId = setInterval(function () {
                if (jqDom.width()) {
                    clearInterval(pushId)
                    circleChart({
                        jqDom: jqDom,
                        s: s,
                        e: e,
                        r: jqDom.width() * 0.83 / 2,
                        borderw: 3,
                        sideL: jqDom.width(),
                        color: '#fcff00'
                    })
                }
            }, 50)
        }
        loadgifActivity() {
            let sc = _util_.CookieUtil.get('sc')
            if (sc / 1 !== 1) {
                $body.append(`<div class="pack-red">
                                    <div class="icon-pack"></div>
                                </div>`)
                $('.icon-pack').click(function() {
                    //hcUtil.checkAppLogin(qid, ver)
                    window.location.href = `./recharge.html`
                })
            }
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
    // new EastSport()
})
