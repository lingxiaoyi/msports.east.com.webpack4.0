
import '../../public-resource/sass/swiper.scss'
import 'pages/atlas/style.scss'
import './log.news.js'
import 'zepto/src/fx'
import '../../../vendor/animate.js'
import FastClick from 'fastclick'
import config from 'configModule'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
import Swiper from 'swiper'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, HOST_DSP_DETAIL} = config.API_URL
    let {DOMAIN} = config
    let domain = DOMAIN
    let version = '1.0.0' //内页版本号  用来区分版本上线
    console.log(version)
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let pixel = window.screen.width + '*' + window.screen.height
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let $body = $('body')
    let $swiperContainer = $('#swiperContainer')
    let $imgs = $swiperContainer.find('.swiper-slide img')
    let title = $swiperContainer.find('.swiper-slide .info h3').eq(0).text()
    let desc = $swiperContainer.find('.swiper-slide .info p').eq(0).text()
    function Detail() {}
    Detail.prototype = {
        init: function() {
            this.loadSwiper()
            this.hideText()
        },
        loadSwiper: function() {
            new Swiper('#swiperContainer', {
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
        },
        hideText: function() {
            $('body').on('click', '.swiper-slide', function() {
                $(this).find('.info').removeClass('slideDown')
                $(this).find('.info').removeClass('slideUp')
                if ($(this).hasClass('hide')) {
                    $(this).removeClass('hide')
                    $(this).find('.info').addClass('slideUp')
                } else {
                    $(this).addClass('hide')
                    $(this).find('.info').addClass('slideDown')
                }
            })
        }
    }
    let en = new Detail()
    //let _detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
    en.init()
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
                    let imgSrc = $imgs.eq(0).attr('src')
                    if (imgSrc.indexOf('http') === -1) {
                        imgSrc = 'http:' + imgSrc
                    }
                    wx.onMenuShareAppMessage({
                        title: title + '_东方体育', // 分享标题
                        desc: desc, // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: imgSrc, // 分享图标
                        success: function() {},
                        cancel: function() {}
                    })
                    wx.onMenuShareTimeline({
                        title: title + '_东方体育', // 分享标题
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
