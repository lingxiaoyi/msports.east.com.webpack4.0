import 'pages/detail_noad/style.scss'
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
    (function() {
        let {HOST, HOST_DSP_DETAIL, COMMENTREPLY} = config.API_URL //, QUERYIP
        let {DOMAIN} = config
        let domain = DOMAIN
        let version = '1.1.3' //内页版本号
        console.log(version)
        let os = _util_.getOsType()
        let recgid = _util_.getUid()
        let qid = _util_.getPageQid()
        //let uid = _util_.getUid()//访客uid
        qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
        let pixel = window.screen.width + '*' + window.screen.height
        let wsCache = new WebStorageCache()
        let $interestNews = $('#J_interest_news') // 猜你喜欢
        let $hotNews = $('#J_hot_news') // 热点新闻
        let $hnList = $('<div id="J_hn_list" class="hn-list"></div>') // 热点新闻列表
        let $loading = $('<div id="J_loading" class="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><p class="txt">数据加载中</p></div>')
        let $article = $('#J_article')
        let $body = $('body')
        let $baiduhao = $('#baiduhao')
        let $articleTag = $article.find('.article-tag')
        let indexType = _util_.getUrlParam('dataType')
        let indexName = _util_.getUrlParam('typeName')
        //let $imgs = $article.find('#content .img-wrap img')
        let $imgsA = $article.find('#content .img-wrap')
        let pullUpFinished = true
        let locationUrl = 'http://' + window.location.host + window.location.pathname //当前url
        let fromUrl = _util_.getUrlParam('from') || document.referrer//来源url
        //let iszhiding = _util_.getUrlParam('from') && _util_.getUrlParam('from').indexOf('top') >= 0 ? '1' : 'null'
        let idx = _util_.getUrlParam('idx') || 0
        let ishot = _util_.getUrlParam('ishot') || 'null'
        let recommendtype = _util_.getUrlParam('recommendtype') || 'null'
        let pgnum = _util_.getUrlParam('pgnum') || '1'
        let iszhiding = _util_.getUrlParam('from') && _util_.getUrlParam('from').indexOf('top') >= 0 ? '1' : 'null'
        let downloadUrl = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5wenxf`//顶部悬浮框 下载地址
        let downloadUrlpl = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5wenpl`//评论 下载地址
        function Detail(channel) {
            this.host = HOST
            this.channel = channel
            this.index = 3 //热点新闻中的广告起始下标为3
            this.startkey = 0
            this.typecode = _articleTagCodes_.split(',').join('|')
            /* global _articleTagCodes_:true*/
            this.isnotappqid = (this.channel !== 'dfspiosnull' && this.channel !== 'dfspadnull' && this.channel !== 'wxspadnull' && this.channel !== 'wxspiosnull' && this.channel !== 'dfspdftttypd')
            this.isnotappqid ? this.idx = 1 : this.idx = -2 //渠道不在app里为true
            //this.idx = 1 //热点新闻中的位置下标
            this.pgnum = 1
            //this.isWeiXin = _util_.isWeiXin()
            this.dspData = ''
            this.dspDataIndex = 0
            this.urlNum = 0
            this.baiduhao = $baiduhao.length > 0 && (this.channel === 'null' || this.channel === 'baiducom')
            this.adIsCheats = (qid === 'tiyutt' || qid === 'tiyumshd' || qid === 'tiyuxqqkj' || qid === 'qid02463' || qid === 'tiyudh' || qid === 'tiyutytt' || qid === 'qid02625' || false) //作弊广告渠道
        }

        Detail.prototype = {
            init: function() {
                this.setHistoryUrl()
                $article.css({'max-height': '100%'})
                // this.showHotNews()
                // if (this.isnotappqid) {
                //     this.onScrollLoadNews()
                // }
                //注册展开
                // this.unfoldArticle()
            }, //图片预加载和下拉加载新闻
            onScrollLoadNews: function() {
                let scope = this
                let clientHeight = $(window).height()
                //回到顶部 返回首页
                /*$body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?${`qid=${qid}&from=homepage`}${indexType ? `&class=${indexType}` : ''}"></a></div> </div>`)*/
                // $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="/html/index.html?${`qid=${qid}&from=homepage`}${indexType ? `&class=${indexType}` : ''}"></a></div> </div>`)
                let $goTop = $('#goTop')
                $goTop.on('click', function() {
                    $('html,body').scrollTop(0)
                })
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
                    let bodyHeight = $('body').height() - 200
                    // 上拉加载数据(pullUpFlag标志 防止操作过快多次加载)
                    if (scope.startkey === 0 && scope.isnotappqid) {
                        if (scrollTop >= 0 && pullUpFinished && !scope.isShieldAd) {
                            pullUpFinished = false
                            scope.getData(scope.startkey)
                        }
                    } else {
                        //console.log(pullUpFinished)
                        if (scrollTop + clientHeight >= bodyHeight && pullUpFinished && !scope.isShieldAd) {
                            //console.log(222222222)
                            pullUpFinished = false
                            scope.getData(scope.startkey)
                        }
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
                    //以下渠道广告不悬浮
                    if (scope.channel === 'tiyuweimillq') return
                    let $backHomepage = $('.article-tag')
                    if (scrollTop + $(this).height() >= ($backHomepage.offset().top + 35)) {
                        if (scope.ggEle) {
                            scope.ggEle.css({
                                'position': 'static'
                            })
                        }
                    } else {
                        if (scope.ggEle) {
                            scope.ggEle.css({
                                'position': 'fixed',
                                'bottom': 0
                            })
                        }
                    }
                })
            },
            setHistoryUrl: function() {
                let url = window.location.href
                let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
                let historyUrlArr = wsCache.get('historyUrlArr')
                this.urlNum = urlNum
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
            showHotNews: function(data) {
                let scope = this
                // 红包广告 百度号和渠道不要加  红包cookie保存24小时
                /*if (!scope.baiduhao && (this.channel === 'null' || this.channel === 'baiducom') && !_util_.CookieUtil.get('hideRedPack')) {
                    $body.append(`<div class="pack-red"> <a href="javascript:;" class="icon-pack" id="icon-pack" data-advid="dftth5_red_icon05" data-advurl=""></a><span>广告</span> </div>`)
                }
                $('#icon-pack').click(function() {
                    $('.pack-red').remove()
                    window.location.href = config.ggUrl.TBURL
                    _util_.CookieUtil.set('hideRedPack', true)
                })*/
                //判断加载淘口令
                //scope.loadTkl()
                //原创加标签
                /* global _isdongfanghao_:true _newstype_:true*/
                let ad
                if (scope.channel === 'tiyutytt') {
                    ad = _AD_.sgGg[qid].detail
                }
                if (typeof _isdongfanghao_ !== 'undefined' && _isdongfanghao_ === '1') {
                    $articleTag.before('<div class="copyright">特别声明：本文为自媒体作者上传并发布，仅代表该作者观点。东方体育仅提供信息发布平台。</div>')
                }
                //标题上方广告;  baiducom tiyubdtyald tiyutt baiducom baiduhao标题上方广告不显示
                // if (scope.channel !== 'tiyubdtyald' && !scope.baiduhao && !scope.adIsCheats && scope.isnotappqid/* && scope.channel !== 'baiducom'*/) {
                //     let timestamp = Date.parse(new Date())
                //     let newtimestamp = Date.parse(new Date('2018/04/30 00:00'))
                //     if (newtimestamp - timestamp > 0) {
                //         $article.before(`<section class="gg-item" style="padding:0 0.12rem;"><iframe style="background:#fff;" src="/adbd.html?sogou_ad_id=5594160" frameborder="0" scrolling="no" width="100%" height="0" id="iframeZhike2"></iframe><div class="line"></div></section>`)
                //     } else {
                //         scope.requestDspUrl(1, -3).done(function(data) {
                //         let dspData = data.data
                //         if (dspData.length && dspData[0]) {
                //             $article.before(scope.loadDspHtml(dspData, 0, 'articleDown'))
                //             scope.reportDspInviewbackurl()
                //         } else {
                //             if (scope.channel === 'tiyutytt') {
                //                 $article.before(`<iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                //             } else {
                //                 $article.before('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[0] + '"></div><div class="line"></div></section>')
                //                 _util_.getScript('//df888.eastday.com/' + _detailsGg_[0] + '.js', function() {}, $('#' + _detailsGg_[0])[0])
                //             }
                //         }
                //     }).fail(function() {
                //         if (scope.channel === 'tiyutytt') {
                //             $article.before(`<iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                //         } else {
                //             $article.before('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[0] + '"></div><div class="line"></div></section>')
                //             _util_.getScript('//df888.eastday.com/' + _detailsGg_[0] + '.js', function() {}, $('#' + _detailsGg_[0])[0])
                //         }
                //     })
                //     }
                // }
                /*baijiahao 和默认的区别在这里 start*/
                //百家号baiducom null渠道隐藏
                if (!scope.baiduhao) {
                    $baiduhao.hide()
                }
                //文章下方加展开全文 百度号baiducom null文章要全部展开 其他展开余文
                // if ($article.height() >= 900) {
                //     if (scope.baiduhao) {
                //         $article.css({
                //             'maxHeight': '100%'
                //         })
                //         $article.after('<div class="unfold-field"  id="unfoldField"></div>')
                //     } else {
                //         /*if (this.channel === 'null') {
                //             $article.after('<div class="unfold-field"  id="unfoldField"><div class="unflod-field__mask"></div><a href="javascript:void(0)" class="unfold-field__text">展开全文【抢天猫红包】</a></div>')
                //         } else {}*/
                //         $article.after('<div class="unfold-field"  id="unfoldField"><div class="unflod-field__mask"></div><a href="javascript:void(0)" class="unfold-field__text">展开全文</a></div>')
                //     }
                // } else {
                //     $article.after('<div class="unfold-field"  id="unfoldField"></div>') //加这个元素是为了在文章后方加广告
                // }
                if (qid === '000000') return
                //文章下方广告; tiyutt 百度号baiducom null此广告不显示
                // if (scope.adIsCheats || scope.baiduhao || qid === 'qid02556') {} else {
                //     scope.requestDspUrl(1, -1).done(function(data) {
                //         let $unfoldField = $('#unfoldField')
                //         let dspData = data.data
                //         if (dspData.length && dspData[0]) {
                //             $unfoldField.after(scope.loadDspHtml(dspData, 0, 'articleDown'))
                //             scope.reportDspInviewbackurl()
                //         } else {
                //             if (scope.channel === 'baiducom') {
                //                 $unfoldField.after('<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=849191&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="78"></iframe></section>')//sougou
                //             } else if (scope.channel === 'null') {
                //                 //sougou
                //                 $unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="//msports.eastday.com/ad.html?sogou_ad_id=922048&sogou_ad_height=80" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`)
                //                 /*$unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><img style="width:100%;height:1.1rem;" src="https://msports.eastday.com/h5/img/ad/545C7A0B-6A2F-4e21-A6ED-CBA3C8EA3B8B.png" alt=""></section>`)*/
                //             } else if (scope.channel === 'tiyutytt') {
                //                 $unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`)//sougou
                //             } else {
                //                 $unfoldField.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                //                 _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])//baidu
                //             }
                //         }
                //     }).fail(function() {
                //         let $unfoldField = $('#unfoldField')
                //         if (scope.channel === 'baiducom') {
                //             $unfoldField.after('<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=849191&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="78"></iframe></section>')//sougou
                //         } else if (scope.channel === 'null') {
                //             $unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="//msports.eastday.com/ad.html?sogou_ad_id=922048&sogou_ad_height=80" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`)//sougou
                //         } else if (scope.channel === 'tiyutytt') {
                //             $unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`)//sougou
                //         } else {
                //             $unfoldField.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                //             _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])//baidu
                //         }
                //     })
                //     //直客广告
                //     /*let $unfoldField = $('#unfoldField')
                //     if (scope.isnotappqid) {
                //         $unfoldField.after('<section class="gg-item" style="" id="fm_ad_02"><iframe src="/adbd.html?sogou_ad_id=5561919" frameborder="0" scrolling="no" height="120" width="100%" id="iframeZhike"></iframe></section>')
                //     } else {
                //         $unfoldField.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                //         _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])//baidu
                //     }*/
                // }
                //猜你喜欢广告; tiyubdtyald tiyutt 百度号 baiducom null 此广告不显示
                // if (scope.channel !== 'tiyubdtyald' && !scope.baiduhao && !scope.adIsCheats) {
                //     /* else if (scope.channel === 'baiducom') {
                //        $interestNews.html(`<div class="section-title in-title"><h2>猜你喜欢</h2></div><section style="padding:0.15rem 0.24rem 0.15rem"><iframe style="background:#fff;height:4.7rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=922049&sogou_ad_height=12" frameborder="0" scrolling="no" width="100%"></iframe></section><div class="separate-line"></div>`)
                //    }*/
                //     if (scope.channel === 'tiyutytt') {
                //         $interestNews.html(`<iframe style="background:#fff;padding:0.1rem 0.24rem 0;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe><iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                //     } else {
                //         $interestNews.html('<div class="section-title in-title"><h2><span></span>猜你喜欢<span class="line"></span></h2></div><section><div id="' + _detailsGg_[2] + '"></div></section>')
                //         _util_.getScript('//df888.eastday.com/' + _detailsGg_[2] + '.js', function() {}, $('#' + _detailsGg_[2])[0])
                //     }
                // }
                /*baijiahao 和默认的区别在这里 end*/
                //文章图片加下载app链接
                if (qid !== 'baiducom' && !scope.baiduhao && qid !== 'qid02556' && scope.isnotappqid) {
                    $imgsA.attr('href', `${downloadUrl}`)
                }
                //相关阅读部分;tiyubdtyald 相关阅读
                if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    $hotNews.append('<div class="section-title hn-title"><h2><span></span>相关阅读<span class="line"></span></h2></div>')
                    $hotNews.append(`<div id="J_xg_list" class="hn-list"></div><div class="separate-line"></div>`)
                }
                //加载评论
                if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    $hotNews.append(`<div id="hotComment" class="comment-list"><ul></ul></div>`)
                    scope.loadComment()
                }
                //热点推荐部分;tiyubdtyald 不显示热点推荐 下方3图广告和2个文字链
                if (scope.channel !== 'tiyubdtyald') {
                    // if (scope.channel !== 'tiyubdtyald' && !scope.baiduhao && !scope.adIsCheats && qid !== 'qid02556' && scope.isnotappqid) {
                    //     //猜你喜欢下方3图广告和2个文字链广告
                    //     if (this.channel === 'tiyuvivobrowser01') { //
                    //         detailGGAddThree[this.channel].reverse().forEach(function(item) {
                    //             $hotNews.append(`<section class="gg-item"  style="padding:0 0;"><div id="${item}"></div></section>`)
                    //             _util_.getScript(`//df888.eastday.com/${item}.js`, function() {}, $(`#${item}`)[0])
                    //         })
                    //     } else {
                    //         detailGGAddThree['null'].reverse().forEach(function(item) {
                    //             $hotNews.append(`<section class="gg-item"  style="padding:0  0;"><div id="${item}"></div></section>`)
                    //             _util_.getScript(`//df888.eastday.com/${item}.js`, function() {}, $(`#${item}`)[0])
                    //         })
                    //     }
                    // }
                    //$hotNews.append('<div class="separate-line"></div>')
                    $hotNews.append('<div class="section-title hn-title"><h2><span></span>热点新闻<span class="line"></span></h2></div>')
                    $hotNews.append($hnList)
                    $hotNews.append($loading)
                }
                //返回首页 tiyubdtyald 不显示点击查看更多精彩
                if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    $interestNews.parent().before(`<a href="${config.HOME_URL}?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews${indexType ? `&class=${indexType}` : ''}`}" class="back-homepage"><i></i>${indexType || indexName ? `进入${indexName}频道查看更多文章` : '点击查看更多精彩'}  >></a>`)
                    // $interestNews.parent().before(`<a href="/html/index.html?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews${indexType ? `&class=${indexType}` : ''}`}" class="back-homepage"><i></i>${indexType || indexName ? `进入${indexName}频道查看更多文章` : '点击查看更多精彩'}  >></a>`)
                    $interestNews.parent().before('<div class="separate-line"></div>')
                } else {
                    //$interestNews.parent().before(`<a href="${downloadUrl}" class="back-homepage"><i></i>前往APP查看更多相关新闻</a>`)
                }
                //app中隐掉文章中tag
                if (!scope.isnotappqid) {
                    $articleTag.hide()
                }
                //加载相关阅读 推荐阅读 评论
                if (!scope.isnotappqid) {
                    scope.getData(0)
                }
                //加载悬浮广告
                /*let timestamp = Date.parse(new Date())
                let newtimestamp = Date.parse(new Date('2018/04/18 00:00'))
                if (newtimestamp - timestamp > 0) {
                    if (scope.channel !== 'baiducom' && scope.isnotappqid) {
                        scope.loadXuanfuGg()
                    }
                }*/
                //去掉描文本
                if (!scope.isnotappqid) {
                    $article.find('a').attr('src', '').css('color', '#333')
                }
            },
            loadTkl: function() {
                /*_util_.getScript('//pv.sohu.com/cityjson?ie=utf-8', function() {
                    /!*global returnCitySN:true*!/
                    let data = {
                        vuid: returnCitySN.cip + '',
                        qid: qid, // 渠道号
                        uid: uid,
                        softname: 'DFTYH5',
                        softid: 'dongfangtiyu',
                        softver: 'null'
                    }
                     _util_.makeJsonpcallback(QUERYIP, data).done(function(res) {
                         // 复制功能淘口令 有兼容性问题 不支持某些原生浏览器
                         if (!res.cpid && !res.alid && returnCitySN.cname !== '浙江省杭州市') {
                         }
                     })
                })*/
                try {
                    _util_.getScript(`//09img.shaqm.com/h5/partner/zfbc_w.min.js?qid=${qid}&uid=${recgid}&site=ty`, function() {
                        /*let body = document.getElementsByTagName('body')[0]
                        //let copyDom = document.getElementById('copy-alert')
                        /!* global Clipboard:true*!/
                        let clipboard = new Clipboard(body, {
                            target: function(trigger) {
                                return body
                            },
                            text: function(trigger) {
                                return config.ggUrl.TKL
                            },
                            container: body
                        })
                        clipboard.on('success', function(e) {
                            console.log('success', e)
                            $('#copy-alert').css('display', 'none')
                        })*/
                    })
                    /* if (_util_.getOsType().indexOf('iOS') > -1) {
                     } else {
                         _util_.getScript('//mini.eastday.com/toutiaoh5/js/clipboard-touch.min.js', function() {
                             let body = document.getElementsByTagName('body')[0]
                             let copyDom = document.getElementById('copy-alert')
                             let clipboard = new Clipboard(copyDom, {
                                 target: function(trigger) {
                                     return copyDom
                                 },
                                 text: function(trigger) {
                                     return config.ggUrl.TKL
                                 },
                                 container: body
                             })
                             clipboard.on('success', function(e) {
                                 console.log('success', e)
                                 $('#copy-alert').css('display', 'none')
                             })
                         })
                     }*/
                } catch (e) { console.error(e) }
            },
            loadXuanfuGg: function() {
                $body.append(`<div class="pack-red"> <iframe id ="iframeXuanfu" src="/xuanfu.html" style="width:100px;height:200px;" frameborder="0"></iframe> </div>`)
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
                    $loading.hide()
                    if (!result.data.length) {
                        $('#noMore').remove()
                        $body.append('<section id="noMore" class="clearfix">无更多数据了</section>')
                        return
                    } //如果startkey没变化就结束
                    scope.startkey = result.endkey
                    scope.requestDspUrl(3, 1).done(function(data) {
                        scope.dspDataIndex = 0
                        scope.dspData = data.data
                        scope.productHtml(result, start)
                        scope.pgnum++
                    }).fail(function() {
                        scope.productHtml(result, start)
                        scope.pgnum++
                    })
                    pullUpFinished = true
                }).done(function() {
                    /*if (!scope.adIsCheats) {
                        scope.requestDspUrl(3, 1).done(function(data) {
                            let dspData = scope.changeDspDataToObj(data)
                            for (let i = 2; i >= 0; i--) {
                                if (data.data.length && dspData[i]) {
                                    $(`#ggModule${scope.index - 4 - 2 + i}`).html(scope.loadDspHtml(dspData, i, ''))
                                } else {
                                    let ggid = $(`#ggModule${scope.index - 4 - 2 + i}`).children().children().attr('id')
                                    if (start === 0 && qid === 'tiyutytt') {
                                        let ad = _AD_.sgGg[qid].detail
                                        $('#' + ggid).append(`<iframe style="background:#fff;" src="http://msports.eastday.com/sg_ad_list.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="98"></iframe>`)
                                    } else {
                                        _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {
                                        }, $('#' + ggid)[0])
                                    }
                                }
                            }
                            scope.reportDspInviewbackurl()
                        })
                    }*/
                }).done(function(result) {
                    function produceHtml(result) {
                        let data = result.data
                        let html = ''
                        html += `<div class="swiper-slide">
			                                    <a class="J-topappdownload" href="${downloadUrl}"><div class="top"><div class="topContent"><div class="tC-left"><img class="tC-left-img" src="${config.DIRS.BUILD_FILE.images['i-logo']}" alt=""><div class="tC-right-div"><p class="p1">东方体育</p><p class="p2">专业的体育资讯及直播平台</p></div></div><span class="tC-right-a">打开</span></div></div></a>
			                                    <span class="J-topappdownload-close tC-right-span"></span>
		                                 </div>`
                        data.forEach(function(item, i) {
                            if (i < 3) {
                                html += `<div class="swiper-slide"><a class="J-topappdownload" href="${downloadUrl}"><div class="top"><div class="topContent"><div class="tC-left"><img class="tC-left-img tC-img" src="${item.miniimg[0].src}" alt=""><div class="title-wrap"><p class="pp">${item.topic}</p></div></div><span class="tC-right-a">打开</span></div></div></a> <span class="J-topappdownload-close tC-right-span"></span> </div>`
                            }
                        })
                        return html
                    }
                    //加顶部轮播诱导
                    // if (!_util_.CookieUtil.get('hasDownloadBox') && !scope.baiduhao && start === 0 && qid === 'null') {
                    //     _util_.getScript('//msports.eastday.com/h5/js/lib/swiper.min.js', function() {
                    //         let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container appdownload-swiper"><div id="sorter" class="swiper-pagination"></div></div>')
                    //         $el.prepend(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)
                    //         $body.prepend($el)
                    //         $body.prepend('<div id="J_topappdownload_empty" class="topapp-empty"></div>')
                    //         /* global Swiper:true*/ //激活轮播图
                    //         new Swiper('#swiperContainer', {
                    //             loop: true,
                    //             centeredSlides: true,
                    //             autoplay: 4000,
                    //             autoplayDisableOnInteraction: false,
                    //             pagination: '.swiper-pagination'
                    //         })
                    //     }, '')
                    //     /*require.ensure([], function(require) {
                    //         let Swiper = require('swiper')
                    //         let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container appdownload-swiper"><div id="sorter" class="swiper-pagination"></div></div>')
                    //         $el.prepend(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)
                    //         $body.prepend($el)
                    //         $body.prepend('<div id="J_topappdownload_empty" class="topapp-empty"></div>')
                    //         //激活轮播图
                    //         new Swiper('#swiperContainer', {
                    //             loop: true,
                    //             centeredSlides: true,
                    //             autoplay: 4000,
                    //             autoplayDisableOnInteraction: false,
                    //             pagination: '.swiper-pagination'
                    //         })
                    //     })*/

                    //     $body.on('click', '.J-topappdownload-close', function() {
                    //         let $swiperContainer = $('#swiperContainer')
                    //         $swiperContainer.prev().remove()
                    //         $swiperContainer.remove()
                    //         _util_.CookieUtil.set('hasDownloadBox', 1, 1)//保存一小时
                    //     })
                    // }
                })
            },
            productHtml: function(result, start) {
                let $J_hn_list = $('#J_hn_list')
                let $J_xg_list = $('#J_xg_list')
                let data = result.data
                let html = ''
                let scope = this
                data.forEach(function(item, i) {
                    let ggid = _detailsGg_[scope.index]
                    let length = item.miniimg.length
                    let url = ''
                    let tagHtml = ``
                    /*if (!scope.baiduhao && qid !== 'baiducom' && i < 3 && start === 0) {
                        url = downloadUrl
                        tagHtml = '<em class="tag tag-app tag-toapp">打开app</em>'
                    } else {}*/
                    url = `${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}&pgnum=${scope.pgnum}`}`
                    tagHtml = `<em class="tag tag-src">${item.source}</em>`
                    if (!length) {
                        return
                    }
                    if (length >= 3) {
                        html = `<section class="news-item news-item-s2">
                                    <a class="news-link" href="${url}" suffix="">
                                        <div class="news-wrap">
                                            <h3>${item.topic}</h3>
                                            <div class="img-wrap clearfix">
                                                <div class="img fl img-bg"><img class="lazy" src="${item.miniimg[0].src}"></div>
                                                <div class="img fl img-bg"><img class="lazy" src="${item.miniimg[1].src}"></div>
                                                <div class="img fl img-bg"><img class="lazy" src="${item.miniimg[2].src}"></div>
                                            </div>
                                            <p class="tags clearfix">
                                                ${tagHtml}
                                            </p>
                                        </div>
                                    </a>
                                    </section>`
                    } else {
                        html = `<section class="news-item news-img1">
									<a class="news-link" href="${url}" suffix="">
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
                    //广告
                    if (start === 0 && i < 3) {
                        if (scope.isnotappqid) {
                            $J_xg_list.append(html)
                        } else {
                            //$interestNews.find('.section-title').after(html)
                        }
                        if ((i === 0 || i === 2) && !scope.adIsCheats) {
                            if (qid === 'qid02556') {
                                scope.index++
                            } else {
                                // $J_xg_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"  data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                // _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {}, $(`${ggid}`)[0])
                                scope.index++
                            }
                        }
                    } else if (start === 0 && i >= 3) {
                        if (scope.isnotappqid) {
                            $J_hn_list.append(html)
                            if ((i === 4 || i === 6 || i === 9 || i === 8 || i === 11 || i === 12) && !scope.adIsCheats) {
                                if (qid === 'qid02556' && i !== 4) {
                                    return
                                }
                                // if (scope.dspData[scope.dspDataIndex]) {
                                //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                //     $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                //     scope.dspDataIndex++
                                //     scope.index++
                                //     scope.reportDspInviewbackurl()
                                // } else {
                                //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                //     _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {}, $(`${ggid}`)[0])
                                //     scope.index++
                                // }
                            }
                        } else {
                            if (i >= 8) return
                            if (i === 3 || i === 5 || i === 7) {
                                // if (scope.dspData[scope.dspDataIndex]) {
                                //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                //     $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                //     scope.dspDataIndex++
                                //     scope.index++
                                //     scope.reportDspInviewbackurl()
                                // } else {
                                //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                //     _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {}, $(`${ggid}`)[0])
                                //     scope.index++
                                // }
                            } else if (i === 6) {
                                scope.index++
                            }
                            $J_hn_list.append(html)
                        }
                    } else {
                        $J_hn_list.append(html)
                        if ((i === 1 || i === 3 || i === 6 || i === 9) && !scope.adIsCheats && qid !== 'qid02556') {
                            // if (scope.dspData[scope.dspDataIndex]) {
                            //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                            //     $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                            //     scope.dspDataIndex++
                            //     scope.reportDspInviewbackurl()
                            //     scope.index++
                            // } else {
                            //     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                            //     _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {}, $(`${ggid}`)[0])
                            //     scope.index++
                            // }
                        }
                    }
                    scope.idx++
                })
            },
            loadComment: function() {
                let $hotComment = $('#hotComment')
                let $hotCommentUl = $hotComment.children('ul')
                let url = window.location.href
                let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
                //let urlNum =180107155853154000000
                let data = {
                    softtype: 'dongfangtiyu',
                    softname: 'DFTYH5',
                    ime: 'null',
                    appqid: qid,
                    apptypeid: recgid,
                    ver: 'null',
                    os: os,
                    ttaccid: 'null',
                    sdkver: 'null',
                    appver: 'null',
                    device: 'null',
                    deviceid: 'null',
                    position: 'null',
                    network: 'null',
                    newstype: _newstype_,
                    from: fromUrl,
                    to: locationUrl,
                    pgnum: pgnum,
                    idx: idx,
                    ishot: ishot,
                    recommendtype: recommendtype,
                    recommendurl: 'null',
                    ispush: 'null',
                    suptop: iszhiding,
                    aid: urlNum,
                    rowkey: urlNum,
                    userid: '',
                    username: '',
                    userpic: '',
                    hotnum: '',
                    commtype: 0, //0：全部类型热评  1：对文章热评   2：对人热评
                    depth: '',
                    revnum: '',
                    endkey: 0,
                    limitnum: 2,
                }
                _util_.makeJsonp(`${COMMENTREPLY}${urlNum}/commentreply` + '', data).done(function(result) {
                    let data = result.data
                    if (data.length) {
                        $hotComment.before(`<div class="section-title hn-title"><h2><span></span>热门评论<span class="line"></span></h2></div>`)
                        data.forEach(function(item) {
                            $hotCommentUl.append(`<li class="clearfix">
                    <div class="head">
                        <img src="${item.userpic}" alt="">
                    </div>
                    <div class="info">
                        <div class="row clearfix">
                            <div class="l">
                                <div class="name">${item.username}</div>
                                <div class="time">${_util_.getSpecialTimeStr(item.cts)}</div>
                            </div>
                            <div class="r commentZan">
                                <i></i><span>${item.ding}</span>
                            </div>
                        </div>
                        <p class="comment-content-maxheight">${item.content}</p>
                        ${item.content.length > 40 ? '<a class="J_expand" href="javascript:;">展开</a>' : ''}
                    </div>
                </li>`)
                        })
                        $hotComment.append(`<a href="${downloadUrlpl}" class="back-homepage f33">打开App查看全部热门评论</a>`)
                    }
                })
                $hotComment.on('click', '.commentZan', function() {
                    let num = $(this).children('span').text() / 1
                    if (!$(this).children('i').hasClass('active')) {
                        $(this).children('span').text(++num)
                        $(this).children('i').addClass('active')
                    }
                })
                $hotComment.on('click', '.J_expand', function() {
                    $(this).prev().removeClass('comment-content-maxheight')
                    $(this).remove()
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
                return _util_.makeGet(HOST_DSP_DETAIL, data)
            },
            loadDspHtml: function(dspData, posi, type) {
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
            }, //展开文章
            unfoldArticle() {
                let scope = this
                $body.on('click', '.unfold-field', function() {
                    $article.css({'max-height': '100%'})
                    $(this).hide()
                    let $gg = $(this).next()
                    scope.ggEle = $gg
                    console.log(scope.channel)
                    if (scope.isnotappqid && scope.channel !== 'tiyuweimillq') {
                        $gg/*.children()*/.css({
                            'position': 'fixed',
                            'bottom': 0
                        })
                    }
                    /*if (scope.channel === 'null') {
                        $body.append(`<div id="copy-alert"><div class="copy-cancel"></div><div class="copy-btn"></div></div>`)
                        scope.loadTkl()
                        /!*$('.copy-cancel').click(function(e) {
                            e.stopPropagation()
                            $('#copy-alert').css('background', 'none')
                        })*!/
                    }*/
                })
                /*$body.on('click', '#copy-alert .copy-cancel', function(e) {
                    $('#copy-alert').css('background', 'none')
                })
                $body.on('click', '#copy-alert', function(e) {
                    e.stopPropagation()
                    $('#copy-alert').css('opacity', '0')
                })*/
            }
        }
        let en = new Detail(qid)

        let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
        let _detailsNewGg_ = _AD_.detailNewAd
        _detailsGg_.splice(3, 0, _detailsNewGg_[0], _detailsNewGg_[1])
        if (en.isnotappqid) {
            _detailsGg_.splice(6, 1, 'ezrofhobo')
        }
        _detailsGg_.splice(7, 0, _detailsNewGg_[2])
        _detailsGg_.splice(9, 0, _detailsNewGg_[3], _detailsNewGg_[4])
        //console.log(_detailsGg_)
        let detailGGAddThree = _AD_.detailGGAddThree
        if (qid === 'tiyutt') {
            _detailsGg_ = {}
        }
        en.init()
    })();
    (function shareWebPage() {
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
    })();
    (function() {
        let qid = _util_.getPageQid()
        // 操作系统
        /*let GLOBAL = {
            Os: (function() {
                var u = navigator.userAgent
                var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
                var mobile = false
                for (var v = 0; v < Agents.length; v++) {
                    if (u.indexOf(Agents[v]) > -1) {
                        mobile = true
                        break
                    }
                }
                return {
                    //移动终端浏览器版本信息
                    mobile: mobile, //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iphone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    ipad: u.indexOf('iPad') > -1, //是否iPad
                    webapp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
                }
            })()
        }*/
        /*function Browser() {
            let ua = navigator.userAgent //获取判断用的对象
            let mobile = GLOBAL.Os.mobile
            if (mobile) { //mobile
                //移动终端浏览器版本信息
                return {
                    wechat: ua.indexOf('MicroMessenger') > -1, // 在微信中打开
                    weibo: ua.toLowerCase().indexOf('weibo') > -1, // 在新浪微博客户端打开
                    qq: ua.indexOf('QQ/') > -1, // 在QQ、QQ空间中打开
                    qqbrowser: ua.indexOf('MQQBrowser') > -1 // 在QQ空间打开
                }
            }
            return {}
        }*/
        // IOS9及以上系统版本
       /* var isGtIOS9 = !Boolean(navigator.userAgent.match(/OS [1-8]_\d[_\d]* like Mac OS X/i)) // eslint-disable-line
        // 微信中打开新闻内页，返回时跳到首页。 || (qid === 'baiducom')
        if (isGtIOS9 && qid !== 'dfspiosnull' && qid !== 'dfspadnull' && qid !== 'wxspadnull' && qid !== 'wxspiosnull' && qid !== 'dfspdftttypd') {
            var bool = false
            window.history.pushState({}, document.title, '#pushstate')
            window.addEventListener('popstate', function() {
                // 防止微信中一进入就触发"popstate"事件
                if (bool) {
                    //var redirectId = 'wechat_detail_backto_index' // 禁止修改（日志唯一ID记录）
                    // var redirectUrl = 'index.html?qid=test';
                    // var redirectUrl = 'http://testing.eastday.com/toutiao_h5_test/toutiaoh5/src/index.html?qid=test';
                    var redirectUrl = '//msports.eastday.com/24hour.html'
                    window.location.href = redirectUrl
                    /!*log.appLinkClickLog({
                        advUrl: redirectUrl,
                        advId: redirectId,
                        callback: function() {
                            Cookies.set('DFTT_DETAIL_TO_INDEX', true, {
                                expires: 1 / 24,
                                path: '/',
                                domain: 'eastday.com'
                            })

                        }
                    })*!/
                }
            }, false)
            // 设置延时是为了解决：在微信中进入页面就触发了popstate事件
            setTimeout(function() {
                bool = true
            }, 2000)
        }*/
    }())
})
