import 'pages/24hour/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import WebStorageCache from 'web-storage-cache'
import './log.js'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    //定义需要传入接口的值
    let {HOST_DSP_LIST} = config.API_URL
    let {DOMAIN} = config
    let domain = DOMAIN
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    let wsCache = new WebStorageCache()
    let pixel = window.screen.width + '*' + window.screen.height
    //let pullUpFinished = true
    let pgnum = 1
    let idx = 1
    let index = 0
    let $loading = `<div id="J_loading" class="loading">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                    <p class="txt">数据加载中</p>
                </div>`
    let $J_hn_list = $('#newsList')
    $J_hn_list.after($loading)
    let $J_loading = $('#J_loading')
    let $body = $('body')
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let _newsGg_ = _AD_['indexGg'][qid].concat(_AD_.indexNoChannel)

    /*$(window).on('scroll', function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList()
        }
    })*/

    class Page {
        constructor() {
            this.init()
        }
        init() {
            this.loadNewsList()
            this.loadredpack()
        }
        loadredpack() {
            //加载悬浮广告
            /*let timestamp = Date.parse(new Date())
            let newtimestamp = Date.parse(new Date('2018-04-18 00:00'))
            if (newtimestamp - timestamp > 0) {
                if (qid !== 'baiducom') {
                    this.loadXuanfuGg()
                }
            }*/
        }
        loadNewsList() {
            let that = this
            if (pgnum >= 6) {
                $J_hn_list.append('<li style="text-align: center"><a href="javascript:;">没有更多数据了..</a></li>')
                $J_loading.hide()
                return
            }
            let data = {
                pgnum: pgnum,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: domain
            }
            $J_loading.show()
            return _util_.makecallback('//sports.eastday.com/data/cblq.json', data).done(function(result) {
                $J_loading.hide()
                if (!result.length) {
                    $J_hn_list.append('<li style="text-align: center"><a href="javascript:;">没有更多数据了..</a></li>')
                    return
                }
                $J_hn_list.append(produceListHtml(result))
                //pullUpFinished = true
                pgnum++
            }).done(function(result) {
                if (!result.length) {
                    return
                }
                that.requestDspUrl(3, 1).done(function(data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 5; i >= 0; i--) {
                        let value = $(`#ggModule${index - 6 + i}`).children().attr('id')
                        if (that.dspData[i]) {
                            $(`#${value}`).html(that.loadDspHtml(that.dspData, i, ''))
                            that.reportDspInviewbackurl()
                        } else {
                            _util_.getScript('//df888.eastday.com/' + value + '.js', function() {
                            }, $('#' + value)[0])
                        }
                    }
                })
            })
            function produceListHtml(result) {
                let html = ''
                //let that = this
                result.forEach(function(item, i) {
                    let length = item.miniimg.length // 判断缩略图的数量
                    if (length < 3 && length >= 1) {
                        /*html += `<li class="clearfix">
                                            <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}`}`}" suffix="">
                                                <div class="img">
                                                    <img class="lazy" src="${item.miniimg[0].src}"/>
                                                </div>
                                                <div class="info">
                                                    <div class="title">${item.topic}</div>
                                                    <div class="source clearfix">
                                                        ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                                    <div class="l">${item.source}</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>`*/
                        html += `<section class="news-item news-item-s1"><a data-type="jiankang" href="${`${item.url.replace('http://', 'http://m')}?${`qid=${qid}&idx=${idx}`}`}">
                    <div class="news-wrap clearfix">
                        <div class="txt-wrap fl">
                            <div class="news-head"><h3>${item.topic}</h3></div>
                            <p class="tags"><em class="tag tag-src">${item.source}</em></p></div>
                        <div class="img-wrap fr"><img data-lbimg="" class="lazy" src="${item.miniimg[0].src}">
                        </div>
                    </div>
                </a></section>`
                    } else if (length >= 3) {
                        html += `<section class="news-item news-item-s2"><a data-type="jiankang" href="${`${item.url.replace('http://', 'http://m')}?${`qid=${qid}&idx=${idx}`}`}">
                    <div class="news-wrap">
                        <div class="news-head"><h3>${item.topic}</h3></div>
                        <div class="img-wrap clearfix">
                            <div class="img fl"><img class="lazy" src="${item.miniimg[0].src}">
                            </div>
                            <div class="img fl"><img class="lazy" src="${item.miniimg[1].src}">
                            </div>
                            <div class="img fl"><img class="lazy" src="${item.miniimg[2].src}">
                            </div>
                        </div>
                        <p class="tags clearfix"><em class="tag tag-src">${item.source}</em></p></div>
                </a></section>`
                    }
                    // 广告位置
                    if ((i + 1) % 2 === 0 || i === 2) {
                        html += `<section id="ggModule${index}" class="news-item gg" style="border-bottom: 1px solid #f5f5f5;"><div id="${_newsGg_[index]}"></div></section>`
                        index++
                        pgnum++
                    }
                    idx++
                })
                return html
            }
        }
        loadXuanfuGg() {
            $body.append(`<div class="pack-red"> <iframe id ="iframeXuanfu" src="/xuanfu.html" style="width:100px;height:200px;" frameborder="0"></iframe> </div>`)
        }
        requestDspUrl(adnum, pgnum) {
            let readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl !== 'null') {
                readUrl = readUrl.join(',')
            }
            let data = {
                type: 'h5qiwen',
                qid: qid,
                uid: recgid, // 用户ID
                os: os,
                readhistory: readUrl,
                pgnum: pgnum,
                adnum: adnum,
                adtype: 236, //1是大图 2 小图 3 组图 6 全图 1 是500*250   6是400*100 的
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.browserType || 'null',
                pixel: pixel,
                fr_url: _util_.getReferrer() || 'null',	 // 首页是来源url(document.referer)
                site: 'sport'

            }
            return _util_.makeGet(HOST_DSP_LIST, data)
        }
        changeDspDataToObj(data) {
            let obj = {}
            data.data.forEach(function(item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        }
        loadDspHtml(dspData, posi, type) {
            let html = ''
            let item = dspData[posi]
            let scope = this
            switch (item.adStyle) {
                case 'big': //大
                    html += `<section class="news-item" style="${type === 'articleDown' ? 'border:0' : ''}">
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
    <div class="txt-wrap fl"><h3>${item.topic}</h3><p class="tags"><em class="tag tag-time"><i class="tag tag-gg">${item.isadv ? '广告' : '推广'}</i></em><em class="tag tag-src">${item.source}</em></p></div><div class="img-wrap fr"><img class="lazy" src="${item.miniimg[0].src}"></div></div>
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
        }
        reportDspInviewbackurl() {
            let cHeight = $(window).height()
            let offsetArr = []
            let eleArr = []
            $('a[inviewbackurl]').each(function(i, item) {
                if (cHeight > $(this).offset().top) {
                    $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                    $(this).removeAttr('inviewbackurl')
                }
            })
            $(window).scroll(function() {
                offsetArr = []
                eleArr = []
                $('a[inviewbackurl]').each(function(i, item) {
                    offsetArr.push($(this).offset().top)
                    eleArr.push($(this))
                })
                offsetArr.forEach((item, index) => {
                    if (cHeight + $(this).scrollTop() > item) {
                        if (eleArr[index].attr('inviewbackurl')) {
                            $body.append(`<img style="display: none" src="${eleArr[index].attr('inviewbackurl')}"/>`)
                            eleArr[index].removeAttr('inviewbackurl')
                        }
                    }
                })
            })
        }
    }
    new Page()
})
