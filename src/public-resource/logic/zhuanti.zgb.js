import 'pages/zhuanti_zgb/style.scss'
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
    //let {THEME, HOST_DSP_DETAIL} = config.API_URL
    //let {DOMAIN} = config
    //let domain = DOMAIN
    let version = '1.0.1' //内页版本号  用来区分版本上线
    console.log(version)
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let pixel = window.screen.width + '*' + window.screen.height
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let wsCache = new WebStorageCache()
    let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
    let $body = $('body')
    let $menu = $('#menu')
    let $tabBd = $('#tabBd')
    let $item = $tabBd.find('.item')
    let $secNewsList = $tabBd.find('.sec-news-list')
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
                $body.scrollTop(0)
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
        },
        getData: function(start) {
            let scope = this
            $loading.show()
            $.getJSON(scope.host).done(function(result) {
                //console.log(result)
                $loading.hide()
                scope.result = result
                if (!result.length) {
                    $loading.hide()
                    $('#noMore').remove()
                    $secNewsList.eq(scope.activeIndex).append('<section id="noMore" class="clearfix">无更多数据了</section>')
                    return
                }
                $secNewsList.eq(scope.activeIndex).append(scope.productHtml(result, start))
                pullUpFinished = true
                scope.pgnum++
            })/*.done(function() {
                scope.requestDspUrl(3, 1).done(function(data) {
                    let dspData = scope.changeDspDataToObj(data)
                    for (let i = 2; i >= 0; i--) {
                        if (data.data.length && dspData[i]) {
                            $(`#ggModule${scope.index - 4 - 3 + i}`).html(scope.loadDspHtml(dspData, i, ''))
                        } else {
                            let ggid = $(`#ggModule${scope.index - 4 - 3 + i}`).children().attr('id')
                            _util_.getScript('//tt123.eastday.com/' + ggid + '.js', function() {
                            }, $('#' + ggid)[0])
                        }
                    }
                    scope.reportDspInviewbackurl()
                })
            })*/
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
        },
        requestDspUrl: function(adnum, pgnum) {
            let readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl !== 'null') {
                readUrl = readUrl.join(',')
            }
            /* global _sportsType_:true */
            let data = {
                type: _sportsType_,
                qid: qid,
                uid: recgid, // 用户ID
                os: os,
                readhistory: readUrl,
                adnum: adnum,
                pgnum: this.pgnum,
                adtype: 236,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.browserType || 'null',
                pixel: pixel,
                fr_url: _util_.getReferrer() || 'null',	 // 首页是来源url(document.referer)
                site: 'sport'

            }
            return _util_.makeGet(HOST_DSP_DETAIL, data)
        },
        changeDspDataToObj: function(data) {
            let obj = {}
            data.data.forEach(function(item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        },
        loadDspHtml: function(dspData, posi, type) {
            let html = ''
            let item = dspData[posi]
            switch (item.adStyle) {
                case 'big':
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}"  data-dsp="hasDsp" style="display:block;height:5.14rem;">
                    <div class="title">${item.topic}</div>
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="souce">${item.source}</div>
                    </div>
                    </a>`
                    break
                case 'one':
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp">
                            <div class="img">
                                <img class="lazy" src="${item.miniimg[0].src}"/>
                            </div>
                            <div class="info">
                                <div class="title">${item.topic}</div>
                                <div class="source clearfix">
                                    <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                                    <div class="l">${item.source}</div>
                                </div>
                            </div>
                        </a>`
                    break
                case 'group':
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" >
                            <div class="title">${item.topic}</div>
                            <div class="imgs">
                                <img class="lazy" src="${item.miniimg[0].src}">
                                <img class="lazy" src="${item.miniimg[1].src}">
                                <img class="lazy" src="${item.miniimg[2].src}">
                            </div>
                            <div class="source clearfix">
                                <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                                <div class="souce">${item.source}</div>
                            </div>
                        </a>`
                    break
                case 'full':
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="display:block;height:2.9rem;">
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="tag">${item.isadv ? '广告' : '推广'}</div>
                        <div class="l">${item.source}</div>
                    </div>
                    </a>`
                    break
            }
            $body.append(`<img style="display: none" src="${item.showbackurl}"/>`)
            return html
        },
        reportDspInviewbackurl: function() {
            let cHeight = $(window).height()
            let offsetArr = []
            let eleArr = []
            $('a[inviewbackurl]').each(function(i, item) {
                if (cHeight > $(this).offset().top) {
                    $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                    $(this).removeAttr('inviewbackurl')
                }
            })

            $('a[inviewbackurl]').each(function(i, item) {
                offsetArr.push($(this).offset().top)
                eleArr.push($(this))
            })

            $(window).scroll(function() {
                offsetArr.forEach((item, index) => {
                    if (cHeight + $(this).scrollTop() > item) {
                        if (eleArr[index].attr('inviewbackurl')) {
                            $body.append(`<img style="display: none" src="${eleArr[index].attr('inviewbackurl')}"/>`)
                            eleArr[index].removeAttr('inviewbackurl')
                        }
                    }
                })
            })
        },
        loadLazyImg: function() {
            /*!
 *  Echo v1.4.0
 *  Lazy-loading with data-* attributes, offsets and throttle options
 *  Project: https://github.com/toddmotto/echo
 *  by Todd Motto: http://toddmotto.com
 *  Copyright. MIT licensed.
 */
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
        }
    }
    let en = new Detail()
    //let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
    en.init()
})
