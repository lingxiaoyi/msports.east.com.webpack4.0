import './style.scss'
import '../../../public-resource/logic/log.news.js'
import FastClick from 'fastclick'
import WebStorageCache from 'web-storage-cache'
import config from 'configModule'
import '../../../public-resource/libs/lib.prototype'
import _util_ from '../../../public-resource/libs/libs.util'
//import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {
        PLAYOFFNBA,
        GroupStage
    } = config.API_URL
    // let {DOMAIN} = config
    // let domain = DOMAIN
    let {
        HOST
    } = config.API_URL
    let {
        DOMAIN
    } = config
    let _domain_ = DOMAIN
    let version = '1.0.1' //内页版本号  用来区分版本上线
    console.log(version)
    //let os = _util_.getOsType()
    //let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    //qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    //let pixel = window.screen.width + '*' + window.screen.height
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    // let wsCache = new WebStorageCache()
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $J_loading = $('#J_loading')
    // let $menu = $('#menu')
    // let $tabBd = $('#tabBd')
    // let $item = $tabBd.find('.item')
    // let $secNewsList = $tabBd.find('.sec-news-list')
    // let tabh = $tabBd.find('.tab-h')
    // let tabList = $tabBd.find('.tab-list .sec-news-list')
    let pullUpFinished = false
    // 世界杯
    let $scrollLoad = $('#J_loading')
    let headerNavA = $('.header-nav a')
    let matchNavA = $('.match-nav a')
    let dataNavA = $('.data-nav a')
    let dataMain = $('.data-main')
    let match = $('.match')
    let data = $('.data')
    let news = $('.news')
    let groupPhaseMatchs = $('.groupPhase .matchs')
    let duelTab = $('#duelTab')
    let shootOutB = $('.shootOut .tab-b')
    let matchShootOutNavA = $('#matchShootOutNav .tab-item')
    let dataScoreNavA = $('#dataScoreNav .tab-item')
    let dataListsNavA = $('#dataListsNav .tab-item')
    let $dataListsNav = $('#dataListsNav')
    let $dataScoreNav = $('#dataScoreNav')
    // 新闻数据
    let AllTypeMatch = {
        world_cup: {
            code: 901276,
            name: 'world_cup'
        }
    }
    let matchFlag = true //下拉加载开关
    let nameType = _util_.getUrlParam('name') //赛事名称
    let navType = _util_.getUrlParam('type') // 积分榜or排行榜
    let saishiid = AllTypeMatch[nameType].code //赛事id
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    let readhistory = _util_.CookieUtil.get(`historyUrlArr${nameType}`) || 'null'


    function Detail() {
        /* global _special_:true*/
        // this.host = _special_[0]
        // this.activeIndex = 0 //当前菜单栏目下标
        // this.channel = qid
        // this.index = 4 //热点新闻中的广告起始下标
        // this.startkey = ''
        // this.idx = 1 //热点新闻中的位置下标
        // this.pgnum = 1
        // this.result = ''
        // 世界杯
        this.allTeamData = [] // 全部小组赛总和
        this.newsInit = false // 新闻相关
        this.matchLoad = false //当前加载状态
        this.newsInit = false // 新闻相关
        this.startkeynext = ''
        this.startkeylast = ''
        this.startkey = ''
        this.pgnum = 0
        this.pgnext = 0
        this.pglast = 0
        this.shijiebeiData = ''
        this.shootOutData = ''
        this.againstPlan = {}
    }
    Detail.prototype = {
        init: function () {
            /*let scope = this
            scope.showHotNews()
            //scope.setHistoryUrl()
            //scope.queryMatchState()
            scope.addEventListener()
            scope.getData(0)*/
            // 世界杯
            let scope = this
            scope.onScrollLoadNews()
            scope.common()
        },
        // 公用交互样式
        common: function () {
            let scope = this
            let $goTop = $('#goTop')
            // nav切换
            headerNavA.on('click', function () {
                let type = $(this).attr('data-type')
                $(this).addClass('active')
                $goTop.hide()
                $(this).parent().siblings().find('a').removeClass('active')
                dataMain.find('.' + type).addClass('active').siblings('.item').removeClass('active')
                if (type == 'news') {
                    scope.newsReader()
                }
                if(type == 'data'){
                    scope.matchDataRender('score')
                }
                if(type == 'match'){
                    scope.makeHtml['groupPhase']('groupPhase', scope)
                }
            })
            // 赛程内 对阵  小组  淘汰切换
            matchNavA.on('click', function () {
                let type = $(this).attr('data-type')
                $(this).addClass('show')
                $(this).parent().siblings().find('a').removeClass('show')
                match.find('.' + type).addClass('match-active').siblings('.match-item').removeClass('match-active')
                scope.makeHtml[type](type, scope)
            })
            // 数据内积分榜和排行榜切换
            dataNavA.on('click', function () {
                let type = $(this).attr('data-type')
                $(this).addClass('show')
                $(this).parent().siblings().find('a').removeClass('show')
                data.find('.' + type).addClass('data-active').siblings('.data-item').removeClass('data-active')
                type == 'lists' ? scope.matchDataRender($('.lists .show').attr('data-type')) : scope.matchDataRender(type)
            })
            // 小组赛组队切换
            matchShootOutNavA.on('click', function () {
                let type = $(this).attr('data-type')
                $(this).addClass('show').siblings().removeClass('show')
                scope.makeHtml.groupPhase(type, scope)
            })

            dataListsNavA.on('click', function () {
                let type = $(this).attr('data-type')
                $(this).addClass('show').siblings().removeClass('show')
                scope.matchDataRender(type)
            })

            data.find()
            // navType有值
            if (!!navType) {
                headerNavA.removeClass('active')
                headerNavA.eq(2).addClass('active').click()
                $('.data-nav a[data-type=' + navType + ']').click()
                // this.matchDataRender(navType)
            } else {
                headerNavA.eq(0).click()
                matchNavA.eq(0).click()
            }
            $goTop.children('.top').on('click', function () {
                news.scrollTop(0)
            })
            news.on('scroll', function () {
                if (($(this).scrollTop()) / 100 > 0.9) {
                    $goTop.show()
                } else {
                    $goTop.hide()
                }
                let lastLis = $(this).find('li:last-child')
                let lastLi = $(lastLis[lastLis.length - 1])
                if (lastLi.position().top - $(window).height() < 0 && matchFlag) {
                    matchFlag = false
                    $scrollLoad.show()
                    scope.newsReader(2) //执行对应的滚动加载
                }
            })
        },
        matchDataRender:function(navType){
            let self = this
            let dataRender = ''
            let url = ''
            dataRender = navType == 'score' ? 'worldcup_world_jifenbang' : 'worldcup_world_player_' + navType
            if(this[navType]){
                this.matchHtml[navType](this[navType],self)
                return
            }
            let data = {
                datatype : dataRender
            }
            $J_loading.sj
            _util_.makeJsonp(HOST + 'data',data).done((res) => {
                if(JSON.stringify(res.data) == "{}") return
                this[navType] = res.data
                this.matchHtml[navType](res.data,self)
            })
        },
        matchHtml:{
            score:(data,self) => {
                let group = data.data
                var groupArr = {}
                let arr = []
                for(let item of group){
                    group[item.title] = item
                    for(let oldarr of item.list){
                        oldarr['title'] = item.title.replace('组','')
                        arr[arr.length] = oldarr
                    }
                }
                let newArr = arr.sort((a,b)=>{
                    return a['积分'] - b['积分']
                })
                for(let item of group){
                    groupArr[item.title.replace('组','')] = item.list
                }
                groupArr['all'] = arr
                self.matchHtml.scoreHtml(groupArr['all'])
                dataScoreNavA.on('click', function () {
                    let type = $(this).attr('data-type')
                    $(this).addClass('show').siblings().removeClass('show')
                    self.matchHtml.scoreHtml(groupArr[type])
                })
            },
            scoreHtml:(newArr) => {
                let html = ''
                $.each(newArr,(i,v) => {
                    html += `<tr data-type="${v.title}"><td class="${i>2? '':'first'}"><p class="ranking">${i+1}</p><img src="${v['球队图标']}" alt=""><p class="name">${v['球队']}</p></td><td>${v['胜'] + '/' + v['平'] + '/' + v['负']}</td><td>${v['进/失球']}</td><td>${v['积分']}</td></tr>`
                })
                $dataScoreNav.next().find('tbody').html(html)
            },
            jinqiubang:(data,self) => {
                data.data.length = data.data.length > 20 ? 20 : data.data.length
                let html = ''
                $dataListsNav.next().find('thead tr th').eq(2).html('进球')
                $.each(data.data, (i,v) => {
                    html += `<tr><td class="${i > 2? '':'first'}"><p class="ranking">${i+1}</p><p class="name">${v['球员']}</p></td><td>${v['球队']}</td><td>${v['进球']}</td></tr>`
                })
                $dataListsNav.next().find('tbody').html(html)
            },
            zhugongbang:(data,self) => {
                $dataListsNav.next().find('thead tr th').eq(2).html('助攻')
                data.data.length = data.data.length > 20 ? 20 : data.data.length
                let html = ''
                $.each(data.data, (i,v) => {
                    html += `<tr><td class="${i > 2? '':'first'}"><p class="ranking">${i+1}</p><p class="name">${v['球员']}</p></td><td>${v['球队']}</td><td>${v['总计']}</td></tr>`
                })
                $dataListsNav.next().find('tbody').html(html)
            }
        },
        newsReader: function (flage) {
            let self = this
            if (self.newsInit) {
                if (flage === true) { //下拉加载
                    self.pglast--
                    self.pgnum = self.pglast
                    self.startkey = self.startkeylast || self.startkey
                } else if (flage === 2) { //滚动加载
                    $('#news').append($scrollLoad)
                    self.pgnext++
                    self.pgnum = self.pgnext
                    self.startkey = self.startkeynext || self.startkey
                } else {
                    return false
                }
            } else {
                self.pgnum = self.pgnext = 1
            }
            self.newsLoad = true
            self.requestnews(self.startkey, self.pgnum).done(function (res) {
                $('.pull-down-load-tips .txt').html('为您更新15条内容')
                $scrollLoad.remove()
                setTimeout(function () {
                    // $insideNav.find('.down_load').removeClass('show')
                    self.newsLoad = false
                }, 500)
                self.startkey = res.endkey
                if (flage === true) {
                    self.startkeylast = res.endkey
                } else {
                    self.startkeynext = res.endkey
                }
                self.makeHtml['news'](res, news, flage)
                self.newsInit = true
            })
        },
        requestnews: function (startkey, pgnum) {
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
            return _util_.makeJsonp(HOST + 'newspool', data).always(function () {})
        },
        makeHtml: {
            againstPlan: function (type, self) {
                let arr = self.shootOutData
                let html = ''
                let allData = {
                    eightTop : [],
                    eightBottom : [],
                    fourTop : [],
                    fourBottom : [],
                    semiFinalTop : '',
                    semiFinalBottom : '',
                    third : '',
                    final : ''
                }
                arr.sort((a, b) => {
                    return new Date(a.starttime) - new Date(b.starttime)
                })
                for(let index of arr.keys()){
                    if([0,1,4,5].includes(index)){
                        allData.eightTop[allData.eightTop.length] = arr[index]
                    }else if([2,3,6,7].includes(index)){
                        allData.eightBottom[allData.eightBottom.length] = arr[index]
                    }else if([8,9].includes(index)){
                        allData.fourTop[allData.fourTop.length] = arr[index]
                    }else if([10,11].includes(index)){
                        allData.fourBottom[allData.fourBottom.length] = arr[index]
                    }else if(12 == index){
                        allData.semiFinalTop = arr[index]
                    }else if(13 == index){
                        allData.semiFinalBottom = arr[index]
                    }else if(14 == index){
                        allData.third = arr[index]
                    }else if(15 == index){
                        allData.final = arr[index]
                    }
                }
                let homeImg = (img,flage) => {
                    if((img.indexOf('8263870e94ec15958cc5414a2e8b234b') > -1 || img.indexOf('0e09e9b5903c192fe4a759731a730fff') > -1 || img.indexOf('d6f6f61ab462bab686910de6616661b8'))&& flage){
                        return '//sports.eastday.com/jscss/v4/img/world_cup_2018/i-red-small.png'
                    }else if(img.indexOf('8263870e94ec15958cc5414a2e8b234b') > -1){
                        return '//sports.eastday.com/jscss/v4/img/world_cup_2018/i-red-big.png'
                    }
                    return img
                }
                let visitImg = (img,flage) => {
                    if(img.indexOf('cb3306a5503314bbd5a625c3198a2b44') > -1 && flage){
                        return '//sports.eastday.com/jscss/v4/img/world_cup_2018/i-blue-small.png'
                    }else if(img.indexOf('cb3306a5503314bbd5a625c3198a2b44') > -1){
                        return '//sports.eastday.com/jscss/v4/img/world_cup_2018/i-blue-big.png'
                    }
                    return img
                }
                // 第一行
                html += `<div class="match-group-top1 match-group">
                        ${((arr) => {
                    let str = ''
                    for(let item of arr){
                        str += `<div class="match-list">
                                            <div class="teams">
                                                <span class="icon">
                                                    <div class="team num">(${item.home_team})</div>
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="
                                                    ${homeImg(item.home_logoname,1)}">
                                                    <div class="team">${item.home_team}</div>
                                                </span>
                                                <span class="icon">
                                                    <div class="team num">(${item.visit_team})</div>
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team">${item.visit_team}</div>
                                                </span>
                                            </div>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <span class="line-vertical"></span>
                                        </div>`
                    }
                    return str
                })(allData.eightTop)}
                        </div>`
                // 第二行
                html += `<div class="match-group-top2 match-group">
                        ${((arr) => {
                    let str = ''
                    for(let item of arr){
                        str += `<div class="match-list">
                                            <div class="teams">
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item.home_logoname,1)}">
                                                    <div class="team">${item.home_team}</div>
                                                </span>
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team">${item.visit_team}</div>
                                                </span>
                                            </div>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <span class="line-vertical"></span>
                                        </div>`
                    }
                    return str
                })(allData.fourTop)}    
                        </div>`
                // 第三行
                html += `<div class="match-group-top3 match-group">
                        ${((item) => {
                    return `<div class="match-list">
                                            <div class="teams">
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item.home_logoname,1)}">
                                                    <div class="team">${item.home_team}</div>
                                                </span>
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team">${item.visit_team}</div>
                                                </span>
                                            </div>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <span class="line-vertical"></span>
                                        </div>`
                })(allData.semiFinalTop)}
                         </div>`
                // 第四行
                html += `<div class="match-group-center match-group">
                        ${((item1,item2) => {
                    return `<div class="match-list champion">
                                        <div class="teams">
                                            <span class="icon">
                                                <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item2.home_logoname,0)}">
                                                <div class="team">${item2.home_team}</div>
                                            </span>
                                            <div class="labels">
                                                <div class="score">${item1.ismatched != 1? '-' : item1.home_score + '-' + item1.visit_score}</div>
                                            </div>
                                            <span class="icon">
                                                <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${visitImg(item2.visit_logoname,0)}">
                                                <div class="team">${item2.visit_team}</div>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="match-list came-second">
                                        <div class="teams">
                                            <span class="icon">
                                                <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item1.home_logoname,0)}">
                                                <div class="team">${item1.home_team}</div>
                                            </span>
                                            <div class="labels">
                                                <div class="score">${item1.ismatched != 1? '-' : item1.home_score + '-' + item1.visit_score}</div>
                                            </div>
                                            <span class="icon">
                                                <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-b.png'" src="${visitImg(item1.visit_logoname,0)}">
                                                <div class="team">${item1.visit_team}</div>
                                            </span>
                                        </div>
                                    </div>`
                })(allData.third,allData.final)}
                         </div>`
                // 第五行
                html += `<div class="match-group-bottom3 match-group bottom">
                        ${((item) => {
                    return `<div class="match-list">
                                            <span class="line-vertical"></span>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <div class="teams">
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item.home_logoname,1)}">
                                                    <div class="team">${item.home_team}</div>
                                                </span>
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team">${item.visit_team}</div>
                                                </span>
                                            </div>
                                        </div>`
                })(allData.semiFinalBottom)}
                        </div>`
                // 第六行
                html += `<div class="match-group-bottom2 match-group bottom">
                        ${((arr) => {
                    let str = ''
                    for(let item of arr){
                        str += `<div class="match-list">
                                            <span class="line-vertical"></span>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <div class="teams">
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item.home_logoname,1)}">
                                                    <div class="team">${item.home_team}</div>
                                                </span>
                                                <span class="icon">
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team">${item.visit_team}</div>
                                                </span>
                                            </div>
                                        </div>`
                    }
                    return str
                })(allData.fourBottom)} 
                         </div>`
                // 第七行
                html += `<div class="match-group-bottom1 match-group bottom">
                        ${((arr) => {
                    let str = ''
                    for(let item of arr){
                        str += `<div class="match-list">
                                            <span class="line-vertical"></span>
                                            <div class="line">${item.ismatched != 1? '-' : item.home_score + '-' + item.visit_score}</div>
                                            <div class="teams">
                                                <span class="icon">
                                                    <div class="team">${item.home_team}</div>
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${homeImg(item.home_logoname,1)}">
                                                    <div class="team num">(${item.home_team})</div>
                                                </span>
                                                <span class="icon">
                                                    <div class="team">${item.visit_team}</div>
                                                    <img onerror="this.src='//msports.eastday.com/h5/img/nomatch-r.png'" src="${visitImg(item.visit_logoname,1)}">
                                                    <div class="team num">(${item.visit_team})</div>
                                                </span>
                                            </div>
                                        </div>`
                    }
                    return str
                })(allData.eightBottom)}
                         </div>`
                $('#duelTab').html(html)
            },
            groupPhase: function (type, self) {
                // 世界杯小组赛所有的数据总和
                if (self.allTeamData.length) {
                    this.groupPhaseRender(type, self)
                    return
                }
                _util_.makeJsonpAjax(GroupStage).done((res) => {
                    if (!res) return
                    self.shijiebeiData = res.data
                    let json = res.data
                    let arr = []
                    for (let obj in json) {
                        if (obj == 'TAOTAI') {
                            self.shootOutData = json[obj]
                            continue
                        }
                        for (let item of json[obj]) {
                            arr[arr.length] = item
                        }
                    }
                    arr.sort((a, b) => {
                        return new Date(a.starttime) - new Date(b.starttime)
                    })
                    self.allTeamData = arr
                    // 生产小组赛数据
                    this.groupPhaseRender(type, self)
                })
            },
            groupPhaseRender: function (type, self) {
                let arr = []
                let str = ''
                if (type == 'groupPhase' || type == 'all') {
                    arr = self.allTeamData
                    type = 'all'
                } else {
                    arr = self.shijiebeiData[type]
                }
                for (let item of arr) {
                    let liveInfo = (function (arr) {
                        let infoName = []
                        arr.forEach(function (item) {
                            let name = item.title.split('(')[0]
                            if (infoName.indexOf(name) < 0) infoName.push(name)
                        })
                        return infoName
                    })(item.zhiboinfozh)
                    let state2 = ''
                    let state = (function (a) {
                        if (a === 1) {
                            state2 = (item.hasjijin / 1 + item.hasluxiang / 1) ? `<div class="info">${item.hasjijin / 1 ? '<em>集锦</em>' : ''}${item.hasluxiang / 1 ? '<em>录像</em>' : ''}</div>` : '已结束'
                            return 'end'
                        }
                        if (a === 0) {
                            state2 = `<div class="info"><em>直播中</em>${liveInfo.length ? `<br>${liveInfo[0]}` : ''}</div>`
                            return 'live'
                        }
                        if (liveInfo.length) {
                            state2 = `<div class="info">${liveInfo[0] ? liveInfo[0] : ''}${liveInfo[1] ? `<br>${liveInfo[1]}` : ''}</div>`
                            return 'unstart'
                        }
                        state2 = '<div class="info">敬请期待</div>'
                        return 'unstart noZhibo'
                    })(item.ismatched / 1)
                    let score = (function (a) {
                        if (a === -1) {
                            return `<div class="hscore">-</div>
                                    <div class="vscore">-</div>`
                        } else {
                            return `<div class="hscore">${item.home_score}</div>
                                    <div class="vscore">${item.visit_score}</div>`
                        }
                    })(item.ismatched / 1)
                    let html = `<div class="host"><img src="${item.home_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${item.home_team}</span></div>
                    <div class="visit"><img src="${item.visit_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${item.visit_team}</span></div>`

                    str += `<li class="${state}" data-team="${type}">
                                <a href="${item.liveurl}"  >
                                    <div class="tt">
                                        ${item.starttime.split(' ')[0].replace('2018-','')}
                                        <br> ${item.starttime.split(' ')[1]}
                                    </div>
                                    <div class="team">
                                        ${html}
                                    </div>
                                    <div class="score">
                                        ${score}
                                    </div>
                                    <div class="state">
                                        ${state2}
                                    </div>
                                </a>
                            </li>`
                }
                groupPhaseMatchs.html(str)
            },
            shootOut: function (type, self) {
                let arr = self.shootOutData
                let str = ''
                let shootUl = shootOutB.find('ul')
                arr.sort((a, b) => {
                    return new Date(a.starttime) - new Date(b.starttime)
                })

                for (let item of arr) {
                    let liveInfo = (function (arr) {
                        let infoName = []
                        arr.forEach(function (item) {
                            let name = item.title.split('(')[0]
                            if (infoName.indexOf(name) < 0) infoName.push(name)
                        })
                        return infoName
                    })(item.zhiboinfozh)
                    let lineStr = (function (title) {
                        if (title.indexOf('1/8') > -1 && str.indexOf('1/8') == -1) {
                            return '<li class="line" data-match="1/8">1/8决赛</li>'
                        } else if (title.indexOf('1/4') > -1 && str.indexOf('1/4') == -1) {
                            return '<li class="line" data-match="1/4">1/4决赛</li>'
                        } else if (title.indexOf('季军') > -1 && str.indexOf('季军') == -1) {
                            return '<li class="line" data-match="季军">世界杯季军争夺战</li>'
                        } else if (title.indexOf('半决赛') > -1 && str.indexOf('半决赛') == -1) {
                            return '<li class="line" data-match="半决赛">世界杯半决赛</li>'
                        } else if (title.indexOf('世界杯决赛') > -1 && str.indexOf('世界杯决赛') == -1) {
                            return '<li class="line" data-match="世界杯决赛">世界杯决赛</li>'
                        }
                        return ''
                    })(item.title02)
                    let state2 = ''
                    let state = (function (a) {
                        if (a === 1) {
                            state2 = (item.hasjijin / 1 + item.hasluxiang / 1) ? `<div class="info">${item.hasjijin / 1 ? '<em>集锦</em>' : ''}${item.hasluxiang / 1 ? '<em>录像</em>' : ''}</div>` : '已结束'
                            return 'end'
                        }
                        if (a === 0) {
                            state2 = `<div class="info"><em>直播中</em>${liveInfo.length ? `<br>${liveInfo[0]}` : ''}</div>`
                            return 'live'
                        }
                        if (liveInfo.length) {
                            state2 = `<div class="info">${liveInfo[0] ? liveInfo[0] : ''}${liveInfo[1] ? `<br>${liveInfo[1]}` : ''}</div>`
                            return 'unstart'
                        }
                        state2 = '<div class="info">敬请期待</div>'
                        return 'unstart noZhibo'
                    })(item.ismatched / 1)
                    let score = (function (a) {
                        if (a === -1) {
                            return `<div class="hscore">-</div>
                                    <div class="vscore">-</div>`
                        } else {
                            return `<div class="hscore">${item.home_score}</div>
                                    <div class="vscore">${item.visit_score}</div>`
                        }
                    })(item.ismatched / 1)
                    let html = `<div class="host"><img src="${item.home_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${item.home_team}</span></div>
                    <div class="visit"><img src="${item.visit_logoname || config.DIRS.BUILD_FILE.images['logo_default']}" alt=""><span>${item.visit_team}</span></div>`
                    str += lineStr + `<li class="${state}" data-team="${type}">
                                <a href="${item.liveurl}"  >
                                    <div class="tt">
                                        ${item.starttime.split(' ')[0].replace('2018-','')}
                                        <br> ${item.starttime.split(' ')[1]}
                                    </div>
                                    <div class="team">
                                        ${html}
                                    </div>
                                    <div class="score">
                                        ${score}
                                    </div>
                                    <div class="state">
                                        ${state2}
                                    </div>
                                </a>
                            </li>`
                }
                shootUl.html(str)
            },
            news: function (res, resBox, flage) {
                res.data.forEach(function (a) {
                    let html = ''
                    if (a.minimg > 2) {
                        html = `<li class="clearfix">
                            <a href="${a.url}?qid=${qid}&amp;ishot=0&amp;recommendtype=-1&amp;idx=13&amp;pgnum=1&amp;from=tuijian&amp;dataType=tuijian&amp;typeName=推荐" suffix="tuijian">
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
                            <a href="${a.url}?qid=${qid}&amp;ishot=0&amp;recommendtype=-1&amp;idx=12&amp;pgnum=1&amp;from=tuijian&amp;dataType=tuijian&amp;typeName=推荐" suffix="tuijian">
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
            data: function (res, resBox) {
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
            }
        },
        //图片预加载和下拉加载新闻
        onScrollLoadNews: function () {
            let scope = this
            let clientHeight = $(window).height()
            //回到顶部 返回首页
            $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?qid=${qid}"></a></div> </div>`)
            let $goTop = $('#goTop')
            $goTop.on('click', function () {
                $('body,html').scrollTop(0)
            })

            // 滚动出现返回顶部
            news.on('scroll', function () {
                //出现返回顶部按钮
                if (($(this).scrollTop()) / 100 > 0.9) {
                    $goTop.show()
                } else {
                    $goTop.hide()
                }
            })
        }
    }
    let en = new Detail()
    en.init()
})
