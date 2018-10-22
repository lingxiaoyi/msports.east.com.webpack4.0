import 'pages/data/data_all.scss'
import 'pages/data/data_rank_basketball.scss'
import 'pages/all_data/nba_jihousai.scss'
import './log.js'
import WebStorageCache from 'web-storage-cache'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'
import hcUtil from '../libs/fixed.tab.js'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, ORDER_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let wsCache = new WebStorageCache()
    //定义需要传入接口的值
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    //dom元素
    let $body = $('body')
    $body.find('.data-main').append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $J_loading = $('#J_loading')
    let $headerType = $('header .crumbs-data .type')
    let $navMenu = $('nav.data')
    let $header = $('header')
    let $content = $('.data-main .content')
    let $popup = $('#popup')
    let $insideNav = $('#insideNav')
    let $insideNavLiA = $insideNav.find('ul li a')
    if (_os_.indexOf('windows') > -1) { //电脑端
        $('.data-main').css('width', '103%')
    }
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        _qid_ = 'dfsphcad'
    } else if (agent.indexOf('dftyios') >= 0) {
        _qid_ = 'dfsphcios'
    }
    $('.back').click(function() {
        if (document.referrer) {
            window.history.go(-1)
        } else {
            window.location.href = '//msports.eastday.com/hc/'
        }
    })
    if (_qid_ === 'dfsphcad' || _qid_ === 'dfsphcios' || _qid_ === 'dfttapp') {
        $('.back').remove()
        $insideNav.children().css({
            width: '7.5rem',
            left: 0
        })
    }
    /*let token = _util_.CookieUtil.get('hctoken')
    if (token) {
        $body.append(hcUtil.fixedTabs(4, 1))
    } else {
        $body.append(hcUtil.fixedTabs(4, 0))
    }*/
    class EastSport {
        constructor() {
            this.dataType = _util_.getUrlParam('datatype') || 's' //j代表季后赛 s代表赛程 t代表统计 p代表排名
            this.classType = _util_.getUrlParam('classtype') || '' //赛事类别
            this.slideHeight = ''
            this.init()
        }

        init() {
            this.computedSlideHeight() //计算栏目的高度
            this.makeMenu()
            this.makeCrumbs()
            this.loadContent()
            this.loadMainColumns()
            this.clickNav()
        }

        clickNav() {
            let that = this
            // insildeNav导航功能
            $insideNav.on('click', 'li a', function(e) {
                e.preventDefault()
                let width = $(this).parent().width()
                let index = $(this).parent().index()
                $insideNav.find('ul').scrollLeft(width * (index - 3))
            })
            $insideNavLiA.click(function(e) {
                e.preventDefault()
                $insideNavLiA.removeClass('active')
                $(this).addClass('active')
                that.classType = $(this).attr('data-type')
                that.makeMenu()
                that.makeCrumbs()
                that.loadContent()
                that.loadMainColumns()
            })
        }

        computedSlideHeight() {
            let wHeight = $(window).height()
            this.headerHeight = $header.height()
            let headNavHeight = $navMenu.height()
            this.slideHeight = wHeight - this.headerHeight - headNavHeight
            let that = this
            $content.parent().css({
                'height': that.slideHeight + 'px',
                'overflowY': 'scroll'
            })
        }

        makeMenu() {
            switch (this.classType) {
                case 'zhongyao':
                    $navMenu.html(`<ul>
                                    <li data-type='t' class="${this.dataType === 't' ? 'active' : ''}">统计</li>
                                    <li data-type='p' class="${this.dataType === 'p' ? 'active' : ''}">排名</li>
                                </ul>`)
                    break
                case 'nba':
                    //<li data-type='j' class="${this.dataType === 'j' ? 'active' : ''}">季后赛</li>
                    //<li data-type='s' class="${this.dataType === 's' ? 'active' : ''}">赛程</li>
                    $navMenu.html(`<ul>
                                    <li data-type='t' class="${this.dataType === 't' ? 'active' : ''}">统计</li>
                                    <li data-type='p' class="${this.dataType === 'p' ? 'active' : ''}">排名</li>
                                </ul>`)
                    break
                default :
                    //<li data-type='s' class="${this.dataType === 's' ? 'active' : ''}">赛程</li>
                    $navMenu.html(`<ul>
                                    <li data-type='t' class="${this.dataType === 't' ? 'active' : ''}">统计</li>
                                    <li data-type='p' class="${this.dataType === 'p' ? 'active' : ''}">排名</li>
                                </ul>`)
                    break
            }
        }

        makeCrumbs() {
            let objList = {
                'zhongyao': '重要',
                'yingchao': '英超',
                'ouguan': '欧冠',
                'xijia': '西甲',
                'yijia': '意甲',
                'dejia': '德甲',
                'zhongchao': '中超',
                'cba': 'CBA',
                'yaguan': '亚冠',
                'fajia': '法甲',
                'nba': 'NBA'
            }
            $headerType.text(objList[this.classType])
        }

        //加载对象的内容
        loadContent() {
            switch (this.dataType) {
                case 'j':
                    this.loadPlayoff()
                    break
                case 's':
                    this.loadMatchSchedule()
                    break
                case 't':
                    this.loadStatistics()
                    break
                case 'p':
                    this.loadRanking()
                    break
            }
        }

        //加载季后赛
        loadPlayoff() {
            let dataPlayoff = wsCache.get(`dataPlayoff`)
            if (dataPlayoff) { //有缓存就加缓存进去
                $content.html(dataPlayoff)
                return
            }
            let data = {
                datatype: 'nba_jihousai',
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }
            $J_loading.show()
            _util_.makeJsonp(HOST + 'data', data).done(function(result) {
                let html = ''
                let top = result.data.data.top
                let bottom = result.data.data.bottom
                let final = result.data.data.finals
                top.forEach(function(group, index) {
                    html += '<div class="match-group-top' + (index + 1) + ' match-group">'
                    group.forEach(function(item, i) {
                        html += '	<div class="match">'
                        html += '		<div class="teams">'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + item.teams[0].img + '">'
                        let name = item.teams[0].name.length > 3 ? item.teams[0].name.slice(0, 3) : item.teams[0].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '			</span>'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + item.teams[1].img + '">'
                        name = item.teams[1].name.length > 3 ? item.teams[1].name.slice(0, 3) : item.teams[1].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '</span>'
                        html += '		</div>'
                        html += '		<div class="line">' + item.info1 + '</div>'
                        html += '		<span class="line-vertical"></span>'
                        html += '	</div>'
                    })
                    html += '</div>'
                })
                html += '<div class="match-group-center match-group">'
                html += '	<div class="match">'
                html += '		<div class="teams">'
                html += '			<span class="icon">'
                html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + final.teams[0].img + '" alt="">'
                let name = final.teams[0].name.length > 3 ? final.teams[0].name.slice(0, 3) : final.teams[0].name
                html += '				<div class="team">' + name + '</div>'
                html += '			</span>'
                html += '			<div class="labels">'
                html += '				<div class="score">' + final.info1 + '</div>'
                html += '				<div class="score match-name">总决赛</div>'
                html += '			</div>'
                html += '			<span class="icon">'
                html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + final.teams[1].img + '" alt="">'
                name = final.teams[1].name.length > 3 ? final.teams[1].name.slice(0, 3) : final.teams[1].name
                html += '				<div class="team">' + name + '</div>'
                html += '			</span>'
                html += '		</div>'
                html += '	</div>'
                html += '</div>'
                for (let i = bottom.length - 1; i >= 0; i--) {
                    let group = bottom[i]
                    html += '<div class="match-group-bottom' + (i + 1) + ' match-group bottom">'
                    group.forEach(function(item, i) {
                        html += '	<div class="match">'
                        html += '		<span class="line-vertical"></span>'
                        html += '		<div class="line">' + item.info1 + '</div>'
                        html += '		<div class="teams">'
                        html += '			<span class="icon">'
                        let name = item.teams[0].name.length > 3 ? item.teams[0].name.slice(0, 3) : item.teams[0].name
                        html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + item.teams[0].img + '">'
                        html += '				<div class="team">' + name + '</div>'
                        html += '			</span>'
                        html += '			<span class="icon">'
                        html += '				<img onerror=this.src="//msports.eastday.com/h5/img/nomatch.png" src="//imgsports.eastday.com/sports/icons/team/' + item.teams[1].img + '">'
                        name = item.teams[1].name.length > 3 ? item.teams[1].name.slice(0, 3) : item.teams[1].name
                        html += '				<div class="team">' + name + '</div>'
                        html += '</span>'
                        html += '		</div>'
                        html += '	</div>'
                    })
                    html += '</div>'
                }
                $content.html(html)
                wsCache.set(`dataPlayoff`, $content.html(), {exp: 30 * 60})
            }).always(function() {
                $J_loading.hide()
            })
        }

        //加载赛程
        loadMatchSchedule() {
            let that = this
            let objAllId = {
                'yingchao': '900006',
                'ouguan': '900011',
                'xijia': '900007',
                'yijia': '900008',
                'dejia': '900009',
                'zhongchao': '900005',
                'nba': '900002',
                'cba': '900003',
                'yaguan': '900013',
                'fajia': '900017'
            }
            let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
            let starts = new Date(prevDate).getTime()
            //加载头部日期
            loadhead()
            //默认执行 加载赛程列表
            requestMatchSchedule(starts)
            //加载前一天数据
            $content.on('click', '.head .btn-left', function() {
                starts = starts - 24 * 60 * 60 * 1000
                $content.find('.head .tit').html(formatDate(starts))
                requestMatchSchedule(starts)
            })
            $content.on('click', '.head .btn-right', function() {
                starts = starts + 24 * 60 * 60 * 1000
                $content.find('.head .tit').html(formatDate(starts))
                requestMatchSchedule(starts)
            })
            let isRequested = true
            $content.on('click', '.btn-order', function() {
                let that = this
                if ($(that).attr('data-ordered') || !isRequested) {
                    popup(2)
                    return
                }
                isRequested = false
                _util_.makeJsonp(ORDER_API + $(this).attr('data-matchid'), {}).done(function(result) {
                    if (result.status === -1) {
                        popup(1)
                    } else {
                        popup(2)
                        $(that).attr('data-ordered', '1') //订阅过data-ordered为1
                    }
                }).fail(function() {
                    popup(3)
                }).always(function() {
                    isRequested = true
                })
            })
            $body.on('click', '#popup', function() {
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

            //加载赛程切换时间的头部
            function loadhead() {
                $content.html(`<div class="head">
                                    <div class="btn btn-left"></div>
                                    <div class="tit">${formatDate(starts)}</div>
                                    <div class="btn btn-right"></div>
                                </div><ul class="match-info"></ul>`)
            }

            //格式化日期为2017-03-13 周一
            function formatDate(starts) {
                let weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                let date = new Date(starts)
                return date.format('yyyy-MM-dd') + ' ' + weekday[date.getDay()]
            }

            //请求比赛赛程
            function requestMatchSchedule(starts) {
                let data = {
                    startts: starts,
                    endts: starts + 1 * 24 * 60 * 60 * 1000,
                    saishiid: objAllId[that.classType] || '',
                    isimp: '1',
                    os: _os_,
                    recgid: _recgid_,
                    qid: _qid_,
                    domain: _domain_
                }
                $content.children('.match-info').html('')
                $J_loading.show()
                _util_.makeJsonp(HOST + 'matchba', data).done(function(result) {
                    if (!result.data.length) {
                        $content.children('.match-info').html(`<li><h3>暂无数据</h3></li>`)
                        return
                    }
                    $content.children('.match-info').html(makeHtml(result))
                }).always(function() {
                    $J_loading.hide()
                })
            }

            function makeHtml(result) {
                let html = ''
                let data = result.data
                let isInApp = _util_.getUrlParam('redirect') || '' //有这个参数就在app中
                for (let item of data) {
                    let title = item.title.split(' ')
                    let mHtml = ''
                    let url = ''
                    if (item.ismatched === '-1') {
                        if (_util_.isWeiXin()) {
                            mHtml = `<div class="btn-order" data-matchid="${item.matchid}"><a href="javascript:;">预约</a></div>`
                        } else {
                            mHtml = `<div class="btn-living">未开赛</div>`
                            url = item.liveurl
                        }
                    } else if (item.ismatched === '0') {
                        mHtml = `<div class="score"><div>${item.home_score}</div><span>-</span><div>${item.visit_score}</div></div><div class="btn-living">直播中</div>`
                        url = item.liveurl
                    } else {
                        mHtml = `<div class="score"><div>${item.home_score}</div><span>-</span><div>${item.visit_score}</div></div>
                        <div class="btn">集锦</div>
                        <div class="btn">回放</div>`
                        url = item.luxiang_url ? (item.liveurl + '?tab=saikuang') : item.liveurl
                    }
                    if (isInApp) {
                        if (url.indexOf('?') > -1) {
                            url += '&redirect=app'
                        } else {
                            url += '?redirect=app'
                        }
                    }
                    html += `<li>
                                <a href="${url}">
                                <h6>${title[1] + ' ' + title[0]}</h6>
                                <div class="clearfix">
                                    <div class="item">
                                        <img src="${item.home_logoname ? item.home_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                        <p>${item.home_team}</p>
                                    </div>
                                    <div class="m">${mHtml}</div>
                                    <div class="item">
                                        <img src="${item.visit_logoname ? item.visit_logoname : config.DIRS.BUILD_FILE.images['logo_default']}" alt=""/>
                                        <p>${item.visit_team}</p>
                                    </div>
                                </div>
                                </a>    
                            </li>`
                }
                return html
            }
        }

        //加载统计
        loadStatistics() {
            $content.html(`<div class="tab-h" id="dataSlideNav"></div><div class="tab-b tab-all"></div>`)
            let $dataSlideNav = $('#dataSlideNav')
            let $tabB = $content.find('.tab-b')
            let tableList = {
                'nba': {
                    'nba_defen': '得分',
                    'nba_lanban': '篮板',
                    'nba_zhugong': '助攻',
                    'nba_qiangduan': '抢断',
                    'nba_gaimao': '盖帽',
                    'nba_shiwu': '失误',
                    'nba_shentou': '神投',
                    'nba_sanfen': '三分',
                    'nba_xiaolv': '效率',
                    'nba_faqiu': '罚球'
                },
                'cba': {
                    'cba_defen': '得分',
                    'cba_lanban': '篮板',
                    'cba_zhugong': '助攻',
                    'cba_qiangduan': '抢断',
                    'cba_gaimao': '盖帽',
                    'cba_koulan': '扣篮',
                    'cba_shiwu': '失误',
                    'cba_fangui': '犯规'
                },
                'zhongchao': {
                    'zhongchao_sheshoubang': '射手榜',
                    'zhongchao_zhugong': '助攻',
                    'zhongchao_shemen': '射门',
                    'zhongchao_chuanweixieqiu': '传威胁球',
                    'zhongchao_beiqinfan': '被侵犯',
                    'zhongchao_qiangduan': '抢断',
                    'zhongchao_chuanzhong': '传中',
                    'zhongchao_chuanqiu': '传球',
                    'zhongchao_honghuangpai': '红黄牌',
                    'zhongchao_pujiu': '扑救',
                    'zhongchao_chuchangshijian': '出场时间',
                    'zhongchao_fangui': '犯规',
                    'zhongchao_jiewei': '解围'
                },
                'yingchao': {
                    'yingchao_sheshoubang': '射手榜',
                    'yingchao_zhugong': '助攻',
                    'yingchao_shemen': '射门',
                    'yingchao_chuanweixieqiu': '传威胁球',
                    'yingchao_beiqinfan': '被侵犯',
                    'yingchao_qiangduan': '抢断',
                    'yingchao_chuanzhong': '传中',
                    'yingchao_chuanqiu': '传球',
                    'yingchao_honghuangpai': '红黄牌',
                    'yingchao_pujiu': '扑救',
                    'yingchao_chuchangshijian': '出场时间',
                    'yingchao_fangui': '犯规',
                    'yingchao_jiewei': '解围'
                },
                'xijia': {
                    'xijia_sheshoubang': '射手榜',
                    'xijia_zhugong': '助攻',
                    'xijia_shemen': '射门',
                    'xijia_chuanweixieqiu': '传威胁球',
                    'xijia_beiqinfan': '被侵犯',
                    'xijia_qiangduan': '抢断',
                    'xijia_chuanzhong': '传中',
                    'xijia_chuanqiu': '传球',
                    'xijia_honghuangpai': '红黄牌',
                    'xijia_pujiu': '扑救',
                    'xijia_chuchangshijian': '出场时间',
                    'xijia_fangui': '犯规',
                    'xijia_jiewei': '解围'
                },
                'yijia': {
                    'yijia_sheshoubang': '射手榜',
                    'yijia_zhugong': '助攻',
                    'yijia_shemen': '射门',
                    'yijia_chuanweixieqiu': '传威胁球',
                    'yijia_beiqinfan': '被侵犯',
                    'yijia_qiangduan': '抢断',
                    'yijia_chuanzhong': '传中',
                    'yijia_chuanqiu': '传球',
                    'yijia_honghuangpai': '红黄牌',
                    'yijia_pujiu': '扑救',
                    'yijia_chuchangshijian': '出场时间',
                    'yijia_fangui': '犯规',
                    'yijia_jiewei': '解围'
                },
                'dejia': {
                    'dejia_sheshoubang': '射手榜',
                    'dejia_zhugong': '助攻',
                    'dejia_shemen': '射门',
                    'dejia_chuanweixieqiu': '传威胁球',
                    'dejia_beiqinfan': '被侵犯',
                    'dejia_qiangduan': '抢断',
                    'dejia_chuanzhong': '传中',
                    'dejia_chuanqiu': '传球',
                    'dejia_honghuangpai': '红黄牌',
                    'dejia_pujiu': '扑救',
                    'dejia_chuchangshijian': '出场时间',
                    'dejia_fangui': '犯规',
                    'dejia_jiewei': '解围'
                },
                'fajia': {
                    'fajia_sheshoubang': '射手榜',
                    'fajia_zhugong': '助攻',
                    'fajia_shemen': '射门',
                    'fajia_chuanweixieqiu': '传威胁球',
                    'fajia_beiqinfan': '被侵犯',
                    'fajia_qiangduan': '抢断',
                    'fajia_chuanzhong': '传中',
                    'fajia_chuanqiu': '传球',
                    'fajia_honghuangpai': '红黄牌',
                    'fajia_pujiu': '扑救',
                    'fajia_chuchangshijian': '出场时间',
                    'fajia_fangui': '犯规',
                    'fajia_jiewei': '解围'
                },
                'ouguan': {
                    'ouguan_sheshoubang': '射手榜',
                    'ouguan_zhugong': '助攻',
                    'ouguan_shemen': '射门',
                    'ouguan_chuanweixieqiu': '传威胁球',
                    'ouguan_beiqinfan': '被侵犯',
                    'ouguan_qiangduan': '抢断',
                    'ouguan_chuanzhong': '传中',
                    'ouguan_chuanqiu': '传球',
                    'ouguan_honghuangpai': '红黄牌',
                    'ouguan_pujiu': '扑救',
                    'ouguan_chuchangshijian': '出场时间',
                    'ouguan_fangui': '犯规',
                    'ouguan_jiewei': '解围'
                },
                'yaguan': {
                    'yaguan_sheshoubang': '射手榜',
                    'yaguan_zhugong': '助攻',
                    'yaguan_shemen': '射门',
                    'yaguan_chuanweixieqiu': '传威胁球',
                    'yaguan_beiqinfan': '被侵犯',
                    'yaguan_qiangduan': '抢断',
                    'yaguan_chuanzhong': '传中',
                    'yaguan_chuanqiu': '传球',
                    'yaguan_honghuangpai': '红黄牌',
                    'yaguan_pujiu': '扑救',
                    'yaguan_chuchangshijian': '出场时间',
                    'yaguan_fangui': '犯规',
                    'yaguan_jiewei': '解围'
                }
            }
            initNav(this.classType)
            $dataSlideNav.height(this.slideHeight)
            $dataSlideNav.on('click', '.item', function(e) {
                let dataType = $(this).attr('data-type')
                let data = {
                    datatype: dataType,
                    os: _os_,
                    recgid: _recgid_,
                    qid: _qid_,
                    domain: _domain_
                }
                $dataSlideNav.children().removeClass('active')
                $(this).addClass('active')
                let dataStatistics = wsCache.get(`dataStatistics${dataType}`)
                if (dataStatistics) { //有缓存就加缓存进去
                    $tabB.html(dataStatistics)
                    return
                }
                $tabB.html('') //先清空内容
                $J_loading.show()
                _util_.makeJsonp(HOST + 'data', data).done(function(result) {
                    if (result.data.data.length <= 1) {
                        $tabB.html(`<h3 style="text-align: center;font-size: 0.3rem;line-height: 1rem;font-weight: 400;">暂无数据</h3>`)
                        return
                    }
                    $tabB.html(produceHtml(result))
                    wsCache.set(`dataStatistics${dataType}`, $tabB.html(), {exp: 30 * 60})
                }).always(function() {
                    $J_loading.hide()
                })
            })
            $dataSlideNav.find('.item').eq(0).click().click() //默认执行第一个 2个click为了兼容浏览器
            function initNav(dataType) {
                let dataobj = tableList[dataType]
                for (let key in dataobj) {
                    $dataSlideNav.append(`<div class="item" data-type="${key}">${dataobj[key]}</div>`)
                }
            }
            function produceHtml(result) {
                let html = `<table class="tongji"><tr style="background: #f8f8f8">`
                let data = result.data.data
                let items = result.data.items
                switch (result.data.name) {
                    case 'nba':
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[3]}</th><th>${items[2]}</th>`
                        break
                    case 'cba':
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[3]}</th><th>${items[2]}</th>`
                        break
                    default:
                        html += `<th>${items[0]}</th><th>${items[1]}</th><th>${items[3]}</th><th>${items[2]}</th>`
                }
                switch (result.data.name) {
                    case 'cba':
                        for (let i = 0; i < 10; i++) {
                            html += `<tr><td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[3]]}</td><td>${data[i][items[2]]}</td></tr>`
                        }
                        break
                    default:
                        for (let i = 0; i < 10; i++) {
                            html += '<tr>'
                            if (data[i][items[4]]) {
                                html += `<td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[3]]}</td><td>${data[i][items[2]]}</td>`
                            } else {
                                html += `<td>${data[i][items[0]]}</td><td>${data[i][items[1]]}</td><td>${data[i][items[3]]}</td><td>${data[i][items[2]]}</td>`
                            }
                            html += `</tr>`
                        }

                        break
                }
                html += `</table>`
                return html
            }
        }

        //加载排名
        loadRanking() {
            let type
            if (this.classType === 'nba') {
                type = this.classType + '_paiming'
            } else {
                type = this.classType + '_jifenbang'
            }
            let dataRanking = wsCache.get(`dataRanking${type}`)
            if (dataRanking) { //有缓存就加缓存进去
                $content.html(dataRanking)
                return
            }
            let data = {
                datatype: type,
                os: _os_,
                recgid: _recgid_,
                qid: _qid_,
                domain: _domain_
            }
            $J_loading.show()
            _util_.makeJsonp(HOST + 'data', data).done(function(result) {
                $J_loading.hide()
                $content.html(produceHtml(result))
                wsCache.set(`dataRanking${type}`, $content.html(), {exp: 30 * 60})
            })

            function produceHtml(result) {
                let data = result.data.data
                let items = result.data.items
                let html = ''
                let colNum
                colNum = items ? items.length : 0
                if (result.data.name === 'nba') {
                    for (let j = 0; j < data.length; j++) {
                        html += `<div class="tab-b tab-p"><table><tr>`
                        items.forEach(function(item, index) {
                            if (index === 0) {
                                html += `<th colspan="2">${data[j].title + item}</th>`
                            } else if (index > 1) {
                                html += `<th>${item}</th>`
                            }
                        })
                        html += `</tr>`
                        for (let i = 0; i < data[j].list.length; i++) {
                            html += `<tr><td><span>${i + 1}</span></td>
                           <td><a href="javascript:;"><span class="is_img"><img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${data[0].list[i].球队图标}"></span><span class="is_word">${data[j].list[i].球队}</span></a></td>
                           <td><span>${data[j].list[i].胜}</span></td>
                           <td><span>${data[j].list[i].负}</span></td>
                           <td><span>${data[j].list[i].胜率}</span></td>
                           <td><span>${data[j].list[i].胜差}</span></td>
                           <td><span>${data[j].list[i].近况}</span></td>
                           </tr>`
                        }
                        html += `</table></div>`
                    }
                } else if (result.data.name === 'ouguan' || result.data.name === 'yaguan') {
                    for (let j = 0; j < data.length; j++) {
                        // 一共有这么多组
                        html += `<div class="tab-b  tab-p"><table><tr><th colspan="${colNum}" class="tc">${data[j].title}</th></tr><tr>`
                        items.forEach(function(item, index) {
                            if (index === 0) {
                                html += `<th colspan="2">${item}</th>`
                            } else if (index > 1) {
                                html += `<th>${item}</th>`
                            }
                        })
                        html += `</tr>`
                        for (let i = 0; i < data[j].list.length; i++) {
                            html += `<tr>` // 每一组的总行
                            for (let m = 0; m < colNum; m++) {
                                if (items[m].indexOf('队') >= 0) {
                                    html += `<td><a href="javascript:;"><span class="is_img">${_qid_ === 'dfsphcad' || _qid_ === 'dfsphcad' ? '' : `<img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${data[i].list[i].球队图标}">`}</span><span class="is_word">${data[j].list[i].球队}</span></a></td>`
                                } else {
                                    html += `<td><span>${data[i].list[i][items[m]]}</span></td>`
                                }
                            }
                            html += `</tr>`
                        }
                        html += `</table></div>`
                    }
                } else {
                    html += `<div class="tab-b tab-p"><table><tr>`
                    items.forEach(function(item, index) {
                        if (index === 0) {
                            html += `<th colspan="2">${item}</th>`
                        } else if (index > 1) {
                            html += `<th>${item}</th>`
                        }
                    })
                    html += `</tr>`
                    for (let i = 0; i < data.length; i++) {
                        html += `<tr>`
                        for (let j = 0; j < colNum; j++) {
                            if (items[j].indexOf('队') >= 0) {
                                html += `<td><a href="javascript:;"><span class="is_img"><img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${data[i].球队图标}"></span><span class="is_word">${data[i].球队}</span></a></td>`
                            } else {
                                html += `<td><span>${data[i][items[j]]}</span></td>`
                            }
                        }
                        html += `</tr>`
                    }
                    html += `</table></div>`
                }
                return html
            }
        }

        //点击加载其他的主栏目
        loadMainColumns() {
            let that = this
            $navMenu.find('li').click(function() {
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                that.dataType = $(this).attr('data-type')
                that.loadContent()
            })
        }
    }
    new EastSport()
})
