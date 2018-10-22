import 'public/sass/newindex.scss'
import 'pages/theme/worldcup/style.scss'
import 'public/logic/log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import 'public/libs/lib.prototype'
import _util_ from 'public/libs/libs.util'
import JS_APP from 'public/libs/JC.JS_APP'
import _AD_ from 'public/libs/ad.channel'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.2' //首页版本号
    console.log(version)
    // let {WORLDCUPINDEX,HOST,GroupStage} = config.API_URL
    let {
        HOST,
        WORLDCUPINDEX,
        GroupStage
    } = config.API_URL
    // let HOST = 'http://117.50.1.220/dfsports_h5/'
    let {
        DOMAIN
    } = config
    let _domain_ = DOMAIN
    let matchFlag = true //下拉加载开关
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    // DOM
    let $body = $('body')
    let secNewsList = $('.sec-news-list ul')
    let allFootballRank = $('.all-football-rank')
    let $scrollLoad = $('.loading-tips2')
    let news = $('#news')
    let newsTop = $('#newsTop')
    let $pullDownLoadTips = $('.pull-down-load-tips')
    let apiPosition = `//position.dftoutiao.com/position/get`
    //let wsCache = new WebStorageCache()
    $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?qid=${_qid_}"></a></div> </div>`)

    let position = _util_.CookieUtil.get('position')
    let loginAd = _util_.CookieUtil.get('loginAd')
    let cityArr = ['上海', '江苏']
    //8点到12点部分渠道屏蔽强弹该广告
    if (_util_.isDateBetween('2018/07/03 08:00', '2018/07/03 12:00') || _util_.isDateBetween('2018/07/04 08:00', '2018/07/04 12:00') || _util_.isDateBetween('2018/07/05 08:00', '2018/07/05 12:00') || _util_.isDateBetween('2018/07/06 08:00', '2018/07/06 12:00') || _util_.isDateBetween('2018/07/07 00:00', '2018/07/08 23:59') || _util_.isDateBetween('2018/07/09 08:00', '2018/07/09 12:00') || _util_.isDateBetween('2018/07/10 08:00', '2018/07/10 12:00') || _util_.isDateBetween('2018/07/11 08:00', '2018/07/11 12:00') || _util_.isDateBetween('2018/07/12 08:00', '2018/07/12 12:00') || _util_.isDateBetween('2018/07/13 08:00', '2018/07/13 12:00') || _util_.isDateBetween('2018/07/14 00:00', '2018/07/15 23:59') || _util_.isDateBetween('2018/07/16 08:00', '2018/07/16 12:00') || _util_.isDateBetween('2018/07/17 08:00', '2018/07/17 12:00') || _util_.isDateBetween('2018/07/18 08:00', '2018/07/18 12:00') || _util_.isDateBetween('2018/07/19 08:00', '2018/07/19 12:00') || _util_.isDateBetween('2018/07/20 08:00', '2018/07/20 12:00')) {} else {
        if (position) {
            loadHc(position)
        } else {
            _util_.makeJsonpcallback(apiPosition, {}).done(function(result) {
                _util_.CookieUtil.set('position', result.position.provname, 8)
                loadHc(result.position.provname)
            })
        }
    }
    function loadHc(cityname) {
        let isCity = cityArr.indexOf(cityname)
        if (_AD_['loginOpenAd'][_qid_] && isCity === -1 && loginAd / 1 !== 1) {
            var id = _AD_['loginOpenAd'][_qid_][0]
            $('#wrapper').append('<section class="loginAd"><div><span class="loginAdClose"></span><div id="' + id + '"></div><!--<span  class="adTxt">广告</span>--></div></section>')
            _util_.getScript('//df888.eastday.com/' + id + '.js', function() {}, $('#' + id)[0]) //baidu
            $('.loginAd .loginAdClose').on('click', () => {
                $('.loginAd').hide()
            })
            _util_.CookieUtil.set('loginAd', 1, 1)
        }
    }
    class EastSport {
        constructor() {
            // 广告
            this._detailsGg_ = _AD_['worldcupNewAd'][_qid_] ? _AD_['worldcupNewAd'][_qid_] : []
            this._newsGg_ = this.renderAd()
            this._TopGg_ = _AD_['worldcupTopAd'][_qid_] ? _AD_['worldcupTopAd'][_qid_] : _AD_['worldcupTopAd']['null']
            console.log(this._TopGg_)
            this._detailsGg_.splice(-3, 3)
            this.common()
            this.topData = ''
            this.nameType = 'yayunhui'
            this.saishiid = '9223753'
            this.readhistory = _util_.CookieUtil.get(`historyUrlArr${this.nameType}`) || 'null'
            this.newsInit = false // 新闻相关
            this.matchLoad = false //当前加载状态
            this.startkeynext = ''
            this.startkeylast = ''
            this.startkey = ''
            this.pgnum = 0
            this.pgnext = 0
            this.pglast = 0
            this.newsnum = 0
            this.shijiebeiData = '' // 世界杯数组all
            this.addNews = 0
            // 下拉数据
            this.isTouchBottom = false //判断是否拉到最底端
            this.pullDownFinished = true //只有接口调用完成后才能下一次调用
            this.isSlideMove = false
            this.touchDistance = 0 // 滑动距离
            this.startPos = 0 // 滑动开始位置
            this.isTop = false // 顶部判断标志
            this.TOUCH_DISTANCE = 100 // 规定滑动加载距离
            this.direction = '' //规定手指滑动的方向slideDown向下
            this.clientWidth = $(window).width()

            this.curPos = 0
            this.ggIndexArr = this.createArr(0)
            this.adIsCheats = (_qid_ === 'tiyutt' || _qid_ === 'tiyumshd' || _qid_ === 'tiyuxqqkj' || _qid_ === '_qid_02463' || _qid_ === 'tiyudh' || _qid_ === 'tiyutytt' || _qid_ === 'qid02625' || false) //作弊广告渠道
            // this.topMatch()
            this.worldcupNewAdIndex = 0
            this.worldcupTopAdIndex = 0
            this.pullDownLoadNews()
        }

        createArr(value) {
            let arr = []
            for (let i = 0; i < 1; i++) {
                arr.push(value)
            }
            return arr
        }

        renderAd() {
            if (this.adIsCheats || window.JSToNative) return ''
            let qid = _AD_['indexGg'][_qid_] ? _qid_ : 'null'
            let _newsGg_ = _AD_['indexGg'][qid].concat(_AD_.indexNoChannel)
            return _newsGg_
        }

        common() {
            let $goTop = $('#goTop')
            let self = this
            _util_.makeJsonpCallbackOther(WORLDCUPINDEX).done((res) => {
                //debugger
                //if (!res) return
                this.topData = res
                // this.nameType =  res.tags.name // 赛事名字
                //this.saishiid = res.tags.id || '901276' // 赛事id
                self.newsReader(2) //执行对应的滚动加载
                this.renderHtml(res)
            })

            setTimeout(() => {
                $('.sec-match ul').css({
                    'position': 'static',
                    'background': 'none'
                })
            }, 1500)
            let $wrapper = $('#wrapper')
            $wrapper.on('scroll', () => {
                if (($(this).scrollTop()) / 100 > 0.9) {
                    $goTop.show()
                } else {
                    $goTop.hide()
                }
                let lastLi = ''
                if (news.html() === '') {
                    lastLi = allFootballRank
                } else {
                    lastLi = news.children('li:last-child')
                }
                let scrollTop = $(window).scrollTop()
                // alert(lastLi.offset().top)
                if (lastLi.offset().top - $(window).height() < scrollTop && matchFlag) {
                    matchFlag = false
                    $scrollLoad.show()
                    let objTime = setInterval(function() {
                        if (self.saishiid) {
                            clearInterval(objTime)
                            self.newsReader(2) //执行对应的滚动加载
                        }
                    }, 200)
                }
            })
            //app内协议交互 并且app里加竞猜
            if (_qid_ === 'qid10601') {
                $wrapper.on('click', 'a', function() {
                    let url = $(this).attr('href')
                    //新闻页面逻辑
                    if (url.indexOf('/a/') > -1 || url.indexOf('/html/') > -1 || url.indexOf('/video/') > -1) {
                        url = `${url}&listpg=1&fr=worldcup`
                        JS_APP.ToNewWebPage({
                            'type': '4',
                            'url': url
                        })
                    } else if (url.indexOf('msports.eastday.com') === -1) {
                        url = `https://msports.eastday.com/${url}&qid=qid10601&fr=worldcup`
                        JS_APP.ToNewWebPage({
                            'type': '0',
                            'url': url
                        })
                    } else {
                        url = `${url}`
                        JS_APP.ToNewWebPage({
                            'type': '0',
                            'url': url
                        })
                    }
                    return false
                })
            } else {
            }
            $('.navs').remove()
            $('.separate-line').remove()
        }

        topMatch() {
            _util_.makeJsonpAjax(GroupStage).done((res) => {
                if (!res) return
                this.shijiebeiData = res.data
                let json = res.data
                let arr = []
                for (let obj in json) {
                    arr = arr.concat(json[obj])
                }
                arr.sort((a, b) => {
                    return new Date(a.starttime.replace(/-/g, '/')) - new Date(b.starttime.replace(/-/g, '/'))
                })
                this.allTeamData = arr
                // 生产小组赛数据
                this.matchRender(arr)
            })
        }

        // 赛程
        matchRender(arr) {
            if (!arr.length) return
            let html = ''
            //let currentServerTime = new Date().getTime()
            arr = processData(arr)
            $.each(arr, (i, item) => {
                let title = item.title02
                let home_team = item.home_team
                let visit_team = item.visit_team
                let score = item.home_score + '-' + item.visit_score
                let orderStr = '' //判断预约的功能
                let className
                if (item.ismatched === '-1') {
                    orderStr = '<span class="empty">未开赛</span>'
                    className = 'no-start'
                } else if (item.ismatched === '0') {
                    orderStr = '<span class="living">LIVE</span>'
                    className = 'living'
                } else {
                    orderStr = '<span>集锦</span>'
                    className = 'end'
                }
                item.home_logoname = item.home_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`
                item.visit_logoname = item.visit_logoname || `${config.DIRS.BUILD_FILE.images['logo_default']}`

                html += `<li class="clearfix ${className}">
                        <a href="${`${item.liveurl}?${`qid=${_qid_}&idx=${i + 1}&from=match${i}&pgtype=yayunhui`}`}" suffix="match${i}" target="_parent">
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
            })
            html += `<li class="clearfix all">
                        <a href="/data_world_up_duel.html?name=world_cup" suffix="yayunhui" target="_parent">
                            点击查看
                            <br> 全部赛程
                        </a>
                    </li>`
            $('.sec-match ul').html(html)
            let livingLen = $('.sec-match ul .living').length
            if (livingLen) {
                let firstLiving = $('.sec-match ul .living').eq(0)
                let liW = firstLiving.width()
                let left = firstLiving.position().left - (window.screen.width - liW - 7.5) / 2
                $('.sec-match ul').scrollLeft(left)
            } else {
                let firstLiving = $('.sec-match ul .no-start').eq(0)
                let liW = firstLiving.width()
                let left = firstLiving.position().left - (window.screen.width - liW - 7.5) / 2
                $('.sec-match ul').scrollLeft(left)
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
                    if (i + 2 >= index && i - 2 <= index) {
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
        }

        // 查看更多信息加载
        renderHtml(data) {
            let that = this
            let str = ''
            if(!data.small) return
            let topLength = data.small.length
            if (data.show_big / 1 == 1) {
                let url = data.big.url.replace('http://sports.eastday.com', 'https://msports.eastday.com')
                url = url.replace('https://sports.eastday.com', 'https://msports.eastday.com')
                secNewsList.append(`<li class="clearfix big-img" style="${data.head.title ? `` : 'margin-top:5px;'}">
                            <a href="${url}?qid=${_qid_}&idx=0&pgnum=1&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                ${data.head.title ? `<h3>${data.head.title}</h3>` : ''}
                                <div class="img">
                                    <img src="${data.big.img}"
                                        class="lazy" >
                                    <div class="title">${data.big.title}</div>
                                    <div class="btn-play ${data.big.url.indexOf('video') > -1 ? '' : 'no'}"></div>
                                </div>
                                ${data.head.tag ? `<div class="tag-r">${data.head.tag}</div>` : ''}
                            </a>
                        </li>`)
            }
            data.small.forEach((item, i) => {
                //安卓手机头条app里和作弊渠道不加载广告
                if (this.adIsCheats || window.JSToNative) {} else {
                    if (data.show_big / 1 === 1 && i === 0 && this._TopGg_[0] !== undefined) {
                        secNewsList.append(`<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap" data-ggid="${this._TopGg_[0]}">
                        <div id="${this._TopGg_[0]}"></div>
                       </li>`)
                        if (_qid_ === 'qid10602') {
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._TopGg_[0])[0])
                        } else {
                            _util_.getScript('//df888.eastday.com/' + this._TopGg_[0] + '.js', function() {}, $('#' + this._TopGg_[0])[0]) //baidu
                        }
                        if (_qid_ === 'null') {
                            this.ggIndexArr[this.curPos]++
                        }
                    } else if (data.show_big / 1 !== 1 && i === 1 && this._TopGg_[0] !== undefined) {
                        secNewsList.append(`<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap" data-ggid="${this._TopGg_[0]}">
                        <div id="${this._TopGg_[0]}"></div>
                       </li>`)
                        if (_qid_ === 'qid10602') {
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._TopGg_[0])[0])
                        } else {
                            _util_.getScript('//df888.eastday.com/' + this._TopGg_[0] + '.js', function () {}, $('#' + this._TopGg_[0])[0]) //baidu
                        }
                        if (_qid_ === 'null') {
                            this.ggIndexArr[this.curPos]++
                        }
                    }
                    if (i == topLength - 1 && this._TopGg_[1] !== undefined) {
                        secNewsList.append(`<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap" data-ggid="${this._TopGg_[1]}">
                        <div id="${this._TopGg_[1]}"></div>
                       </li>`)
                        if (_qid_ === 'qid10602') {
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._TopGg_[1])[0])
                        } else {
                            _util_.getScript('//df888.eastday.com/' + this._TopGg_[1] + '.js', function () {}, $('#' + this._TopGg_[1])[0]) //baidu
                        }
                        if (_qid_ === 'null') {
                            this.ggIndexArr[this.curPos]++
                        }
                    }
                }
                let url = item.url.replace('http://sports.eastday.com', 'https://msports.eastday.com')
                url = url.replace('https://sports.eastday.com', 'https://msports.eastday.com')
                secNewsList.append(`<li class="clearfix">
                            <a href="${url}?qid=${_qid_}&idx=0&pgnum=1&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                <div class="img">
                                    <img src="${item.img}" class="lazy" >
                                    <span class="play-btn ${data.big.url.indexOf('video') > 1 ? '' : 'no'}"></span>
                                </div>
                                <div class="info">
                                    <div class="title">${item.title}</div>
                                    <div class="source">
                                        <div class="tag-qt ${data.big.url.indexOf('video') > 1 ? '' : 'no'}">视频</div>
                                        <div class="l">${item.source}</div>
                                    </div>
                                </div>
                            </a>
                        </li>`)
            })
            /*if (data.bottom.url) {
                secNewsList.append(`<a href="${data.bottom.url.replace('http://sports.eastday.com', '//msports.eastday.com')}" class="look-more-news" target="_parent" suffix="yayunhui">
                        点击查看更多亚运会消息  >>
                    </a>`)
            }*/
            // secNewsList.html(str)
        }

        // 新闻
        newsReader(flage, isDown) {
            let self = this
            if (self.newsInit) {
                if (flage === true) { //下拉加载
                    self.pglast--
                    self.pgnum = self.pglast
                    self.startkey = self.startkeylast || self.startkey
                } else if (flage === 2) { //滚动加载
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
            self.requestnews(self.startkey, self.pgnum).done((res) => {
                $scrollLoad.hide()
                setTimeout(() => {
                    // $insideNav.find('.down_load').removeClass('show')
                    self.newsLoad = false
                }, 500)
                self.startkey = res.endkey
                if (!res.data.length) {
                    news.append('<li class="noData">暂无数据 ^ . ^</li>')
                }
                if (flage === true) {
                    self.startkeylast = res.endkey
                } else {
                    self.startkeynext = res.endkey
                }
                if (isDown) {
                    self.news(res, newsTop, flage, self.newsInit)
                    self.pullDownFinished = true
                    self.setPullDownLoadTips('为您更新15条内容')
                    self.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                } else {
                    self.news(res, news, flage, self.newsInit)
                }
                self.newsInit = true
                this.loadLazyImg()
            }).done(() => {
                if (this.addNews !== 1) {
                    for (let i = 0; i < 3; i++) {
                        if (this.ggIndexArr[this.curPos] - 3 + i !== 0) {
                            let value = $(`#module${this.curPos + '_' + (this.ggIndexArr[this.curPos] - 3 + i)}`).children().attr('id')
                            if (_qid_ === 'qid10602') {
                                _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + value)[0])
                            } else {
                                _util_.getScript(`//df888.eastday.com/${value}.js`, function () {}, $('#' + value)[0])
                            }
                        }
                    }
                }
            })
        }

        requestnews(startkey, pgnum) {
            let data = {
                type: this.nameType,
                typecode: this.saishiid,
                startkey: startkey,
                newkey: '',
                pgnum: pgnum,
                os: _os_,
                uid: _recgid_,
                qid: _qid_,
                domain: _domain_,
                readhistory: this.readhistory
            }
            return _util_.makeJsonp(HOST + 'newspoolv2', data).always(function() {})
        }

        news(res, resBox, flage, newsInit) {
            let html = ''
            if (!newsInit) { // 第一屏
                res.data.forEach((a, b) => {
                    if (a.minimg > 2 && a.newstype === 'news') {
                        resBox.append(`<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                <div class="title">${a.topic}</div>
                                <div class="imgs">
                                    <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${a.miniimg[0].src}">
                                    <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${a.miniimg[1].src}">
                                    <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${a.miniimg[2].src}">
                                </div>
                                <div class="source clearfix">
    
                                    <div class="l">${a.source}</div>
                                </div>
                            </a>
                        </li>`)
                    } else if (a.newstype === 'news') {
                        resBox.append(`<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                <div class="img">
                                    <img class="lazy" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" data-echo="${a.miniimg[0].src}">
                                </div>
                                <div class="info">
                                    <div class="title">${a.topic}</div>
                                    <div class="source clearfix">
                                        <div class="l">${a.source}</div>
                                    </div>
                                </div>
                            </a>
                        </li>`)
                    }
                    if (a.newstype === 'video') {
                        resBox.append(`<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                <div class="img">
                                    <img class="lazy" src="${a.miniimg[0].src}">
                                    <span class="play-btn"></span>
                                </div>
                                <div class="info">
                                    <div class="title">${a.topic}</div>
                                    <div class="source clearfix">
                                        <div class="l">${a.source}</div>
                                    </div>
                                </div>
                            </a>
                        </li>`)
                    }
                    if (b % 5 === 4 || b === 1) {
                        resBox.append(`<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap"  data-ggid="${this._newsGg_[this.ggIndexArr[this.curPos]]}">
                            <div id="${this._newsGg_[this.ggIndexArr[this.curPos]]}"></div>
                           </li><li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap"  data-ggid="${this._detailsGg_[this.worldcupNewAdIndex]}">
                           <div id="${this._detailsGg_[this.worldcupNewAdIndex]}"></div>
                          </li>`)
                        if (_qid_ === 'qid10602') {
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._detailsGg_[this.worldcupNewAdIndex])[0])
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._newsGg_[this.ggIndexArr[this.curPos]])[0])
                        } else {
                            _util_.getScript('//df888.eastday.com/' + this._detailsGg_[this.worldcupNewAdIndex] + '.js', function() {}, $('#' + this._detailsGg_[this.worldcupNewAdIndex])[0])
                            _util_.getScript('//df888.eastday.com/' + this._newsGg_[this.ggIndexArr[this.curPos]] + '.js', function() {}, $('#' + this._newsGg_[this.ggIndexArr[this.curPos]])[0])
                        }
                        this.ggIndexArr[this.curPos]++
                        this.worldcupNewAdIndex++
                    }
                    if (b === 6 || b === 11) {
                        resBox.append(`<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap"  data-ggid="${this._detailsGg_[this.worldcupNewAdIndex]}">
                            <div id="${this._detailsGg_[this.worldcupNewAdIndex]}"></div>
                           </li><li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap"  data-ggid="${this._detailsGg_[this.worldcupNewAdIndex + 1]}">
                           <div id="${this._detailsGg_[this.worldcupNewAdIndex + 1]}"></div>
                          </li>`)
                        if (_qid_ === 'qid10602') {
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._detailsGg_[this.worldcupNewAdIndex])[0])
                            _util_.dynamicScript(`//www.smucdn.com/smu0/o.js`, `d=m&s=b&u=u3460606&h=135`, $('#' + this._detailsGg_[this.worldcupNewAdIndex + 1])[0])
                        } else {
                            _util_.getScript('//df888.eastday.com/' + this._detailsGg_[this.worldcupNewAdIndex] + '.js', function() {}, $('#' + this._detailsGg_[this.worldcupNewAdIndex])[0])
                            _util_.getScript('//df888.eastday.com/' + this._detailsGg_[this.worldcupNewAdIndex + 1] + '.js', function() {}, $('#' + this._detailsGg_[this.worldcupNewAdIndex + 1])[0])
                        }
                        this.worldcupNewAdIndex += 2
                    }
                    this.newsnum++
                    matchFlag = true
                })
            } else {
                res.data.forEach((a, b) => {
                    if (a.minimg > 2 && a.newstype === 'news') {
                        html += `<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
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
                    } else if (a.newstype === 'news') {
                        html += `<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
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
                    if (a.newstype === 'video') {
                        html += `<li class="clearfix">
                            <a href="${a.url}?qid=${_qid_}&ishot=${a.ishot}&recommendtype=${a.recommendtype}&idx=${this.newsnum}&pgnum=${this.pgnum}&from=yayunhui&dataType=yayunhui&typeName=${encodeURI('亚运会')}" target="blank" suffix="yayunhui">
                                <div class="img">
                                    <img class="lazy" src="${a.miniimg[0].src}">
                                    <span class="play-btn"></span>
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
                    if (b % 5 == 4) {
                        html += this.loadgg()
                    }
                    this.newsnum++
                    matchFlag = true
                })
                if (flage === 2) {
                    resBox.append(html)
                } else if (flage) {
                    resBox.prepend(html)
                    this.pullDownFinished = true
                }
            }
            this.addNews++
        }

        // 下拉加载新闻
        pullDownLoadNews() {
            let that = this
            let $swiperSlides = $('#wrapper')
            let $navs = $('.navs')
            $swiperSlides.on('touchstart', function (e) {
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

            $swiperSlides.on('touchend', function (e) {
                // 达到下拉阈值 启动数据加载
                if (that.direction === 'slideDown' && that.isSlideMove === false) {
                    /*$header.show()
                    $swiperSlides.each(function() {
                        $(this).css({
                            'height': that.slideHeight + 'px'
                        })
                    })*/
                    that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
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
                    // that.loadNewsListForPullDown() // 下拉加载数据
                    that.newsReader(true, true) //执行对应的滚动加载
                } else { //松开返回顶部
                    if (that.pullDownFinished === true && that.isSlideMove === false) {
                        if ($pullDownLoadTips.attr('style').indexOf('slideDown') >= 0) {
                            that.setPullDownLoadTipsAnimation('slideUp 1s ease forwards')
                        }
                    }
                }
            })
            $swiperSlides.on('touchmove', function (e) {
                let _touch = e.touches[0]
                let py = _touch.pageY
                $navs.css('z-index', 0)
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
                    //that.touchDistance = that.touchDistance * (750 / that.clientWidth) / 100
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

        loadgg() {
            let html = ''
            html += `<li style="padding:0;width:7.5rem;margin-left:-0.24rem" class="gg clearfix bdgg-wrap" data-ggid="${this._newsGg_[this.ggIndexArr[this.curPos]]}" id="module${this.curPos + '_' + this.ggIndexArr[this.curPos]}">
                     <div id="${this._newsGg_[this.ggIndexArr[this.curPos]]}"></div>
                    </li>`
            this.ggIndexArr[this.curPos]++
            //wsCache.set('ggIndexArr', this.ggIndexArr, {exp: 10 * 60})//保存广告的位置
            return html
        }
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

            var _inView = function(el) {
                var coords = el.getBoundingClientRect()
                return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))
            }

            var _pollImages = function() {
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

            var _throttle = function() {
                console.log(2)
                clearTimeout(poll)
                poll = setTimeout(_pollImages, throttle)
            }

            var init = function(obj) {
                var nodes = document.querySelectorAll('[data-echo]')
                var opts = obj || {}
                offset = opts.offset || 0
                throttle = opts.throttle || 250
                for (var i = 0; i < nodes.length; i++) {
                    store.push(nodes[i])
                }

                _throttle()
                let $wrapper = $('#wrapper')
                if (document.addEventListener) {
                    $wrapper[0].addEventListener('scroll', _throttle, false)
                } else {
                    $wrapper[0].attachEvent('onscroll', _throttle)
                }
            }
            init({
                offset: 0, //离可视区域多少像素的图片可以被加载
                throttle: 0 //图片延时多少毫秒加载
            })
        }
    }
    window.worldCupIndex = new EastSport()
    $('.Android_Slider_Fix').scroll(function () {
        if ($(this).scrollLeft() <= 0) {
            try {
                window.JSToNative.postMessage(JSON.stringify({
                    method: 'requestEvent',
                    request: false
                }))
                //android.slideIdle()
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                window.JSToNative.postMessage(JSON.stringify({
                    method: 'requestEvent',
                    request: true
                }))
                //android.slideStart()
            } catch (e) {
                console.log(e)
            }
        }
    })
    window.woldCupRefesh = function () {
        window.location.reload()
    }
    //app端的滑动值
    var touchSlop = 0
    //初次按下时的x, y轴值
    var mLastClientX,
        mLastClientY
    //是否处于滑动中
    var isBeingDrag = false

    //js附值,在web加载完成时将android的滑动单位值传给js
    /*function initTouchSlop(appTouchSlop) {
        touchSlop = appTouchSlop
    }*/

    $('.Android_Slider_Fix').on('touchstart touchmove touchend touchcancel', function(event) {
        var touch = event.targetTouches[0]
        switch (event.type) {
            case 'touchstart':
                mLastClientX = touch.clientX
                mLastClientY = touch.clientY
                isBeingDrag = false
                try {
                    window.Android.requestEvent(true)
                } catch (e) {
                    console.log(e)
                }
                break
            case 'touchmove':
                if (!isBeingDrag) {
                    var xDiff = Math.abs(touch.clientX - mLastClientX)
                    var yDiff = Math.abs(touch.clientY - mLastClientY)
                    if (xDiff >= touchSlop) {
                        isBeingDrag = true
                    } else if (yDiff > touchSlop) {
                        //产生app纵向滑动,父控件不强制请求放行事件,这段逻辑主要是不影响外层垂直滑动控件的滑动
                        //js端控制滑动与app端的标准不一样,所以结合上面的onSliderMove:function方法来判断
                        //如果H5端控件已经产生滑动时则必须请求父控件放行事件
                        //如果有些开源控件没有类似onSliderMove方法时,只需提供控件是否产生滑动就行,原理都是一样
                        isBeingDrag = true
                        window.Android.requestEvent(false)
                    }
                }
                break
            case 'touchend':
                window.Android.requestEvent(false)
                break
        }
    })
    if (_qid_ === 'dfspiosnull' || _qid_ === 'dfspadnull') {
        document.title = '决战亚运会'
    }
    //翱翔app
    if (_qid_ === 'qid10459') {
        window.web_idleaf = 999167
        window.is_pinglun = '1'
        window.pl_yrl_onclick = 'window.location=\'action://link_comment?titleurl=\'+encodeURIComponent(\'?zhuid=999167&page=1&type=1&yuantie=http://listen.021east.com/2018fwc/entry.html\')+\'&iscomment=\'+encodeURIComponent(\'1\')+\'&isshare=\'+encodeURIComponent(\'1\')+\'&enabled=\'+encodeURIComponent(\'1\')+\'\';'
        window.share = function () {
            window.location = 'action://share?newsurl=' + encodeURIComponent('http://listen.021east.com/2018fwc/entry.html') + '&newsid=' + encodeURIComponent('999167') + '&newstitle=' + encodeURIComponent('东方体育带你激情亚运会') + '&imgurl1=' + encodeURIComponent('http://listen.021east.com/2018fwc/640_1136-2.png') + '&newsdescription=' + encodeURIComponent('东方体育带你激情亚运会') + ''
        }
    }
})

