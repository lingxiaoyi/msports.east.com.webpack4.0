import './style.scss'
import 'public/logic/log.js'
import FastClick from 'fastclick'
//import config from 'configModule'
import 'public/libs/lib.prototype'
import _util_ from 'public/libs/libs.util'
//import _AD_ from 'public/libs/ad.channel'
import Swiper from 'swiper'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    //let {DOMAIN} = config
    /*let qid = _util_.getPageQid()
    qid = _AD_.indexGg[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null*/
    //let _newsGg_ = _AD_.indexGg[qid].concat(_AD_.indexNoChannel)
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let _qid_ = _util_.getPageQid()
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $secNewsList = $('#secNewsList')
    let $J_loading = $('#J_loading')
    //let $header = $('.header')
    let pullUpFinished = false
    let pgnum = 1
    let ts = 0
    let historicalDateArr = []
    let todayDate = new Date().format('yyyy-MM-dd')
    loadNewsList(1)
    $(window).scroll(function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList(pgnum)
        }
    })

    function loadNewsList(num) {
        /*typecode = _util_.getUrlParam('typecode') || '901278'
        let data = {
            type: '',
            typecode: typecode,
            startkey: startkey,
            newkey: newkey,
            pgnum: pgnum,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }*/
        $J_loading.show() // 数据加载样式
        let uid = (+new Date()) + Math.random().toString(10).substring(2, 6)
        _util_.makeJsonpCallbackOther(`${worldapi}${num}.js?${uid}`, {}).done(function(result) {
            $J_loading.hide()
            if (!result.data.length) {
                $('#noMore').remove()
                $secNewsList.children('ul').append('<li id="noMore" class="clearfix">无更多数据了</li>')
                return
            }
            ts = result.ts
            $secNewsList.children('ul').append(produceListHtml(result))
            loadLazyImg()
            pgnum++
            pullUpFinished = true
        })/*.done(function(result) {
            if (!result.data.length) {
                return
            }
            for (let i = 1; i >= 0; i--) {
                let value = $(`#ggModule${index - 2 + i}`).children().attr('id')
                _util_.getScript('//df888.eastday.com/' + value + '.js', function() {
                }, $('#' + value)[0])
            }
        })*/
    }
    function setInterloadNewsList(pgnum) {
        /*typecode = _util_.getUrlParam('typecode') || '901278'
        let data = {
            type: '',
            typecode: typecode,
            startkey: startkey,
            newkey: newkey,
            pgnum: pgnum,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }*/
        let uid = (+new Date()) + Math.random().toString(10).substring(2, 6)
        $J_loading.show() // 数据加载样式
        _util_.makeJsonpCallbackOther(`${worldapi}${pgnum}.js?${uid}`, {}).done(function(result) {
            $J_loading.hide()
            if (ts !== result.ts) {
                if ($('.btn-more-news').length) return
                $secNewsList.prepend(`<div class="btn-more-news">有新闻，点击查看  </div>`)
                $('.btn-more-news').click(function() {
                    window.location.reload()
                })
            }
            pullUpFinished = true
        })/*.done(function(result) {
            if (!result.data.length) {
                return
            }
            for (let i = 1; i >= 0; i--) {
                let value = $(`#ggModule${index - 2 + i}`).children().attr('id')
                _util_.getScript('//df888.eastday.com/' + value + '.js', function() {
                }, $('#' + value)[0])
            }
        })*/
    }
    function produceListHtml(result) {
        let data = result.data
        let html = ''
        data.forEach(function(item, i) {
            let dataArr = item.create_time.split(' ')
            let html1 = ''
            //视频 图片html组装
            if (item.videos.length) {
                /*if (item.videos[0].indexOf('mp4') >= 0) {}*/
                    html1 = `<div class="img-boxs img1 clearfix">
                                <div class="video-box">
                                    <!--<img src="//imgmini.eastday.com/video/vzixun/20160615/20160615162859788651284_1_mwpm_05501609.jpeg">-->
                                    <video id="J_video" class="video" src="${item.videos[0]}" data-type="vgaoxiao" poster="${item.imgs[0]}" data-poster = "${item.imgs[0]}"  type="video/mp4" preload="true" controls="none" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" x-webkit-airplay="allow" webkit-playsinline="true" playsinline="true" width="100%" height="100%" data-duration="33200" data-source="来源" data-publishtime="2017-02-22 12:12" data-size="11234" data-width="640" data-height="360"></video>
                                </div>
                            </div>`
                /* else {
                    html1 = ` <div class="img-boxs clearfix">
                                <a href="">
                                    <div class="img-box ">
                                        <img src="${item.imgs[0]}" alt="">
                                        <div class="i-play"></div>
                                    </div>
                                </a>
                            </div>`
                }*/
            } else {
                html1 += `<div class="img-boxs clearfix">`
                item.imgs.forEach(function(itemChild, i) {
                    html1 += `<div class="img-box ${item.imgs.length === 1 ? 'single' : ''}">
                                <img class="${item.imgs.length === 1 ? '' : `${item.preview[i].w - item.preview[i].h > 0 ? 'h100' : 'w100'}`}" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="  data-echo="${itemChild.replace('http:', 'https:')}" style="${item.imgs.length !== 1 ? '' : (`height:${item.preview[i].h / 100 * (402.6 / item.preview[i].w) + 'rem'}`)}" alt="">
                            </div>`
                })
                html1 += `</div>`
            }
            if (historicalDateArr.indexOf(dataArr[0]) === -1) {
                historicalDateArr.push(dataArr[0])
                if (dataArr[0] !== todayDate) {
                    html += `<li><div class="date">${dataArr[0]}</div>
                    <div class="line"></div></li>`
                }
            }
            item.content = item.content.replace(/http:\/\/sports.eastday.com/ig, '//msports.eastday.com')
            item.content = item.content.replace(/http:\/\/msports.eastday.com/ig, '//msports.eastday.com')
            item.content = item.content.replace(/(<a\b[^>]+\bhref="[^"]*"[^>]*>)/ig, '$1<i></i>')
            item.content = item.content.replace(/(href="[^"]*\.html)/ig, '$1?qid=' + _qid_)
                html += `<li>
                    <div class="time">
                        <span></span>${_util_.getSpecialTimeStr(new Date(item.create_time.replace(/-/g, '/')).getTime())}
                    </div>
                    <div class="info">
                        <p>${item.content}</p>
                           ${html1}
                    </div>
                </li>`
        })
        return html
    }
    $secNewsList.on('click', 'ul li .img-boxs .img-box', function() {
        //let src = $(this).attr('data-src')
        let index = $(this).index()
        let $imgs = $(this).parent().children().children()
        let html = ''
        $imgs.each(function(item) {
            html += `<div class="swiper-slide"><div class="slide-wrap">
                <img src="${$(this).attr('src')}" class="swiper-lazy" />
             </div></div>`
        })
        $body.append(`<div id="swiperContainer" class="swiper-container fs-swiper-container">
    <div class="swiper-wrapper">
            ${html}
            <!--<div class="info">
                <h3><span>1</span><span>/</span><span>5</span>  梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀</h3>
                <p>上半场，丹尼斯-苏亚雷斯推射稍稍偏出。易边再战，保利尼奥疑似受伤被换下场。罗贝托造点，梅西主罚的点球被迭戈-洛佩斯扑出。</p>
            </div>-->
       
    </div>
    <div class="close"></div>
</div>`)
        let swiper = new Swiper('#swiperContainer', {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            zoom: true,
            lazyLoading: true,
            loop: false, /* spaceBetween: 10, */
            //centeredSlides: true,
            autoplay: false,
            autoplayDisableOnInteraction: false,
            onInit: function(swiper) {
            },
            onSlideChangeStart: function(swiper) {
            }
        })
        swiper.slideTo(index, 0)
    })

    $body.on('click', '#swiperContainer', function() {
        $(this).remove()
    })
    setInterval(function() {
        setInterloadNewsList(1)
    }, 10000)
    function loadLazyImg() {
        /*!
        *  Echo v1.4.0
        *  Lazy-loading with data-* attributes, offsets and throttle options
        *  Project: https://github.com/toddmotto/echo
        *  by Todd Motto: http://toddmotto.com
        *  Copyright. MIT licensed.
        */
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
                    //self.poster = self.getAttribute('data-poster')
                    //$(self).removeAttr('data-echo')
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
                $(window)[0].addEventListener('scroll', _throttle, false)
            } else {
                $(window)[0].attachEvent('onscroll', _throttle)
            }
        }
        init({
            offset: 0, //离可视区域多少像素的图片可以被加载
            throttle: 0 //图片延时多少毫秒加载
        })
    }
})
