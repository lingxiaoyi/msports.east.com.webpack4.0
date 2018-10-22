import 'pages/detail/style.scss'
import './log.news.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, HOST_DSP_DETAIL} = config.API_URL
    let {DOMAIN} = config
    let domain = DOMAIN
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let pixel = window.screen.width + '*' + window.screen.height
    let wsCache = new WebStorageCache()
    ;(function() {
        let $interestNews = $('#J_interest_news') // 猜你喜欢
        let $hotNews = $('#J_hot_news') // 热点新闻
        let $hnList = $('<div id="J_hn_list" class="hn-list"></div>') // 热点新闻列表
        let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
        let $article = $('#J_article')
        let $body = $('body')
        //let $imgs = $article.find('#content .img-wrap img')
        let pullUpFinished = false
        let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
        let typecode
        /* global _articleTagCodes_:true*/
        typecode = _articleTagCodes_.split(',')
        $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?${`qid=${qid}&from=homepage`}"></a></div> </div>`)
        let $goTop = $('#goTop')
        $goTop.on('click', function() {
            $body.scrollTop(0)
        })
        function Detail(channel, tpyecode) {
            this.host = HOST
            this.channel = channel
            this.index = 3 //热点新闻中的广告起始下标为3
            this.startkey = ''
            this.typecode = tpyecode.join('|')
            this.idx = 1 //热点新闻中的位置下标
            this.pgnum = 1
            this.isShieldAd = this.channel === 'tiyubdtyald'
        }
        Detail.prototype = {
            init: function() {
                this.showHotNews()
                this.setHistoryUrl()
                this.onScrollLoadNews()
                //注册展开
                this.unfoldArticle()
            },
            //图片预加载和下拉加载新闻
            onScrollLoadNews: function() {
                let scope = this
                let clientHeight = $(window).height()
                /*let $imgsTopArr = []
                //先加载本屏幕和下方的2张图片
                $imgs.each(function() {
                    let $this = $(this)
                    $imgsTopArr.push($this.offset().top)
                })
                $imgsTopArr.forEach(function(item, i) {
                    if (item < clientHeight + 400) {
                        let $img = $imgs.eq(i)
                        if ($img.attr('data-src')) {
                            $img.attr('src', $img.attr('data-src'))
                        }
                    }
                })*/
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
                    if (scrollTop + clientHeight >= bodyHeight && pullUpFinished && !scope.isShieldAd) {
                        pullUpFinished = false
                        scope.getData(scope.startkey)
                    }
                    //预加载图片
                    /*$imgsTopArr.forEach(function(item, i) {
                        if (scrollTop + clientHeight + 100 > item) {
                            let $img = $imgs.eq(i)
                            if ($img.attr('data-src')) {
                                $img.attr('src', $img.attr('data-src'))
                            }
                        }
                    })*/
                })
            },
            setHistoryUrl: function() {
                let url = window.location.href
                let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
                let historyUrlArr = []
                if (wsCache.get('historyUrlArr') && wsCache.get('historyUrlArr').length) {
                    historyUrlArr = wsCache.get('historyUrlArr')
                }
                if (historyUrlArr.length >= 5) {
                    historyUrlArr.shift()
                }
                historyUrlArr.push(urlNum)
                wsCache.set('historyUrlArr', historyUrlArr, {exp: 10 * 60})
            },
            showHotNews: function(data) {
                let scope = this
                //原创加标签
                /* global _isOriginal_:true*/
                if (typeof _isOriginal_ !== 'undefined' && _isOriginal_ === '1') {
                    $article.find('.article-tag').before('<div class="copyright">本文仅代表作者个人观点，与本网无关。</div>')
                }
                //downloadUrl += `?qid=${scope.channel}`
                //标题上方广告;猜你喜欢广告;
                if (!scope.isShieldAd && this.channel !== 'null' && this.channel !== 'baiducom') {
                    $article.before('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[0] + '"></div><div class="line"></div></section>')
                    _util_.getScript('//tt123.eastday.com/' + _detailsGg_[0] + '.js', function() {}, $('#' + _detailsGg_[0])[0])
                }
                if (this.channel !== 'null' && this.channel !== 'baiducom' && qid !== 'tiyutt') {
                    $('#baiduhao').hide()
                    scope.requestDspUrl(1, 0).done(function(data) {
                        let $unfoldField = $('#unfoldField')
                        let dspData = scope.changeDspDataToObj(data)
                        if (data.data.length && dspData[0]) {
                            $unfoldField.after(scope.loadDspHtml(dspData, 0, 'articleDown'))
                            scope.reportDspInviewbackurl()
                        } else {
                            if (scope.channel === 'baiducom') {
                                $unfoldField.after('<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=849191&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="78"></iframe></section>')//sougou
                            } else {
                                $unfoldField.after('<section class="gg-item news-gg-img3"  style="margin-bottom: 0.4rem;"><div id="' + _detailsGg_[1] + '"></div></section>')
                                _util_.getScript('//tt123.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])//baidu
                            }
                        }
                    })
                    //猜你喜欢广告;
                    if (!scope.isShieldAd && scope.channel !== 'baiducom') {
                        $interestNews.html('<div class="section-title in-title"><h2>猜你喜欢</h2></div><section style="padding:0.15rem 0.24rem 0.15rem"><div id="' + _detailsGg_[2] + '"></div></section><div class="separate-line"></div>')
                        _util_.getScript('//tt123.eastday.com/' + _detailsGg_[2] + '.js', function() {}, $('#' + _detailsGg_[1])[0])
                        //猜你喜欢下方3图广告和2个文字链广告
                        if (this.channel === 'tiyuvivobrowser01') {
                            detailGGAddThree[this.channel].reverse().forEach(function(item) {
                                $interestNews.after(`<section class="gg-item"  style="padding:0 0.24rem;"><div id="${item}"></div></section>`)
                                _util_.getScript(`//tt123.eastday.com/${item}.js`, function() {}, $(`#${item}`)[0])
                            })
                        } else {
                            detailGGAddThree['null'].reverse().forEach(function(item) {
                                $interestNews.after(`<section class="gg-item"  style="padding:0 0.24rem;"><div id="${item}"></div></section>`)
                                _util_.getScript(`//tt123.eastday.com/${item}.js`, function() {}, $(`#${item}`)[0])
                            })
                        }
                    }
                    //文章下方加展开全文
                    if ($article.height() >= 1100) {
                        $article.after('<div class="unfold-field"  id="unfoldField"><div class="unflod-field__mask"></div><a href="javascript:void(0)" class="unfold-field__text">展开全文</a></div>')
                    }
                } else {
                    $article.css({
                        'maxHeight': '100%'
                    })
                }
                scope.getData(0)
                //热点推荐部分;
                if (scope.channel !== 'tiyubdtyald') {
                    $hotNews.append('<div class="section-title hn-title"><h2>热点推荐</h2></div>')
                    $hotNews.append($hnList)
                    $hotNews.append($loading)
                }
                //去掉面包屑
                $('.crumbs').remove()
                //返回首页
                if (!scope.isShieldAd) {
                    $interestNews.parent().before(`<a href="${config.HOME_URL}?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews`}" class="back-homepage"><i></i>点击查看更多精彩  >></a>`)
                } else {
                    //$interestNews.parent().before(`<a href="${downloadUrl}" class="back-homepage"><i></i>前往APP查看更多相关新闻</a>`)
                }
                $interestNews.parent().before('<div class="separate-line"></div>')
            },
            productHtml: function(result, start) {
                let data = result.data
                let html = ''
                let scope = this
                data.forEach(function(item, i) {
                    let ggid = _detailsGg_[scope.index]
                    let length = item.miniimg.length
                    let url = item.url
                    let tagHtml = `<em class="tag tag-src">${item.source}</em>`
                    if (length >= 3) {
                        html += `
					<section class="news-item news-item-s2">
					<a class="news-link" href="${`${url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}&pgnum=${scope.pgnum}`}`}" suffix="">
						<div class="news-wrap">
							<h3>${item.topic}</h3>
							<div class="img-wrap clearfix">
								<div class="img fl"><img class="lazy" src="${item.miniimg[0].src}"></div>
								<div class="img fl"><img class="lazy" src="${item.miniimg[1].src}"></div>
								<div class="img fl"><img class="lazy" src="${item.miniimg[2].src}"></div>
							</div>
							<p class="tags clearfix">
								${tagHtml}
							</p>
						</div>
					</a>
					</section>
					`
                    } else {
                        html += `<section class="news-item news-img1">
									<a class="news-link" href="${`${url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}&pgnum=${scope.pgnum}`}`}" suffix="">
									<div class="info">
									<h3 class="title dotdot line3">${item.topic}</h3>
									<p class="tags">
									${tagHtml}
									</p>
									</div>
									<div class="img img-bg">
									<img  class="image" src="${item.miniimg[0].src}">
									</div>
									</a>
								</section>`
                    }
                    if ((i === 1 || i === 3 || i === 6) && qid !== 'tiyutt') {
                        html += `<div id="ggModule${scope.index - 4}" class="clearfix" ><section  class="news-item news-img1"><div id="${ggid}"></div></section></div>`
                        scope.index++
                    }
                    scope.idx++
                })
                return html
            },
            getData: function(start) {
                let scope = this
                let data = {
                        typecode: this.typecode,
                        startkey: this.startkey,
                        pgnum: this.pgnum,
                        url: locationUrl,
                        os: os,
                        recgid: recgid,
                        qid: qid,
                        domain: domain
                    }
                $loading.show()
                _util_.makeJsonp(scope.host + 'detailnews', data).done(function(result) {
                    if (!result.data.length) {
                        $loading.hide()
                        $('#noMore').remove()
                        $('#J_hn_list').append('<section id="noMore" class="clearfix">无更多数据了</section>')
                        return
                    } //如果startkey没变化就结束
                    scope.startkey = result.endkey
                    $('#J_hn_list').append(scope.productHtml(result, start))
                    pullUpFinished = true
                    scope.pgnum++
                }).done(function() {
                    scope.requestDspUrl(3, 1).done(function(data) {
                        let dspData = scope.changeDspDataToObj(data)
                        for (let i = 2; i >= 0; i--) {
                            if (data.data.length && dspData[i]) {
                                $(`#ggModule${scope.index - 4 - 3 + i}`).html(scope.loadDspHtml(dspData, i, ''))
                            } else {
                                let ggid = $(`#ggModule${scope.index - 4 - 3 + i}`).children().children().attr('id')
                               _util_.getScript('//tt123.eastday.com/' + ggid + '.js', function() {
                                }, $('#' + ggid)[0])
                            }
                        }
                        scope.reportDspInviewbackurl()
                    })
                })
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
                let scope = this
                switch (item.adStyle) {
                    case 'big': //大
                        html += `<section class="news-item news-item-s1" style="${type === 'articleDown' ? 'border:0' : ''}">
										<a  href="${item.url}" class="news-link" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}`}" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" style="display:block;height:5.14rem;">
											<div class="news-wrap">
												<h3>${item.topic}</h3>
												<div class="img-wrap">
													<img class="lazy" src="${item.miniimg[0].src}">
												</div>
												<p class="tags clearfix">
													<em class="tag tag-time"><i class="tag tag-gg">${item.isadv ? '广告' : '推广'}</i></em>
													<em class="tag tag-src l">${item.source}</em>
												</p>
											</div>
										</a>
										</section>`
                        break
                    case 'one': //单
                        html += `<section class="news-item news-item-s1" style="${type === 'articleDown' ? 'border:0' : ''}">
										<a  href="${item.url}" class="news-link" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}`}" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}">
										<div class="news-wrap clearfix">
    <div class="txt-wrap fl"><h3>${item.topic}</h3><p class="tags clearfix"><em class="tag tag-time"><i class="tag tag-gg">${item.isadv ? '广告' : '推广'}</i></em><em class="tag tag-src">${item.source}</em></p></div><div class="img-wrap fr"><img class="lazy" src="${item.miniimg[0].src}"></div></div>
										</a>
										</section>`
                        break
                    case 'group': //三图
                        html += `<section class="news-item news-item-s2" style="${type === 'articleDown' ? 'border:0' : ''}">
										<a  href="${item.url}" class="news-link" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}`}" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}">
											<div class="news-wrap">
												<h3>${item.topic}</h3>
												<div class="img-wrap clearfix">
													<div class="img fl"><img class="lazy" src="${item.miniimg[0].src}"></div>
													<div class="img fl"><img class="lazy" src="${item.miniimg[1].src}"></div>
													<div class="img fl"><img class="lazy" src="${item.miniimg[2].src}"></div>
												</div>
												<p class="tags clearfix">
													<em class="tag tag-time"><i class="tag tag-gg">${item.isadv ? '广告' : '推广'}</i></em>
													<em class="tag tag-src  l">${item.source}</em>
												</p>
											</div>
										</a>
										</section>`
                        break
                    case 'full': //banner
                        html += `<section class="news-item news-item-s2" style="${type === 'articleDown' ? 'border:0' : ''}">
										<a  href="${item.url}" class="news-link" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}`}" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" style="display:block;height:2.9rem;">
											<div class="news-wrap">
												<div class="img-wrap">
													<img src="${item.miniimg[0].src}">
												</div>
												<p class="tags clearfix">
													<em class="tag tag-time"><i class="tag tag-gg">${item.isadv ? '广告' : '推广'}</i></em>
													<em class="tag tag-src l">${item.source}</em>
												</p>
											</div>
										</a>
										</section>`

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
            }, //展开文章
            unfoldArticle() {
                $body.on('click', '.unfold-field', function() {
                    $article.css({'max-height': '100%'})
                    $(this).hide()
                })
            }
        }
        let en = new Detail(qid, typecode)
        let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
        let detailGGAddThree = _AD_.detailGGAddThree
        if (qid === 'tiyutt') {
            _detailsGg_ = {}
        }
        en.init()
    })()
    ;(function shareWebPage() {
        $.ajax({
            type: 'get',
            url: '//xwzc.eastday.com/wx_share/share_check.php',
            data: {
                url: window.location.href
            },
            dataType: 'jsonp',
            jsonp: 'wxkeycallback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: 'wxkeycallback',
            success: function(result) {
                wx.config({
                    debug: false, //这里是开启测试，如果设置为true，则打开每个步骤，都会有提示，是否成功或者失败
                    appId: result.appId,
                    timestamp: result.timestamp, //这个一定要与上面的php代码里的一样。
                    nonceStr: result.nonceStr, //这个一定要与上面的php代码里的一样。
                    signature: result.signature, //签名
                    jsApiList: [
                        // 所有要调用的 API 都要加到这个列表中
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                    ]
                })
                wx.ready(function() {
                    // 分享给朋友
                    let imgSrc = $('#content img').eq(0).attr('src')
                    if (imgSrc.indexOf('http') === -1) {
                        imgSrc = 'http:' + imgSrc
                    }
                    wx.onMenuShareAppMessage({
                        title: $('h1.title').text() + '_东方体育', // 分享标题
                        desc: $('#content p.txt').text(), // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    wx.onMenuShareTimeline({
                        title: $('h1.title').text() + '_东方体育', // 分享标题
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function() {
                        },
                        cancel: function() {

                        }
                    })
                })
            },
            error: function() {

            }
        })
    })()
})
