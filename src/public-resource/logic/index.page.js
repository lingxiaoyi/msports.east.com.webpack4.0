import '../../public-resource/sass/newindex.scss'
import '../../public-resource/sass/swiper.scss'
import 'pages/index/style.scss'
import 'zepto/src/selector'
import 'zepto/src/detect'
import 'zepto/src/fx'
import 'zepto/src/fx_methods'
import 'zepto/src/touch'
import 'zepto/src/gesture'
import './log.js'
import WebStorageCache from 'web-storage-cache'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
//import _teamCode_ from '../libs/team.code'
import Swiper from 'swiper'
import Sortable from 'sortablejs'
//
// while (localStorage.key(0)) {
//     localStorage.removeItem(localStorage.key(0))
// }

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.3' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let $swiperWrapper = $('#mainSection').children('.swiper-wrapper') //外层swiper
    let $swiperSlides
    // let $swiperSlidesNums = $swiperSlides.length
    //导航条元素
    let $body = $('body')
    let $header = $('header')
    let $headNav = $('#headNav')
    let $headNavBtn = $headNav.find(' .nav-setBtn')
    let $headNavNew = $headNav.find('.nav-new ul')
    let $pullDownLoadTips = $headNav.children('.pull-down-load-tips')
    let $navSetBox = $('.nav-setBox')
    let $navSetButton = $('.nav-setBox button')
    let $nav_set_item = $('.nav_set_item')
    let wsCache = new WebStorageCache()
    $body.append(`<div class="popup" id="popup"></div>`)//加入弹窗
    let $popup = $('#popup')
    let $swiperCon = $('#swiperContainer')
    // 定义需要传入接口的值
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    const _pixel_ = window.screen.width + '*' + window.screen.height
    let _qid_ = _util_.getPageQid()
    _qid_ = _AD_['indexGg'][_qid_] ? _qid_ : 'null' //将qid过滤 如果广告中没有定义的就为null
    let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
    let token = _util_.CookieUtil.get('hctoken')

    /* if (token) {
         $body.append(hcUtil.fixedTabs(1, 1))
     } else {
         $body.append(hcUtil.fixedTabs(1, 0))
     }*/

    class EastSport {
        constructor() {
            this.firstIntoPage = true //第一次进入页面
            this.navInit() //初始化导航栏
            this.class = _util_.getUrlParam('class') || _util_.CookieUtil.get('curClass')
            this.from = _util_.getUrlParam('from')
            this.channel = '' //根据这个值去加载相应的新闻内容
            this.pullUpFinished = this.createArr(true) //下拉加载用 防止重复加载
            this.startkeyArr = wsCache.get('startkeyArr') || this.createArr('') // 用来拉取分页
            this.newkeyArr = wsCache.get('newkeyArr') || this.createArr('') // 用来拉取分页
            this.ggIndexArr = wsCache.get('ggIndexArr') || this.createArr(0)
            this.ggIndexOldArr = wsCache.get('ggIndexOldArr') || this.createArr(0)
            this.headerHeight = $header.height() //logo的固定高度
            this.loadingHeight = wsCache.get('loadingHeight') || 0
            this.slideHeight = '' //模块的固定高度
            this.dataType = '' //栏目的类型 tuijian shipin NBA
            this.hasmLinks = this.createArr(false)
            this.pgnumState = wsCache.get('pgnumState') || {
                0: this.createArr(1),
                1: this.createArr(-1)
            } //2、3、4 -1、-2、-3正值代表上拉 负值代表下拉
            this.idx = wsCache.get('idx') || this.createArr(1) //上拉的列表位置
            this.idxtop = wsCache.get('idxtop') || this.createArr(-1) //下拉的列表位置
            this.pgnum = wsCache.get('pgnum') || this.createArr(1)
            this.readhistory = ''
            //下拉所需值
            this.startPos = 0			// 滑动开始位置
            this.touchDistance = 0		// 滑动距离
            this.isTop = false				// 顶部判断标志
            this.TOUCH_DISTANCE = 100		// 规定滑动加载距离
            this.direction = '' //规定手指滑动的方向slideDown向下
            this.clientWidth = $(window).width()
            this.isTouchBottom = false//判断是否拉到最底端
            this.pullDownFinished = true//只有接口调用完成后才能下一次调用
            this.isSlideMove = false
            this.focusRequest = ''
            this.indexmatchRequest = ''
            this.newspoolRequest = ''
            this.action = wsCache.get('action') || false //没行动   加载其他模块就为true
            this.dspData = ''
            this.starts = new Date(prevDate).getTime() //当前时间戳
            this.imgIndex = this.createArr(0) //存储图片加载到的位置，避免每次都从第一张图片开始遍历
            this.adIsCheats = (_qid_ === 'tiyutt' || _qid_ === 'tiyumshd' || _qid_ === 'tiyuxqqkj' || _qid_ === 'qid02463' || _qid_ === 'tiyudh' || _qid_ === 'tiyutytt' || _qid_ === 'qid02556' || _qid_ === 'qid02625' || false) //作弊广告渠道
            this.init()
        }

        //创造数组用来保存数据
        createArr(value) {
            let obj = {}
            $swiperSlides.each(function () {
                obj[$(this).attr('data-type')] = value
            })
            return obj
        }

        init() {
            this.computedSlideHeight() //计算栏目的高度
            this.changeNavPos() //在注册导航栏点击事件
            if (this.adIsCheats || ((_qid_ === 'null' || _qid_ === 'baiducom') && this.dataType === 'tuijian')) {
                //$('.adSet').remove()
            } else {
                $('.adSet').html(`<li style="padding:0" class="gg clearfix bdgg-wrap" data-ggid="pkchcjjjm1">
                     <div id="pkchcjjjm"></div>
                    </li>`)
                _util_.getScript(`//df888.eastday.com/pkchcjjjm.js`, function () {
                }, $(`#pkchcjjjm`)[0])
            }
            /*if (_qid_ === 'null') {
                this.popupApp() //注册弹窗下载app
                //this.xuanfugg()
            }*/
            // $headNavLi.eq(this.class).click() //加载当前栏目数据
            // $header.show()
        }

        navInit() { // 初始化导航栏
            let str = '', str2 = '', str3 = '', navTags = JSON.parse(localStorage.getItem('navTags') || '[]'), navObj,
                that = this
            if (navTags.length && navTags.length === navItems.length) {
                navObj = navTags
            } else {
                navObj = navItems
            }
            navObj.forEach(function (v, k) {
                let className = 'drag-el'
                if (k < 2) {
                    className = "first_item"
                }
                if (v.type === that.class) {
                    str += `<li data-channel="${v.code}" data-type="${v.type}" class="active">${v.name}</li>`
                } else {
                    str += `<li data-channel="${v.code}" data-type="${v.type}">${v.name}</li>`
                }
                str2 += `<li class="${className}" data-type="${v.type}">${v.name}</li>`
                if (that.firstIntoPage && k) {
                    str3 += `<div  class="swiper-slide" data-type="${v.type}"><div class="loading-tips1 l-btn-refresh1"><div><i class="iloading rotating"></i>正在加载</div></div></div>`
                }
            })
            $headNavNew.html(str)
            if (!that.class) {
                this.class = _util_.CookieUtil.get('class') || navItems[0].type
            }
            $nav_set_item.html(str2)
            if (this.firstIntoPage) {
                $swiperWrapper.append(str3)
            }
            $swiperSlides = $swiperWrapper.children()
            // 导航栏排序
            this.sortable = this.sortable || new Sortable($nav_set_item[0], {
                group: "navTab",
                filter: ".first_item",
                ghostClass: "dragging-css",
                draggable: ".drag-el",
                onEnd: function () {
                    let navArr = [], dataType, linavArr = [], liWArr2 = []
                    $nav_set_item.children().each(function () {
                        dataType = $(this).attr('data-type')
                        navObj.forEach(function (v) {
                            if (v.type === dataType) {
                                navArr.push(v)
                                linavArr.push(v.type)
                            }
                        })
                    })
                    if (that.liWArr) {
                        console.log(that.liWArr)
                        linavArr.forEach(function (v) {
                            liWArr2[v] = that.liWArr[v]
                        })
                        that.liWArr = liWArr2
                        $headNavNew.scrollLeft(_util_.computedWidth(that.liWArr, (linavArr.indexOf(that.class) - 2)) - 30)
                    }
                    localStorage.setItem('navTags', JSON.stringify(navArr))
                    that.navInit()
                }
            })
            //添加用户头像
            // headpic
            $('.header .user').attr('href', token ? './hc/personal.html' : './hc/login.html')
            if (_util_.CookieUtil.get('headpic')) {
                $('.header .user').html(`<img src="${_util_.CookieUtil.get('headpic')}">`).attr('href', token ? './hc/personal.html' : './hc/login.html')
            }
        }

        computedSlideHeight() {
            let wHeight = $(window).height()
            // this.headerHeight = $header.height() //这2个高度下边会用到
            this.headNavHeight = $headNav.height()
            this.slideHeight = wHeight - this.headNavHeight //这2个高度下边会用到  - this.headerHeight
            let that = this
            $swiperSlides.each(function () {
                $(this).css({
                    'height': that.slideHeight + 'px',
                    'overflowY': 'scroll'
                })
            })
        }

        // 点击栏目按钮
        changeNavPos() {
            this.liWArr = this.liWArr || {}
            let that = this, $headNavLi = $headNavNew.find('li'), livebox,
                $focusNav = $headNavNew.find(`li[data-type="${this.class}"]`)
            $headNavLi.each(function () {
                that.liWArr[$(this).attr('data-type')] = $(this).width()
            })
            $headNavNew.on('click', 'li', function () {
                let i = $(this).attr('data-type')
                if (that.liveObj) {
                    that.liveObj.pause()
                    that.liveObj = null
                }
                if (!that.firstIntoPage && i === that.class) {
                    if (that.pullDownFinished) {
                        that.pullDownFinished = false
                        if (_qid_ === 'null') {
                            that.loadNewsListForPullDown()
                        }
                    }
                    return
                }
                //中断上一栏目的加载
                if (that.focusRequest) {
                    that.focusRequest && that.focusRequest.abort()
                    that.indexmatchRequest && that.indexmatchRequest.abort()
                    that.newspoolRequest && that.newspoolRequest.abort()
                    that.pullUpFinished[that.class] = true
                }
                if (!that.firstIntoPage) {
                    let html = $swiperWrapper.find(`[data-type="${that.class}"]`).html().replace(/<a ([^>]*)data-dsp([^>]*)>([\s\S]*?)<\/a>/g, '')
                    $swiperWrapper.find(`[data-type="${that.class}"]`).html(``)
                    if ($swiperWrapper.find(`[data-type="${that.class}"]`).find('ul').length) {
                        wsCache.set(`newsModule${that.class}`, html, {exp: 10 * 60})
                        wsCache.set(`scrollTop${that.class}`, $swiperWrapper.find(`[data-type="${that.class}"]`).scrollTop(), {exp: 10 * 60})
                    }
                }
                that.class = i
                if (that.firstIntoPage) {
                    if (i !== 'tuijian') {
                        $swiperWrapper.find(`[data-type="${that.class}"]`).html(`<div class="loading-tips1 l-btn-refresh1"><div><i class="iloading rotating"></i>正在加载</div></div>`)
                    } else {
                        $swiperWrapper.find(`[data-type="${that.class}"]`).find('.indexItem').show().siblings().remove()
                    }
                }
                $swiperSlides.hide()
                $swiperWrapper.find(`[data-type="${that.class}"]`).show()
                $(this).addClass('active').siblings().removeClass('active')
                $headNavNew.scrollLeft(_util_.computedWidth(that.liWArr, (Object.keys(that.liWArr).indexOf(that.class) - 2)) - 30)
                //测试某个渠道拉取这个code的新闻点击量
                if (_qid_ === 'tiyuvivobrowser01' && that.class === 0) {
                    that.channel = '901282'
                } else {
                    that.channel = $(this).attr('data-channel')
                }
                _util_.CookieUtil.set('curClass', that.class, 1 / 6) //保存10分钟
                //加载模块内容
                that.dataType = $(this).attr('data-type')
                //获取每个单独栏目阅读历史
                that.readhistory = _util_.CookieUtil.get(`historyUrlArr${that.dataType}`) || 'null'
                if ($(this).attr('data-type') === 'shijiebei' && !$swiperWrapper.find(`[data-type="${that.class}"]`).find('iframe').length) {
                    // scrolling="autoa"
                    $swiperWrapper.find(`[data-type="${that.class}"]`).html(`<iframe src="theme/yayunhui.html" width="100%" height="100%" frameborder="0" ></iframe>`)
                    return
                }
                //加载缓存的数据或者线上的
                loadCurChannelData.call(that)
                that.firstIntoPage = false //进过页面就判断为进过
            })

            //加载当前栏目数据
            function loadCurChannelData() {
                if (/*false*/wsCache.get(`newsModule${that.class}`) && that.dataType !== 'zhibo'/* && wsCache.get(`newsModule${that.class}`).indexOf('iframe') >= 0 && wsCache.get(`newsModule${that.class}`).indexOf('data-dsp="hasDsp"') < 0*/) {
                    let html = wsCache.get(`newsModule${that.class}`)
                    if (html === '<section class="sec-news-list"></section>') {
                        wsCache.set(`newsModule${that.class}`, null)
                        that.loadCurChannelData()
                        return false
                    }
                    $swiperWrapper.find(`[data-type="${that.class}"]`).html(html)
                    that.loadBdGgCache()
                    that.loadLazyImg()
                    $swiperWrapper.find(`[data-type="${that.class}"]`).scrollTop(wsCache.get(`scrollTop${that.class}`))
                    that.loadLazyImg(0)
                    that.delLoadingTips()
                    that.pullUpLoadNews() //注册加载上拉更多新闻
                    that.pullDownLoadNews() //注册加载下拉更多新闻
                    that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                    that.unload() //离开页面事件
                    if (_qid_ === 'null') {
                        if (that.from) that.loadNewsListForPullDown()//如果有from来源
                        //激活轮播图
                    }
                    if ($('#swiperContainer').length) {
                        new Swiper('#swiperContainer', {
                            loop: true, /* spaceBetween: 10, */
                            centeredSlides: true,
                            autoplay: 4000,
                            autoplayDisableOnInteraction: false
                        })
                    }
                } else {
                    that.ggIndexArr[that.class] = 0
                    that.idx[that.class] = 1
                    that.idxtop[that.class] = -1
                    that.pgnum[that.class] = 0
                    that.pgnumState[0][that.class] = 1
                    that.pgnumState[1][that.class] = -1
                    that.loadDataHtml()
                }
                if ($('.indexItem video')) {
                    //点击直播
                    this.liveObj = $('.indexItem video')[0]
                    livebox = $('.indexItem .live')
                    if (this.liveObj) {
                        this.liveObj.onpause = function () {
                            livebox.addClass('pause')
                        }
                        this.liveObj.onplay = function () {
                            livebox.removeClass('pause')
                        }
                        livebox.on('click', function () {
                            that.liveObj.play()
                            livebox.removeClass('pause')
                        })
                    }
                }
            }

            // 设置导航栏
            $headNavBtn.on('click', function () {
                that.liveObj && that.liveObj.pause()
                $navSetBox.show()
            })
            $navSetBox.on('click', '.nav_back', function () {
                $navSetBox.hide()
            })
            $navSetButton.on('click', function () {
                localStorage.setItem('navTags', JSON.stringify(navItems))
                that.navInit()
            })
            $swiperWrapper.find('[data-type="tuijian"]').on('scroll', function () {
                if (that.liveObj && $(that.liveObj).offset().top < 0) {
                    that.liveObj.pause()
                }
            })
            $focusNav.length ? $focusNav.click() : $headNavLi.eq(0).click()
        }

        /*registMySwiper() {
            let that = this
            this.mySwiper = new Swiper('#mainSection', {
                speed: 500,
                onInit: function(swiper) {},
                onSlideChangeStart: function(swiper) {
                    let activeIndex = swiper.activeIndex
                    $headNavLi.eq(activeIndex).click() //激活导航条移动
                },
                onSlideChangeEnd: function(swiper) {},
                onSliderMove: function(swiper, event) {
                    that.isSlideMove = true
                    that.setPullDownLoadTipsAnimation('slideUp 0s') //发现是swiper移动瞬间将元素向上隐藏
                },
                onTouchEnd: function(swiper) {
                    that.isSlideMove = false
                }
            })
        }*/

        loadDataHtml() {
            let that = this
            switch (this.dataType) {
                case 'tuijian':
                    // this.loadRecommendCol()
                    that.initNews()
                    break
                case 'shipin':
                    that.initNews()
                    break
                case 'zhibo':
                    that.loadZhibo()
                    break
                default:
                    that.initNews()
            }
        }

        loadRecommendCol() {
            if (_qid_ === 'null' || _qid_ === 'baiducom') {
                this.initNews()
            } else {
                this.initNews()
            }
        }

        loadOtherCol() {
            if (_qid_ === 'tiyuxqqkj' || _qid_ === 'tiyucoolpad') {
                this.initNews()
            } else {
                this.initNews()
                // this.loadHotMatch()
            }
        }

        // 轮播图
        loadFocusPic() {
            let that = this
            let $el = $('<div id="swiperContainer" class="swiper-container fs-swiper-container"></div>')
            that.focusRequest = $.ajax({
                type: 'GET',
                url: HOME_LUNBO_API,
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'callbcak'
            }).done(function (result) {
                /*if (_qid_ === 'null') {
                    $el.append(`<div class="swiper-wrapper">${banner(result)}</div>`)
                } else { }*/
                $el.append(`<div class="swiper-wrapper">${produceHtml(result)}</div>`)

                $swiperWrapper.find(`[data-type="${that.class}"]`).html('')
                $swiperWrapper.find(`[data-type="${that.class}"]`).append($el)
                setTimeout(function () {
                    $('#swiperContainer').find('.swiper-slide img').each(function () {
                        $(this).attr('src', $(this).attr('data-src'))
                    })
                }, 50)
                that.delLoadingTips(0)
                // if (_qid_ === 'null' || _qid_ === 'baiducom') {
                //     that.loadHotMatch()
                // } else {
                //     that.initNews()
                // }
                // that.loadHotMatch()
                //激活轮播图
                /*if (_qid_ !== 'null') {}*/
                new Swiper('#swiperContainer', {
                    loop: true, /* spaceBetween: 10, */
                    centeredSlides: true,
                    autoplay: 4000,
                    autoplayDisableOnInteraction: false
                })
            })

            function produceHtml(result) {
                let data = result.data
                let html = ''
                data.forEach(function (item, i) {
                    if (i < 5) {
                        // let i = 1
                        // let item = data[i]
                        html += `<div class="swiper-slide">
                                     <a href="${`${item.url.replace('http:', 'https:')}?${`qid=${_qid_}&idx=${i + 1}&from=lunbo${i + 1}&pgtype=${that.dataType}`}`}" suffix="lunbo${i + 1}">
                                     <img data-src="${item.image_url}"/>
                                     <p>${item.title}
                                     <span>${i + 1}&nbsp;/&nbsp;<i>5</i></span>
                                     </p></a>
                                 </div>`
                    }
                })
                return html
            }

            /*function banner(result) {
                let i = 0
                let item = result.data[i]
                let html = `<div class="swiper-slide">
                                     <a href="${`${item.url}?${`qid=${_qid_}&idx=${i + 1}&from=lunbo${i + 1}&pgtype=${that.dataType}`}`}" suffix="lunbo${i + 1}">
                                     <img data-src="${item.image_url}"/>
                                     <p>${item.title}
                                     <!--<span>${i + 1}&nbsp;/&nbsp;<i>5</i></span>-->
                                     </p></a>
                                 </div>`
                return html
            }*/
        }

        // 热门比赛
        loadHotMatch() {
            let $el = $(`<section class="sec-match"></section>`)
            let data
            let that = this
            let api
            let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
            let starts = new Date(prevDate).getTime()
            let endts = starts + 24 * 60 * 60 * 1000
            if (that.dataType === 'tuijian') {
                api = 'matchba'
                data = {
                    startts: starts,
                    endts: endts,
                    saishiid: '',
                    isimp: '1',
                    os: _os_,
                    recgid: _recgid_,
                    qid: _qid_,
                    domain: _domain_
                }
            } else {
                api = 'indexmatch'
                data = {
                    channel: this.channel,
                    os: _os_,
                    recgid: _recgid_,
                    qid: _qid_,
                    domain: _domain_
                }
            }
            that.indexmatchRequest = _util_.makeJsonp(HOST + api, data).done(function (result) {
                if (result.data.length) { //有推荐赛程就添加元素
                    $el.append(`<ul class="clearfix">${produceHtml.call(that, result)}</ul>`)
                    if (that.class !== 0) {
                        $swiperWrapper.find('[data-type="' + that.class + '"]').html('')
                    }
                    $swiperWrapper.find('[data-type="' + that.class + '"]').append($el)
                    let $living = $el.find('li.living').last()
                    if (!$living.length) {
                        $living = $el.find('li.no-start').first()
                        if (!$living.length) {
                            $living = $el.find('li.end').last()
                        }
                    }
                    let left = $living.position().left - window.screen.width / 4
                    $el.find('ul').scrollLeft(left)
                    wsCache.set(`scrollLeft`, left, {exp: 10 * 60})
                    $el.after(`<div class="separate-line"></div>`)
                    if (_os_.indexOf('windows') > -1) { //电脑端
                        $el.find('ul').css('width', '102%')
                    }
                    loadMatchMore.call(that)
                    that.delLoadingTips()
                }
                that.initNews()
            })
            let isRequested = true
            $body.on('click', '.btn-order', function () {
                let that = this
                if ($(that).attr('data-ordered') || !isRequested) {
                    popup(2)
                    return
                }
                isRequested = false
                _util_.makeJsonp(ORDER_API + $(this).attr('data-matchid'), {}).done(function (result) {
                    if (result.status === -1) {
                        popup(1)
                    } else {
                        popup(2)
                        $(that).attr('data-ordered', '1') //订阅过data-ordered为1
                    }
                }).fail(function () {
                    popup(3)
                }).always(function () {
                    isRequested = true
                })
            })
            $body.on('click', '#popup', function () {
                $(this).hide()
            })

            //弹窗
            function popup(option) {
                let html = ``
                switch (option) {
                    case 1:
                        html = `<div class="content">
                                    <img src="//msports.eastday.com/h5/img/getqrcode.jpg" alt=""/>
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

            //处理数据
            function processData(data) {
                let index
                let arr = []
                let length = data.length
                for (let i = 0; i < length; i++) {
                    if (data[i].ismatched === '0') {
                        index = i
                        break
                    } else if (data[i].ismatched === '-1') {
                        index = i
                        break
                    } else {
                        index = length - 1
                    }
                }
                for (let i = 0; i < length; i++) {
                    if (i + 6 >= index && i - 6 <= index) {
                        arr.push(data[i])
                    }
                }
                /*for (let [i, item] of data.entries()) {
                    if (item.ismatched === '0') {
                        index = i
                        break
                    } else if (item.ismatched === '-1') {
                        index = i
                        break
                    } else {
                        index = length - 1
                    }
                }
                for (let [i, item] of data.entries()) {
                    if (i + 6 >= index && i - 6 <= index) {
                        arr.push(item)
                    }
                }*/
                return arr
            }

            function produceHtml(result) {
                let data = result.data
                let html = ''
                if (that.dataType === 'tuijian') {
                    data = processData(data)
                }
                data.forEach(function (item, i) {
                    let title = item.title02
                    let home_team = item.home_team
                    let visit_team = item.visit_team
                    let score = item.home_score + '-' + item.visit_score
                    let orderStr = ''//判断预约的功能
                    let className
                    if (item.ismatched === '-1') {
                        /*if (_util_.isWeiXin()) {
                            orderStr = `<a class="btn-order" data-matchid="${item.matchid}" href="javascript:"><span>预约</span></a>`
                        } else {}*/
                        orderStr = '<span class="empty">未开赛</span>'
                        className = 'no-start'
                    } else if (item.ismatched === '0') {
                        orderStr = '<span class="living">LIVE</span>'
                        className = 'living'
                    } else {
                        orderStr = '<span>集锦</span>'
                        className = 'end'
                    }

                    //if (i < 2) {}
                    item.home_logoname = item.home_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`
                    item.visit_logoname = item.visit_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`
                    if (item.sport_type === '1') {
                        title = item.title
                        //此位置需要注意classname的值 此值用来判断当前赛程的位置
                        html += `<li class="clearfix other ${className}">
                                    <a href="${`${item.liveurl}?${`qid=${_qid_}&idx=${i + 1}&from=match${i}&pgtype=${that.dataType}`}`}" suffix="match${i}">
                                        <h6>${item.title02}</h6>
                                        <h3>${title}</h3>
                                        <div class="row ${className}">
                                            <div class="t">${item.starttime.split(' ')[1]}</div>
                                             ${orderStr}
                                        </div>
                                    </a>
                                </li>`
                    } else {
                        html += `<li class="clearfix ${className}">
                                <a href="${`${item.liveurl}?${`qid=${_qid_}&idx=${i + 1}&from=match${i}&pgtype=${that.dataType}`}`}" suffix="match${i}">
                                <h3>${title}</h3>
                                <div class="team">
                                    <img src="${item.home_logoname}" alt=""/>
                                    <p>${home_team}</p>
                                </div>
                                <div class="info" id="${item.matchid}">
                                    <div class="score">${item.ismatched === '-1' ? _util_.formatTimeToMatch(item.currentServerTime, item.starttime) : score}</div>
                                    ${orderStr}
                                </div>
                                <div class="team">
                                    <img src="${item.visit_logoname}" alt=""/>
                                    <p>${visit_team}</p>
                                </div>
                                </a>
                            </li>`
                    }
                })
                return html
            }

            //加载推荐比赛下的模块
            function loadMatchMore() {
                let dateTxt = new Date().format('MM月dd日')
                if (this.class === 0) { //第一个推荐栏目
                    $el.after(`<a class="match-more" href="saishi.html?from=hotmatch&pgtype=${that.dataType}&type=all" suffix="hotmatch">
                                    <div class="l">${dateTxt}</div>
                                    <div class="m">查看今天全部热门比赛</div>
                                    <div class="r"></div>
                                </a>`)
                } else { //其他栏目
                    $el.after(`<div class="match-more">
                                    <div class="item">
                                        <a href="schedule.html?class=${that.dataType.toLowerCase()}&pgtype=${that.dataType}">
                                            <img src="${config.DIRS.BUILD_FILE.images['i-s-saicheng']}" alt=""/>
                                            赛程
                                        </a>
                                    </div>
                                    <div class="item">
                                        <a href="data.html?type=t&name=${that.dataType.toLowerCase()}&class=data&pgtype=${that.dataType}">
                                            <img src="${config.DIRS.BUILD_FILE.images['i-shuju']}" alt=""/>
                                            数据
                                        </a>
                                    </div>
                                    <div class="line"></div>
                                </div>`)
                }
            }
        }

        //加载直播全部赛事
        loadZhibo() {
            let that = this
            let $el = $swiperWrapper.find(`[data-type="${that.class}"]`)
            $el.html(`<div class="crumbs">
            <div class="time all-time">
                <div class="cont">
                    <span class="left"></span>
                    <span class="middle" id="dateText">-</span>
                    <span class="right"></span>
                </div>
            </div>
        </div><ul class="matchs"></ul>`)
            let $dateText = $('#dateText')
            let $matchs = $el.find('.matchs')
            loadMatchList.call(that)
            selectDateToMatch.call(that)

            function loadMatchList() {
                let that = this
                let data = {
                    startts: this.starts,
                    endts: this.starts + 24 * 60 * 60 * 1000,
                    saishiid: '',
                    isimp: '1'
                }
                formatDateText(this.starts)
                $matchs.html('')
                $el.append(`<div class="loading-tips1 l-btn-refresh1"><div><i class="iloading rotating"></i>正在加载</div></div>`)
                _util_.makeJsonp(HOST + 'matchba', data).done(function (result) {
                    if (!result.data.length) {
                        $matchs.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                        return
                    }
                    $matchs.html('')
                    produceHtml(result)
                    if ($matchs.find('li.live').length) {
                        $el.scrollTop($matchs.find('li.live').eq(0).position().top)
                    } else if ($matchs.find('li.unstart').length) {
                        $el.scrollTop($matchs.find('li.unstart').eq(0).position().top)
                    }
                }).always(function () {
                    that.delLoadingTips()
                })

                function produceHtml(result) {
                    result.data.forEach(function (v) {
                        let liveInfo = (function (arr) {
                            let infoName = []
                            arr.forEach(function (item) {
                                let name = item.title.split('(')[0]
                                if (infoName.indexOf(name) < 0) infoName.push(name)
                            })
                            return infoName
                        })(v.zhiboinfozh)
                        let state2 = ''
                        let state = (function (a) {
                            if (a === 1) {
                                state2 = (v.hasjijin / 1 + v.hasluxiang / 1) ? `<div class="info">${v.hasjijin / 1 ? '<em>集锦</em>' : ''}${v.hasluxiang / 1 ? '<em>录像</em>' : ''}</div>` : '已结束'
                                return 'end'
                            }
                            if (a === 0) {
                                state2 = `<div class="info"><em>直播中</em>${liveInfo.length ? `<br>${liveInfo[0]}` : ''}</div>`
                                return 'live'
                            }
                            state2 = liveInfo.length ? `<div class="info">${liveInfo[0] ? liveInfo[0] : ''}${liveInfo[1] ? `<br>${liveInfo[1]}` : ''}</div>` : '敬请期待'
                            return 'unstart'
                        })(v.ismatched / 1)
                        let score = (function (a) {
                            if (a === -1) return '<i></i>'
                            return `<div class="hscore">${v.saishi_id === '900002' ? v.visit_score : v.home_score}</div>
                            <div class="vscore">${v.saishi_id === '900002' ? v.home_score : v.visit_score}</div>`
                        })(v.ismatched / 1)
                        let html = ``
                        if (v.sport_type === '1') {
                            html = `<div class="title2">${v.title}</div>`
                            score = ''
                        } else {
                            html = `<div class="host"><img src="${v.saishi_id === '900002' ? v.visit_logoname : v.home_logoname}" alt=""><span>${v.saishi_id === '900002' ? v.visit_team : v.home_team}</span></div>
                            <div class="visit"><img src="${v.saishi_id === '900002' ? v.home_logoname : v.visit_logoname}" alt=""><span>${v.saishi_id === '900002' ? v.home_team : v.visit_team}</span></div>`
                        }
                        $matchs.append(`<li class="${state}">
                    <a href="${v.liveurl}">
                        <div class="tt">
                            <div class="tit">
                                <em>${v.starttime.split(' ')[1]}</em><br>${v.title02}
                            </div>
                        </div>
                        <div class="team">
                            ${html}
                        </div>
                        <div class="score">
                        ${score}                      
                        </div>
                        <div class="state">${state2}</div>
                    </a>
                </li>`)
                    })
                }
            }

            function selectDateToMatch() {
                let that = this
                $dateText.prev().click(function () {
                    that.starts = that.starts - 24 * 60 * 60 * 1000
                    loadMatchList.call(that, that.starts)
                })
                $dateText.next().click(function () {
                    that.starts = that.starts + 24 * 60 * 60 * 1000
                    loadMatchList.call(that, that.starts)
                })
            }

            function formatDateText(starts) {
                $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 24 * 60 * 60 * 1000).format('MM-dd')).data('data-timestamp', starts)
            }
        }

        // 信息流初始化
        initNews() {
            let $el = $swiperWrapper.find(`[data-type="${this.class}"]`).find('.sec-news-list')
            if (!$el.length) {
                $el = $(`<section class="sec-news-list"></section>`)
                $swiperWrapper.find(`[data-type="${this.class}"]`).append($el)
            }
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: '',
                newkey: '',
                pgnum: this.pgnumState[0][this.class],
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_,
                readhistory: this.readhistory
            }
            let that = this
            let api = ''
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            that.newspoolRequest = _util_.makeJsonp(HOST + api, data).done(function (result) {
                let option = {
                    isFirstInitNew: true, //页面每个栏目第一次加载新闻
                    loadNewsWay: 'normal' //正常方式加载新闻,下拉为另一种方式
                }
                if ($el.find('ul').length) {
                    $el.find('ul').append(that.produceListHtml(result, option))
                } else {
                    $el.append(`<ul>${that.produceListHtml(result, option)}</ul>`)
                }
                // $swiperWrapper.find(`[data-type="${that.class}"]`).append($el)
                if (_os_.indexOf('windows') > -1) { //电脑端
                    $el.css('padding', 0)
                }
                that.loadLazyImg()
                let loading = $(`<div class="loading-tips2 btn-refresh2"><span class="loading rotating"></span>正在载入新内容...</div>`)
                $el.after(loading)//尾部加入load动画
                that.loadingHeight = loading.height()//计算下方load高度
                that.startkeyArr[that.class] = result.endkey
                that.newkeyArr[that.class] = result.newkey
                that.pgnum[that.class]++
                that.pgnumState[0][that.class]++
                if (that.class !== 0) {
                    wsCache.set(`action`, true, {exp: 10 * 60})
                } //加载过其他模块
                wsCache.set('idx', that.idx, {exp: 10 * 60})
                wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                wsCache.set('loadingHeight', that.loadingHeight, {exp: 10 * 60})//保存load高度
                wsCache.set('pgnum', that.pgnum, {exp: 10 * 60})
                wsCache.set('pgnumState', that.pgnumState, {exp: 10 * 60})
                that.delLoadingTips()
                let html = $swiperWrapper.find(`[data-type="${that.class}"]`).html().replace(/<a ([^>]*)data-dsp([^>]*)>([\s\S]*?)<\/a>/g, '')
                wsCache.set(`newsModule${that.class}`, html, {exp: 10 * 60})
                that.pullUpLoadNews() //注册加载上拉更多新闻
                that.pullDownLoadNews() //注册加载下拉更多新闻
                that.btnLoadMoreNews() //注册点击下拉加载事件btn-load-more元素
                that.unload() //离开页面事件
            }).done(function () {
                that.loadDspBdGg()
            }).done(function () { //加顶部广告
                if (that.dataType !== 'shipin' && !that.adIsCheats) {
                    let _ggID_ = _AD_['indexGGAddThree'][_qid_]
                    if (!_ggID_ || $('#' + _ggID_).length) {
                    } else {
                        $swiperWrapper.find(`[data-type="${that.class}"]`).prepend(`<div><div id="${_ggID_}"></div></div>`)
                        if (_qid_ === 'tiyutytt') {
                            let ad = _AD_.sgGg[_qid_].list
                            $(`#${_ggID_}`).append(`<iframe style="padding: 0 0.24rem" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="140"></iframe>`)
                        } else {
                            _util_.getScript(`//df888.eastday.com/${_ggID_}.js`, function () {
                            }, $(`#${_ggID_}`)[0])
                        }
                    }
                }
            }).done(function () {
                if (_qid_ === 'null') {
                    if (that.from) that.loadNewsListForPullDown()
                }
            })
        }

        // 上拉加载新闻
        pullUpLoadNews() {
            let that = this
            $swiperWrapper.find(`[data-type="${that.class}"]`).scroll(function () {
                if (!$(this).children('.loading-tips2').length) return
                let tipsTop = $(this).children('.loading-tips2').position().top //这个是距离父元素定位的距离  会变的越来越小
                let slideHeight = that.slideHeight
                if (!$header.is(':visible')) {
                    slideHeight = slideHeight + that.headerHeight
                }
                slideHeight = slideHeight + that.headNavHeight
                //let scrollTop = $(this).scrollTop()
                //加5是为了减少误差
                if (slideHeight - that.loadingHeight + 5 >= tipsTop && that.pullUpFinished[that.class]) {
                    that.pullUpFinished[that.class] = false
                    that.loadNewsList()
                }
                //that.loadLazyImg(this.scrollTop)
            })
        }

        loadNewsList() {
            let that = this
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: this.startkeyArr[this.class],
                newkey: this.newkeyArr[this.class],
                pgnum: this.pgnumState[0][this.class],
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_,
                readhistory: this.readhistory
            }
            let api = ''
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            _util_.makeJsonp(HOST + api, data).done(function (result) {
                if (!result.data.length) {
                    //提示没有数据了
                    that.changeLoadingTips2('没有更过内容了...')
                    return
                }
                that.startkeyArr[that.class] = result.endkey
                that.newkeyArr[that.class] = result.newkey
                that.pgnum[that.class]++
                that.pullUpFinished[that.class] = true
                let option = {
                    isFirstInitNew: false, //页面每个栏目第一次加载新闻
                    loadNewsWay: 'normal' //正常方式加载新闻,下拉为另一种方式
                }
                Object.keys(that.ggIndexArr).forEach(function (k) {
                    that.ggIndexOldArr[k] = that.ggIndexArr[k]
                })
                wsCache.set('ggIndexOldArr', that.ggIndexOldArr, {exp: 10 * 60})//保存广告的位置
                $swiperWrapper.find(`[data-type="${that.class}"]`).find('.sec-news-list ul').append(that.produceListHtml(result, option))
                that.loadLazyImg()
                that.pgnumState[0][that.class]++
                wsCache.set(`action`, true, {exp: 10 * 60})
                wsCache.set(`idx`, that.idx, {exp: 10 * 60})
                wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                wsCache.set('pgnum', that.pgnum, {exp: 10 * 60})
                wsCache.set('pgnumState', that.pgnumState, {exp: 10 * 60})
                let html = $swiperWrapper.find(`[data-type="${that.class}"]`).html().replace(/<a ([^>]*)data-dsp([^>]*)>([\s\S]*?)<\/a>/g, '')
                wsCache.set(`newsModule${that.class}`, html, {exp: 10 * 60})
            }).done(function () {
                that.requestDspUrl(3).done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    let n = 0
                    for (let i = that.ggIndexOldArr[that.class]; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        if (that.dspData[n]) {
                            $(`#${value}`).html(that.loadDspHtml(n))
                            n++
                        } else {
                            _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }
                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)
                }).fail(function () {
                    for (let i = that.ggIndexOldArr[that.class]; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                        }, $('#' + value)[0])
                    }
                })
            }).fail(function () {
                that.pullUpFinished[that.class] = true
            })
        }

        /**
         *
         * @param result
         * @param  option = {
                        isFirstInitNew: true, //页面每个栏目第一次加载新闻
                        loadNewsWay: 'normal' //正常方式加载新闻,下拉为另一种方式
                    }
         * @returns {string}
         */
        produceListHtml(result, option) {
            let data = result.data
            let html = ''
            let that = this
            let dataLength = result.data.length
            let pgnum
            let idx
            /*if (_qid_ === 'baiducom') {
                _qid_ = 'null'
            }*/
            if (that.dataType === 'shipin') {
                data.forEach(function (item, i) {
                    if (option.loadNewsWay === 'normal') {
                        pgnum = that.pgnumState[0][that.class]
                        idx = that.idx[that.class]
                    } else {
                        let arr = [
                            -14,
                            -12,
                            -10,
                            -8,
                            -6,
                            -4,
                            -2,
                            0,
                            2,
                            4,
                            6,
                            8,
                            10,
                            12,
                            14,
                            16
                        ]
                        pgnum = that.pgnumState[1][that.class] + 1
                        idx = that.idxtop[that.class] + arr[i]
                    }
                    html += `<li class="clearfix video-list">
                                    <div class="img"><a href="${`${item.url}?${`qid=${_qid_}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}&pgtype=${that.dataType}`}`}" suffix="">
                                        <img class="lazy" src="${item.miniimg[0].src}"/>
                                        <div class="title">${item.topic}</div>
                                        <div class="icon"></div>
                                        <div class="duration">${_util_.formatDuring(item.videoalltime)}</div></a>
                                     </div>
                                    <div class="info">
                                        <div class="img"> <img src="${item.dfhheadsrc ? item.dfhheadsrc : `${config.DIRS.BUILD_FILE.images['i-logo']}`}" alt=""> </div>
                                        <div class="name">${item.dfhname ? item.dfhname : '东方体育'}</div>
                                        <div class="tag">
                                            
                                            <!--<i>詹姆士</i> <i>勇士</i> -->
                                        </div>
                                    </div>
                                </li>`
                    if (option.loadNewsWay === 'normal') {
                        that.idx[that.class]++
                    } else {
                        that.idxtop[that.class]--
                    }
                    //加入广告的位置
                    if (option.isFirstInitNew && !that.adIsCheats) {
                        if (i === 1) {
                            html += `<li class="clearfix video-list" id="huanqiu1"></li>`
                        } else if (i === 4) {
                            html += `<li class="clearfix video-list" id="huanqiu2"></li>`
                        } else if (i === 9) {
                            html += `<li class="clearfix video-list" id="huanqiu3"></li>`
                        } else if (i === 14) {
                            html += `<li class="clearfix video-list" id="huanqiu4"></li>`
                        }
                    }
                })
            } else {
                let typeName = encodeURI($('.nav-new li.active').html())
                data.forEach(function (item, i) {
                    let length = item.miniimg.length// 判断缩略图的数量
                    let tag = ''
                    let tagName = ''
                    if (item.isvideo === '1') {
                        tag += ' <div class="tag-qt">视频</div>'
                    }
                    if (item.iszhiding === '1' && item.tags) {
                        tag = `<div class="tag-zd">${item.tags}</div>`
                    } else {
                        if (item.ishot === '1') {
                            tag = '<div class="tag-zd">热门</div>'
                        } else if (item.iscommend === '1') {
                            tag += ' <div class="tag-qt">推荐</div>'
                        }
                    }
                    /*let arr = item.tagsid.split(',')
                    for (let i = 0; i < arr.length; i++) {
                        if (_teamCode_[arr[i]] && _teamCode_[arr[i]]['type_match'] === '人') {
                            tagName = _teamCode_[arr[i]]['name']
                            break
                        }
                    }
                    if (!tagName) {
                        for (let i = 0; i < arr.length; i++) {
                            if (_teamCode_[arr[i]] && _teamCode_[arr[i]]['type_match'] === '球队') {
                                tagName = _teamCode_[arr[i]]['name']
                                break
                            }
                        }
                    }
                    if (!tagName) {
                        for (let i = 0; i < arr.length; i++) {
                            if (_teamCode_[arr[i]] && _teamCode_[arr[i]]['type_match'] === '赛事') {
                                tagName = _teamCode_[arr[i]]['name']
                                break
                            }
                        }
                    }*/
                    if (option.loadNewsWay === 'normal') {
                        pgnum = that.pgnumState[0][that.class]
                        idx = that.idx[that.class]
                    } else {
                        let arr = [-6, -4, -2, -0, 2, 4, 6]
                        pgnum = that.pgnumState[1][that.class] + 1
                        idx = that.idxtop[that.class] + arr[i]
                    }
                    if (length < 3 && length >= 1) {
                        html += `<li class="clearfix">
                                    <a href="${`${item.url}?${`qid=${_qid_}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}&from=${item.iszhiding === '1' ? `top${that.idx[that.class]}` : `${that.dataType}`}&dataType=${that.dataType}&typeName=${typeName}&pgtype=${that.dataType}`}`}" suffix="${item.iszhiding === '1' ? `top${that.idx[that.class]}` : `${that.dataType}`}">
                                        <div class="img">
                                            <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" class="lazy" data-src="" data-echo="${item.miniimg[0].src}"/>
                                            ${item.isvideo === '1' ? `<span class="play-btn"></span>` : ''}
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source">
                                                ${tag}
                                            <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
                    } else if (length >= 3) {
                        html += `<li class="clearfix">
                                     <a href="${`${item.url}?${`qid=${_qid_}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}&from=${item.iszhiding === '1' ? `top${that.idx[that.class]}` : `${that.dataType}`}`}`}&dataType=${that.dataType}&typeName=${typeName}&pgtype=${that.dataType}" suffix="${item.iszhiding === '1' ? `top${that.idx[that.class]}` : `${that.dataType}`}">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${item.miniimg[0].src}">
                                            <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${item.miniimg[1].src}">
                                            <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${item.miniimg[2].src}">
                                        </div>
                                        <div class="source">
                                            ${tag}
                                            <div class="l">${item.source} ${tagName}</div>
                                        </div>
                                    </a>
                                </li>`
                    }

                    if (option.loadNewsWay === 'normal') {
                        if ((i + 1) % 3 === 0 && that.ggIndexArr[that.class] < 19) {
                            if (option.isFirstInitNew) {
                                if (i > 7) {
                                    html += that.loadgg()
                                }
                            } else {
                                html += that.loadgg()
                            }
                        }
                    } else {
                        if (i === 1 || i === 4) {
                            html += that.loadgg()
                        }
                        // if ((i - 3) % 3 === 0 && that.ggIndexArr[that.class] < 19) {
                        //     html += that.loadgg()
                        // }
                    }
                    //加入广告的位置
                    if (option.isFirstInitNew) {
                        if (_qid_ === 'null' || _qid_ === 'baiducom') {
                            if (i === 2 || i === 5) {
                                html += that.loadgg()
                            }
                        } else {
                            if (i === 0 || i === 1 || i === 2 || i === 5) {
                                html += that.loadgg()
                            }
                        }
                    }

                    if (option.loadNewsWay === 'normal') {
                        that.idx[that.class]++
                        //中间赛程 排行 统计 下载模块
                        let mlinksLength = $swiperWrapper.find(`[data-type="${that.class}"]`).find('.sec-news-list ul').find('.m-links').length
                        if (that.dataType === 'NBA') {
                            if (that.class !== 0 && i === 0 && !mlinksLength) {
                                html += `<li class="clearfix" style="padding:0;border: 0">
                            <div class="clearfix m-links">
                                <div>
                                    <a href="data.html?name=${that.dataType.toLowerCase()}">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-saicheng']}" alt=""/>
                                        <p>赛程</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="zhuanti_nba_duel.html">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-tongji']}" alt=""/>
                                        <p>季后赛</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="data.html?type=p&name=${that.dataType.toLowerCase()}&class=data">
                                        <img src="${that.dataType === 'NBA' ? `${config.DIRS.BUILD_FILE.images['i-paiming']}` : `${config.DIRS.BUILD_FILE.images['i-jifenbang']}`}" alt=""/>
                                        <p>${that.dataType === 'NBA' ? '排名' : '积分榜'}</p>
                                    </a>
                                </div>
                                <div>
                                    <a href="downloadapp.html?qid=${_qid_}&pagefrom=homepage&from=H5dftiyu">
                                        <img src="${config.DIRS.BUILD_FILE.images['i-zhibo']}" alt=""/>
                                        <p>看直播</p>
                                    </a>
                                </div>
                            </div>
                        </li>`
                                that.hasmLinks[that.class] = true
                            }
                        } else {
                            // $swiperSlides.find('[data-type="tuijian"]').show()
                            /*     if (that.class !== 0 && i === 4 && !mlinksLength) {
                                     html += `<li class="clearfix" style="padding:0;border: 0">
                                 <div class="clearfix m-links">
                                     <div>
                                         <a href="data.html?name=${that.dataType.toLowerCase()}">
                                             <img src="${config.DIRS.BUILD_FILE.images['i-saicheng']}" alt=""/>
                                             <p>赛程</p>
                                         </a>
                                     </div>
                                     <div>
                                         <a href="data.html?type=t&name=${that.dataType.toLowerCase()}&class=data">
                                             <img src="${config.DIRS.BUILD_FILE.images['i-tongji']}" alt=""/>
                                             <p>统计</p>
                                         </a>
                                     </div>
                                     <div>
                                         <a href="data.html?type=p&name=${that.dataType.toLowerCase()}&class=data">
                                             <img src="${that.dataType === 'NBA' ? `${config.DIRS.BUILD_FILE.images['i-paiming']}` : `${config.DIRS.BUILD_FILE.images['i-jifenbang']}`}" alt=""/>
                                             <p>${that.dataType === 'NBA' ? '排名' : '积分榜'}</p>
                                         </a>
                                     </div>
                                     <div>
                                         <a href="downloadapp.html?qid=${_qid_}&pagefrom=homepage&from=H5dftiyu">
                                             <img src="${config.DIRS.BUILD_FILE.images['i-zhibo']}" alt=""/>
                                             <p>看直播</p>
                                         </a>
                                     </div>
                                 </div>
                             </li>`
                                     that.hasmLinks[that.class] = true
                                 }*/
                        }

                    } else {
                        that.idxtop[that.class]--
                        $swiperWrapper.find(`[data-type="${that.class}"]`).find('.sec-news-list ul').find('.btn-load-more').remove()
                        if (i + 1 === dataLength) {
                            html += `<li class="btn-load-more" style="padding:0;">
                                        <div class="tips">
                                            <i>点击刷新个性化推荐</i>
                                        </div>
                                    </li>`
                        }
                    }
                })
            }
            return html
        }

        // 下拉加载新闻
        pullDownLoadNews() {
            let that = this
            $swiperWrapper.find(`[data-type="${that.class}"]`).on('touchstart', function (e) {
                // 防止重复快速下拉
                let _touch = e.touches[0]
                that.startPos = _touch.pageY
                that.isTouchBottom = false
                if ($(this).scrollTop() <= 0) {
                    that.isTop = true
                } else {
                    that.isTop = false
                }
            })

            $swiperWrapper.find(`[data-type="${that.class}"]`).on('touchend', function (e) {
                // 达到下拉阈值 启动数据加载
                if (that.direction === 'slideDown' && that.isSlideMove === false) {
                    /*$header.show()
                    $swiperSlides.each(function() {
                        $(this).css({
                            'height': that.slideHeight + 'px'
                        })
                    })*/
                } else if (that.direction === 'slideUp' && that.isSlideMove === false) {
                    // $header.hide()
                    $body.addClass('nologo')
                    $swiperSlides.each(function () {
                        $(this).css({
                            'height': that.slideHeight + that.headerHeight + 'px'
                        })
                    })
                }
                if (that.isTouchBottom && that.pullDownFinished) {
                    that.pullDownFinished = false
                    that.loadNewsListForPullDown()
                } else { //松开返回顶部
                    if (that.pullDownFinished === true && that.isSlideMove === false) {
                        if ($pullDownLoadTips.attr('style').indexOf('slideDown') >= 0) {
                            that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                        }
                    }
                }
            })
            $swiperWrapper.find(`[data-type="${that.class}"]`).on('touchmove', function (e) {
                let _touch = e.touches[0]
                let py = _touch.pageY
                that.touchDistance = py - that.startPos
                if (that.isSlideMove === true) {
                    return
                }
                // 根据用户开始的滑动手势判断用户是向下滑还是向上滑
                if (that.touchDistance > 0) {
                    that.direction = 'slideDown'
                } else {
                    that.direction = 'slideUp'
                }
                if (that.isTop && that.touchDistance > 0) {
                    // 下拉加载
                    if (that.touchDistance >= that.TOUCH_DISTANCE) {
                        //that.touchDistance = that.TOUCH_DISTANCE
                        that.isTouchBottom = true
                        if (!that.pullDownFinished) { //如果这个值是false 那么模块还在加载中 不用提示松开刷新
                            that.setPullDownLoadTips('加载中...')
                        } else {
                            that.setPullDownLoadTips('松开刷新')
                        }
                    } else {
                        that.isTouchBottom = false
                        that.setPullDownLoadTips('下拉加载')
                    }
                    if (that.touchDistance > 30) {
                        that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                        that.slideDownAnimate = true
                    }

                    $pullDownLoadTips.find('.iloading').css({
                        'transform': `rotate(${that.touchDistance}deg)`
                    })
                    e.preventDefault()
                } else {
                    that.isTouchBottom = false
                }
            })
        }

        //下拉加载新闻列表
        loadNewsListForPullDown() {
            this.liveObj && this.liveObj.pause()
            let that = this
            let data = {
                type: this.dataType,
                typecode: this.channel,
                startkey: this.startkeyArr[this.class],
                newkey: this.newkeyArr[this.class],
                pgnum: this.pgnumState[1][this.class],
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_,
                readhistory: this.readhistory
            }
            that.setPullDownLoadTips('加载中...')
            let api = ''
            // let $swiperCon = $('#swiperContainer')
            if (that.dataType === 'shipin') {
                api = 'videonewspool'
            } else {
                api = 'newspool'
            }
            _util_.makeJsonp(HOST + api, data).done(function (result) {
                $swiperCon.hide()
                if (!result.data.length) {
                    //提示没有数据了
                    that.setPullDownLoadTips('已是最新内容,看看其它频道吧', 1)
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                } else {
                    that.setPullDownLoadTips(`为您更新${result.data.length}条内容`, 1)
                    that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                    that.startkeyArr[that.class] = result.endkey
                    that.newkeyArr[that.class] = result.newkey
                    that.pgnum[that.class]++
                    that.pgnumState[1][that.class]--
                    $swiperWrapper.find(`[data-type="${that.class}"]`).scrollTop(0)
                    let option = {
                        isFirstInitNew: false, //页面每个栏目第一次加载新闻
                        loadNewsWay: 'pullDown' //正常方式加载新闻,下拉为另一种方式
                    }
                    $.each(that.ggIndexArr, function (k, v) {
                        that.ggIndexOldArr[k] = v
                    })
                    // that.ggIndexArr.forEach(function (item, i) {
                    //     that.ggIndexOldArr[i] = item
                    // })
                    wsCache.set('ggIndexOldArr', that.ggIndexOldArr, {exp: 10 * 60})//保存广告的位置
                    $swiperWrapper.find(`[data-type="${that.class}"]`).find('.sec-news-list ul').prepend(that.produceListHtml(result, option))
                    that.loadLazyImg()
                    wsCache.set(`idxtop`, that.idxtop, {exp: 10 * 60})
                    wsCache.set(`action`, true, {exp: 10 * 60})
                    wsCache.set('startkeyArr', that.startkeyArr, {exp: 10 * 60})
                    wsCache.set('newkeyArr', that.newkeyArr, {exp: 10 * 60})
                    wsCache.set('pgnum', that.pgnum, {exp: 10 * 60})
                    wsCache.set('pgnumState', that.pgnumState, {exp: 10 * 60})
                    let html = $swiperWrapper.find(`[data-type="${that.class}"]`).html().replace(/<a ([^>]*)data-dsp([^>]*)>([\s\S]*?)<\/a>/g, '')
                    wsCache.set(`newsModule${that.class}`, html, {exp: 10 * 60})
                }
                setTimeout(function () {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
                that.pullDownFinished = true
            }).done(function () {
                that.requestDspUrl(3).done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    let n = 0
                    for (let i = that.ggIndexOldArr[that.class]; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        if (that.dspData[n]) {
                            $(`#${value}`).html(that.loadDspHtml(n))
                            n++
                        } else {
                            _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }
                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)
                }).fail(function () {
                    for (let i = that.ggIndexOldArr[that.class]; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                        }, $('#' + value)[0])
                    }
                })
            }).fail(function () {
                that.setPullDownLoadTips('网络中断,请刷新页面', 1)
                that.pullDownFinished = true
                setTimeout(function () {
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                }, 2000)
            })
        }

        //图片懒加载
        loadLazyImg() {
            let that = this
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
                    $swiperWrapper.find(`[data-type="${that.class}"]`)[0].addEventListener('scroll', _throttle, false)
                } else {
                    $swiperWrapper.find(`[data-type="${that.class}"]`)[0].attachEvent('onscroll', _throttle)
                }
            }
            init({
                offset: 0, //离可视区域多少像素的图片可以被加载
                throttle: 0 //图片延时多少毫秒加载
            })
        }

        loadgg() {
            if (this.adIsCheats || ((_qid_ === 'null' || _qid_ === 'baiducom') && this.dataType === 'tuijian')) return ''
            let that = this
            let _newsGg_ = _AD_['indexGg'][_qid_].concat(_AD_.indexNoChannel)
            let html = ''
            /* if (!_newsGg_[that.ggIndexArr[that.class]]) {
                 that.ggIndexArr[that.class]++
                 return ''
             }*/
            html += `<li style="padding:0" class="gg clearfix bdgg-wrap" data-ggid="${_newsGg_[that.ggIndexArr[that.class]]}" id="module${that.class + '_' + that.ggIndexArr[that.class]}">
                     <div id="${_newsGg_[that.ggIndexArr[that.class]]}"></div>
                    </li>`
            that.ggIndexArr[that.class]++
            wsCache.set('ggIndexArr', that.ggIndexArr, {exp: 10 * 60})//保存广告的位置
            return html
        }

        loadDspBdGg() {
            let that = this
            if (that.dataType === 'shipin') {
                _AD_.videoList[_qid_].forEach(function (item, i) {
                    $(`#huanqiu${i + 1}`).html('')
                    _util_.getScript(`//df888.eastday.com/${item}.js`, function () {
                    }, $(`#huanqiu${i + 1}`)[0])
                })
            } else {
                that.requestDspUrl().done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = 0; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        if (that.dspData[i]) {
                            $(`#${value}`).html(that.loadDspHtml(i))
                        } else {
                            let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                            if (_qid_ === 'tiyutytt') {
                                let ad = _AD_.sgGg[_qid_].list
                                $(`#${value}`).append(`<iframe style="" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="140"></iframe>`)
                            } else {
                                _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                                }, $(`#${value}`)[0])
                            }
                        }
                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)
                }).fail(function () {
                    for (let i = 0; i < that.ggIndexArr[that.class]; i++) {
                        let value = $(`#module${`${that.class}_${i}`}`).children().attr('id')
                        if (_qid_ === 'tiyutytt') {
                            let ad = _AD_.sgGg[_qid_].list
                            $(`#${value}`).append(`<iframe style="" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="140"></iframe>`)
                        } else {
                            _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                            }, $(`#${value}`)[0])
                        }
                    }
                })
            }
        }

        loadBdGgCache() {
            let that = this
            if (that.dataType === 'shipin') {
                _AD_.videoList[_qid_].forEach(function (item, i) {
                    $(`#huanqiu${i + 1}`).html('')
                    _util_.getScript(`//df888.eastday.com/${item}.js`, function () {
                    }, $(`#huanqiu${i + 1}`)[0])
                })
            } else {
                that.requestDspUrl().done(function (data) {
                    that.dspData = that.changeDspDataToObj(data)
                    for (let i = (that.ggIndexArr[that.class] - 1); i >= 0; i--) {
                        let value = $(`#module${that.class + '_' + i}`).children().attr('id')
                        if (that.dspData[i]) {
                            $(`#${value}`).html(that.loadDspHtml(i))
                        } else {
                            if (_qid_ === 'tiyutytt') {
                                let ad = _AD_.sgGg[_qid_].list
                                $('#' + value).append(`<iframe style="" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="140"></iframe>`)
                            } else {
                                _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                                }, $('#' + value)[0])
                            }
                        }
                    }
                    setTimeout(function () {
                        that.reportDspInviewbackurl()
                    }, 0)
                }).fail(function () {
                    for (let i = (that.ggIndexArr[that.class] - 1); i >= 0; i--) {
                        let value = $(`#module${that.class + '_' + i}`).children().attr('id')
                        if (_qid_ === 'tiyutytt') {
                            let ad = _AD_.sgGg[_qid_].list
                            $('#' + value).append(`<iframe style="" src="http://msports.eastday.com/ad.html?sogou_ad_id=${ad.id}&sogou_ad_height=${ad.height}" frameborder="0" scrolling="no" width="100%" height="140"></iframe>`)
                        } else {
                            _util_.getScript(`//df888.eastday.com/${value}.js`, function () {
                            }, $('#' + value)[0])
                        }
                    }
                })
            }
        }

        requestDspUrl(num) {
            let readUrl = wsCache.get('historyUrlArr') || 'null'
            if (readUrl !== 'null') {
                readUrl = readUrl.join(',')
            }
            let data = {
                type: this.dataType,
                qid: _qid_,
                uid: _recgid_, // 用户ID
                os: _os_,
                readhistory: readUrl,
                pgnum: this.pgnum[this.class],
                adtype: 1236,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.browserType || 'null',
                pixel: _pixel_,
                fr_url: _util_.getReferrer() || 'null', //首页是来源url(document.referer)
                site: 'sport'
            }
            return _util_.makeGet(HOST_DSP_LIST, data)
        }

        changeDspDataToObj(data) {
            let obj = {}
            data.data.forEach(function (item, i) {
                obj[item.idx - 1] = item
            })
            return obj
        }

        loadDspHtml(posi) {
            let html = ''
            let item = this.dspData[posi]
            switch (item.adStyle) {
                case 'big'://大
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}"  data-dsp="hasDsp" style="display:block;height:5.14rem;    padding: 0.24rem 0.24rem;">
                    <div class="title">${item.topic}</div>
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="">${item.source} 提供的广告</div>
                    </div>
                    </a>`
                    break
                case 'one'://单
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="padding: 0.24rem 0.24rem;">
                            <div class="img">
                                <img class="lazy" src="${item.miniimg[0].src}"/>
                            </div>
                            <div class="info">
                                <div class="title">${item.topic}</div>
                                <div class="source clearfix">
                                    <div class="">${item.source} 提供的广告</div>
                                </div>
                            </div>
                        </a>`
                    break
                case 'group'://三图
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp"  style="padding: 0.24rem 0.24rem;">
                            <div class="title">${item.topic}</div>
                            <div class="imgs">
                                <img class="lazy" src="${item.miniimg[0].src}">
                                <img class="lazy" src="${item.miniimg[1].src}">
                                <img class="lazy" src="${item.miniimg[2].src}">
                            </div>
                            <div class="source clearfix">
                               <div class="">${item.source} 提供的广告</div>
                            </div>
                        </a>`
                    break
                case 'full'://banner
                    html += `<a href="${item.url}" suffix="btype=news_details&subtype=hotnews&idx=0" clickbackurl="${item.clickbackurl}" inviewbackurl="${item.inviewbackurl}" data-dsp="hasDsp" style="display:block;height:2.9rem;padding: 0.24rem 0.24rem;">
                    <div class="big-img">
                        <img class="lazy" src="${item.miniimg[0].src}"/>
                    </div>
                    <div class="source clearfix">
                        <div class="">${item.source} 提供的广告</div>
                    </div>
                    </a>`
                    break
            }
            $body.append(`<img style="display: none" src="${item.showbackurl}"/>`)
            return html
        }

        reportDspInviewbackurl() {
            let cHeight = $(window).height()
            let offsetArr = []
            let eleArr = []
            $('a[inviewbackurl]').each(function (i, item) {
                if (cHeight > $(this).offset().top) {
                    $body.append(`<img style="display: none" src="${$(this).attr('inviewbackurl')}"/>`)
                    $(this).removeAttr('inviewbackurl')
                }
            })

            $('a[inviewbackurl]').each(function (i, item) {
                offsetArr.push($(this).offset().top)
                eleArr.push($(this))
            })

            $swiperWrapper.find(`[data-type="${this.class}"]`).scroll(function () {
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

        //注册点击刷新下拉新闻
        btnLoadMoreNews() {
            let that = this
            $swiperWrapper.find(`[data-type="${that.class}"]`).on('click', '.sec-news-list .btn-load-more', function () {
                that.setPullDownLoadTips('加载中...')
                that.setPullDownLoadTipsAnimation('slideDown 1s ease forwards')
                that.loadNewsListForPullDown()
            })
        }

        //注册页面离开事件
        unload() {
            let that = this
            $(window).unload(function () {
                //let html = $swiperWrapper.find(`[data-type="${that.class}"]`).html().replace(/<a ([^>]*)data-dsp([^>]*)>([\s\S]*?)<\/a>/g, '')
                if ($swiperWrapper.find(`[data-type="${that.class}"]`).find('ul').length) {
                    //wsCache.set(`newsModule${that.class}`, html, {exp: 10 * 60})
                    wsCache.set(`scrollTop${that.class}`, $swiperWrapper.find(`[data-type="${that.class}"]`).scrollTop(), {exp: 10 * 60})
                }
            })
        }

        //点击信件加载下载弹窗
        popupApp() {
            if (_util_.CookieUtil.get('hasDownloadBox') !== '1' && _qid_ !== 'baiducom' && _qid_ !== 'qid02556') {
                $body.append(`<div class="download-box" id="downloadBox">
                            <a href="//msports.eastday.com/downloadapp.html?qid=${_qid_}&pagefrom=homepage&from=H5dftiyu"><div class="logo"></div>
                                <div class="info">
                                    <h3>东方体育</h3>
                                    <p>专业的体育资讯及直播平台</p>
                                </div>
                                <a href="//msports.eastday.com/downloadapp.html?qid=${_qid_}&pagefrom=homepage&from=H5dftiyu" class="btn-down">立即打开</a>
                            <div class="close"></div></a> 
                        </div>`)
            }
            let $downloadBox = $('#downloadBox')
            $downloadBox.find('.close').click(function () {
                $downloadBox.hide()
                _util_.CookieUtil.set('hasDownloadBox', 1, 1) //保存一小时
            })
        }

        //悬浮广告
        xuanfugg() {
            $body.append(`<div class="pack-red"> <iframe id ="iframeXuanfu" src="/xuanfu.html" style="width:100px;height:200px;" frameborder="0"></iframe> </div>`)
        }

        delLoadingTips() { //有数据删除loading-tips1加载图案
            $swiperWrapper.find(`[data-type="${this.class}"]`).children('.loading-tips1').remove()
        }

        changeLoadingTips2(txt) { //改变下方提示框内容
            $swiperWrapper.find(`[data-type="${this.class}"]`).children('.loading-tips2').html(txt)
        }

        setPullDownLoadTips(option, type = 0) {
            //let option=Object.assign({},option)
            if (type === 1) {
                $pullDownLoadTips.addClass('active')
            } else {
                $pullDownLoadTips.removeClass('active')
            }
            $pullDownLoadTips.find('.txt').html(option)
        }

        setPullDownLoadTipsAnimation(option) { //option例子  bounceInDown 0.8s ease forwards
            $pullDownLoadTips.css({
                'animation': option,
                '-webkit-animation': option,
                '-moz-animation': option
            })
        }

        loadLive(url, playBox) {
            let videoObj = $(`<video  preload="auto" autoplay="autoplay" loop="loop"   preload="none" controls="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" x-webkit-airplay="true" webkit-playsinline="true"  playsinline="true"   data-type="vgaoxiao"  >
                    <source src="${url}" type="application/vnd.apple.mpegurl" />
                    <!--<source src="${url}" type="application/mp4" />-->
                </video>`)
            playBox.append(videoObj)
            return videoObj
        }
    }

    new EastSport()
})
