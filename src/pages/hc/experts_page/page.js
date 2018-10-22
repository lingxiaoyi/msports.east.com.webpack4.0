import './style.scss'
import FastClick from 'fastclick'
import _util_ from 'public/libs/libs.util'
import 'public/logic/log.js'
import config from 'configDir/common.config'
import 'public/libs/lib.prototype'
import hcUtil from 'public/libs/hc.common'
import encrypted from 'public/libs/encrypted.code'
import JS_APP from 'public/libs/JC.JS_APP'
window.myconsole = function (text) {
    $('body').append(`<div id="infoBox" style="color: #fff;
  background: rgba(0,0,0,0.8);font-size: 12px;line-height: 20px;
  position: fixed;top:0;height:20%;">${text}</div>`)
}

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST} = config.API_URL
    let {dfsportswap_lottery, getgzexpert, experts_guanzhu} = config.API_URL.HCAPI
    let version = '1.0.2' //内页版本号
    console.log(version)
    let expertId = _util_.getUrlParam('expertId')
    let qid = _util_.getPageQid()
    if (qid === 'yqbios') {
        getgzexpert = getgzexpert.replace('/u/', '/yqb/')
        experts_guanzhu = experts_guanzhu.replace('/u/', '/yqb/')
    }
    // 定义需要传入接口的值
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let {popMessageTips, getServerts} = hcUtil
    let {DOMAIN, ROOT_URL_HC_detail} = config
    let $sec1 = $('.sec1')
    let $sec2 = $('.sec2 ul')
    let $sec1Info = $('.sec1-info')
    let $loading = `<div id="J_loading" class="loading">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                    <p class="txt">数据加载中</p>
                </div>`
    $sec2.after($loading)
    let $J_loading = $('#J_loading')
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
    //let $body = $('body')
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfsphcad'
        android.nativeTitle('专家详情')
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfsphcios'
        window.webkit.messageHandlers.androidios.postMessage({
            method: 'nativeTitle',
            info: '专家详情'
        })
    }

    class EastSport {
        constructor() {
            this.startkey = ''
            this.maxnum = 10
            this.pullUpFinished = true
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
            this.loadHeadInfo()
            this.loadPlanList()
            this.onScrollLoadNews()
            $sec1.on('click', '.back', function () {
                if (document.referrer) {
                    window.history.go(-1)
                } else {
                    window.location.href = './index.html'
                }
            })

            if (qid === 'dfttapp') {
                $('body').on('click', '.sec2 ul li a', function (e) {
                    e.preventDefault()
                    let url = $(this).attr('href')
                    if (url.indexOf('http') === -1) {
                        url = `http:${url}`
                    }
                    JS_APP.openbyh5({
                        url: url
                        //url: 'http://172.20.6.219:8080/html/hc/detail_nostart.html'
                    })
                })
            }
        }

        onScrollLoadNews() {
            let scope = this
            let clientHeight = $(window).height()
            $(window).on('scroll', function () {
                // 仅允许加载10页新闻
                let scrollTop = $(this).scrollTop()
                let bodyHeight = $('body').height() - 30
                // 上拉加载数据(pullUpFlag标志 防止操作过快多次加载)
                if (scrollTop + clientHeight >= bodyHeight && scope.pullUpFinished) {
                    scope.pullUpFinished = false
                    scope.loadPlanList(scope.startkey)
                }
            })
        }

        loadHeadInfo() {
            //let that = this
            let data = {
                expertid: expertId,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: DOMAIN
            }
            _util_.makeJsonp(dfsportswap_lottery + 'wap/expertinfo', data).done(function (result) {
                let data = result.data
                /*$sec1.html(`<div class="head-img">
                                <img src="${data.expertImg}" alt="">
                            </div>
                            <div class="name">${data.expertName}</div>
                            <p class="introduce">${data.introduce}</p>
                            <div class="info clearfix">
                                <div class="item">
                                    <h3>${data.plannum}</h3>
                                    <p>近期方案</p>
                                </div>
                                <div class="item">
                                    <h3>${data.funnum}</h3>
                                    <p>粉丝</p>
                                </div>
                                <div class="item">
                                    <h3>${data.rate}<span>%</span></h3>
                                    <p>进${data.jin}场中${data.zhong}场</p>
                                </div>
                                <div class="item">
                                    <h3>${data.lianhong}</h3>
                                    <p>最大连红数</p>
                                </div>
                            </div>
                            ${qid !== 'dfsphcios' && qid !== 'dfsphcad' ? '<div class="back"></div><a href="./index.html"><div class="i-home"></div></a>' : ''}
                            `)*/
                let html = ''
                result.data.recent_result.split(',').forEach(function (item) {
                    if (item === '1') {
                        html += `<icon class="active"></icon>`
                    } else {
                        html += `<icon></icon>`
                    }
                })
                $sec1.html(`<div class="row clearfix">
        <div class="head-img">
            <img src="${data.expertImg}" alt="">
        </div>
        <div class="m">
            <div class="name">${data.expertName} <span>粉丝数:${data.funnum}</span></div>
            <p>足彩分析师</p>
        </div>
    </div>
    <p class="introduce">${data.introduce || '这家伙很懒,什么也没有留下'}</p></a>
                            ${qid !== 'dfsphcios' && qid !== 'dfsphcad' ? '<div class="back"></div><a href="./index.html?from=faxq_sy" suffix="faxq_sy"><div class="i-home"></div></a>' : ''}
                            `)
                $sec1Info.html(`<div class="row1">
        <h3>近期战绩:</h3>${html}
    </div>
    <div class="info clearfix">
        <div class="item">
            <h3>${data.rate}<span>%</span></h3>
            <div class="r">
                <h4>近期胜率</h4>
                <p>进${data.jin}中${data.zhong}</p>
            </div>
        </div>
        <div class="item">
            <h3>${data.lianhong}</h3>
            <div class="r">
                <h4>最大连红数</h4>
                <p>最新${data.recent_red}连红</p>
            </div>
        </div>
    </div>`)
                if (qid === 'dfsphcios' || qid === 'dfsphcios') {
                    $('.sec1 .row').css('marginTop', '0.3rem')
                }
            }).done(function (resultroot) {
                //添加专家关注按钮
                getServerts().done(function (result) {
                    let ts = result
                    let data = {
                        ime: ime,
                        position: position,
                        softtype: softtype,
                        softname: softname,
                        appqid: qid,
                        apptypeid: apptypeid,
                        ver: ver,
                        appver: appver,
                        deviceid: deviceid,
                        ts: ts,
                        accid: accid,
                        token: token,
                        userid: accid,
                        ids: resultroot.data.expertId,
                        hcid: token,
                        code: encrypted(ime, apptypeid, ts),
                    }
                    _util_.makeJsonAjax(getgzexpert, data).done(function (result2) {
                        //myconsole(JSON.stringify(data))
                        let operate

                        if (result2.data.length) {
                            $sec1.find('.row').append(`<div id="attention" class="attention active">已关注</div>`)
                        } else {
                            $sec1.find('.row').append(`<div id="attention" class="attention ">+关注</div>`)
                        }
                        $('#attention').click(function () {
                            let that = this
                            if (!token) {
                                hcUtil.checkAppLogin(qid, ver)
                            }
                            if ($(this).hasClass('active')) {
                                operate = '1'
                            } else {
                                operate = '0'
                            }
                            if (qid === 'dfsphcad') {
                                android.focusExpert(resultroot.data.expertId, operate)
                            } else if (qid === 'dfsphcios') {
                                window.webkit.messageHandlers.androidios.postMessage({
                                    method: 'focusExpert',
                                    info: {
                                        expertsid: resultroot.data.expertId,
                                        operate: operate,
                                    }
                                })
                            } else {
                                let data = {
                                    expertsid: resultroot.data.expertId,
                                    userid: accid,
                                    operate: operate,
                                    ime: ime,
                                    position: position,
                                    softtype: softtype,
                                    softname: softname,
                                    appqid: qid,
                                    apptypeid: apptypeid,
                                    ver: ver,
                                    appver: appver,
                                    deviceid: deviceid,
                                    ts: ts,
                                    accid: accid,
                                    token: token,
                                    code: encrypted(ime, apptypeid, ts),
                                }
                                if (data.operate === '1') {
                                    hcUtil.popMessagePrompt('', '是否取消关注', false).done(function (result) {
                                        if (result === 1) {
                                            request()
                                        }
                                    })
                                } else {
                                    request()
                                }

                                function request() {
                                    _util_.makeJsonAjax(experts_guanzhu, data).done(function (result) {
                                        if (result.code === 0) {
                                            if (data.operate === '0') {
                                                $(that).addClass('active').text('已关注')
                                            } else {
                                                $(that).removeClass('active').text('+关注')
                                            }
                                        }
                                    })
                                }
                            }
                        })
                        window.focusExpert = function (operate) {
                            if (operate / 1 === 1) {
                                $('#attention').addClass('active')
                            } else {
                                $('#attention').removeClass('active')
                            }
                        }
                    })
                })
            })
        }

        loadPlanList() {
            let that = this
            let data = {
                expertid: expertId,
                startkey: this.startkey,
                maxnum: this.maxnum,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: DOMAIN
            }
            $J_loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'wap/expertscheme', data).done(function (result) {
                let data = result.data
                if (!data.length) {
                    $('#noMore').remove()
                    $sec2.append(`<div id="noMore" class="item" style="line-height: 1rem;text-align: center">无更多数据...</div>`)
                    that.pullUpFinished = false
                    return
                }
                $sec2.append(that.productHtml(data))
                that.pullUpFinished = true
                that.startkey = result.endkey
            }).fail(function () {
                $sec2.append(`<div class="item" style="line-height: 1rem;text-align: center">网络错误</div>`)
                //that.pullUpFinished = true
            }).always(function () {
                $J_loading.hide()
            })
        }

        productHtml(result) {
            let html = '', that = this
            result.forEach(function (item, i) {
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
                let html2 = ''
                let honghei = ''
                if (item.honghei === '1') {
                    honghei = 'red'
                } else if (item.honghei === '2') {
                    honghei = 'black'
                } else if (item.honghei === '3') {
                    honghei = 'zou'
                }
                let line_4html = ''
                if (item.status === '3') {
                    line_4html = `<div class="end">已结束</div><div class="mark ${honghei}"></div>`
                } else if (item.status === '2') {
                    line_4html = `<div class="end" style="color: #0c8efd">进行中</div>`
                } else {
                    line_4html = `${item.price === 0 ? `<div class="end">免费</div>` : `<div class="yb">${item.price}元宝</div>`}`
                }
                item.matchList.forEach(function (item2, i) {
                    let timeString = ''
                    if (item2.date.indexOf(today) > -1) {
                        timeString = item2.date.substring(11)
                    } else {
                        timeString = item2.date.substring(5, 10)
                    }
                    html2 += `<div class="line_3">
                                        <div class="tag">${item.match_type[i].type.replace('让球', '竞足')}</div>
                                        <div class="tag2">${item2.saishi}</div>
                                        <div class="tag3">
                                         ${item.status === '3' ? `${item2.homeTeam + ' ' + item2.homeScore + ':' + item2.visitScore + ' ' + item2.visitTeam}` : `${item2.homeTeam + ' VS ' + item2.visitTeam}`}
                                         </div>
                                        <div class="tag4">${timeString}</div>
                                    </div>`
                })
                html += `<li>
                                            <a href="${ROOT_URL_HC_detail}${item.htmlname}?from=zjzy_fa_${that.listLength - 1}" suffix="zjzy_fa_${that.listLength - 1}">
                                            <div class="line_2">
                                                ${item.schemeTitle}
                                            </div>
                                            ${html2}
                                            <div class="line_4">
                                                <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}发布</div>
                                                ${line_4html}
                                            </div>
                                            </a>
                                        </li>`
            })
            return html
        }
    }

    new EastSport()
})
