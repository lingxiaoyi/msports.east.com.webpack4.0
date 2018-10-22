import 'pages/detail/style.scss'
import './log.news.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
/*import JS_APP from '../libs/JC.JS_APP.js'
import hcCommon from '../../public-resource/libs/hc.common'
import signCode from '../../public-resource/libs/sign.code'*/

window.myconsole = function (text) {
    $('body').append(`<div id="infoBox">${text}</div>`)
}
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let qid = _util_.getPageQid();
    (function () {
        let {
            HOST,
            HOST_DSP_DETAIL,
            COMMENTREPLY
        } = config.API_URL //, QUERYIP
        let {
            ROOT_URL_HC
        } = config
        let {
            DOMAIN
        } = config
        let domain = DOMAIN
        let version = '1.2.1' //内页版本号
        console.log(version)
        let os = _util_.getOsType()
        let browserType = _util_.browserType()
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
        let $unfoldField = $('#unfoldField')
        let $articleTag = $article.find('.article-tag')
        let indexType = _util_.getUrlParam('dataType')
        let indexName = _util_.getUrlParam('typeName')
        let $newsCheck = $('#news_check')
        //let $imgs = $article.find('#content .img-wrap img')
        let $imgsA = $article.find('#content .img-wrap')
        let pullUpFinished = true
        let locationUrl = 'http://' + window.location.host + window.location.pathname //当前url
        let fromUrl = _util_.getUrlParam('from') || document.referrer //来源url
        //let iszhiding = _util_.getUrlParam('from') && _util_.getUrlParam('from').indexOf('top') >= 0 ? '1' : 'null'
        let idx = _util_.getUrlParam('idx') || 0
        let ishot = _util_.getUrlParam('ishot') || 'null'
        let recommendtype = _util_.getUrlParam('recommendtype') || 'null'
        let soft_type = _util_.getUrlParam('softtype') || 'dongfangtiyu'
        let soft_name = _util_.getUrlParam('softname') || 'DFTYH5'
        let pgnum = _util_.getUrlParam('pgnum') || '1'
        let iszhiding = _util_.getUrlParam('from') && _util_.getUrlParam('from').indexOf('top') >= 0 ? '1' : 'null'
        let downloadUrl = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5dftiyu` //顶部悬浮框 下载地址
        let downloadUrlpl = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5dftiyu` //评论 下载地址
        let apiPosition = `//position.dftoutiao.com/position/get`
        //let advshow = `//wapactlog.dftoutiao.com/getwapdata/advshow`
        //let partner = `//wapactlog.dftoutiao.com/getwapdata/partner`

        function getPosition() { //接口返回名字不带市
            return _util_.makeJsonpcallback(apiPosition, {})
        }

        function Detail(channel) {
            this.host = HOST
            this.channel = channel
            this.index = 3 //热点新闻中的广告起始下标为3
            this.startkey = 0
            this.typecode = _articleTagCodes_.split(',').join('|')
            /* global _articleTagCodes_:true*/
            this.isnotappqid = (this.channel !== 'dfspiosnull' && this.channel !== 'dfspadnull' && this.channel !== 'wxspadnull' && this.channel !== 'wxspiosnull' && this.channel !== 'dfspdftttypd' && this.channel !== 'qid10601' && this.channel !== 'qid10459' && this.channel !== 'baiducom')
            this.isnotappqid ? this.idx = 1 : this.idx = -2 //渠道不在app里为true
            //this.idx = 1 //热点新闻中的位置下标
            this.pgnum = 1
            //this.isWeiXin = _util_.isWeiXin()
            this.dspData = ''
            this.dspDataIndex = 0
            this.urlNum = 0
            this.baiduhao = $baiduhao.length > 0 && (this.channel === 'null' || this.channel === 'baiducom')
            this.adIsCheats = (qid === 'tiyutt' || qid === 'tiyumshd' || qid === 'tiyuxqqkj' || qid === 'qid02463' || qid === 'tiyudh' || qid === 'tiyutytt' || qid === 'qid02625' || false) //作弊广告渠道
            this.worldcupNewAdIndex = 8
        }

        Detail.prototype = {
            init: function () {
                this.setHistoryUrl()
                this.showHotNews()
                if (this.isnotappqid) {
                    this.onScrollLoadNews()
                }
                //注册展开
                this.unfoldArticle()
                this.loadLazyImg()
                // this.loadgifActivity()
            }, //图片预加载和下拉加载新闻
            onScrollLoadNews: function () {
                let scope = this
                let clientHeight = $(window).height()
                //回到顶部 返回首页
                /*$body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?${`qid=${qid}&from=homepage`}${indexType ? `&class=${indexType}` : ''}"></a></div> </div>`)*/
                // $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="/html/index.html?${`qid=${qid}&from=homepage`}${indexType ? `&class=${indexType}` : ''}"></a></div> </div>`)
                let $goTop = $('#goTop')
                $goTop.on('click', function () {
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
                $(window).on('scroll', function () {
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
                    if (scope.channel === 'tiyuweimillq' || scope.channel === 'qid10603' || scope.channel === 'baiducom') return
                    //console.log(scope.channel)
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
            setHistoryUrl: function () {
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
                wsCache.set('historyUrlArr', historyUrlArr, {
                    exp: 10 * 60
                })
            },
            showHotNews: function (data) {
                let scope = this
                // 红包广告 百度号和渠道不要加  红包cookie保存24小时
                /* if (!scope.baiduhao && (this.channel === 'null' || this.channel === 'baiducom') && !_util_.CookieUtil.get('hideRedPack')) {
                     $body.append(`<div class="pack-red"> <a href="javascript:;" class="icon-pack" id="icon-pack" data-advid="dftth5_red_icon05" data-advurl=""></a><span>广告</span> </div>`)
                 }
                 $('#icon-pack').click(function() {
                     $('.pack-red').remove()
                     window.location.href = config.ggUrl.TBURL
                     _util_.CookieUtil.set('hideRedPack', true)
                 })*/
                //9188红彩
                /*if (this.channel === 'null') {
                    $body.append(`<div class="pack-red"> <a href="https://mcp.eastday.com/?agent=3037&flag=7#/ " class="icon-pack-9188" id="icon-pack" data-advid="dftth5_red_icon05" data-advurl=""></a> </div>`)
                }*/
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
                if (scope.channel !== 'tiyubdtyald' && !scope.baiduhao && !scope.adIsCheats && scope.isnotappqid && scope.channel !== 'baiducom') {
                    let timestamp = Date.parse(new Date())
                    let newtimestamp = Date.parse(new Date('2018/04/30 00:00'))
                    if (newtimestamp - timestamp > 0) {
                        $article.before(`<section class="gg-item" style="padding:0 0.12rem;"><iframe style="background:#fff;" src="/adbd.html?sogou_ad_id=5594160" frameborder="0" scrolling="no" width="100%" height="0" id="iframeZhike2"></iframe><div class="line"></div></section>`)
                    } else {
                        scope.requestDspUrl(1, -3).done(function (data) {
                            let dspData = data.data
                            if (dspData.length && dspData[0]) {
                                $article.before(scope.loadDspHtml(dspData, 0, 'articleDown'))
                                scope.reportDspInviewbackurl()
                            } else {
                                if (scope.channel === 'tiyutytt') {
                                    $article.before(`<iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                                } else {
                                    $article.before('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[0] + '"></div><div class="line"></div></section>')
                                    _util_.getScript('//df888.eastday.com/' + _detailsGg_[0] + '.js', function () {}, $('#' + _detailsGg_[0])[0])
                                }
                            }
                        }).fail(function () {
                            if (scope.channel === 'tiyutytt') {
                                $article.before(`<iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                            } else {
                                $article.before('<section class="gg-item news-gg-img3"><div id="' + _detailsGg_[0] + '"></div><div class="line"></div></section>')
                                _util_.getScript('//df888.eastday.com/' + _detailsGg_[0] + '.js', function () {}, $('#' + _detailsGg_[0])[0])
                            }
                        })
                    }
                }
                /*baijiahao 和默认的区别在这里 start*/
                //百家号baiducom null渠道隐藏
                if (!scope.baiduhao) {
                    $baiduhao.hide()
                } else {
                    $interestNews.after(
                        `<div class="baiduDown">
                            <div class="separate-line"></div>
                            <a href="/downloadapp.html?qid=xiongzhanghao&pagefrom=newsdetail&from=xiongzhanghao">
                                <span class="img"></span>
                                <span class="cont"><b>东方体育APP全新升级</b><br>资讯直播免费看，分析方案让你赚</span>
                            </a>
                        </div>`)
                }
                //文章下方加展开全文 百度号baiducom null文章要全部展开 其他展开余文
                if ($article.height() >= 900) {
                    if (scope.baiduhao || scope.channel === 'qid10601' || scope.channel === 'baiducom') {
                        $article.css({
                            'maxHeight': '100%'
                        })
                        if (qid !== 'baiducom') {
                            $article.after('<div class="unfold-field Unfolded-btn"  id="unfoldField"></div>') //加这个元素是为了在文章后方加广告
                        }
                    } else {
                        /*if (this.channel === 'null') {
                            $article.after('<div class="unfold-field"  id="unfoldField"><div class="unflod-field__mask"></div><a href="javascript:void(0)" class="unfold-field__text">展开全文【抢天猫红包】</a></div>')
                        } else {}*/
                        $article.after('<div class="unfold-field Unfolded-btn"  id="unfoldField"><div class="unflod-field__mask"></div><div class="down-wrap"><span class="active"></span><span class=""></span><span class=""></span></div></div>')
                        // let i = 0
                        // setInterval(function () {
                        //     $('#unfoldField').find('.down-wrap span').removeClass('active')
                        //     if (i >= 2) {
                        //         i = 0
                        //         $('#unfoldField').find('.down-wrap span').eq(i).addClass('active')
                        //     } else {
                        //         i++
                        //         $('#unfoldField').find('.down-wrap span').eq(i).addClass('active')
                        //     }
                        // }, 500)
                    }
                } else {
                    if (qid !== 'baiducom') {
                        $article.after('<div class="unfold-field Unfolded-btn"  id="unfoldField"></div>') //加这个元素是为了在文章后方加广告
                    }
                }
                if (qid === '000000') return

                //文章中加广告
                if (_AD_.detailArticle[qid]) {
                    $('#content').children().eq(2).after('<section style="margin-left: -0.24rem;"><div id="' + _AD_.detailArticle[qid] + '"></div></section>')
                    _util_.getScript('//df888.eastday.com/' + _AD_.detailArticle[qid] + '.js', function () {}, $('#' + _AD_.detailArticle[qid])[0])
                }

                //返回首页 tiyubdtyald 不显示点击查看更多精彩
                // if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                //     $interestNews.parent().before(`<a href="${config.HOME_URL}?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews${indexType ? `&class=${indexType}` : ''}`}" class="back-homepage"><i></i>${indexType || indexName ? `进入${indexName}频道查看更多文章` : '打开App阅读全文'}  >></a>`)
                //     // $interestNews.parent().before(`<a href="/html/index.html?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews${indexType ? `&class=${indexType}` : ''}`}" class="back-homepage"><i></i>${indexType || indexName ? `进入${indexName}频道查看更多文章` : '点击查看更多精彩'}  >></a>`)
                //     $interestNews.parent().before('<div class="separate-line"></div>')
                // } else {
                //     if (scope.channel === 'baiducom') {
                //         $interestNews.parent().before(`<a style = "margin: 0 auto;" href="${config.HOME_URL}?${`qid=${qid}&pgnum=${scope.pgnum}&from=morenews${indexType ? `&class=${indexType}` : ''}`}" class="back-homepage"><i></i>${indexType || indexName ? `进入${indexName}频道查看更多文章` : '打开App阅读全文'}  >></a>`)
                //     }
                //     //$interestNews.parent().before(`<a href="${downloadUrl}" class="back-homepage"><i></i>前往APP查看更多相关新闻</a>`)
                // }
                if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    $interestNews.parent().before(`<a href="//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5dftiyu" class="back-homepage"><i></i> 打开App阅读全文  >></a>`)
                } else {
                    if (scope.channel === 'baiducom') {
                        $interestNews.parent().before(`<a href="//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=newsdetail&from=H5dftiyu" class="back-homepage"><i></i> 打开App阅读全文  >></a>`)
                    }
                }
                //文章下方广告; tiyutt 百度号baiducom
                if (scope.adIsCheats || scope.baiduhao || qid === 'qid02556' || qid === 'baiducom') {} else {
                    scope.requestDspUrl(1, -1).done(function (data) {
                        let $backHomepage = $('.back-homepage')
                        let dspData = data.data
                        if (dspData.length && dspData[0]) {
                            $backHomepage.after(scope.loadDspHtml(dspData, 0, 'articleDown'))
                            scope.reportDspInviewbackurl()
                        } else {
                            if (scope.channel === 'baiducom') {
                                $unfoldField.after('<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=849191&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="78"></iframe></section>') //sougou
                            } else if (scope.channel === 'null') {
                                //sougou
                                $backHomepage.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="//msports.eastday.com/ad.html?sogou_ad_id=922048&sogou_ad_height=80" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`)
                                /*$unfoldField.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><img style="width:100%;height:1.1rem;" src="https://msports.eastday.com/h5/img/ad/545C7A0B-6A2F-4e21-A6ED-CBA3C8EA3B8B.png" alt=""></section>`)*/
                            } else if (scope.channel === 'tiyutytt') {
                                $backHomepage.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`) //sougou
                            } else {
                                $backHomepage.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                                _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function () {}, $('#' + _detailsGg_[1])[0]) //baidu
                            }
                        }
                    }).fail(function () {
                        let $backHomepage = $('.back-homepage')
                        if (scope.channel === 'baiducom') {
                            $backHomepage.after('<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=849191&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="78"></iframe></section>') //sougou
                        } else if (scope.channel === 'null') {
                            $backHomepage.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="//msports.eastday.com/ad.html?sogou_ad_id=922048&sogou_ad_height=80" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`) //sougou
                        } else if (scope.channel === 'tiyutytt') {
                            $backHomepage.after(`<section class="gg-item news-gg-img3" style="padding:0 0.3rem" id="fm_ad_02"><iframe style="background:#fff;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe></section>`) //sougou
                        } else {
                            $backHomepage.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                            _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function () {}, $('#' + _detailsGg_[1])[0]) //baidu
                        }
                    })
                    //直客广告
                    /*let $unfoldField = $('#unfoldField')
                    if (scope.isnotappqid) {
                        $unfoldField.after('<section class="gg-item" style="" id="fm_ad_02"><iframe src="/adbd.html?sogou_ad_id=5561919" frameborder="0" scrolling="no" height="120" width="100%" id="iframeZhike"></iframe></section>')
                    } else {
                        $unfoldField.after('<section class="gg-item news-gg-img"  style=""><div id="' + _detailsGg_[1] + '"></div></section>')
                        _util_.getScript('//df888.eastday.com/' + _detailsGg_[1] + '.js', function() {}, $('#' + _detailsGg_[1])[0])//baidu
                    }*/
                }


                //彩票广告
                /*if (scope.channel === 'null') {
                    let position = _util_.CookieUtil.get('position')
                    console.log(position)
                    if (position) {
                        loadHc(position)
                    } else {
                        _util_.makeJsonpcallback(apiPosition, {}).done(function(result) {
                            _util_.CookieUtil.set('position', result.position.cityname, 8)
                            loadHc(result.position.cityname)
                        })
                    }
                }
                function loadHc(cityname) {
                    if (cityname === '上海' || cityname === '北京' || cityname === '广州') {} else {
                        $interestNews.before(`<section class="gg-item" style="padding:0;width:100%;"><a id="hcAd" href="https://8.166cai.cn/activity/zpcj4?cpk=10376" ><img style="width:100%" src="http://sports.eastday.com/jscss/v4/img/zhike/msports_16xx.jpg"></a></section>`)
                        let data = {
                            'qid': qid,
                            'uid': recgid,
                            'loginid': 'null',
                            'softtype': soft_type,
                            'softname': soft_name,
                            'newstype': 'ad',
                            'advurl': 'https://8.166cai.cn/activity/zpcj4?cpk=10376', //  广告落地页链接，没有传空
                            'os_type': os, //  操作系统
                            'browser_type': browserType, //  浏览器类型
                            'pixel': window.screen.width + '*' + window.screen.height,
                            'ime': 'null',
                            'fr_url': 'null',
                            'adv': 'tiyuh5_166caipiao' //  广告id  用这个渠道不同功能  例：dftth5_to_app
                        }
                        _util_.makeJsonpcallback(advshow, data)
                    }
                    $('#hcAd').click(function() {
                        let data = {
                            'qid': qid,
                            'uid': recgid,
                            'loginid': 'null',
                            'softtype': soft_type,
                            'softname': soft_name,
                            'newstype': 'ad',
                            'pgtype': 'detail',
                            'accurateurl': 'null',
                            'adpgnum': 'null',
                            'adposition': 'null',
                            'platform': 'null',
                            'clickbackurl': 'null',
                            'from': 'null',
                            'to': 'https://8.166cai.cn/activity/zpcj4?cpk=10376',
                            'os_type': os,
                            'browser_type': browserType || 'null',
                            'pixel': window.screen.width + '*' + window.screen.height,
                            'ime': 'null',
                            'fr_url': locationUrl,
                            'adv': 'tiyuh5_166caipiao'
                        }
                        _util_.makeJsonpcallback(partner, data)
                    })
                }*/
                //猜你喜欢广告; tiyubdtyald tiyutt 百度号 baiducom null 此广告不显示
                if (scope.channel !== 'tiyubdtyald' && !scope.adIsCheats) {
                    /* else if (scope.channel === 'baiducom') {
                       $interestNews.html(`<div class="section-title in-title"><h2>猜你喜欢</h2></div><section style="padding:0.15rem 0.24rem 0.15rem"><iframe style="background:#fff;height:4.7rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=922049&sogou_ad_height=12" frameborder="0" scrolling="no" width="100%"></iframe></section><div class="separate-line"></div>`)
                   }*/
                    if (scope.channel === 'tiyutytt' && !scope.baiduhao) {
                        $interestNews.html(`<iframe style="background:#fff;padding:0.1rem 0.24rem 0;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe><iframe style="background:#fff;padding:0 0.24rem;" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="88"></iframe>`)
                    } else {
                        if (_detailsGg_[2]) {
                            $interestNews.html('<div class="section-title in-title"><h2><span></span>猜你喜欢<span class="line"></span></h2></div><section><div id="' + _detailsGg_[2] + '"></div></section>').before('<div class="separate-line"></div>')
                            _util_.getScript('//df888.eastday.com/' + _detailsGg_[2] + '.js', function () {}, $('#' + _detailsGg_[2])[0])
                        } else {
                            $interestNews.parent().siblings('.separate-line').remove()
                            $interestNews.hide()
                        }
                    }
                }
                /*baijiahao 和默认的区别在这里 end*/
                //文章图片加下载app链接 qid !== 'baiducom' && !scope.baiduhao && qid !== 'qid02556' && scope.isnotappqid
                if (qid === 'null') {
                    $imgsA.attr('href', `${downloadUrl}`)
                }
                //相关阅读部分;tiyubdtyald 相关阅读
                if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    /*$hotNews.append('<div class="section-title hn-title"><h2><span></span>相关阅读<span class="line"></span></h2></div>')*/
                    $hotNews.append(`<div id="J_xg_list" class="hn-list"></div><div class="separate-line"></div>`)
                }
                //加载评论
                /*if (scope.channel !== 'tiyubdtyald' && scope.isnotappqid) {
                    $hotNews.append(`<div id="hotComment" class="comment-list"><ul></ul></div>`)
                    scope.loadComment()
                }*/
                //热点推荐部分;tiyubdtyald 不显示热点推荐 下方3图广告和2个文字链  彩票广告
                if (scope.channel !== 'tiyubdtyald') {
                    if (scope.channel !== 'baiducom' && scope.channel !== 'tiyubdtyald' && !scope.baiduhao && !scope.adIsCheats && qid !== 'qid02556' /*&& qid !== 'null'*/ && scope.isnotappqid) {
                        //猜你喜欢下方3图广告和2个文字链广告
                        if (this.channel === 'tiyuvivobrowser01') { //
                            detailGGAddThree[this.channel].reverse().forEach(function (item) {
                                // $hotNews.append(`<section class="gg-item"  style="padding:0 0;"><div id="${item}"></div></section>`)
                                // _util_.getScript(`//df888.eastday.com/${item}.js`, function () {
                                // }, $(`#${item}`)[0])
                            })
                        } else {
                            detailGGAddThree['null'].reverse().forEach(function (item) {
                                if (qid === 'qid10480' && item === 'uphlomrrr') return
                                // $hotNews.append(`<section class="gg-item"  style="padding:0  0;"><div id="${item}"></div></section>`)
                                // _util_.getScript(`//df888.eastday.com/${item}.js`, function () {
                                // }, $(`#${item}`)[0])
                            })
                        }
                    }
                    //加彩票广告
                    let arr = ['baiducom', 'dfspiosnull', 'dfspadnull']

                    /* if (arr.indexOf(scope.channel) === -1 || scope.baiduhao) {
                         /!*$('#J_xg_list').after(`<section class="gg-item"  style="padding:0  0;"><div id=""><a href="https://mcp.eastday.com/?agent=3037&flag=7#/"><img style="width:100%;margin-top: 0.2rem" src="http://msports.eastday.com/h5/img/ad/hcbanner.jpg" alt=""></a></div></section>`)*!/
                         $article.find('#title').append(`<div class="lottery-box">
             <!--<a href="http://msports.eastday.com/hc/index.html#h5btxf" class="lottery">看专家推荐，天天中百万大奖</a>-->
             <a href="http://msports.eastday.com/hc/active10_1.html#h5btxf" class="lottery"><p>看独家密料，赢<span>百万</span>大奖！立即查看</p></a>
     </div>`)
                     }*/
                    //$hotNews.append('<div class="separate-line"></div>')
                    $hotNews.append('<div class="section-title hn-title"><h2><span></span>热点新闻<span class="line"></span></h2></div>')
                    $hotNews.append($hnList)
                    $hotNews.append($loading)
                    //热点新闻第一条加广告
                    if (qid === 'tiyucoolpad') {
                        getPosition().done(function (result) {
                            if (result.position.cityname !== '深圳') {
                                let tiyucoolpad = [
                                    'idvazmlem',
                                    'jewbanmft',
                                    'snftjtwkcqum',
                                    'kfxcbongx',
                                    'lgydcpohc',
                                    'ezrofhobo',
                                    'niarjkfje',
                                    'avnbrbesdycx',
                                    'pkctlmhlj',
                                    'kfxoghchl',
                                ]
                                $('#content').children().eq(1).after('<section class="gg-item news-gg-img3" style="width:7rem;" id="fm_ad_02"><iframe src="//msports.eastday.com/ad.html?sogou_ad_id=982916&sogou_ad_height=3" frameborder="0" scrolling="no" width="100%" height="120"></iframe></section>')
                                tiyucoolpad.forEach(function (item) {
                                    $hnList.append(`<section  class="news-item gg-item news-gg-img3"><div id="${item}"></div></section>`)
                                    _util_.getScript(`//df888.eastday.com/${item}.js`, function () {}, $(`#${item}`)[0])
                                })
                            }
                        })
                    }
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
                    $article.find('a').attr('href', 'javascript:;').css('color', '#333')
                }
            },
            loadTkl: function () {
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
                    _util_.getScript(`//09img.shaqm.com/h5/partner/zfbc_w.min.js?qid=${qid}&uid=${recgid}&site=ty`, function () {
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
                } catch (e) {
                    console.error(e)
                }
            },
            loadXuanfuGg: function () {
                $body.append(`<div class="pack-red"> <iframe id ="iframeXuanfu" src="/xuanfu.html" style="width:100px;height:200px;" frameborder="0"></iframe> </div>`)
            },
            getData: function (start) {
                let scope = this
                if (scope.pgnum >= 6) {
                    return false
                }
                if (qid === 'tiyucoolpad') {
                    $loading.remove()
                    return
                }
                let ime = _util_.getUrlParam('ime') || 'null'
                let position = _util_.getUrlParam('position') || 'null'
                let appqid = _util_.getUrlParam('appqid') || 'null'
                let apptypeid = _util_.getUrlParam('apptypeid') || 'null'
                let ver = _util_.getUrlParam('ver') || 'null'
                let appver = _util_.getUrlParam('appver') || 'null'
                let deviceid = _util_.getUrlParam('deviceid') || 'null'
                let ttloginid = _util_.getUrlParam('ttloginid') || 'null'
                let data = {
                    typecode: this.typecode,
                    startkey: this.startkey,
                    pgnum: this.pgnum,
                    url: locationUrl,
                    os: os,
                    recgid: recgid,
                    qid: qid,
                    domain: domain,
                    appqid: appqid,
                    ttloginid: ttloginid,
                    apptypeid: apptypeid,
                    appver: appver,
                    softtype: soft_type,
                    softname: soft_name,
                    position: position,
                    deviceid: deviceid,
                    from: fromUrl,
                    ver: ver,
                    ime: ime
                }
                $loading.show()
                _util_.makeJsonp(scope.host + 'detailnews', data).done(function (result) {
                    $loading.hide()
                    if (!result.data.length) {
                        $('#noMore').remove()
                        $body.append('<section id="noMore" class="clearfix">无更多数据了</section>')
                        return
                    } //如果startkey没变化就结束
                    scope.startkey = result.endkey
                    scope.requestDspUrl(3, 1).done(function (data) {
                        scope.dspDataIndex = 0
                        scope.dspData = data.data
                        scope.productHtml(result, start)
                        scope.pgnum++
                    }).fail(function () {
                        scope.productHtml(result, start)
                        scope.pgnum++
                    })
                    pullUpFinished = true
                }).done(function () {
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
                }).done(function (result) {
                    function produceHtml(result) {
                        let data = result.data
                        let html = ''
                        html += `<div class="swiper-slide">
			                                    <a class="J-topappdownload" href="${downloadUrl}"><div class="top"><div class="topContent"><div class="tC-left"><img class="tC-left-img" src="${config.DIRS.BUILD_FILE.images['i-logo']}" alt=""><div class="tC-right-div"><p class="p1">东方体育</p><p class="p2">专业的体育资讯及直播平台</p></div></div><span class="tC-right-a">立即打开</span></div></div></a>
			                                    <span class="J-topappdownload-close tC-right-span"></span>
		                                 </div>`
                        data.forEach(function (item, i) {
                            if (i < 3) {
                                html += `<div class="swiper-slide"><a class="J-topappdownload" href="${downloadUrl}"><div class="top"><div class="topContent"><div class="tC-left"><img class="tC-left-img tC-img" src="${item.miniimg[0].src}" alt=""><div class="title-wrap"><p class="pp">${item.topic}</p></div></div><span class="tC-right-a">立即打开</span></div></div></a> <span class="J-topappdownload-close tC-right-span"></span> </div>`
                            }
                        })
                        return html
                    }

                    //加顶部轮播诱导
                    if (!_util_.CookieUtil.get('hasDownloadBox') && !scope.baiduhao && start === 0 && qid === 'null') {
                        _util_.getScript('//msports.eastday.com/h5/js/lib/swiper.min.js', function () {
                            let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container appdownload-swiper"><div id="sorter" class="swiper-pagination"></div></div>')
                            $el.prepend(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)
                            $body.prepend($el)
                            // $body.prepend('<div id="J_topappdownload_empty" class="topapp-empty"></div>')
                            /* global Swiper:true*/ //激活轮播图
                            new Swiper('#swiperContainer', {
                                loop: true,
                                centeredSlides: true,
                                autoplay: 4000,
                                autoplayDisableOnInteraction: false,
                                pagination: '.swiper-pagination'
                            })
                        }, '')
                        /*require.ensure([], function(require) {
                            let Swiper = require('swiper')
                            let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container appdownload-swiper"><div id="sorter" class="swiper-pagination"></div></div>')
                            $el.prepend(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)
                            $body.prepend($el)
                            $body.prepend('<div id="J_topappdownload_empty" class="topapp-empty"></div>')
                            //激活轮播图
                            new Swiper('#swiperContainer', {
                                loop: true,
                                centeredSlides: true,
                                autoplay: 4000,
                                autoplayDisableOnInteraction: false,
                                pagination: '.swiper-pagination'
                            })
                        })*/

                        $body.on('click', '.J-topappdownload-close', function () {
                            let $swiperContainer = $('#swiperContainer')
                            $swiperContainer.prev().remove()
                            $swiperContainer.remove()
                            _util_.CookieUtil.set('hasDownloadBox', 1, 1) //保存一小时
                        })
                    }
                })
            },
            productHtml: function (result, start) {
                /*if (qid === 'baiducom') {
                    qid = 'null'
                }*/
                let $J_hn_list = $('#J_hn_list')
                //let $J_xg_list = $('#J_xg_list')
                let data = result.data
                let html = ''
                let scope = this
                data.forEach(function (item, i) {
                    let ggid = _detailsGg_[scope.index]
                    let length = item.miniimg.length
                    let url = ''
                    let tagHtml = ``
                    /*if (!scope.baiduhao && qid !== 'baiducom' && i < 3 && start === 0) {
                        url = downloadUrl
                        tagHtml = '<em class="tag tag-app tag-toapp">打开app</em>'
                    } else {}*/
                    if (scope.pgnum > 3) {
                        url = `//msports.eastday.com/downloadapp.html?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}&pgnum=${scope.pgnum}&softtype=${soft_type}&softname=${soft_name}`}`
                        tagHtml = `<em class="tag tag-app">打开App</em>`
                    } else {
                        url = `${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}&pgnum=${scope.pgnum}&softtype=${soft_type}&softname=${soft_name}`}`
                        tagHtml = `<em class="tag tag-src">${item.source}</em>`
                    }
                    if (!length) {
                        return
                    }
                    /*   if (length >= 3) {
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
                       }*/

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

                    //广告
                    /*if (start === 0 && i < 3) {
                        if (scope.isnotappqid) {
                            $J_xg_list.append(html)
                        } else {
                            //$interestNews.find('.section-title').after(html)
                        }
                        if ((i === 0 || i === 2) && !scope.adIsCheats) {
                            if (qid === 'qid02556') {
                                scope.index++
                            } else {
                                $J_xg_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"  data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                _util_.getScript('//df888.eastday.com/' + ggid + '.js', function() {}, $(`${ggid}`)[0])
                                scope.index++
                            }
                        }
                    } else */
                    /*   $J_hn_list.append(html)
                       if (!scope.isnotappqid) {

                       } else if (scope.baiduhao) {
                           if (scope.channel === 'baiducom') {

                           } else {

                           }
                       } else {
                           if (scope.index === 28) {
                               scope.index = 6
                           }
                           if (i % 2) {
                               $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                               _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {
                               }, $(`${ggid}`)[0])
                               scope.index++
                           }
                       }*/
                    if (start === 0 /* && i >= 3*/ ) {
                        if (scope.isnotappqid && !scope.baiduhao) {
                            $J_hn_list.append(html)
                            /*if ((i === 1 || i === 3 || i === 5 || i === 6 || i === 9 || i === 8 || i === 11 || i === 12) && !scope.adIsCheats) {
                                if (qid === 'qid02556' && i !== 4) {
                                    return
                                }
                                if (scope.dspData[scope.dspDataIndex]) {
                                    $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                    $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                    scope.dspDataIndex++
                                    scope.index++
                                    scope.reportDspInviewbackurl()
                                } else {
                                    $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                    _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {
                                    }, $(`${ggid}`)[0])
                                    scope.index++
                                }
                                let worldcupGgid = _AD_.worldcupNewAd[qid]
                                if (worldcupGgid && (i === 1 || i === 3 || i === 6)) {
                                    worldcupGgid = worldcupGgid[scope.worldcupNewAdIndex]
                                    $J_hn_list.append(`<div style="" class="clearfix"   data-id="${worldcupGgid}"><section  class="news-item gg-item news-gg-img3"><div id="${worldcupGgid}"></div></section></div>`)
                                    _util_.getScript('//df888.eastday.com/' + worldcupGgid + '.js', function () {
                                    }, $(`${worldcupGgid}`)[0])
                                    scope.worldcupNewAdIndex++
                                }
                            }*/
                            if (i % 2) {
                                if (scope.dspData[scope.dspDataIndex]) {
                                    $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                    $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                    scope.dspDataIndex++
                                    scope.reportDspInviewbackurl()
                                    scope.index++
                                } else {
                                    $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                    _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {}, $(`${ggid}`)[0])
                                    scope.index++
                                }
                            }
                        } else {
                            if (i >= 8) return
                            if (scope.channel === 'baiducom' || scope.baiduhao) {
                                if (i === 3 || i === 7) {
                                    if (scope.dspData[scope.dspDataIndex]) {
                                        $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                        $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                        scope.dspDataIndex++
                                        scope.index++
                                        scope.reportDspInviewbackurl()
                                    } else {
                                        $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                        _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {}, $(`${ggid}`)[0])
                                        scope.index++
                                    }
                                } else if (i === 6) {
                                    scope.index++
                                }
                            } else {
                                if (i === 3 || i === 5 || i === 7) {
                                    if (scope.dspData[scope.dspDataIndex]) {
                                        $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                        $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                        scope.dspDataIndex++
                                        scope.index++
                                        scope.reportDspInviewbackurl()
                                    } else {
                                        $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                        _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {}, $(`${ggid}`)[0])
                                        scope.index++
                                    }
                                } else if (i === 6) {
                                    scope.index++
                                }
                            }
                            $J_hn_list.append(html)
                        }
                    } else {
                        $J_hn_list.append(html)
                        if (i % 2) {
                            if (scope.dspData[scope.dspDataIndex]) {
                                $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                scope.dspDataIndex++
                                scope.reportDspInviewbackurl()
                                scope.index++
                            } else {
                                $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {}, $(`${ggid}`)[0])
                                scope.index++
                            }
                        }
                        /* if ((i === 1 || i === 3 || i === 6 || i === 9) && !scope.adIsCheats && qid !== 'qid02556') {
                             if (scope.dspData[scope.dspDataIndex]) {
                                 $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix" data-id="${ggid}" ><div id="${ggid}"></div></div>`)
                                 $(`#${ggid}`).html(scope.loadDspHtml(scope.dspData, scope.dspDataIndex, ''))
                                 scope.dspDataIndex++
                                 scope.reportDspInviewbackurl()
                                 scope.index++
                             } else {
                                 if (i % 2) {
                                     $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                     _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {
                                     }, $(`${ggid}`)[0])
                                     scope.index++
                                 }
                             }
                         } else {
                             if (i % 2) {
                                 $J_hn_list.append(`<div style="" id="ggModule${scope.index - 3}" class="clearfix"   data-id="${ggid}"><section  class="news-item gg-item news-gg-img3"><div id="${ggid}"></div></section></div>`)
                                 _util_.getScript('//df888.eastday.com/' + ggid + '.js', function () {
                                 }, $(`${ggid}`)[0])
                                 scope.index++
                             }
                         }*/
                    }
                    scope.idx++
                })
            },
            loadComment: function () {
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
                    limitnum: 2
                }
                _util_.makeJsonp(`${COMMENTREPLY}${urlNum}/commentreply` + '', data).done(function (result) {
                    let data = result.data
                    if (data.length) {
                        $hotComment.before(`<div class="section-title hn-title"><h2><span></span>热门评论<span class="line"></span></h2></div>`)
                        data.forEach(function (item) {
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
                        $hotComment.append(`<a href="${downloadUrlpl}" class="back-homepage">打开App查看全部热门评论</a>`)
                    }
                })
                $hotComment.on('click', '.commentZan', function () {
                    let num = $(this).children('span').text() / 1
                    if (!$(this).children('i').hasClass('active')) {
                        $(this).children('span').text(++num)
                        $(this).children('i').addClass('active')
                    }
                })
                $hotComment.on('click', '.J_expand', function () {
                    $(this).prev().removeClass('comment-content-maxheight')
                    $(this).remove()
                })
            },
            requestDspUrl: function (adnum, pgnum) {
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
                    fr_url: _util_.getReferrer() || 'null', // 首页是来源url(document.referer)
                    site: 'sport'

                }
                return _util_.makeGet(HOST_DSP_DETAIL, data)
            },
            loadDspHtml: function (dspData, posi, type) {
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
													<em class="tag tag-time"><i class="tag">${item.source} 提供的广告</i></em>
													<--<em class="tag tag-src l">${item.source}</em>-->
												</p>
											</div>
										</a>
										</section>`
                        break
                    case 'one': //单
                        html += `<section class="news-item news-item-s1" style="${type === 'articleDown' ? 'border:0' : ''}">
										<a  href="${item.url}" class="news-link" suffix="${`ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${scope.idx}`}" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}">
										<div class="news-wrap clearfix">
    <div class="txt-wrap fl"><h3>${item.topic}</h3><p class="tags"><em class="tag tag-time"><i class="tag">${item.source} 提供的广告</i></em></p></div><div class="img-wrap fr"><img class="lazy" src="${item.miniimg[0].src}"></div></div>
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
													<em class="tag"><i class="tag">${item.source} 提供的广告</i></em>
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
													<em class="tag"><i class="tag">${item.source} 提供的广告</i></em>
												</p>
											</div>
										</a>
										</section>`

                        break
                }
                $body.append(`<img style="display: none" src="${item.showbackurl}"/>`)
                return html
            },
            reportDspInviewbackurl: function () {
                let cHeight = $(window).height()
                let offsetArr = []
                let eleArr = []
                $('a[inviewbackurl]').each(function (i, item) {
                    if (cHeight > $(this).offset().top) {
                        $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                        $(this).removeAttr('inviewbackurl')
                    }
                })
                $(window).scroll(function () {
                    offsetArr = []
                    eleArr = []
                    $('a[inviewbackurl]').each(function (i, item) {
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
                $body.on('click', '.unfold-field .down-wrap', function () {
                    $article.css({
                        'max-height': '100%'
                    })
                    $(this).parent().hide()
                    let $gg = $(this).next()
                    scope.ggEle = $gg
                    console.log(scope.channel)
                    if (scope.isnotappqid && scope.channel !== 'tiyuweimillq' && scope.channel !== 'qid10603' && scope.channel !== 'baiducom') {
                        $gg /*.children()*/ .css({
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
            }, //图片懒加载
            loadLazyImg() {
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

                var _inView = function (el) {
                    var coords = el.getBoundingClientRect()
                    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))
                }

                var _pollImages = function () {
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

                var _throttle = function () {
                    clearTimeout(poll)
                    poll = setTimeout(_pollImages, throttle)
                }

                var init = function (obj) {
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
            },
            loadgifActivity() {
                if (qid === 'null') {
                    // let sc = _util_.CookieUtil.get('sc')
                    $body.append(`<a href="${ROOT_URL_HC}hc/" class="pack-gif"></a>`)
                    // if (sc / 1 !== 1) {
                    // $body.append(`<div class="pack-red">
                    //             <div class="icon-pack"></div>
                    //         </div>`)
                    // $body.append(`<a href="${ROOT_URL_HC}hc/recharge.html" class="pack-gif"></a>`)
                    // $('.icon-pack').click(function() {
                    //     //hcUtil.checkAppLogin(qid, ver)
                    //     window.location.href = `${ROOT_URL_HC}hc/recharge.html`
                    // })
                    // }
                }
            }
        }
        let en = new Detail(qid)
        let _detailsGg_ = _AD_.detailList[en.baiduhao ? 'baijiahao' : qid].concat(_AD_.detailNoChannel)
        let _detailsNewGg_ = _AD_.detailNewAd
        //_detailsGg_.splice(3, 0, _detailsNewGg_[0], _detailsNewGg_[1])
        // if (en.isnotappqid) {
        //     _detailsGg_.splice(4, 1, 'ezrofhobo')
        // }
        // _detailsGg_.splice(5, 0, _detailsNewGg_[2])
        // _detailsGg_.splice(7, 0, _detailsNewGg_[3], _detailsNewGg_[4])
        //console.log(_detailsGg_)
        let detailGGAddThree = _AD_.detailGGAddThree
        if (qid === 'tiyutt') {
            _detailsGg_ = {}
        }
        en.init();

    //双十一 活动逻辑
    (function () {
        //dc接口数据
        let data = {
            platform: 'H5', //展现平台
            // typecode: this.typecode,
            // startkey: this.startkey,
            // pgnum: this.pgnum,
            // url: locationUrl,
            os: os,
            uid: recgid,
            qid: qid,
            // domain: domain,
            appqid: null, //app推广渠道号
            // ttloginid: ttloginid,
            apptypeid: null, //app软件类别
            appver: null, //app版本号
            softtype: soft_type,
            softname: soft_name,
            position: null, //地域
            deviceid: null, //app唯一id
            ver: version,
            ime: null, //app用户ime
            browser: browserType, //浏览器
            pixel: pixel,
            ttaccid: null, //app用户注册id
            iswifi: null, //网络环境
            ggid: null, //广告id
            newsurl: locationUrl, //负载新闻的url
            ggurl: null, //广告的url
        }
        //4.百度渠道不弹窗
        if (qid === 'baiducom') {
            return
        }
        let date = new Date().getTime()
        // let date = '1541951600000'
        // let startDate = new Date(2018, 10, 20, 0, 0, 0).getTime()
        let startDate = 0
        if (date > startDate) {
            // setTimeout(function () {
                //1.判断当前在哪一轮 通过对象的endTime 和 id判断
                let arr = [{
                        id: 0,
                        info: 'index_0',
                        endTime: '1540310100000'
                    },
                    {
                        id: 1,
                        info: 'index_1',
                        endTime: '1540655700000'
                    },
                    {
                        id: 2,
                        info: 'index_2',
                        endTime: '1541001300000'
                    },
                    {
                        id: 3,
                        info: 'index_3',
                        endTime: '1541174100000'
                    },
                    {
                        id: 4,
                        info: 'index_4',
                        endTime: '1541519700000'
                    },
                    {
                        id: 5,
                        info: 'index_5',
                        endTime: '1541865300000'
                    },
                    {
                        id: 6,
                        info: 'index_6',
                        endTime: '1541951700000'
                    }
                ]
                //2.判断当前有没有弹过窗 根据对象的info属性在localStorage中寻找
                let timeCycle = arr.find(item => {
                    return +item.endTime > date
                }) || {}
                let JsonObj = localStorage.getItem(timeCycle.info)
                if (timeCycle.info) {
                    if (JsonObj) {
                        //3.判断有没有浏览新闻三次 进入详情页后计数
                        let obj = JSON.parse(JsonObj)
                        obj.num++
                        if (obj.num > 2 && !obj.isPopup) {
                            start()
                            obj.isPopup = true
                        }
                        localStorage.setItem(timeCycle.info, JSON.stringify(obj))
                    } else {
                        let obj = {
                            num: 1,
                            isPopup: false,
                        }
                        localStorage.setItem(timeCycle.info, JSON.stringify(obj))
                    }
                }
            // }, 2000)
        }

        $('.advertisement_cover').on('click', function() {
            end()
        })

        $('.advertisement_3 a').on('click', function() {
            taobaoClick($('#advertisement_3 a'))
        })

        $('.advertisement_1 .btn a:first-child').on('click', function() {
            end()
        })

        $('.advertisement_1 .btn a:first-child').on('click', function() {
            taobaoClick($(this))
        })
        //百度统计
        function baidu(type) {
            switch(type){
                case 1:
                    _hmt.push(["_trackEvent","sdtcshow","展现",1])
                    break;
                case 2:
                    _hmt.push(["_trackEvent","sdtcclcick","点击",1])
                    break;
                case 3:
                    _hmt.push(["_trackEvent","sdtcclose","关闭",1])
                    break;
                default:
                    _hmt.push([])
                    break;
            }           
        } 
        //dc统计
        function dc(type, id) {
            data.ggid = id
            if (type === 'click') {
                _util_.makeJsonpcallback('http://123.59.60.170/mopads/show', data).done(function (result) {
                    console.log(result)
                })   
            } else {
                _util_.makeJsonpcallback('http://123.59.60.170/mopads/click', data).done(function (result) {
                    console.log(result)
                })   
            }         
        }
        //活动弹出
        function start(dom = '.advertisement_3') {
            baidu(1)
            dc('show', 'sdtcshow')
            $(dom).css('display', 'inline-block')
            $('.advertisement_cover').css({
                display: 'block',
                animation: 'start 0.5s 1 linear'
            })
        }
        //关闭弹窗
        function end() {
            baidu(3)
            dc('click', 'sdtcclose')
            $('.advertisement_cover').css('animation', 'end 0.5s 1 linear')
            setTimeout(_ => {
                $('.advertisement_cover').css('display', 'none')
            }, 450)
        }

        function taobaoClick(dom) {
            baidu(2)
            dc('click', 'sdtcclcick')
            var ua = window.navigator.userAgent
            var scriptUrl = '//statres.quickapp.cn/quickapp/js/routerinline.min.js'
            if (ua.indexOf('HUAWEI') > -1) { // 华为手机使用不用的快应用js路径
                scriptUrl = '//appimg.dbankcdn.com/hwmarket/files/fastapp/router.fastapp.js';
            }

            getScript(scriptUrl, function () {
                channelReady(function (status) { // 官方回调：判断是否支持快应用  true:支持 false:不支持
                    // console.log('是否支持快应用::' + status)
                    $('body').on('click', dom, function (e) {
                        e.preventDefault()
                        var $this = $(this)
                        var href = $this.attr('href')
                        if (status) {
                            appRouter('com.eastday.quickapp', '/', {
                                url: href
                            })
                        } else {
                            // if (ua.indexOf('MicroMessenger') > -1) { // 微信中打开
                            //   href = 'http://gxjifen.dftoutiao.com/jump.php?u=' + href;
                            // }
                            window.location.href = href
                        }
                    })
                })
            })

            function getScript(url, callback, element) {
                var head = document.getElementsByTagName('head')[0],
                    js = document.createElement('script')
                js.setAttribute('type', 'text/javascript')
                js.setAttribute('src', url)
                if (element) {
                    element.appendChild(js)
                } else {
                    head.appendChild(js)
                }
                // 执行回调
                var callbackFn = function () {
                    if (typeof callback === 'function') {
                        callback()
                    }
                }

                if (document.all) { // IE
                    js.onreadystatechange = function () {
                        if (js.readyState === 'loaded' || js.readyState === 'complete') {
                            callbackFn()
                        }
                    }
                } else {
                    js.onload = function () {
                        callbackFn()
                    }
                }
            }
        }
    }())
    })();
    (function shareWebPage() {
        let imgSrc = $('#content img').eq(0).attr('src')
        if (imgSrc.indexOf('http') === -1) {
            imgSrc = 'http:' + imgSrc
        }
        let title = $('h1.title').text() + '_东方体育'
        let desc = $('#content p.txt').text()
        $.ajax({
            type: 'get',
            url: '//xwzc.eastday.com/wx_share/share_check.php',
            data: {
                url: window.location.href
            },
            dataType: 'jsonp',
            jsonp: 'wxkeycallback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: 'wxkeycallback',
            success: function (result) {
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
                wx.ready(function () {
                    // 分享给朋友
                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    })
                    wx.onMenuShareTimeline({
                        title: title, // 分享标题
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    })
                })
            },
            error: function () {}
        })
        //myconsole(window.location.href)
        if (qid === 'qid10601') {
            document.title = '\u200E'
            let url = window.location.host + window.location.pathname
            let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('000000.html'))
            let ttaccid = _util_.getUrlParam('ttaccid') || 'null'
            let apptypeid = _util_.getUrlParam('apptypeid') || 'null'
            let obj = {
                'method': 'webLoadComplete',
                'title': title,
                'desc': desc.substring(0, 40),
                'imgurl': imgSrc || 'http://mini.eastday.com/toutiaoh5/img/share-logo.png', // 分享缩略图,
                'xcximgurl': imgSrc || 'http://mini.eastday.com/toutiaoh5/img/xcx-logo.png',
                'shareurl': window.location.href,
                'articleH': $('body').height(),
                'smallappshare': `pages/news/ndetails/ndetails?url=${urlNum}&type=${_sportsType_}&ac=${ttaccid}&f=xq1&apptypeid=${apptypeid}&qid=sharexcx`
            }
            try {
                if (_util_.getOsType().indexOf('Android') > -1) {
                    window.NewsDetail.webLoadComplete(JSON.stringify(obj))
                } else {
                    window.webkit.messageHandlers.JSToNative_iOS.postMessage(obj)
                }
            } catch (e) {
                console.log(e)
            }
        }
        //文章下方加竞猜
        /*if (qid === 'qid10601') {
            let $copyright = $('.copyright')
            let $articleTag = $('#J_article').find('.article-tag')
            let html = ``
            let data = {}
            _util_.makeJsonAjax('//sports.eastday.com/data/today_match_info_list.json', data).done(function(result) {
                //let desc = ''
                let total_corn_h = 0
                //let matchid = ''
                result.forEach(function(v) {
                    if (v.type === '0' && (v.total_corn / 1 > total_corn_h)) {
                        console.log(v)
                        //matchid = v.matchid
                        total_corn_h = v.total_corn
                        let odds_percentage = v.odds_percentage
                        let total_corn = v.total_corn
                        let odds = v.odds
                        let total_user = v.total_user
                        desc = `${v.matchname},${v.title}?`
                        html = `<div class="jc-box">
    <div class="head"></div>
    <div class="bd">
        <h6> ${v.matchname.split(' ')[0] + ' ' + v.matchname.split(' ')[1]}</h6>
        <div class="row clearfix dotted">
            <div class="team-box">
                <img src="${v.home_logoname}" alt="">
                <p>${v.home_team}</p>
            </div>
            <div class="middle">
                <div class="row clearfix">
                    <div class="bo" style="color: #ff0000;font-size: 0.4rem;">${toThousands(total_corn)}</div>
                    <div class="text">金币</div>
                </div>
                <p>${total_user}参与</p>
            </div>
            <div class="team-box">
                <img src="${v.visit_logoname}" alt="">
                <p>${v.visit_team}</p>
            </div>
        </div>
        <div class="row2">
            <h3>${v.title}?</h3>
            <ul class="clearfix">
                <li>
                    <h4>${v.home_team}胜</h4>
                    <p><span>${odds_percentage.win}%</span>${odds.win}</p>
                </li>
                <li>
                    <h4>平</h4>
                    <p><span>${odds_percentage.tie}%</span>${odds.tie}</p>
                </li>
                <li>
                    <h4>${v.visit_team}胜</h4>
                    <p><span>${odds_percentage.lose}%</span>${odds.lose}</p>
                </li>
            </ul>
            <a href="https://msports.eastday.com/jingcai/match_detail.html?qid=${qid}&matchid=${v.matchid}" class="more-jc">更多有奖竞猜 >></a>
        </div>
        <div class="btns" style="display: none">
            <div class="btn1" style="display: none"></div>
            <div class="btn1"><a href="https://msports.eastday.com/jingcai/match_detail.html?qid=${qid}&matchid=${v.matchid}"></a></div>
        </div>
    </div>
</div>`
                    }
                })
                if ($copyright.length) {
                    $copyright.before(html)
                } else {
                    $articleTag.before(html)
                }
                $('.jc-box .bd .row2 ul li').click(function() {
                    $(this).parent().children().removeClass('active')
                    $(this).addClass('active')
                    $('.jc-box .bd .btns').show()
                    $('.more-jc').hide()
                })
                $('.jc-box .bd').on('click', 'a', function(e) {
                    let url = $(this).attr('href')
                    e.preventDefault()
                    url = `${url}`
                    JS_APP.ToNewWebPage({
                        'type': '0',
                        'url': url
                    })
                })
                /!*$('body').on('click', '.jc-box .bd .btns .btn1', function() {
                    if ($(this).index() === 0) {
                        JS_APP.CallNativeShare({
                            method: 'CallNativeShare',
                            sharetype: 'all',
                            title: '竞猜世界杯,瓜分千万奖金',
                            des: desc,
                            image: `http://sports.eastday.com/jscss/v4/img/jc_share/share_${Math.floor(Math.random() * 7)}.png`, // url: location.href + `&image=${pageLogic.userData.image}&nick=${pageLogic.userData.nick}`,
                            url: `http://msports.eastday.com/jingcai/detail_share.html?qid=${qid}&matchid=${matchid}`,
                            isSystemShare: 0
                        })
                    }
                })*!/
            })
        }
        function toThousands(num) {
            let result = []
            let counter = 0
            num = (num || 0).toString().split('')
            for (let i = num.length - 1; i >= 0; i--) {
                counter++
                result.unshift(num[i])
                if (!(counter % 3) && i !== 0) { result.unshift(',') }
            }
            return result.join('')
        }*/
        //翱翔app
        if (qid === 'qid10459') {
            window.web_idleaf = 999167
            window.is_pinglun = '1'
            window.pl_yrl_onclick = 'window.location=\'action://link_comment?titleurl=\'+encodeURIComponent(\'?zhuid=999167&page=1&type=1&yuantie=http://listen.021east.com/2018fwc/entry.html\')+\'&iscomment=\'+encodeURIComponent(\'1\')+\'&isshare=\'+encodeURIComponent(\'1\')+\'&enabled=\'+encodeURIComponent(\'1\')+\'\';'
            window.share = function () {
                window.location = 'action://share?newsurl=' + encodeURIComponent('http://listen.021east.com/2018fwc/entry.html') + '&newsid=' + encodeURIComponent('999167') + '&newstitle=' + encodeURIComponent('东方体育带你激情世界杯') + '&imgurl1=' + encodeURIComponent('http://listen.021east.com/2018fwc/640_1136-2.png') + '&newsdescription=' + encodeURIComponent('东方体育带你激情世界杯') + ''
            }
        }
    })();
    (function () {
        // 操作系统1
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
        var isGtIOS9 = !Boolean(navigator.userAgent.match(/OS [1-8]_\d[_\d]* like Mac OS X/i)) // eslint-disable-line
        // 微信中打开新闻内页，返回时跳到首页。 || (qid === 'baiducom')
        var isBaiduhao = $('#baiduhao').length > 0
        if (isGtIOS9 && qid !== 'dfspiosnull' && qid !== 'dfspadnull' && qid !== 'wxspadnull' && qid !== 'wxspiosnull' && qid !== 'dfspdftttypd' && qid !== 'qid10601' && qid !== 'qid10602' && qid !== 'baiducom' && isBaiduhao) {
            var bool = false
            window.history.pushState({}, document.title, '#pushstate')
            window.addEventListener('popstate', function () {
                // 防止微信中一进入就触发"popstate"事件
                if (bool) {
                    //var redirectId = 'wechat_detail_backto_index' // 禁止修改（日志唯一ID记录）
                    // var redirectUrl = 'index.html?qid=test';
                    // var redirectUrl = 'http://testing.eastday.com/toutiao_h5_test/toutiaoh5/src/index.html?qid=test';
                    var redirectUrl = 'http://msports.eastday.com/'
                    window.location.href = redirectUrl
                    /*log.appLinkClickLog({
                        advUrl: redirectUrl,
                        advId: redirectId,
                        callback: function() {
                            Cookies.set('DFTT_DETAIL_TO_INDEX', true, {
                                expires: 1 / 24,
                                path: '/',
                                domain: 'eastday.com'
                            })

                        }
                    })*/
                }
            }, false)
            // 设置延时是为了解决：在微信中进入页面就触发了popstate事件
            setTimeout(function () {
                bool = true
            }, 2000)
        }
        if (qid === 'apptoother') {
            document.title = document.title.replace('_东方体育', '')
        }
    }())
})