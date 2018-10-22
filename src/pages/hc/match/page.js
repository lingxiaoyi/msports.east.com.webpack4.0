import 'pages/hc/match/style.scss'
import 'public/logic/log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import 'public/libs/lib.prototype'
import _util_ from 'public/libs/libs.util'
import hcUtil from '../../../public-resource/libs/hc.common'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    let {DOMAIN} = config
    let qid = _util_.getPageQid()
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $J_loading = $('#J_loading')
    $body.append(`<div class="popup" id="popup"></div>`)
    let $tabCon = $('#main').find('.tab-con')
    let $matchs = $tabCon.find('.matchs')
    let $navLi = $('nav li')
    let $dateText = $('#dateText')
    let $crumbsLi = $('.crumbs li')
    let token = _util_.CookieUtil.get('hctoken')
    if (token) {
        $body.append(hcUtil.fixedTabs(3, 1))
    } else {
        $body.append(hcUtil.fixedTabs(3, 0))
    }
    class EastSport {
        constructor() {
            this.saishitype = ''
            this.matchtype = ''
            this.starts = new Date(new Date().format('yyyy/MM/dd') + ' 00:00:00').getTime()
            this.nowTimestamp = new Date().getTime()
            this.crumbsLiIndex = 0
            this.arrDate = [] //用来保存日期的数据,不重复的日期
            this.data0 = [] //即时  还未开始的比赛+明天0点到12点的比赛；
            this.data1 = [] //赛果  已经结束的比赛+昨天0点到24点的比赛；
            this.data2 = [] //赛程  还未开始的比赛+明天0点到24点的比赛+后天0点到12点的比赛
            this.init()
        }

        init() {
            this.clickMenu()
            this.selectDateToMatch()
            this.loadMatchList()
        }

        //加载全部的比赛详情列表
        loadMatchList(type) {
            let that = this
            let data = {
                os: os,
                uid: recgid,
                qid: qid,
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
                    $matchs.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                    return
                }
                that.filterData(result)
                that.produceHtml(that[`data${that.crumbsLiIndex}`])
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
                if (v.status / 1 === 3) {
                    that.data1.push(v)
                } else {
                    that.data2.push(v)
                    let time = new Date(v.date.replace(/-/g, '/')).getTime()
                    if (time >= that.starts && time <= that.starts + 36 * 60 * 60 * 1000) {
                        that.data0.push(v)
                    }
                }
            })
        }
        produceHtml(result) {
            let that = this
            that.arrDate = []
            $matchs.html(``)
            if (!result.length) {
                $matchs.html(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
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
                    $matchs.append(`<li class="date">${v.date.substring(0, 10)}</li>`)
                    that.arrDate.push(v.date.substring(0, 10))
                }
                $matchs.append(`<li class="${state}">
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
                let id = $(this).attr('data-id')
                that.loadMatchList(id)
                that.matchid = id
            })
            $crumbsLi.click(function() {
                $crumbsLi.removeClass('active')
                $(this).addClass('active')
                that.crumbsLiIndex = $(this).index()
                that.produceHtml(that[`data${that.crumbsLiIndex}`])
            })
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
    }

    new EastSport()

    // dateText日期格式化 页面独有的方法
    function formatDateText(starts) {
        $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 24 * 60 * 60 * 1000).format('MM-dd')).data('data-timestamp', starts)
    }
})
