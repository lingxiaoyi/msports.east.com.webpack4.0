/* eslint-disable no-unneeded-ternary */
import 'pages/data/data_all.scss'
import 'pages/data/data_rank_basketball.scss'
import 'pages/schedule/style.scss'
import 'zepto/src/selector'
import './log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, ORDER_API} = config.API_URL
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}"></a></div> </div>`)
    let $goTop = $('#goTop')
    let $J_loading = $('#J_loading')
    let $insideNav = $('#insideNav')
    let $content = $('.data-main .content')
    let $dateText = $('#dateText')
    //let $header = $('header')
    $body.append(`<div class="popup" id="popup"></div>`)
    let $popup = $('#popup')
    let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
    let starts = new Date(prevDate).getTime()
    let oldStarts = starts
    let saishiid
    const _os_ = _util_.getOsType()
    //app中隐藏面包屑
    let $crumbs = $('.crumbs')
    if (_os_.indexOf('windows') > -1) { //电脑端
        $('.data-main').css('width', '103%')
    }
    if (_util_.getUrlParam('redirect') === 'app') {
        $crumbs.children('a').remove()
        $crumbs.children('i').remove()
        $goTop.children('.back').remove()
        $body.addClass('appPage')
        // $header.remove()
        //console.log(1)
    }
    // insildeNav导航功能
    $insideNav.on('click', 'li a', function(e) {
        e.preventDefault()
        let width = $(this).parent().width()
        let index = $(this).parent().index()
        $insideNav.find('ul').scrollLeft(width * (index - 3))
    })
    formatDateText(starts)
    //默认执行 加载赛程列表
    //requestMatchSchedule(starts)

    //根据日期查询
    $dateText.prev().on('click', function() {
        starts = starts - 3 * 24 * 60 * 60 * 1000
        formatDateText(starts)
        requestMatchSchedule(starts, saishiid)
    })
    $dateText.next().on('click', function() {
        starts = starts + 3 * 24 * 60 * 60 * 1000
        formatDateText(starts)
        requestMatchSchedule(starts, saishiid)
    })
    //根据分类查
    $insideNav.on('click', 'ul li a', function(e) {
        e.preventDefault()
        saishiid = $(this).attr('data-saishiid')
        if ($(this).hasClass('active')) {
            return
        }
        $insideNav.find('ul li a').removeClass('active')
        $(this).addClass('active')

        formatDateText(oldStarts)
        starts = oldStarts
        requestMatchSchedule(oldStarts, saishiid)
    })
    let classType
    classType = _util_.getUrlParam('class')
    if (classType) {
        $insideNav.find(`a[data-type=${_util_.getUrlParam('class')}]`).click()
    } else {
        requestMatchSchedule(starts)
    }
    let isRequested = true
    $content.on('click', '.btn-order', function() {
        let that = this
        if ($(that).attr('data-ordered') || !isRequested) {
            popup(2)
            return
        }
        isRequested = false
        _util_.makeJsonp(ORDER_API + $(this).attr('data-matchid'), {}).done(function(result) {
            if (result.status === -1) {
                popup(1)
            } else {
                popup(2)
                $(that).attr('data-ordered', '1') //订阅过data-ordered为1
            }
        }).fail(function() {
            popup(3)
        }).always(function() {
            isRequested = true
        })
    })
    $body.on('click', '#popup', function() {
        $(this).hide()
    })
    $goTop.children('.top').on('click', function() {
        $('html,body').scrollTop(0)
    })
    $(window).scroll(function() {
        if (($(this).scrollTop()) / 100 > 0.9) {
            $goTop.show()
        } else {
            $goTop.hide()
        }
    })

    //弹窗
    function popup(option) {
        let html = ``
        switch (option) {
            case 1:
                html = `<div class="content">
                                    <img src="/h5/img/getqrcode.jpg" alt=""/>
                                    <p>您未关注公众号,请关注</p>
                                </div>`
                break
            case 2:
                html = `<div class="content">
                                    <p>您已预约成功此场比赛</p>
                                </div>`
                break
            case 3:
                html = `<div class="content">
                                    <p>请重新刷新页面</p>
                                </div>`
                break
        }
        $popup.show().html(html)
    }

    //格式化日期为2017-03-13 周一
    function formatDate(starts) {
        let weekday = [
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六'
        ]
        let date = new Date(starts)
        return date.format('yyyy-MM-dd') + ' ' + weekday[date.getDay()]
    }

    // dateText日期格式化
    function formatDateText(starts) {
        $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 3 * 24 * 60 * 60 * 1000 - 100).format('MM-dd')).data('data-timestamp', starts)
    }

    //请求比赛赛程
    function requestMatchSchedule(starts, saishiid = '') {
        let isimp = ''
        if (!saishiid) {
            isimp = '1'
        }
        let data = {
            startts: starts,
            endts: starts + 3 * 24 * 60 * 60 * 1000,
            saishiid: saishiid,
            isimp: isimp
        }
        $content.find('ul').html('')
        $J_loading.show()
        _util_.makeJsonp(HOST + 'matchba', data).done(function(result) {
            if (!result.data.length) {
                $content.html(`<ul class="match-info"><li class="tit">暂无数据</li></ul>`)
                return
            }
            $content.html(`<ul class="match-info">${makeHtml(result)}</ul>`)
        }).always(function() {
            $J_loading.hide()
        })
    }

    function makeHtml(result) {
        let html = ''
        let data = result.data
        let oldDay = ''
        let isInApp = _util_.getUrlParam('redirect') || '' //有这个参数就在app中
        for (let item of data) {
            let title = item.title.split(' ')
            let mHtml = ''
            let url = ''
            if (item.ismatched === '-1') {
                if (_util_.isWeiXin()) {
                    mHtml = `<div class="btn-order" data-matchid="${item.matchid}"><a href="javascript:;">预约</a></div>`
                } else {
                    mHtml = `<div class="btn-living">未开赛</div>`
                    url = item.liveurl
                }
            } else if (item.ismatched === '0') {
                mHtml = `<div class="score"><div>${item.saishi_id === '900002' ? item.visit_score : item.home_score}</div><span>-</span><div>${item.saishi_id === '900002' ? item.home_score : item.visit_score}</div></div><div class="btn-living">直播中</div>`
                url = item.liveurl
            } else {
                mHtml = `<div class="score"><div>${item.saishi_id === '900002' ? item.visit_score : item.home_score}</div><span>-</span><div>${item.saishi_id ? item.home_score : item.visit_score}</div></div>
                        <div class="btn">集锦</div>
                        <div class="btn">回放</div>`
                url = item.luxiang_url ? (item.liveurl + '?tab=saikuang') : item.liveurl
            }
            if (isInApp) {
                if (url.indexOf('?') > -1) {
                    url += '&redirect=app'
                } else {
                    url += '?redirect=app'
                }
            }
            let day = item.starttime.split(' ')[0]
            if (day !== oldDay) {
                html += `<li class="tit">${formatDate(new Date(item.starttime.replace(/-/g, '/')).getTime())}</li>`
            }
            let home_logoname
            let visit_logoname
            let home_team
            let visit_team
            if (item.saishi_id === '900002') {
                home_logoname = item.visit_logoname
                visit_logoname = item.home_logoname
                home_team = item.visit_team
                visit_team = item.home_team
            } else {
                home_logoname = item.home_logoname
                visit_logoname = item.visit_logoname
                home_team = item.home_team
                visit_team = item.visit_team
            }
            html += `<li><h6>${title[1] + ' ' + title[0]}</h6>
                        <div class="clearfix">
                           <a href="${url}"> <div class="item">
                                <img src="${home_logoname ? home_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                <p>${home_team}</p>
                            </div>
                            <div class="m">${mHtml}</div>
                            <div class="item">
                                <img src="${visit_logoname ? visit_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                <p>${visit_team}</p>
                            </div></a>
                        </div>
                        </li>`
            oldDay = day
        }
        return html
    }
})
