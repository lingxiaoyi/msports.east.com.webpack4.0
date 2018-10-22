import './style.scss'
import 'public/logic/log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import 'public/libs/lib.prototype'
import _util_ from 'public/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
import encrypted from '../../../public-resource/libs/encrypted.code'
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
    let {dfsportswap_lottery, experts_guanzhu, getgzexpert} = config.API_URL.HCAPI
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $J_loading = $('#J_loading')
    $body.append(`<div class="popup" id="popup"></div>`)
    let $tabCon = $('#main').find('.tab-con')
    let $matchs = $tabCon.find('.matchs')
    //let $navLi = $('nav li')
    let $crumbsLi = $('.crumbs li')
    const osType = _util_.getOsType()
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
    let userid = _util_.CookieUtil.get('hcaccid')
    if (token) {
        $body.append(hcUtil.fixedTabs(3, 1))
    } else {
        $body.append(hcUtil.fixedTabs(3, 0))
    }
    //获取服务器时间
    let timeInterval = 0 //客户端和服务器时间间隔
    hcUtil.getServerts().done(function (res) {
        timeInterval = Math.floor(new Date() / 1000) - res
    }).fail(function () {
        hcUtil.popMessagePrompt('', '连接服务器超时,请刷新页面', true).done(function () {
            window.location.reload()
        })
    })

    class EastSport {
        constructor() {
            this.pgNum = [1, 1, 1, 1] //分页
            this.idx = [1, 1, 1, 1] //序号
            this.hasmoreData = [true, true, true, true]
            this.sortType = 'mingzhonglv'
            this.type = '1111'
            this.tabConIndex = 0
            this.flag = true
            this.init()
        }

        init() {
            this.clickMenu()
            this.loadMatchList()
            this.addEventlister()
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
                    that.loadMatchList()
                }
            })
            //关注
            $matchs.on('click', 'li .btn', function () {
                if (!token) {
                    window.location.href = 'login.html?from=zj_gz'
                }
                let id = $(this).attr('data-id')
                let that = this
                let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
                let data = {
                    expertsid: id,
                    userid: accid,
                    operate: '0',
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
                }
                data.code = encrypted(data.ime, data.apptypeid, ts)
                if ($(this).hasClass('active')) {
                    data.operate = '1'
                } else {
                    data.operate = '0'
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
            })
        }

        //加载全部的比赛详情列表
        loadMatchList() {
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                pgNum: this.pgNum[that.tabConIndex],
                maxNum: '15',
                type: this.type,
                userid: userid || '',
                sortType: that.sortType,
            }
            if (!that.hasmoreData[that.tabConIndex]) return
            $J_loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'wap/getexpertlist', data).done(function (result) {
                if (!result.data.length) {
                    $matchs.eq(that.tabConIndex).append(`<li class="nomore" style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                    that.hasmoreData[that.tabConIndex] = false
                } else {
                    that.produceHtml(result, that.tabConIndex)
                    that.pgNum[that.tabConIndex]++
                }
            }).done(function (result) {
                let arr = []
                result.data.forEach(function (item) {
                    arr.push(item.expertId)
                })
                let ts = (new Date() / 1 + '').substring(0, 10) - timeInterval
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
                    userid: userid,
                    ids: arr.join(','),
                    hcid: token
                }
                data.code = encrypted(data.ime, data.apptypeid, ts)
                _util_.makeJsonAjax(getgzexpert, data).done(function (result2) {
                    result2.data.forEach(function (item) {
                        $(`.id${item}`).addClass('active').text('已关注')
                    })
                    that.pgNum[that.tabConIndex]++
                })
            }).always(function () {
                $J_loading.hide()
                that.flag = true
            })
        }

        produceHtml(result, type) {
            let that = this,
                Type = type ? 'zq' : 'lq'
            that.listLength = that.listLength || {}
            that.listLength[Type] = that.listLength[type] || 0
            result.data.forEach(function (item, k) {
                    that.listLength[type]++
                    $matchs.eq(that.tabConIndex).append(`<li>
                <a href="./experts_page.html?expertId=${item.expertId}&from=zj_${Type}_${that.listLength[Type]}" class="clearfix"  suffix="zj_${Type}_${that.listLength[Type]}">
                <div class="col-1">${that.idx[that.tabConIndex] > 3 ? that.idx[that.tabConIndex] : ''}</div>
                <div class="col-2 clearfix">
                    <div class="head"><img src="${item.expertImg}" alt=""></div>
                    <div class="info">
                        <h3>${item.expertName}</h3>
                        ${that.sortType === 'mingzhonglv' ? `<div class="col3">命中率${item.rate}%</div>` : `<div class="col3">${item.lianhong}连红</div>`}
                        <!--<p>${item.plannum}个方案></p>-->
                    </div>
                </div></a>
                <div class="btn id${item.expertId}" data-id="${item.expertId}">+关注</div>
            </li>`)
                    that.idx[that.tabConIndex]++
                }
            )
        }

        clickMenu() {
            let that = this
            $crumbsLi.click(function () {
                $crumbsLi.removeClass('active')
                $(this).addClass('active')
                that.flag = true
                let id = $(this).attr('data-id')
                that.type = id
                if (that.sortType === 'mingzhonglv' && that.type === '1111') {
                    that.tabConIndex = 0
                } else if (that.sortType === 'lianhong' && that.type === '1111') {
                    that.tabConIndex = 1
                } else if (that.sortType === 'lianhong' && that.type === '1112') {
                    that.tabConIndex = 3
                } else {
                    that.tabConIndex = 2
                }
                $tabCon.hide()
                $tabCon.eq(that.tabConIndex).show()
                if (that.idx[that.tabConIndex] === 1) {
                    that.loadMatchList()
                }
            })
            /* $crumbsLi.click(function() {
                 $crumbsLi.removeClass('active')
                 $(this).addClass('active')
                 that.flag = true
                 that.sortType = $(this).attr('data-type')
                 if (that.sortType === 'mingzhonglv' && that.type === '1111') {
                     that.tabConIndex = 0
                 } else if (that.sortType === 'lianhong' && that.type === '1111') {
                     that.tabConIndex = 1
                 } else if (that.sortType === 'lianhong' && that.type === '1112') {
                     that.tabConIndex = 3
                 } else {
                     that.tabConIndex = 2
                 }
                 $tabCon.hide()
                 $tabCon.eq(that.tabConIndex).show()
                 if (that.idx[that.tabConIndex] === 1) {
                     that.loadMatchList()
                 }
             })*/
        }
    }

    new EastSport()
})
