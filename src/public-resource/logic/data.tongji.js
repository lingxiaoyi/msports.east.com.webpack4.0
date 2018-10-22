import 'pages/sougou/data_paiming/style.scss'
import 'zepto/src/selector'
import './log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import '../libs/lib.prototype'
import _util_ from '../libs/libs.util'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    // let {HOST, ORDER_API} = config.API_URL
    let {HOST,SEARCHNEW} = config.API_URL
    // let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}"></a></div> </div>`)
    let $scrollLoad = $('#J_loading')
    let $goTop = $('#goTop')
    let $banner = $('.banner')
    $('.navBox').after('<div id="J_loading_T" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $insideNav = $('nav')
    let $matchContent = $('.main #match')
    // let $newsContent = $('.main #news')
    let $dataContent = $('.main #data')
    // let $dateText = $('#dateText')
    $body.append(`<div class="popup" id="popup"></div>`)
    // let $popup = $('#popup')
    let prevDate = new Date().format('yyyy/MM/dd') // 初始化今天时间
    let classType = _util_.getUrlParam('class')//需要显示的模块名
    let type = _util_.getUrlParam('type')//需要显示的模块名 t为统计 p为排名
    let nameType = _util_.getUrlParam('name')//赛事名称
    let matchFlag = true //下拉加载开关
    let AllTypeMatch = {
        'zhongyao': {
            code: '',
            name: '重要'
        },
        'yingchao': {
            code: '900006',
            name: '英超'
        },
        'ouguan': {
            code: '900011',
            name: '欧冠'
        },
        'xijia': {
            code: '900007',
            name: '西甲'
        },
        'yijia': {
            code: '900008',
            name: '意甲'
        },
        'dejia': {
            code: '900009',
            name: '德甲'
        },
        'zhongchao': {
            code: '900005',
            name: '中超'
        },
        'nba': {
            code: '900002',
            name: 'NBA'
        },
        'cba': {
            code: '900003',
            name: 'CBA'
        },
        'yaguan': {
            code: '900013',
            name: '亚冠'
        },
        'fajia': {
            code: '900017',
            name: '法甲'
        },
        'worldcup': {
            code: '900007',
            name: '世界杯'
        },
    }
    // 世界杯小组赛球队数据
    let json = [
        {
            time: '2018-6-14 23:00',
            host: '俄罗斯',
            visit: '沙特阿拉伯',
            type: 'A',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-15 20:00',
            host: '埃及',
            visit: '乌拉圭',
            type: 'A',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-20 02:00',
            host: '俄罗斯',
            visit: '埃及',
            type: 'A',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-20 23:00',
            host: '乌拉圭',
            visit: '沙特阿拉伯',
            type: 'A',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-25 22:00',
            host: '乌拉圭',
            visit: '俄罗斯',
            type: 'A',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-25 22:00',
            host: '沙特阿拉伯',
            visit: '埃及',
            type: 'A',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-15 23:00',
            host: '摩洛哥',
            visit: '伊朗',
            type: 'B',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-16 02:00',
            host: '葡萄牙',
            visit: '西班牙',
            type: 'B',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-20 20:00',
            host: '葡萄牙',
            visit: '摩洛哥',
            type: 'B',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-21 02:00',
            host: '伊朗',
            visit: '西班牙',
            type: 'B',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-26 02:00',
            host: '伊朗',
            visit: '葡萄牙',
            type: 'B',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-26 02:00',
            host: '西班牙',
            visit: '摩洛哥',
            type: 'B',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-16 18:00',
            host: '法国',
            visit: '澳大利亚',
            type: 'C',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-17 00:00',
            host: '秘鲁',
            visit: '丹麦',
            type: 'C',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-21 20:00',
            host: '丹麦',
            visit: '澳大利亚',
            type: 'C',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-21 23:00',
            host: '法国',
            visit: '秘鲁',
            type: 'C',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-26 22:00',
            host: '丹麦',
            visit: '法国',
            type: 'C',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-26 22:00',
            host: '澳大利亚',
            visit: '秘鲁',
            type: 'C',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-16 21:00',
            host: '阿根廷',
            visit: '冰岛',
            type: 'D',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-17 03:00',
            host: '克罗地亚',
            visit: '尼日利亚',
            type: 'D',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-22 02:00',
            host: '阿根廷',
            visit: '克罗地亚',
            type: 'D',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-22 23:00',
            host: '尼日利亚',
            visit: '冰岛',
            type: 'D',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-27 02:00',
            host: '尼日利亚',
            visit: '阿根廷',
            type: 'D',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-27 02:00',
            host: '冰岛',
            visit: '克罗地亚',
            type: 'D',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-17 20:00',
            host: '哥斯达黎加',
            visit: '塞尔维亚',
            type: 'E',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-18 02:00',
            host: '巴西',
            visit: '瑞士',
            type: 'E',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-22 20:00',
            host: '巴西',
            visit: '哥斯达黎加',
            type: 'E',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-23 02:00',
            host: '塞尔维亚',
            visit: '瑞士',
            type: 'E',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-28 02:00',
            host: '塞尔维亚',
            visit: '巴西',
            type: 'E',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-28 02:00',
            host: '瑞士',
            visit: '哥斯达黎加',
            type: 'E',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-17 23:00',
            host: '德国',
            visit: '墨西哥',
            type: 'F',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-18 20:00',
            host: '瑞典',
            visit: '韩国',
            type: 'F',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-23 23:00',
            host: '韩国',
            visit: '墨西哥',
            type: 'F',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-24 02:00',
            host: '德国',
            visit: '瑞典',
            type: 'F',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-27 22:00',
            host: '韩国',
            visit: '德国',
            type: 'F',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-27 22:00',
            host: '墨西哥',
            visit: '瑞典',
            type: 'F',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-18 23:00',
            host: '比利时',
            visit: '巴拿马',
            type: 'G',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-19 02:00',
            host: '突尼斯',
            visit: '英格兰',
            type: 'G',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-23 20:00',
            host: '比利时',
            visit: '突尼斯',
            type: 'G',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-24 20:00',
            host: '英格兰',
            visit: '巴拿马',
            type: 'G',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-29 02:00',
            host: '英格兰',
            visit: '比利时',
            type: 'G',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-29 02:00',
            host: '巴拿马',
            visit: '突尼斯',
            type: 'G',
            host_num: 2,
            visit_num: 3
        },
        {
            time: '2018-6-19 20:00',
            host: '哥伦比亚',
            visit: '日本',
            type: 'H',
            host_num: 3,
            visit_num: 4
        },
        {
            time: '2018-6-19 23:00',
            host: '波兰',
            visit: '塞内加尔',
            type: 'H',
            host_num: 1,
            visit_num: 2
        },
        {
            time: '2018-6-24 23:00',
            host: '日本',
            visit: '塞内加尔',
            type: 'H',
            host_num: 4,
            visit_num: 2
        },
        {
            time: '2018-6-25 02:00',
            host: '波兰',
            visit: '哥伦比亚',
            type: 'H',
            host_num: 1,
            visit_num: 3
        },
        {
            time: '2018-6-28 22:00',
            host: '日本',
            visit: '波兰',
            type: 'H',
            host_num: 4,
            visit_num: 1
        },
        {
            time: '2018-6-28 22:00',
            host: '塞内加尔',
            visit: '哥伦比亚',
            type: 'H',
            host_num: 2,
            visit_num: 3
        }
    ]
    // 世界杯数据
    let sjbData = {
        els:{
            chinese:'俄罗斯'
        },
        stalb:{
            chinese:'沙特阿拉伯'
        },
        aj:{
            chinese:'埃及'
        },
        wlg:{
            chinese:'乌拉圭'
        },
        pty:{
            chinese:'葡萄牙'
        },
        xby:{
            chinese:'西班牙'
        },
        mlg:{
            chinese:'摩洛哥'
        },
        yl:{
            chinese:'伊朗'
        },
        fg:{
            chinese:'法国'
        },
        adly:{
            chinese:'澳大利亚'
        },
        ml:{
            chinese:'秘鲁'
        },
        dm:{
            chinese:'丹麦'
        },
        agt:{
            chinese:'阿根廷'
        },
        bd:{
            chinese:'冰岛'
        },
        kldy:{
            chinese:'克罗地亚'
        },
        nrly:{
            chinese:'尼日利亚'
        },
        bx:{
            chinese:'巴西'
        },
        rs:{
            chinese:'瑞士'
        },
        gsdlj:{
            chinese:'哥斯达黎加'
        },
        sewy:{
            chinese:'塞尔维亚'
        },
        dg:{
            chinese:'德国'
        },
        mxg:{
            chinese:'墨西哥'
        },
        rd:{
            chinese:'瑞典'
        },
        hg:{
            chinese:'韩国'
        },
        bls:{
            chinese:'比利时'
        },
        bnm:{
            chinese:'巴拿马'
        },
        tns:{
            chinese:'突尼斯'
        },
        ygl:{
            chinese:'英格兰'
        },
        bl:{
            chinese:'波兰'
        },
        snje:{
            chinese:'塞内加尔'
        },
        glby:{
            chinese:'哥伦比亚'
        },
        rb:{
            chinese:'日本'
        }
    }
    let isSjb = false
    let saishiid = null
    let saishiName = null
    // 进来判断是否是世界杯的，需要隐藏数据板块
    // if(nameType in sjbData)
    for(let item in sjbData){
        if(item == nameType){
            $insideNav.find('li:last-child').remove()
            $insideNav.find('li').css('width','49%')
            isSjb = true
            saishiName = sjbData[item].chinese
        }
    }

    if(!isSjb){
        saishiid = AllTypeMatch[nameType].code//赛事id
        saishiName = AllTypeMatch[nameType].name//赛事id
    }

    let readhistory = _util_.CookieUtil.get(`historyUrlArr${nameType}`) || 'null'
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()

    let sjbNewData = {
        keywords:  '',
        stkey_zixun: '',
        lastcol_zixun: '',
        splitwordsarr: '',
        uid: _util_.getUid(),
        qid: _qid_,
        softtype: 'dongfangtiyu',
        browser_type: _util_.browserType(),
        pixel: (function () {
            return window.screen.width + '*' + window.screen.height
        })()
    }
    // 设置banner
    $banner.html(`<icon class="${nameType}"><em>${saishiName}</em></icon>`)
    // 获取数据
    let getData = {
        'startT': '', // 赛事相关
        'oldST': '',
        'endT': '',
        'oldET': '',
        'matchInit': false, // 'matchS'
        'match': function(flage) {
            let self = this
            if(isSjb){
                if($matchContent.find('li.noData').length) return
                sjbHtml.match($matchContent)
                // if($matchContent.find('li').length) return
                // $matchContent.append(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                return
            }
            if (this.matchInit) {
                if (flage === true) {
                    this.endT = this.oldST
                    this.startT = this.oldST = this.oldST - 24 * 60 * 60 * 1000
                } else if (flage === 2) {
                    $matchContent.append($scrollLoad)
                    this.startT = this.oldET
                    this.endT = this.oldET = this.oldET + 24 * 60 * 60 * 1000
                } else {
                    return false
                }
            } else {
                this.startT = this.oldST = new Date(prevDate).getTime()
                this.endT = this.oldET = this.startT + (saishiid === '900003' ? 1 : 3) * 24 * 60 * 60 * 1000//特殊id位一天
            }
            this.matchLoad = true
            requestMatchSchedule(this.startT, this.endT, saishiid).done(function(res) {
                makeHtml['match'](res, $matchContent, flage)
                $('.pull-down-load-tips .txt').html('加载完成')
                $scrollLoad.remove()
                setTimeout(function() {
                    $insideNav.find('.down_load').removeClass('show')
                    self.matchLoad = false
                }, 500)
                self.matchInit = true
            })
        },
        'matchLoad': false, //当前加载状态
        'newsInit': false, // 新闻相关
        'startkeynext': '',
        'startkeylast': '',
        'startkey': '',
        'pgnum': 0,
        'pgnext': 0,
        'pglast': 0,
        'news': function(flage) {
            if(isSjb){
                let news = $('#news')
                if(news.find('li.noData').length) return
                sjbNewData.keywords = encodeURIComponent(sjbData[nameType].chinese)
                requestnewsSjb(sjbNewData).done((res)=>{
                    if(JSON.stringify(res.zixun) == "{}"){
                        news.append(`<li class="noData" style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;border:0">无更多数据...</li>`)
                        return
                    }
                    sjbNewData.lastcol_zixun = res.zixun.lastcol
                    sjbHtml.news(res.zixun,news)
                })
                return
            }
            if (this.newsInit) {
                if (flage === true) { //下拉加载
                    this.pglast--
                    this.pgnum = this.pglast
                    this.startkey = this.startkeylast || this.startkey
                } else if (flage === 2) { //滚动加载
                    $('#news').append($scrollLoad)
                    this.pgnext++
                    this.pgnum = this.pgnext
                    this.startkey = this.startkeynext || this.startkey
                } else {
                    return false
                }
            } else {
                this.pgnum = this.pgnext = 1
            }
            let self = this
            this.newsLoad = true
            requestnews(self.startkey, this.pgnum).done(function(res) {
                $('.pull-down-load-tips .txt').html('为您更新15条内容')
                $scrollLoad.remove()
                setTimeout(function() {
                    $insideNav.find('.down_load').removeClass('show')
                    self.newsLoad = false
                }, 500)
                self.startkey = res.endkey
                if (flage === true) {
                    self.startkeylast = res.endkey
                } else {
                    self.startkeynext = res.endkey
                }
                makeHtml['news'](res, $('#news'), flage)
                self.newsInit = true
            })
        },
        'newsLoad': false, //当前加载状态
        'dataInit': false, // 数据相关
        'data': function() {
            if ($('#data .data-nav li.active').length) {
                return false
            } else {
                //console.log($('#data .data-nav li').eq(0))
                $('#data .data-nav li').eq(0).click().click()
            }
        },
        'dataLoad': false //当前加载状态
    }

    let sjbHtml = {
        match: function(resBox) {
            let newArr = []
            json.forEach((a) => {
                if(a.host == saishiName || a.visit == saishiName){
                    newArr[newArr.length] = a
                }
            })
            if (!newArr.length) {
                resBox.append(`<li class="noData" style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                matchFlag = false
                return false
            }
            resBox.removeClass('noMatch')
            newArr.forEach(function(v) {
                let MathDate = formatDate(v.time)
                let matchBox = $(`#match li[date = "${MathDate[1]}"]`)
                // let liveInfo = 'javascript:;'
                if (!matchBox.length) {
                    matchBox = $(`<li date="${MathDate[1]}">
                                    <div class="date">${MathDate.join(' ')}</div>
                                    <ul class="matchs"></ul>
                                  </li>`)
                    resBox.append(matchBox)
                }
                let state2 = '敬请期待'
                let state = 'unstart'
                let score = '<i></i>'
                let html = `<div class="host"><img src="//sports.eastday.com/jscss/v4/img/world_cup_2018/team/${v.type}_${v.host_num}.png" alt=""><span>${v.host}</span></div>
                <div class="visit"><img src="//sports.eastday.com/jscss/v4/img/world_cup_2018/team/${v.type}_${v.visit_num}.png" alt=""><span>${v.visit}</span></div>`
                matchBox.find('ul').html(`<li class="${state}">
                    <a href="javascipt:;">
                        <div class="tt">
                            <div class="tit">
                                <em>${v.time.split(' ')[1]}</em><br>小组赛
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
                </li>
               `)
            })
            matchFlag = true
        },
        news:function(res, resBox){
            res.data.forEach(function(a) {
                let html = ''
                if (a.imgstr.length > 2) {
                    html = `<li class="clearfix">
                        <a href="/a/${a.url}?qid=${_qid_}&ishot=0&recommendtype=-1&idx=0&pgnum=1&from=shijiebei&dataType=shijiebei&typeName=${encodeURI('世界杯')}" suffix="tuijian">
                            <div class="title">${a.title}</div>
                            <div class="imgs">
                                <img class="lazy" src="${a.imgstr[0].src}">
                                <img class="lazy" src="${a.imgstr[1].src}">
                                <img class="lazy" src="${a.imgstr[2].src}">
                            </div>
                            <div class="source clearfix">

                                <div class="l">${a.source}</div>
                            </div>
                        </a>
                    </li>`
                } else {
                    html = `<li class="clearfix">
                        <a href="/a/${a.url}?qid=${_qid_}&ishot=0&recommendtype=-1&idx=0&pgnum=1&from=shijiebei&dataType=shijiebei&typeName=${encodeURI('世界杯')}" suffix="tuijian">
                            <div class="img">
                                <img class="lazy" src="${a.imgstr[0].src}">
                            </div>
                            <div class="info">
                                <div class="title">${a.title}</div>
                                <div class="source clearfix">

                                    <div class="l">${a.source}</div>
                                </div>
                            </div>
                        </a>
                    </li>`
                }
                resBox.append(html)
            })
        }
    }

    // 字符串模板
    let makeHtml = {
        'match': function(res, resBox, flage) {
            if (!res.data.length) {
                resBox.append(`<li style="text-align: center;line-height: 0.8rem;font-size: 0.3rem;">无更多数据...</li>`)
                matchFlag = false
                return false
            }
            resBox.removeClass('noMatch')
            res.data.forEach(function(v) {
                let MathDate = formatDate(v.starttime.split(' ')[0])
                let matchBox = $(`#match li[date = "${MathDate[1]}"]`)
                let liveInfo = (function(arr) {
                    let infoName = []
                    arr.forEach(function(item) {
                        let name = item.title.split('(')[0]
                        if (infoName.indexOf(name) < 0) infoName.push(name)
                    })
                    return infoName
                })(v.zhiboinfozh)
                if (!matchBox.length) {
                    matchBox = $(`<li date="${MathDate[1]}">
                                    <div class="date">${MathDate.join(' ')}</div>
                                    <ul class="matchs"></ul>
                                  </li>`)
                    if (flage === true) {
                        resBox.prepend(matchBox)
                    } else {
                        resBox.append(matchBox)
                    }
                }
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
                matchBox.find('ul').append(`<li class="${state}">
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
                </li>
               `)
            })
            matchFlag = true
        },
        'news': function(res, resBox, flage) {
            res.data.forEach(function(a) {
                let html = ''
                if (a.minimg > 2) {
                    html = `<li class="clearfix">
                        <a href="${a.url}?qid=null&amp;ishot=0&amp;recommendtype=-1&amp;idx=13&amp;pgnum=1&amp;from=tuijian&amp;dataType=tuijian&amp;typeName=推荐" suffix="tuijian">
                            <div class="title">${a.topic}</div>
                            <div class="imgs">
                                <img class="lazy" src="${a.miniimg[0].src}">
                                <img class="lazy" src="${a.miniimg[1].src}">
                                <img class="lazy" src="${a.miniimg[2].src}">
                            </div>
                            <div class="source clearfix">

                                <div class="l">${a.source}</div>
                            </div>
                        </a>
                    </li>`
                } else {
                    html = `<li class="clearfix">
                        <a href="${a.url}?qid=null&amp;ishot=0&amp;recommendtype=-1&amp;idx=12&amp;pgnum=1&amp;from=tuijian&amp;dataType=tuijian&amp;typeName=推荐" suffix="tuijian">
                            <div class="img">
                                <img class="lazy" src="${a.miniimg[0].src}">
                            </div>
                            <div class="info">
                                <div class="title">${a.topic}</div>
                                <div class="source clearfix">

                                    <div class="l">${a.source}</div>
                                </div>
                            </div>
                        </a>
                    </li>`
                }
                if (flage === true) {
                    resBox.prepend(html)
                } else {
                    resBox.append(html)
                }
            })
        },
        'data': function(res, resBox) {
            resBox.append(`<table>
                    <thead>
                        <tr>
                            ${
                (function(arr) {
                    let s = ''
                    $.each(arr, function(k, v) {
                        s += `<th>${v}</th>`
                        if (k >= 3) {
                            return false
                        }
                    })
                    return s
                })(res.data.items)
                }
                        </tr>
                    </thead>
                    <tbody>
                        ${(function(data) {
                let str = ''
                $.each(data, function(k, v) {
                    str += `<tr>                          
                                ${
                        (function(arr) {
                            let s = ''
                            $.each(arr, function(k, a) {
                                s += `<td>${v[a]}</td>`
                                if (k >= 3) {
                                    return false
                                }
                            })
                            return s
                        })(res.data.items)
                        }
                            </tr>`
                    if (k >= 9) {
                        return false
                    }
                })
                return str
            })(res.data.data)}           
                    </tbody>
                </table>`)
        },
        'paiH': function(res, resBox) {
            resBox.append(`
                 <table>
                    ${(function(da) {
                let str = ''
                if (!da.items) {
                    da.data.forEach(function(v) {
                        str += '<tbody>'
                        str += `<tr>
                                    <th colspan="2">${v.items[0]}排名</th>
                                    <th>胜</th>
                                    <th>负</th>
                                    <th>胜率</th>
                                    <th>胜差</th>
                                    <th>近况</th>
                                </tr>`
                        v.list.forEach(function(b) {
                            str += `<tr>
                                        <td><span>${b[v.items[0]]}</span></td>
                                        <td><a href="javascript:;"><span class="is_img"><img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${b['球队图标']}"></span><span class="is_word">${b['球队']}</span></a></td>
                                        <td><span>${b['胜']}</span></td>
                                        <td><span>${b['负']}</span></td>
                                        <td><span>${b['胜率']}</span></td>
                                        <td><span>${b['胜差']}</span></td>
                                        <td><span>${b['近况']}</span></td>
                                    </tr>`
                        })
                        str += '</tbody>'
                    })
                } else {
                    let headStr = (function(arr) {
                        let s = ''
                        arr.forEach(function(v) {
                            if (v === '球队') {
                                return true
                            }
                            if (!s.length) {
                                s += `<th colspan="2">${v}</th>`
                                return true
                            }
                            s += `<th>${v}</th>`
                        })
                        return `<tr>${s}</tr>`
                    })(da.items)
                    if (da.data[0].list) {
                        da.data.forEach(function(v) {
                            let s = `<tr><th colspan="${da.items.length}" class="tc">${v.title}</th></tr>${headStr}`
                            v.list.forEach(function(a) {
                                s += `<tr>
                                            ${(function(arr) {
                                    let c = ''
                                    arr.forEach(function(b) {
                                        if (b === '球队') {
                                            c += `<td><a href="javascript:;"><span class="is_img"><img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${a['球队图标']}"></span><span class="is_word">${a[b]}</span></a></td>`
                                            return true
                                        }
                                        c += `<td>${a[b]}</td>`
                                    })
                                    return c
                                })(da.items)} 
                                      </tr>`
                            })
                            str += `<tbody>${s}</tbody>`
                        })
                    } else {
                        da.data.forEach(function(v) {
                            str += (function(arr) {
                                let s = ''
                                arr.forEach(function(a) {
                                    if (a === '球队') {
                                        s += `<td><a href="javascript:;"><span class="is_img"><img onerror="this.src='//msports.eastday.com/h5/img/logo_default.png'" src="${v['球队图标']}"></span><span class="is_word">${v[a]}</span></a></td>`
                                    } else {
                                        s += `<td>${v[a]}</td>`
                                    }
                                })
                                return `<tr>${s}</tr>`
                            })(da.items)
                        })
                        str = `<tbody>${headStr}${str}</tbody>`
                    }
                }
                return str
            })(res.data)}
                </table>          
            `)
            return ''
        }
    }
    //根据导航执行对应的模块
    $insideNav.on('click', 'ul li a', function(e) {
        e.preventDefault()
        classType = $(this).attr('data-type')
        if ($(this).hasClass('active')) {
            return
        }
        $goTop.hide()
        $insideNav.find('li a').removeClass('active')
        $(this).addClass('active')
        $(`#${classType}`).show().siblings().hide()
        $body.removeClass('fullS')
        // 执行对应的方法
        getData[classType]()
    })
    // 隐藏弹窗
    $body.on('click', '#popup', function() {
        $(this).hide()
    })
    // 返回顶部
    $goTop.children('.top').on('click', function() {
        $('.main .contBox:visible').scrollTop(0)
        $('#data .team-list:visible').scrollTop(0)
    })
    // 数据分类
    let dataTypes = {
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
        },
        'worldcup': {
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
    }
    // 初始化数据部分结构
    datainit()
    // 绑定数据导航点击
    requestnewsData('worldcup_world_jifenbang').done(function(res) {
        makeHtml.paiH(res, $('#data .team-list'))
    })
    $('#data').on('click', '.data-nav li', function() {
        if ($(this).hasClass('active')) {
            return false
        }
        $goTop.hide()
        $(this).addClass('active').siblings().removeClass('active')
        let type = $(this).attr('data-type')
        $(`#data .dataBox`).hide()
        $(`#data .dataBox[datatype=${type}]`).show()
        if ($(this).index()) {
            requestnewsData($(this).attr('type')).done(function(res) {
                makeHtml.paiH(res, $('#data .team-list'))
            })
        } else {
            if ($('#dataSlideNav .item.active').length) {
                return false
            } else {
                $('#dataSlideNav .item:first-child').click()
            }
        }
    })
    // 绑定统计数据点击事件
    $('#data').on('click', '#dataSlideNav .item', function() {
        if ($(this).hasClass('active')) {
            return false
        }
        $(this).addClass('active').siblings().removeClass('active')
        let itemS = $('#dataSlideNav .item').length
        if ($(this).index() > itemS / 2) {
            let lastItem = $('#dataSlideNav .item:last')
            let ScrollT = lastItem.height() * itemS - $('#dataSlideNav').height()
            $(this).parent().parent().scrollTop(ScrollT)
        } else {
            $(this).parent().parent().scrollTop(0)
        }
        $('#data .tab-b').html('')
        requestnewsData($(this).attr('data-type')).done(function(res) {
            let data = res.data
            sessionStorage.setItem(`${data.name}_${data.type}`, JSON.stringify(res))
            makeHtml.data(res, $('#data .data-tj .tab-b'))
        })
    })
    requestnewsData('xijia_sheshoubang').done(function(res) {
        let data = res.data
        sessionStorage.setItem(`${data.name}_${data.type}`, JSON.stringify(res))
        makeHtml.data(res, $('#data .data-tj .tab-b'))
    })
    //滚动加载
    $('.main .contBox').on('scroll', function() {
        if (($(this).scrollTop()) / 100 > 0.9) {
            $goTop.show()
        } else {
            $goTop.hide()
        }
        if (getData[` ${classType}Load `]) {
            return true
        }
        if (classType === 'data') {
            return false
        }
        let $contbox = $(this)
        let lastLis = $contbox.find('li:last-child')
        let lastLi = $(lastLis[lastLis.length - 1])
        if (classType === 'match') {
            let Btop = $(this).position().top
            let dateH = $('#match>li:first-child .date').height()
            $('#match>li').each(function() {
                let Ltop = $(this).position().top
                if (Ltop < Btop && Btop < $(this).height() + Ltop - dateH) {
                    $(this).addClass('fix-date')
                    $(this).removeClass('fix2-date')
                } else if ($(this).height() + Ltop - dateH <= Btop && Btop <= $(this).height() + Ltop) {
                    $(this).removeClass('fix-date')
                    $(this).addClass('fix2-date')
                } else {
                    $(this).removeClass('fix-date')
                    $(this).removeClass('fix2-date')
                }
            })
        }
        if (lastLi.position().top - $(window).height() < 0 && matchFlag) {
            matchFlag = false
            $scrollLoad.show()
            getData[classType](2)//执行对应的滚动加载
        }
    })
    // 数据部分初始化
    function datainit() {
        $('#data').html('').append(`
 <li class="dataBox data-tj clearfix" datatype="t">
                <div class="tab-h" id="dataSlideNav"> 
                    <div class="tab-box">
                        ${(function() {
            let str = ''
            for (let k in dataTypes[nameType]) {
                str += `<div class="item ${k === 'xijia_sheshoubang' ? 'active' : ''}" data-type="${k}" >${dataTypes[nameType][k]}</div>`
            }
            return str
        })()}
                    </div>                                                                                                                                                          
                </div>
                <div class="tab-b">                
                </div>
            </li> 
            `)
    }

    //格式化日期为[今天 ,03月13日 ,周一]
    function formatDate(starts) {
        let weekday = [
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六'
        ]
        let today = [
            '今天',
            '明天',
            '后天'
        ]
        starts = starts.replace(/-/g, '/')
        let date = new Date(starts)
        let days = -Math.floor((new Date() / 1 - date / 1) / (24 * 60 * 60 * 1000))
        return [
            today[days] ? today[days] : '',
            date.format('MM月dd日'),
            weekday[date.getDay()]
        ]
        // (today[days] ? today[days] : '') + ' ' + date.format('MM月dd日') + ' ' + weekday[date.getDay()]
    }
    //请求比赛赛程
    function requestMatchSchedule(starts, endTs, saishiid = '') {
        let data = {
            startts: starts,
            endts: endTs,
            saishiid: saishiid,
            isimp: ''
        }
        return _util_.makeJsonp(HOST + 'matchba', data)
    }

    //   世界杯新闻请求
    function requestnewsSjb(data){
        return _util_.makeGet(SEARCHNEW, data).always(function() {
        })
    }
    //请求新闻
    function requestnews(startkey, pgnum) {
        let data = {
            type: nameType,
            typecode: saishiid,
            startkey: startkey,
            newkey: '',
            pgnum: pgnum,
            os: _os_,
            recgid: _recgid_,
            qid: _qid_,
            domain: _domain_,
            readhistory: readhistory
        }
        return _util_.makeJsonp(HOST + 'newspool', data).always(function() {
        })
    }

    //请求数据
    function requestnewsData(datatype) {
        let saveDate = sessionStorage.getItem(datatype)
        if (saveDate) { //直接调用done方法
            let dtd = $.Deferred()
            dtd.resolve(JSON.parse(saveDate))
            return dtd
        }
        let data = {
            datatype: datatype,
            os: _os_,
            recgid: _recgid_,
            qid: _qid_,
            domain: _domain_
        }
        return _util_.makeJsonp(HOST + 'data', data)
    }
})
