import 'pages/data_nba_duel/style.scss'
import './log.news.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
//import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {PLAYOFFNBA} = config.API_URL
    //let {DOMAIN} = config
    //let domain = DOMAIN
    let version = '1.0.1' //内页版本号  用来区分版本上线
    console.log(version)
    //let os = _util_.getOsType()
    //let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    //qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    //let pixel = window.screen.width + '*' + window.screen.height
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let wsCache = new WebStorageCache()
    let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
    let $body = $('body')
    let $menu = $('#menu')
    let $tabBd = $('#tabBd')
    let $item = $tabBd.find('.item')
    let $secNewsList = $tabBd.find('.sec-news-list')
    let tabh = $tabBd.find('.tab-h')
    let tabList = $tabBd.find('.tab-list .sec-news-list')
    let pullUpFinished = false
    function Detail() {
        /* global _special_:true*/
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
            //scope.queryMatchState()
            scope.onScrollLoadNews()
            scope.addEventListener()
            scope.getData(0)
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
                $item.hide()
                $item.eq(index).show()
                that.activeIndex = index
                that.host = _special_[index]
            })
            tabh.on('click', 'li', function() {
                let index = $(this).index()
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                let tabList = $(this).parent().parent().next().children()
                tabList.hide()
                tabList.eq(index).show()
            })
            tabList.on('click', '.more', function() {
                $(this).parent().css('maxHeight', '100%')
                $(this).remove()
            })
        },
        getData: function(start) {
            //let scope = this
            $loading.show()
            var data = {
                datatype: 'nba_jihousai'
            }
            _util_.makeJsonp(PLAYOFFNBA, data).done(function(result) {
                let html = ''
                let round_1 = result.round_1
                let round_2 = result.round_2
                let ewFinal = result.ewFinal
                let allFinal = result.allFinal
                //第一行
                html += `<div class="match-group-top1 match-group">`
                round_1.west.forEach(function(item) {
                    html += `<div class="match">
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1}</div>
                                        <div class="team">(${item.teamdesc1.substring(1)})</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2}</div>
                                        <div class="team">(${item.teamdesc2.substring(1)})</div>
                                    </span>
                                </div>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <span class="line-vertical"></span>
                            </div>`
                })
                html += `</div>`
                //第二行
                html += `<div class="match-group-top2 match-group">`
                round_2.west.forEach(function(item) {
                    html += `<div class="match">
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1 ? item.teamname1 : '?'}</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2 ? item.teamname2 : '?'}</div>
                                    </span>
                                </div>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <span class="line-vertical"></span>
                            </div>`
                })
                html += `</div>`
                //第三行
                html += `<div class="match-group-top3 match-group">`
                ewFinal.west.forEach(function(item) {
                    html += `<div class="match">
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1 ? item.teamname1 : '?'}</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2 ? item.teamname2 : '?'}</div>
                                    </span>
                                </div>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <span class="line-vertical"></span>
                            </div>`
                })
                html += `</div>`
                //第四行
                html += `<div class="match-group-center match-group">`
                html += `<div class="match">
                            <div class="teams">
                                <span class="icon">				
                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${allFinal.vs.teamlogurl1}">
                                    <div class="team">${allFinal.vs.teamname1 ? allFinal.vs.teamname1 : '?'}</div>
                                </span>
                                <div class="labels">
                                    <div class="score">${(allFinal.vs.teamscore1 === '' ? '0' : allFinal.vs.teamscore1) + '-' + (allFinal.vs.teamscore2 === '' ? '0' : allFinal.vs.teamscore2)}</div>
                                    <div class="score match-name">总决赛</div>
                                </div>
                                <span class="icon">
                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${allFinal.vs.teamlogurl2}">
                                    <div class="team">${allFinal.vs.teamname2 ? allFinal.vs.teamname2 : '?'}</div>
                                </span>
                            </div>
                        </div>`
                html += `</div>`
                //第五行
                html += `<div class="match-group-bottom3 match-group bottom">`
                ewFinal.east.forEach(function(item) {
                    html += `<div class="match">
                                <span class="line-vertical"></span>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1 ? item.teamname1 : '?'}</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2 ? item.teamname2 : '?'}</div>
                                    </span>
                                </div>
                            </div>`
                })
                html += `</div>`
                //第六行
                html += `<div class="match-group-bottom2 match-group bottom">`
                round_2.east.forEach(function(item) {
                    html += `<div class="match">
                                <span class="line-vertical"></span>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1 ? item.teamname1 : '?'}</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2 ? item.teamname2 : '?'}</div>
                                    </span>
                                </div>
                            </div>`
                })
                html += `</div>`
                //第七行
                html += `<div class="match-group-bottom1 match-group bottom">`
                round_1.east.forEach(function(item) {
                    html += `<div class="match">
                                <span class="line-vertical"></span>
                                <div class="line">${(item.teamscore1 === '' ? '0' : item.teamscore1) + '-' + (item.teamscore2 === '' ? '0' : item.teamscore2)}</div>
                                <div class="teams">
                                    <span class="icon">				
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl1}">
                                        <div class="team">${item.teamname1}</div>
                                        <div class="team">(${item.teamdesc1.substring(1)})</div>
                                    </span>
                                    <span class="icon">
                                        <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${item.teamlogurl2}">
                                        <div class="team">${item.teamname2}</div>
                                        <div class="team">(${item.teamdesc2.substring(1)})</div>
                                    </span>
                                </div>
                            </div>`
                })
                html += `</div>`
                $('#duelTab').html(html)
            }).always(function() {
                $loading.hide()
            })
        },
        productHtml: function(result) {
            let data = result
            let html = ''
            let scope = this
            data.forEach(function(item, i) {
                //let ggid = _detailsGg_[scope.index]
                if (item.stype === 'news') {
                    let length = item.imgsrc3.length
                    if (i >= (scope.pgnum * 10 - 10) && i < scope.pgnum * 10) {
                        if (length === 0) {
                            html += `<li class="clearfix">
                    <a href="${`${item.src}?${`qid=${qid}&idx=${scope.idx}&pgnum=${scope.pgnum}`}`}">
                        <div class="img">
                            <img class="lazy" src="${item.imgsrc1}">
                        </div>
                        <div class="info">
                            <div class="title">${item.title}</div>
                            <div class="source">
                                <div class="l">${item.source}</div>
                            </div>
                        </div>
                    </a>
                </li>`
                        } else {
                            html += `<li class="clearfix">
                    <a href="${`${item.src}?${`qid=${qid}&idx=${scope.idx}&pgnum=${scope.pgnum}`}`}">
                        <div class="title">${item.title}</div>
                        <div class="imgs">
                            <img class="lazy" src="${item.imgsrc1}">
                            <img class="lazy" src="${item.imgsrc2}">
                            <img class="lazy" src="${item.imgsrc3}">
                        </div>
                        <div class="source">
                            <div class="l">${item.source} </div>
                        </div>
                    </a>
                </li>`
                        }
                        scope.idx++
                    }
                } else {

                }
                // <div class="tag-zd">${item.tags.length > 0 && item.tags[0].name}</div>

                // 广告位置
                /*if (i === 1 || i === 3 || i === 6) {
                    html += `<li style="padding:0;" id="ggModule${scope.index - 4}" class="clearfix" ><div id="${ggid}"></div></li>`
                    scope.index++
                }*/
            })
            return html
        }
        /*loadLazyImg: function() {
            /!*!
 *  Echo v1.4.0
 *  Lazy-loading with data-* attributes, offsets and throttle options
 *  Project: https://github.com/toddmotto/echo
 *  by Todd Motto: http://toddmotto.com
 *  Copyright. MIT licensed.
 *!/
            let that = this
            var store = []
            var offset
            var throttle
            var poll

            var _inView = function(el) {
                var coords = el.getBoundingClientRect()
                return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))
            }

            var _pollImages = function() {
                for (var i = store.length; i--;) {
                    var self = store[i]
                    if (_inView(self)) {
                        self.src = self.getAttribute('data-echo')
                        store.splice(i, 1)
                    }
                }
            }

            var _throttle = function() {
                clearTimeout(poll)
                console.log(1)
                poll = setTimeout(_pollImages, throttle)
            }

            var init = function(obj) {
                var nodes = document.querySelectorAll('[data-echo]')
                var opts = obj || {}
                offset = opts.offset || 0
                throttle = opts.throttle || 250

                for (var i = 0; i < nodes.length; i++) {
                    store.push(nodes[i])
                }

                _throttle()
                if (document.addEventListener) {
                    $swiperSlides.eq(that.curPos)[0].addEventListener('scroll', _throttle, false)
                } else {
                    $swiperSlides.eq(that.curPos)[0].attachEvent('onscroll', _throttle)
                }
            }
            init({
                offset: 0, //离可视区域多少像素的图片可以被加载
                throttle: 0 //图片延时多少毫秒加载
            })
        }*/
    }
    let en = new Detail()
    //let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
    en.init()
})
