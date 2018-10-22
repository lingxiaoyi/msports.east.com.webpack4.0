import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import Swiper from 'swiper'
import _util_ from 'public/libs/libs.util'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let $banner = $('#swiperContainer')
    let $body = $('body')
    let $fanganBox = $body.find('.part_4 ul')
    let $part_2 = $body.find('.part_2 ul')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $loading = $('#J_loading')

    class EastSport {
        constructor() {
            this.flag = true
            this.hcmatchid = '' //红彩matchid
            this.startkey = '' //红彩分页
            this.pgNum = 1 //红彩分页
            this.pageSize = 20 //红彩分页
            this.init()
        }

        addEventlister() {
            let that = this
            $(window).scroll(function () {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    that.loadHcList()
                }
            })
        }

        init() {
            this.addEventlister()
            this.loadHcList()
            this.loadExList()
            this.loadSwiper()
            this.loadExpertList()
        }

        loadHcList() { //红彩列表
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: this.startkey,
                pageNum: this.pgNum,
                maxNum: this.pageSize,
            }
            if (this.startkey === 'end') return
            $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'wap/schemelist', data).done(function (data) {
                that.startkey = data.endkey
                that.pgNum++
                that.flag = true
                $loading.hide()
                if (data.data.length) {
                    data.data.forEach(function (item) {
                        ///experts_page.html?expertId=${item.expert.expertId}
                        $fanganBox.append(`<li>
                <a href="//msports.eastday.com/hc/fa/${item.htmlname}">
                <div class="line_1">
                    <div class="img"><img src="${item.expert.expertImg.replace('http:', 'https:')}" alt=""></div>
                    <div class="info">
                        <b>${item.expert.expertName}</b>
                        <br>
                        <div class="tag b">近${item.expert.jin}场中${item.expert.zhong}场</div>
                        <div class="tag r">${item.expert.lianhong}连红</div>
                    </div>
                    <div class="mz">
                        <span><b>${item.expert.rate}</b>% <br>命中率</span>
                    </div>
                </div>
                <div class="line_2">
                    ${item.schemeTitle}
                </div>
                <div class="line_3">
                    <div class="tag">${item.match_type[0].type}</div>
                    <div class="date">${item.matchList[0].date}</div>
                    <!--<div class="tit">发布让球推介</div>-->
                </div>
                <div class="line_4">
                    <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}</div>
                    <div class="yb">${item.price}元宝</div>
                </div>
                </a>
            </li>`)
                    })
                } else {
                    $fanganBox.append(`<li class="no-comment" style="text-align: center;border: 0;padding:0.3rem;">无更多数据...</li>`)
                    that.startkey = 'end'
                }
            })
        }

        loadExList() { //专家列表
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
            }
            // if (this.startkey === 'end') return
            // $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'recexperts', data).done(function (res) {
                let html = ''
                if (!res.data.length) {
                    $part_2.hide()
                }
                res.data.forEach(function (v, k) {
                    if (k >= 8) {
                        return false
                    }
                    html += `<li>
                <a href="../experts_page.html?expertId=${v.expertId}">
                    <img src="${v.expertImg}" alt="">
                    <div class="name">${v.expertName}</div>
                </a>
            </li>`
                })
                $part_2.html(html)
            }).fail(function() {
                $part_2.hide()
            })
        }

        loadExpertList() {
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: this.startkey,
                pageNum: this.pgNum,
                maxnum: this.pageSize,
            }
            $loading.show()
            _util_.makeJsonp(dfsportswap_lottery + '/wap/expertscheme', data).done(function (data) {
                $loading.hide()
                if (data.data.length) {
                    data.data.forEach(function (item) {
                        $fanganBox.append(`<li>
                <a href="#">
                    <img src="http://00.imgmini.eastday.com/dcminisite/portrait/09d263cee4ca52451eefea898a653adc.jpg" alt="">
                    <div class="name">洪旭到人</div>
                </a>
            </li>`)
                    })
                }
            })
        }

        loadSwiper() {
            /*const items = [
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e899f25e8937969e36691f7f6f79e26d_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-18/10a40f358400d8e6c10a8a63be3a0c51_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e899f25e8937969e36691f7f6f79e26d_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-18/10a40f358400d8e6c10a8a63be3a0c51_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
                {
                    img: '//imgsports.eastday.com/res/upload/img/2018-06-19/e34e0a98ff08549bf202d65865a9b139_660_330.jpeg',
                    url: 'http://sports.eastday.com/a/180619040554645000000.html'
                },
            ]
            let html = ''
            items.forEach(function (v) {
                html += `<div class="swiper-slide"><a href="${v.url}" class="slide-wrap">
                <img src="${v.img}" class="swiper-lazy" />
             </a></div>`
            })
            $banner.append(`
    <div class="swiper-wrapper">
            ${html}
            <!--<div class="info">
                <h3><span>1</span><span>/</span><span>5</span>  梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀梅西失点巴萨0-1遭绝杀</h3>
                <p>上半场，丹尼斯-苏亚雷斯推射稍稍偏出。易边再战，保利尼奥疑似受伤被换下场。罗贝托造点，梅西主罚的点球被迭戈-洛佩斯扑出。</p>
            </div>-->

    </div><div class="swiper-pagination"></div>`)*/
            let swiper = new Swiper('#swiperContainer', {
                loop: true, /* spaceBetween: 10, */
                centeredSlides: true,
                autoplay: 4000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination'
            })
            //swiper.slideTo(0, 0)
        }
    }

    new EastSport()
})
