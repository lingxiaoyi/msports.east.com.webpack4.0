import 'pages/zhuanti_nba_duel/style.scss'
import './log.news.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {PLAYOFFNBA, HOST} = config.API_URL
    //let {DOMAIN} = config
    //let domain = DOMAIN
    let version = '1.0.1' //内页版本号  用来区分版本上线
    console.log(version)
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    //let pixel = window.screen.width + '*' + window.screen.height
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    //let os = _util_.getOsType()
    //let recgid = _util_.getUid()
    let wsCache = new WebStorageCache()
    let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
    let $body = $('body')
    let $menu = $('#menu')
    let $tabBd = $('#tabBd')
    let $secNewsList = $tabBd.find('.sec-news-list')
    let pullUpFinished = false
    function Detail() {
        /* global _special_:true*/
        this.isInApp = (qid === 'dfspdftttypd' || qid === 'wxspiosnull')
        this.host = _special_[0]
        this.activeIndex = 0 //当前菜单栏目下标
        this.channel = qid
        this.index = 4 //热点新闻中的广告起始下标
        this.startkey = ''
        this.idx = 1 //热点新闻中的位置下标
        this.pgnum = 1
        this.result = ''
    }
    Detail.prototype = {
        init: function() {
            let scope = this
            scope.showHotNews()
            //scope.setHistoryUrl()
            scope.onScrollLoadNews()
            scope.addEventListener()
            scope.getData(0)
            if (this.isInApp) scope.handleInapp()
        },
        //图片预加载和下拉加载新闻
        onScrollLoadNews: function() {
            let scope = this
            let clientHeight = $(window).height()
            //回到顶部 返回首页
            $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?qid=${qid}"></a></div> </div>`)
            let $goTop = $('#goTop')
            $goTop.on('click', function() {
                $('body,html').scrollTop(0)
            })
            $(window).on('scroll', function() {
                //出现返回顶部按钮
                if (($(this).scrollTop()) / 100 > 0.9) {
                    $goTop.show()
                } else {
                    $goTop.hide()
                }
                // 仅允许加载10页新闻
                let scrollTop = $(this).scrollTop()
                let bodyHeight = $('body').height() - 50
                // 上拉加载数据(pullUpFlag标志 防止操作过快多次加载)
                if (scrollTop + clientHeight >= bodyHeight && pullUpFinished) {
                    if (scope.idx >= scope.result.length) {
                        $loading.hide()
                        $('#noMore').remove()
                        $secNewsList.append('<li id="noMore" class="clearfix">无更多数据了</li>')
                        return
                    }
                    pullUpFinished = false
                    $secNewsList.append(scope.productHtml(scope.result))
                    pullUpFinished = true
                    scope.pgnum++
                }
            })
        },
        setHistoryUrl: function() {
            let url = window.location.href
            let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
            let historyUrlArr = wsCache.get('historyUrlArr')
            if (!historyUrlArr) {
                historyUrlArr = []
            }
            if (historyUrlArr.length >= 5) {
                historyUrlArr.shift()
            }
            historyUrlArr.push(urlNum)
            historyUrlArr = _util_.unique(historyUrlArr)
            wsCache.set('historyUrlArr', historyUrlArr, {exp: 10 * 60})
        },
        showHotNews: function() {
            $body.append($loading)
            //this.getData(0)
        },
        //监听浏览器事件
        addEventListener: function() {
            let that = this
            $menu.on('click', 'li', function() {
                let index = $(this).index()
                $menu.find('li').removeClass('active')
                $(this).addClass('active')
                let $item = $tabBd.children('.item')
                $item.hide()
                $item.eq(index).show()
                that.activeIndex = index
                that.host = _special_[index]
            })
            $tabBd.on('click', '.tab-h li', function() {
                let index = $(this).index()
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                let tabList = $(this).parent().parent().next().children()
                tabList.hide()
                tabList.eq(index).show()
            })
            $tabBd.on('click', '.more', function() {
                $(this).parent().css('maxHeight', '100%')
                $(this).remove()
            })
        },
        getData: function(start) {
            let scope = this
            $loading.show()
            _util_.makeJsonp(PLAYOFFNBA, '').done(function(result) {
                //console.log(result)
                $loading.hide()
                $tabBd.html(scope.productHtml(result))
                //获取当前比赛
                scope.matchData()
                //展示决赛
                $menu.find('li').eq(3).click()
                pullUpFinished = true
                scope.pgnum++
            })
        },
        productHtml: function(result) {
            let round_1 = result.round_1
            let round_2 = result.round_2
            let ewFinal = result.ewFinal
            let allFinal = result.allFinal
            //首轮
            let html = '<div class="item">'
            html += `<div class="tab-h">
                <ul>
                    <li class="active">西部</li><li>东部</li>
                </ul>
            </div>
            <div class="tab-list">
<ul class="sec-news-list">`
            round_1.west.forEach(function(item, i) {
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2} <span style="font-size: 0.2rem;color:#999;">(${item.teamdesc2.substring(1)})</span></p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1} <span style="font-size: 0.2rem;color:#999;">(${item.teamdesc1.substring(1)})</span></p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += `<div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
                html += ` </li>`
            })
            html += `</ul><ul class="sec-news-list">`
            round_1.east.forEach(function(item, i) {
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2} <span style="font-size: 0.2rem;color:#999;">(${item.teamdesc2.substring(1)})</span></p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1} <span style="font-size: 0.2rem;color:#999;">(${item.teamdesc1.substring(1)})</span></p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += `<div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
            })
            html += `</ul></div></div>`
            //半决赛
            html += '<div class="item">'
            html += `<div class="tab-h">
                <ul>
                    <li class="active">西部</li><li>东部</li>
                </ul>
            </div>
            <div class="tab-list">
<ul class="sec-news-list">`
            round_2.west.forEach(function(item, i) {
                if (!item.teamname2 || !item.teamname1) return
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2}</p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1}</p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += `<div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num"  data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num"  data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
                html += ` </li>`
            })
            html += `</ul><ul class="sec-news-list">`
            round_2.east.forEach(function(item, i) {
                if (!item.teamname2 || !item.teamname1) return
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2}</p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1}</p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += `<div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
            })
            html += `</ul></div></div>`
            //决赛
            html += '<div class="item">'
            html += `<div class="tab-h">
                <ul>
                    <li class="active">西部</li><li>东部</li>
                </ul>
            </div>
            <div class="tab-list"><ul class="sec-news-list">`
            ewFinal.west.forEach(function(item, i) {
                if (!item.teamname2 || !item.teamname1) return
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2}</p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1}</p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += `<div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
                html += `</li>`
            })
            html += `</ul><ul class="sec-news-list">`
            ewFinal.east.forEach(function(item, i) {
                if (!item.teamname2 || !item.teamname1) return
                html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${item.teamlogurl2}" alt="">
                                <p>${item.teamname2}</p>
                            </div>
                            <div class="col-2">
                                <h3>${item.teamscore2} - ${item.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${item.teamlogurl1}" alt="">
                                <p>${item.teamname1}</p>
                            </div>
                        </div>`
                item.matches.forEach(function(item2, i) {
                    item2.indexnum = i + 1
                })
                item.matches.reverse().forEach(function(item2, i) {
                    if (i === 2) {
                        html += ` <div class="more"></div>`
                    }
                    if (item2.ismatched === '0') {
                        item2.state = 'nostart'
                        item2.statetext = '未开始'
                    } else {
                        item2.state = 'ending'
                        item2.statetext = '回顾'
                    }
                    html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${item2.indexnum}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
                })
            })
            html += `</ul></div></div>`
            //总决赛
            let vs = allFinal.vs
            html += '<div class="item">'
            html += `<div class="tab-list"><ul class="sec-news-list">`
            html += `<li class="clearfix">
<div class="row1 clearfix">
                            <div class="col-1">
                                <img src="${vs.teamlogurl2}" alt="">
                                <p>${vs.teamname2}</p>
                            </div>
                            <div class="col-2">
                                <h3>${vs.teamscore2} - ${vs.teamscore1}</h3>
                            </div>
                            <div class="col-1">
                                <img src="${vs.teamlogurl1}" alt="">
                                <p>${vs.teamname1}</p>
                            </div>
                        </div>`

            vs.matches.forEach(function(item2, i) {
                if (i === 2) {
                    html += `<div class="more"></div>`
                }
                if (item2.ismatched === '0') {
                    item2.state = 'nostart'
                    item2.statetext = '未开始'
                } else {
                    item2.state = 'ending'
                    item2.statetext = '回顾'
                }
                html += `<div class="row clearfix">
                            <a href="${item2.liveurl}" data-matchId="${item2.matchId}">
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName2 === item2.homeTeamName}">${item2.teamGoal2}</div>
                                    <p>${item2.teamName2 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                                <div class="col-2">
                                    <h4>第${i + 1}场   ${item2.startTime.substring(5).replace('-', '月').replace(' ', '日 ')}</h4>
                                    <div class="state ${item2.state}" id="${item2.matchId}">${item2.statetext}</div>
                                </div>
                                <div class="col-1">
                                    <div class="num" data-value="${item2.teamName1 === item2.homeTeamName}">${item2.teamGoal1}</div>
                                    <p>${item2.teamName1 === item2.homeTeamName ? '(主)' : '(客)'}</p>
                                </div>
                            </a>
                        </div>`
            })
            html += `</li>`
            html += `</ul></div></div>`
            return html
        },
        matchData: function() {
            let prevDate = new Date().format('yyyy/MM/dd')
            let timestamp = new Date(prevDate).getTime()
            let data = {
                startts: timestamp,
                endts: timestamp + 60 * 60 * 24 * 1000,
                saishiid: '900002',
                isimp: ''
            }
            _util_.makeJsonp(HOST + 'matchba', data).done(function(result) {
                result.data.forEach(function(item) {
                    let $el = $(`#${item.matchid}`)
                    if (item.ismatched === '0') {
                        $el.addClass('living').text('LIVE').removeClass('nostart')
                        let $prevnum = $el.parent().prev().children('.num')
                        let $nextnum = $el.parent().next().children('.num')
                        $prevnum.text($prevnum.attr('data-value') === 'true' ? item.home_score : item.visit_score)
                        $nextnum.text($nextnum.attr('data-value') === 'true' ? item.home_score : item.visit_score)
                        let $elP = $el.parent().parent().parent().parent().children().eq(0)
                        let $elclone = $el.parent().parent().parent().clone()
                        $el.parent().parent().parent().remove()
                        $elP.after($elclone)
                    } else if (item.ismatched === '1') {
                        $el.addClass('ending').text('回顾').removeClass('nostart')
                        let $prevnum = $el.parent().prev().children('.num')
                        let $nextnum = $el.parent().next().children('.num')
                        $prevnum.text($prevnum.attr('data-value') === 'true' ? item.home_score : item.visit_score)
                        $nextnum.text($nextnum.attr('data-value') === 'true' ? item.home_score : item.visit_score)
                    }
                })
            })
        },
        //app里的逻辑
        handleInapp: function() {
            $menu.find('a').remove()
            $tabBd.on('click', '.sec-news-list li .row a', function(e) {
                e.preventDefault()
                let matchId = $(this).attr('data-matchId')
                console.log(matchId)
                if (qid === 'dfspdftttypd') {
                    /* global androidios:true*/
                    androidios.getmatchIdToApp(matchId)
                } else {
                    window.webkit.messageHandlers.androidios.postMessage({
                        'method': 'getmatchIdToApp',
                        'matchId': `${matchId}`
                    })
                }
                return false
            })
        }
    }
    let en = new Detail()
    en.init()
})
