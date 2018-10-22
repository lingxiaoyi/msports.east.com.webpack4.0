import 'pages/saishi/style.scss'
import './log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import hcUtil from '../libs/hc.common'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST} = config.API_URL
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    let {DOMAIN} = config
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}"></a></div> </div>`)
    let $goTop = $('#goTop')
    let $J_loading = $('#J_loading')
    $body.append(`<div class="popup" id="popup"></div>`)
    let $tabCon = $('#main').find('.tab-con')
    let $fanganBox = $tabCon.eq(2).children('ul')
    let $matchs = $tabCon.find('.matchs')
    let $navLi = $('nav li')
    let $dateText = $('#dateText')
    let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    let token = _util_.CookieUtil.get('hctoken')
    if (token) {
        $body.append(hcUtil.fixedTabs(2, 1))
    } else {
        $body.append(hcUtil.fixedTabs(2, 0))
    }
    $body.append('<div class="bottom_nav"></div>')
    class EastSport {
        constructor() {
            this.starts = new Date(prevDate).getTime()
            this.type = _util_.getUrlParam('type') || 'saishi'
            this.starts = new Date(new Date().format('yyyy/MM/dd') + ' 00:00:00').getTime()
            this.crumbsLiIndex = 0
            this.nowTimestamp = new Date().getTime()
            this.arrDate = [] //用来保存日期的数据,不重复的日期
            this.data0 = [] //即时  还未开始的比赛+明天0点到12点的比赛；
            this.data1 = [] //赛果  已经结束的比赛+昨天0点到24点的比赛；
            this.data2 = [] //赛程  还未开始的比赛+明天0点到24点的比赛+后天0点到12点的比赛；
            this.init()
        }

        init() {
            this.clickMenu()
            this.selectDateToMatch()
            this.goTop()
            if (this.type === 'all') {
                $navLi.eq(0).click()
            } else {
                //$navLi.eq(0).click()
                this.loadSaishi()
            }
        }

        //加载赛事有多少场比赛
        loadSaishi() {
            let data = {
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: DOMAIN
            }
            $J_loading.show()
            _util_.makeJsonp(HOST + 'livesinfo', data).done(function(result) {
                produceHtml(result)
            }).always(function() {
                $J_loading.hide()
            })

            function produceHtml(result) {
                let html = ''
                result.data.forEach(function(item) {
                    html += `<div class="title">${item.name}</div><ul class="saishi">`
                    item.message.forEach(function(item) {
                        let imgSrc = `//sports.eastday.com/jscss/v4/${item.imgurl.substring(9)}`
                        html += `<li class="clearfix"><a class="clearfix" href="//msports.eastday.com/data.html?name=${item.code}">
                                    <img src="${imgSrc}" alt="">
                                    <div class="name">${item.name}</div>
                                    <div class="info">
                                        <p>今日${item.liveNum}场直播 </p><i></i>
                                    </div>
                                </a></li>`
                    })
                    html += `</ul>`
                })
                $tabCon.eq(0).html(html)
            }
        }

        //加载全部的比赛详情列表
        loadMatchList() {
            let data = {
                startts: this.starts,
                endts: this.starts + 24 * 60 * 60 * 1000,
                saishiid: '',
                isimp: '1'
            }
            formatDateText(this.starts)
            $matchs.html('')
            $J_loading.show()
            _util_.makeJsonp(HOST + 'matchba', data).done(function(result) {
                if (!result.data.length) {
                    $matchs.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                    return
                }
                produceHtml(result)
                let $live = $matchs.children('li.live')
                let $unstart = $matchs.children('li.unstart')
                if ($live.length) {
                    $(window).scrollTop($live.eq(0).position().top)
                } else {
                    $(window).scrollTop($unstart.eq(0).position().top)
                }
            }).always(function() {
                $J_loading.hide()
            })

            function produceHtml(result) {
                result.data.forEach(function(v) {
                    let liveInfo = (function(arr) {
                        let infoName = []
                        arr.forEach(function(item) {
                            let name = item.title.split('(')[0]
                            if (infoName.indexOf(name) < 0) infoName.push(name)
                        })
                        return infoName
                    })(v.zhiboinfozh)
                    let state2 = ''
                    let state = (function(a) {
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
                    let score = (function(a) {
                        if (a === -1) return '<i></i>'
                        return `<div class="hscore">${v.saishi_id === '900002' ? v.visit_score : v.home_score}</div>
                            <div class="vscore">${v.saishi_id === '900002' ? v.home_score : v.visit_score}</div>`
                    })(v.ismatched / 1)
                    let html = ``
                    if (v.sport_type === '1') {
                        html = `<div class="title2">${v.title}</div>`
                        score = ''
                    } else {
                        html = `<div class="host"><img src="${v.saishi_id === '900002' ? v.visit_logoname : v.home_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${v.saishi_id === '900002' ? v.visit_team : v.home_team}</span></div>
                            <div class="visit"><img src="${v.saishi_id === '900002' ? v.home_logoname : v.visit_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${v.saishi_id === '900002' ? v.home_team : v.visit_team}</span></div>`
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
        loadMatchListHc(type) {
            let that = this
            let data = {
                os: _os_,
                uid: _recgid_,
                qid: _qid_,
                domain: DOMAIN,
                start: this.starts - 24 * 60 * 60 * 1000,
                end: this.starts + 3 * 24 * 60 * 60 * 1000,
                type: type || '900004'
            }
            formatDateText(this.starts)
            $matchs.html('')
            $J_loading.show()
            _util_.makeJsonp(dfsportswap_lottery + 'wap/matchlist', data).done(function(result) {
                if (!result.data.length) {
                    $fanganBox.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                    return
                }
                that.filterData(result)
                that.produceHtml(that[`data${that.crumbsLiIndex}`])
                let $live = $fanganBox.children('li.live')
                let $unstart = $fanganBox.children('li.unstart')
                if ($live.length) {
                    $(window).scrollTop($live.eq(0).position().top)
                    that.hcscrollTop = $live.eq(0).position().top
                } else {
                    $(window).scrollTop($unstart.eq(0).position().top)
                    that.hcscrollTop = $live.eq(0).position().top
                }
            }).always(function() {
                $J_loading.hide()
            })
        }
        filterData(result) {
            let that = this
            this.data0 = [] //即时  还未开始的比赛+明天0点到12点的比赛；
            this.data1 = [] //赛果  已经结束的比赛+昨天0点到24点的比赛；
            this.data2 = []
            result.data.forEach(function(v) {
                if (!v.liveurl) return
                that.data0.push(v)
                /*if (v.status / 1 === 3) {
                    that.data1.push(v)
                } else {
                    that.data2.push(v)
                    let time = new Date(v.date.replace(/-/g, '/')).getTime()
                    if (time >= that.starts && time <= that.starts + 36 * 60 * 60 * 1000) {
                        that.data0.push(v)
                    }
                }*/
            })
        }
        produceHtml(result) {
            let that = this
            that.arrDate = []
            $fanganBox.html(``)
            if (!result.length) {
                $fanganBox.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                return
            }
            result.forEach(function(v) {
                let state2 = ''
                let state = (function(a) {
                    if (a === 3) {
                        state2 = (v.hasjijin / 1 + v.hasluxiang / 1) ? `<div class="info">${v.hasjijin / 1 ? '<em>集锦</em>' : ''}${v.hasluxiang / 1 ? '<em>录像</em>' : ''}</div>` : '已结束'
                        return 'end'
                    } else if (a === 2) {
                        state2 = `<div class="info"><em>直播中</em></div>`
                        return 'live'
                    } else if (a === 4) {
                        state2 = '已延期'
                        return 'unstart'
                    } else if (a === 1) {
                        state2 = '敬请期待'
                        return 'unstart'
                    }
                })(v.status / 1)
                let score = (function(a) {
                    if (a === 1) return '<i></i>'
                    return `<div class="hscore">${v.homeScore}</div>
                            <div class="vscore">${v.visitScore}</div>`
                })(v.status / 1)
                let html = `<div class="host"><img src="${v.homeLogourly}" alt=""><span>${v.homeTeam}</span></div>
                        <div class="visit"><img src="${v.visitLogourly}" alt=""><span>${v.visitTeam}</span></div>`
                if (that.arrDate.indexOf(v.date.substring(0, 10)) === -1) {
                    $fanganBox.append(`<li class="date">${v.date.substring(0, 10)}</li>`)
                    that.arrDate.push(v.date.substring(0, 10))
                }
                $fanganBox.append(`<li class="${state}">
                    <a href="${v.liveurl}?tab=fangan">
                    <div class="row1 clearfix">
                        <div class="tt">
                            <div class="tit">
                                <em>${v.date.substring(11)}</em><br>${v.saishi}
                            </div>
                        </div>
                        <div class="team">
                            ${html}
                        </div>
                        <div class="score">
                            ${score}                      
                        </div>
                        <div class="state">${state2}</div>
                    </div>
                    <div class="row2 clearfix">
                        <p>胜${v.hvdh}  平${v.hvdd}  负${v.hvdv}</p>
                        <span>${v.count}个方案></span>
                    </div>
                    </a>
                </li>`)
            })
        }
        clickMenu() {
            let that = this
            $navLi.click(function() {
                $navLi.removeClass('active')
                $(this).addClass('active')
                let index = $(this).index()
                if (!$matchs.children().length) {
                    that.loadMatchList()
                }
                if (!$tabCon.eq(0).children().length) {
                    that.loadSaishi()
                }
                if (index === 2 && !$fanganBox.children().length) {
                    that.loadMatchListHc()
                    that.flag = true
                }
                $tabCon.hide()
                $tabCon.eq(index).show()
            })
            $navLi.eq(1).click()
            let $crumbsLi = $('.crumbs li')
            $crumbsLi.click(function() {
                $crumbsLi.removeClass('active')
                $(this).addClass('active')
                let id = $(this).attr('data-id')
                that.loadMatchListHc(id)
                that.matchid = id
            })
            /*$(window).scroll(function() {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag) { // 距离底端80px是加载内容
                    that.flag = false
                    that.loadHcList()
                }
            })*/
        }
        selectDateToMatch() {
            let that = this
            $dateText.prev().click(function() {
                that.starts = that.starts - 24 * 60 * 60 * 1000
                that.loadMatchList(that.starts)
            })
            $dateText.next().click(function() {
                that.starts = that.starts + 24 * 60 * 60 * 1000
                that.loadMatchList(that.starts)
            })
        }

        goTop() {
            $goTop.children('.top').on('click', function() {
                $('html,body').scrollTop(0)
            })
            $(window).scroll(function() {
                if (($(this).scrollTop()) / 100 > 0.9) {
                    $goTop.show()
                } else {
                    $goTop.hide()
                }
            })
        }
    }

    new EastSport()

    // dateText日期格式化 页面独有的方法
    function formatDateText(starts) {
        $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 24 * 60 * 60 * 1000).format('MM-dd')).data('data-timestamp', starts)
    }
})
