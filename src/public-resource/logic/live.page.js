import 'pages/liveing/style.scss'
import FastClick from 'fastclick'
import config from 'configDir/common.config'
import wx from 'weixin-js-sdk'
import '../libs/lib.prototype'
import './log.js'
import _util_ from '../libs/libs.util'
//import '../../../vendor/socket.io'
//import pomelo from 'pomelo'

$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, CHAT, HOST_LIVE} = config.API_URL
    let {dfsportswap_lottery} = config.API_URL.HCAPI
    let version = '1.0.7' //内页版本号  加视频直播弹出app下载
    console.log(version)
    let $loading = $('<div id="$loading" class="loading">' + '<div class="spinner">' + '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>' + '</div>' + '<p class="txt">数据加载中</p>' + '</div>')
    let qid = _util_.getPageQid()
    // 定义需要传入接口的值
    const os = _util_.getOsType()
    const recgid = _util_.getUid()
    let {DOMAIN} = config
    let $body = $('body')
    let $zhibo_body = $body.find('.zhibo_body')
    let $playerSta = $('#playerSta')
    let $teamStats = $('#teamStats')
    let $headScore = $('#headScore')
    let $matchNews = $('#matchNews')
    let $livebox = $('#livebox')
    let $zhiboHead = $('.zhibo_head')
    let $zhiboMenu = $('#zhiboMenu')
    let $homeLeft = $headScore.prev()
    let $homeRight = $headScore.next()
    let $textState = $zhiboHead.find('.info .state')
    let $bigBox = $zhiboHead.find('.big-box')
    let $zhiboHeadTop = $zhiboHead.find('.top')
    let appId = 'wxty'
    let $chatRoomUl = $('#chatRoom').children('ul')
    $body.append($loading)

    function Loading(_match_id) {
        this.matchId = _match_id
        this.ismatched = ''//比赛状态
        this.pullWenziNum = 30 // 一次加载20条文字数据,可定义
        this.wenziMaxNum = 0 // 保存当前文字条数的最大记录,并与新请求的数字对比
        this.wenziLastNum = 0 // 文字下拉加载当前定位的文字id
        this.flag = true // 用来防止文字下拉加载重复
        this.isZhiboTab = true
        this.isFanganTab = false
        this.startoffset = 0 //聊天室
        this.diffoffset = 0 //聊天室
        this.type = '' //NBA CBA
        this.hcmatchid = '' //红彩matchid
        this.startkey = '' //红彩分页
        this.pgNum = 1 //红彩分页
        this.pageSize = 10 //红彩分页
        this.init()
    }

    Loading.prototype = {
        // 微信分享配置:
        sharePage: function(imgSrc, title, desc) {
            if (desc.length >= 60) {
                desc = desc.slice(0, 60)
                desc += '...'
            }
            title += '_东方体育'
            $.ajax({
                type: 'get',
                url: '//xwzc.eastday.com/wx_share/share_check.php',
                data: {
                    url: window.location.href
                },
                dataType: 'jsonp',
                jsonp: 'wxkeycallback', // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: 'wxkeycallback',
                success: function(result) {
                    wx.config({
                        debug: false, // 这里是开启测试，如果设置为true，则打开每个步骤，都会有提示，是否成功或者失败
                        appId: result.appId,
                        timestamp: result.timestamp, // 这个一定要与上面的php代码里的一样。
                        nonceStr: result.nonceStr, // 这个一定要与上面的php代码里的一样。
                        signature: result.signature, // 签名
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ]
                    })
                    wx.ready(function() {
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: window.location.href, // 分享链接
                            imgUrl: imgSrc, // 分享图标
                            success: function() {
                            },
                            cancel: function() {
                            }
                        })
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
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
        }, // 集锦录像
        makeAjaxJijin: function(_rowkey_) {
            return $.ajax({
                url: HOST + 'subject?topicid=' + _rowkey_,
                dataType: 'jsonp',
                success: function() {}
            })
        }, //根据比赛开始状态去判断执行
        queryMatchState: function() {
            let data = {
                matchid: this.matchId
            }
            let that = this
            _util_.makeJsonp(HOST + 'matchinfo', data).done(function(result) {
                result = result.data
                that.template.score(result, that)//填充头部数据
                that.ismatched = result.ismatched
                that.hcmatchid = result.hcmatchid
                if (qid === 'dfttapp') {} else {
                    that.loadHcList()
                }
                if (result.ismatched === '-1') { // 加载比赛前的
                    that.loadWenziNum() // 加载文字直播
                    that.loadDetailDate(result)
                } else if (result.ismatched === '0') { // 加载比赛中的
                    that.loadWenziNum() // 加载文字直播
                    setInterval(function() { // 5秒钟更新一次
                        that.loadWenziNum() // 加载文字直播
                    }, 3000)
                    that.loadDetailDate(result)// 加载统计数据
                    setInterval(function() {
                        that.loadDetailDate(result)
                    }, 60000)
                } else if (result.ismatched === '1') { // 加载比赛后的
                    that.loadWenziNum() // 加载文字直播
                    that.loadDetailDate(result)// 加载统计数据
                }
            })
        }, // 加载文字数量
        loadWenziNum: function() {
            let data = {
                matchid: this.matchId
            }
            let that = this
            _util_.makeJsonp(HOST_LIVE + 'matchwenzinum', data).done(function(result) {
                let data = result.data / 1 // 转化字符串为数字
                if (!data) {
                    // 显示暂无直播提示
                    $livebox.html(`<li>
                                        <div class="t">
                                            <div class="circle red"></div>
                                        </div>
                                        <div class="text-box">
                                            <p>暂无数据</p>
                                        </div>
                                    </li>`)
                    return
                } else {
                    if (!$livebox.parent().find('.show-score').length) {
                        $livebox.before(`<div class="show-score"></div>`)
                    }
                }
                if (!that.wenziMaxNum) {
                    that.wenziMaxNum = data
                    // 先加载固定20条
                    if (data % 2 !== 0) {
                        that.loadAssignWenzi(data + 1, data + 1)
                    } else {
                        that.loadAssignWenzi(data, data)
                    }
                }

                if (data > that.wenziMaxNum) { // 文字数字大于最大值就加入新值
                    that.loadWenzi(that.wenziMaxNum, data / 1, that.wenziMaxNum)
                }
            })
        }, // 一次加载20条文字直播
        loadAssignWenzi: function(start, old) {
            let data = {
                matchid: this.matchId,
                start: start
            }
            let that = this
            if (start <= (old - this.pullWenziNum) || start <= 0) {
                that.flag = true
                that.wenziLastNum = start
                $loading.hide()
                return
            }
            _util_.makeJsonp(HOST_LIVE + 'matchwenzi', data).done(function(result) {
                that.template.textMessage(result, 1) // 1代表插文字到下方,0代表上方
                that.loadAssignWenzi(start - 2, old)
            })
        }, // 加载文字直播 注:minOld拉取文字直播最小值 小于这个数字的不需要记载
        loadWenzi: function(min, max, minOld) {
            min = min / 1 // 字符串转数字
            if (min % 2 !== 0) {
                min++
            } else {
                min += 2
            }
            let data = {
                matchid: this.matchId,
                start: min
            }
            let that = this
            if (min - 2 >= max) {
                return
            }
            _util_.makeJsonp(HOST_LIVE + 'matchwenzi', data).done(function(result) {
                that.template.textMessage(result, 0, minOld)
                that.loadWenzi(min, max, minOld)
            })
        },
        onTextScroll: function() {
            let that = this
            //let $zhiboHeadH = $zhiboHead.height()
            //let width = $(window).width()
            $(window).scroll(function() {
                let $liveboxHeight = $('body').height()
                let $liveboxScrollTop = $(this).scrollTop()
                let clientHeight = $(this).height()
                //加载文字直播
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag && that.isZhiboTab) { // 距离底端80px是加载内容
                    that.flag = false
                    $loading.show()
                    that.loadAssignWenzi(that.wenziLastNum, that.wenziLastNum)
                }
                if ($liveboxScrollTop + clientHeight >= ($liveboxHeight - 50) && that.flag && that.isFanganTab) { // 距离底端80px是加载内容
                    that.flag = false
                    that.loadHcList(true)
                }
            })
        },
        loadDetailDate: function(data) { // 加载实时详细统计数据
            let that = this
            let type // 是篮球还是足球 其他
            type = data.tplv001
            updateStatistics(type)

            // 统计数据
            function updateStatistics(type) {
                let data = {
                    matchid: that.matchId
                }
                _util_.makeJsonp(HOST + 'matchdata', data).done(function(data) { // 填充一次数据
                    if (isEmptyObject(data.data)) {
                        return
                    }
                    if (type === '足球') {
                        // console.log(data);
                        that.template.football.paixu(data.data)
                        that.template.football.matchIng(data.data)
                    } else if (type === '篮球') {
                        that.template.nba.score_period(data.data, that)
                        that.template.nba.player(data.data, that)
                        // that.template.nba.score_rank(data.data); //各项最高 H5暂无
                        that.template.nba.stats_team(data.data, that)
                        // 篮球类型显示球员统计
                        $playerSta.show()
                    } else {}
                }).done(function(data) {
                    // 填充一次historyData recentRecord futureSchedule
                    that.template.loadOnceDate(data, that)
                    let imgSrc = $('.zhibo_head img').eq(0).attr('src')
                    let title = '正在直播:' + $('.zhibo_head .top .left .sub1').text() + ' VS ' + $('.zhibo_head .top .right .sub1').text() + ',点击观看'
                    let desc = '快来看我们分享给你的网站:' + title
                    that.sharePage(imgSrc, title, desc)
                })
            }

            function isEmptyObject(e) {
                let t
                for (t in e) return !1
                return !0
            }
        }, // 字符串模板
        template: {
            football: {
                paixu: function(self) {
                    let data = self.data_compare.data
                    if (!data) {
                        // 没有数据 隐藏球队统计
                        $teamStats.hide()
                        $teamStats.prev().hide()
                        return
                    } else {
                        $teamStats.show()
                        $teamStats.prev().show()
                    }
                    let home = self.host_team
                    let home_data
                    let visit_data
                    for (let k in data) {
                        if (data[k].team_name === home) {
                            home_data = data[k]
                        } else {
                            visit_data = data[k]
                        }
                    }
                    let typeName = {
                        '射门': 'total_scoring_att',
                        '射正': 'ontarget_scoring_att',
                        '射中门框': 'post_scoring_att',
                        '直塞': 'total_through_ball',
                        '犯规': 'fk_foul_lost',
                        '角球': 'won_corners',
                        '越位': 'total_offside',
                        '控球率': 'possession_percentage',
                        '传球': 'total_pass',
                        '抢断': 'total_tackle',
                        '任意球': 'fk_foul_won',
                        '传球成功率': 'pass_percentage',
                        '传中成功率': 'cross_percentage',
                        '抢断成功率': 'tackle_percentage',
                        '头球成功率': 'aerial_percentage'
                    }
                    let $teamStatsContentTeam = $teamStats.find('.content-team')
                    $teamStatsContentTeam.children().each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    for (let q in typeName) {
                        if (typeof home_data[typeName[q]] === 'undefined' || home_data[typeName[q]] == null) {
                            continue
                        }
                        let max = home_data[typeName[q]] / 1 + visit_data[typeName[q]] / 1
                        if (home_data[typeName[q]] === 0 && visit_data[typeName[q]] === 0) {
                            max = 1
                        }
                        if (('' + home_data[typeName[q]]).indexOf('%') >= 0) {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + (home_data[typeName[q]] ? home_data[typeName[q]] : '-') + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].replace('%', '') / 1 > visit_data[typeName[q]].replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]] + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].replace('%', '') / 1 > visit_data[typeName[q]].replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]] + '"></span></div>' + ' </div>' + '<div class="num">' + (visit_data[typeName[q]] ? visit_data[typeName[q]] : '-') + '</div></div>')
                        } else {
                            $teamStatsContentTeam.append('<div class="row"><div class="num">' + (home_data[typeName[q]] ? home_data[typeName[q]] : '-') + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]] / 1 > visit_data[typeName[q]] / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]] / max * 100 + '%' + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]] / 1 > visit_data[typeName[q]] / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]] / max * 100 + '%' + '"></span></div>' + ' </div>' + '<div class="num">' + (visit_data[typeName[q]] ? visit_data[typeName[q]] : '-') + '</div></div>')
                        }
                    }
                }, // 比赛过程 足球图谱 实时更新
                matchIng: function(self) {
                    let home = self.host_team // 主队
                    let visit = self.visit_team // 客队
                    let data = self.match_process.data
                    let $matchResult = $('#matchResult')
                    $matchResult.find('.foot-saikuang .head-team p').eq(0).text('(主) ' + home)
                    $matchResult.find('.foot-saikuang .head-team p').eq(1).text('(客) ' + visit)
                    if (!data) {
                        // 没有数据隐藏赛况
                        $matchResult.hide()
                        $matchResult.prev().hide()
                        return
                    } else {
                        $matchResult.show()
                        $matchResult.prev().show()
                    }
                    let even_code = {
                        '1': 'i-jinqiu', // 进球
                        '2': 'i-jinqiu', // 乌龙球
                        '3': 'i-huangpai', // 黄牌
                        '4': 'i-hongpai', // 两黄牌下  红牌
                        '5': 'i-hongpai', // 红牌
                        '6': 'i-dianqiu', // 点球
                        '7': 'i-pujiu',
                        '8': 'i-pujiu',
                        '9': 'i-pujiu',
                        '10': 'i-pujiu',
                        '11': 'i-pujiu',
                        '12': 'i-pujiu',
                        '13': 'i-shepian', // 射偏
                        '_13': 'i-shepian', // 射偏
                        '14': 'i-huanxia', // 换下
                        '_14': 'i-menkuang', // 击中门框
                        '15': 'i-huanshang', // 换上
                        '_15': 'i-shepian', // 射门被扑 被别人挡出
                        '16': 'i-huanxia', // 受伤下
                        '17': 'i-pujiu',
                        '18': 'i-pujiu',
                        '19': 'i-pujiu',
                        'diy_20': 'i-zhugong' // 助攻
                    }
                    let Showdata = []
                    for (let i = 0; i < data.length; i++) {
                        if (!Showdata.length || Showdata[Showdata.length - 1].time !== data[i].time) {
                            Showdata.push({
                                time: data[i].time,
                                home: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                },
                                visit: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                },
                                all: {
                                    event_code: [],
                                    Info: [],
                                    event_code_cn: []
                                }
                            })
                        }
                        if (data[i].team_name === home) {
                            let nowobj = Showdata[Showdata.length - 1].home
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        } else if (data[i].team_name === visit) {
                            let nowobj = Showdata[Showdata.length - 1].visit
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        } else {
                            let nowobj = Showdata[Showdata.length - 1].all
                            nowobj.event_code_cn.push(data[i].event_code_cn)
                            nowobj.event_code.push(data[i].event_code)
                            nowobj.Info.push(data[i].Info)
                        }
                    }
                    // console.log(Showdata);
                    let $timeLine = $('#matchResult .time-line')
                    let html = ''
                    $timeLine.html('') // 清空时间轴的内容
                    // 开始比赛的
                    html += '<div class="time-box">'
                    html += '<div class="time">0′</div>'
                    html += '<div class="rows">'
                    html += '<div class="row"> <div class="text">比赛开始</div> <div class="i-start icon"></div></div>'
                    html += ' </div>'
                    html += ' </div>'
                    for (let i = 0; i < Showdata.length; i++) {
                        let info
                        let length
                        // 主队的数据
                        info = Showdata[i].home.Info
                        length = Showdata[i].home.Info.length
                        // console.log(Showdata[i]);
                        if (length) {
                            html += ' <div class="time-box" style="margin-bottom:' + (0.3 + (length - 1) * 0.5) + 'rem' + '">'
                            html += '<div class="time">' + Showdata[i].time + '</div>'
                            html += '<div class="rows">'
                            for (let j = 0; j < length; j++) {
                                html += '<div class="row"> <div class="text">' + info[j] + (Showdata[i].home.event_code_cn[j] === '点球' ? '(点球)' : '') + '</div> <div class="icon  ' + even_code[Showdata[i].home.event_code[j]] + '"></div></div>'
                            }
                            html += '</div></div>'
                        }
                        // 客队的数据
                        info = Showdata[i].visit.Info
                        length = Showdata[i].visit.Info.length
                        if (length) {
                            html += ' <div class="time-box" style="margin-bottom:' + (0.3 + (length - 1) * 0.5) + 'rem' + '">'
                            html += '<div class="time">' + Showdata[i].time + '</div>'
                            html += '<div class="rows right">'
                            for (let j = 0; j < length; j++) {
                                html += '<div class="row"> <div class="icon  ' + even_code[Showdata[i].visit.event_code[j]] + '"></div><div class="text">' + info[j] + (Showdata[i].visit.event_code_cn[j] === '点球' ? '(点球)' : '') + '</div> </div>'
                            }
                            html += '</div></div>'
                        }
                    }
                    // 结束比赛的标志
                    html += '<div class="time-box">'
                    html += '<div class="time">end</div>'
                    html += '<div class="rows">'
                    html += '<div class="row"> <div class="text">比赛结束</div> <div class="i-end icon"></div></div>'
                    html += ' </div>'
                    html += ' </div>'
                    $timeLine.html(html)
                }
            },
            nba: {
                // 每节比分统计
                score_period: function(self, that) {
                    let data = self.score_period
                    let $matchResult = $('#matchResult')
                    if (!data) {
                        // 没有数据隐藏比分
                        $matchResult.hide()
                        $matchResult.prev().hide() // 灰色隔断
                        return
                    } else {
                        $matchResult.show()
                        $matchResult.prev().show()
                    }
                    let length = 0
                    let html = '<tbody>' + '<tr>' + '<th>球队</th>' + '<th>第一节</th>' + '<th>第二节</th>' + '<th>第三节</th>' + '<th>第四节</th>'
                    data.team1_scores.forEach(function(item) {
                        if (item === '0') {
                            length++
                        }
                    })
                    length = 4 - length // 原始4个零-数据得到的0
                    for (let i = 0; i < length; i++) {
                        html += '<th>加时赛</th>'
                    }
                    html += '<th>总分</th></tr>'
                    if (that.type === 'NBA') {
                        html += '<tr>' + '<td class="home_team_name">' + data.visit_team + '</td>' + '<td>' + data.team2_scores[0] + '</td>' + '<td>' + data.team2_scores[1] + '</td>' + '<td>' + data.team2_scores[2] + '</td>' + '<td>' + data.team2_scores[3] + '</td>'
                        for (let i = 0; i < length; i++) {
                            html += '<td>' + data.team2_scores[i + 4] + '</td>'
                        }
                        html += '<td>' + data.visit_score + '</td></tr>'
                        html += '<tr>' + '<td class="visit_team_name">' + data.home_team + '</td>' + '<td>' + data.team1_scores[0] + '</td>' + '<td>' + data.team1_scores[1] + '</td>' + '<td>' + data.team1_scores[2] + '</td>' + '<td>' + data.team1_scores[3] + '</td>'
                        for (let i = 0; i < length; i++) {
                            html += '<td>' + data.team1_scores[i + 4] + '</td>'
                        }
                        html += '<td>' + data.home_score + '</td></tr></tbody>'
                    } else {
                        html += '<tr>' + '<td class="home_team_name">' + data.home_team + '</td>' + '<td>' + data.team1_scores[0] + '</td>' + '<td>' + data.team1_scores[1] + '</td>' + '<td>' + data.team1_scores[2] + '</td>' + '<td>' + data.team1_scores[3] + '</td>'
                        for (let i = 0; i < length; i++) {
                            html += '<td>' + data.team1_scores[i + 4] + '</td>'
                        }
                        html += '<td>' + data.home_score + '</td></tr>'
                        html += '<tr>' + '<td class="visit_team_name">' + data.visit_team + '</td>' + '<td>' + data.team2_scores[0] + '</td>' + '<td>' + data.team2_scores[1] + '</td>' + '<td>' + data.team2_scores[2] + '</td>' + '<td>' + data.team2_scores[3] + '</td>'
                        for (let i = 0; i < length; i++) {
                            html += '<td>' + data.team2_scores[i + 4] + '</td>'
                        }
                        html += '<td>' + data.visit_score + '</td></tr></tbody>'
                    }
                    $matchResult.children('table').html(html)
                },
                // 球员统计
                player: function(self, that) {
                    if (!self.player) {
                        return
                    }
                    let data = self.player.data
                    let host = data.host // 主队球员
                    let guest = data.guest // 客队球员
                    if (!data) {
                        // 没有数据隐藏球员统计
                        $playerSta.hide()
                        $playerSta.prev().hide()
                        return
                    } else {
                        $playerSta.show()
                        $playerSta.prev().show()
                    }
                    if (that.type === 'NBA') {
                        this.teamPlayer(host, $playerSta.find('.visit'))
                        this.teamPlayer(guest, $playerSta.find('.host'))
                    } else {
                        this.teamPlayer(host, $playerSta.find('.host'))
                        this.teamPlayer(guest, $playerSta.find('.visit'))
                    }
                },
                teamPlayer: function(data, ele) {
                    // 清空表格内容
                    ele.find('.player').find('tr').each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    ele.find('.player-data table').find('tr').each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    let plays = data.on
                    let played = data.off
                    // 在场
                    for (let i = 0; i < plays.length; i++) {
                        this.playone(ele, plays[i], true)
                    }
                    // 休息
                    for (let i = 0; i < plays.length; i++) {
                        if (!played) {
                            continue
                        }
                        this.playone(ele, played[i], 0)
                    }
                },
                playone: function(ele, data, type) {
                    if (!data) {
                        return
                    }
                    ele.find('.player').append('<tr><td style=" ">' + data.player_name_cn + '</td></tr>')
                    ele.find('.player-data table').append('<tr>' + '</td>' + '<td>' + data.pos + '</td>' + '<td>' + data.minutes + '</td>' + '<td>' + data.field + '</td>' + '<td>' + data.three + '</td>' + '<td>' + data.free + '</td>' + '<td>' + data.off + '</td>' + '<td>' + data.def + '</td>' + '<td>' + data['off+def'] + '</td>' + '<td>' + data.ass + '</td>' + '<td>' + data.ste + '</td>' + '<td>' + data.blo + '</td>' + '<td>' + data.turn + '</td>' + '<td>' + data.fouls + '</td>' + '<td>' + data.plusMinus + '</td>' + '<td>' + data.points + '</td>' + '</tr>')
                }, // 各项最高 H5暂无
                score_rank: function(self, that) {
                    //console.log(self)
                    let data = self.score_rank.data
                    let guest = data.guest
                    let host = data.host
                    let table = $('#mdata .paixu  table tbody').eq(0)
                    let lines = table.find('tr')
                    table.find('.trtit').html('<td>各项最高</td>' + '<td>' + host.team_info.team_name + '</td>' + '<td></td>' + '<td>' + guest.team_info.team_name + '</td>' + '<td></td>')
                    for (let i = 1; i < lines.length; i++) {
                        let datatype = lines.eq(i).attr('datatype')
                        lines.eq(i).html('<td>' + host[datatype].name + '</td>' + '<td><a href= target="_blank">' + host[datatype].player_name + '</a></td>' + '<td>' + host[datatype].points + '</td>' + '<td><a href="javascript:void(0)" target="_blank">' + guest[datatype].player_name + '</a></td>' + '<td>' + guest[datatype].points + '</td>')
                    }
                }, // 球队统计
                stats_team: function(self, that) {
                    if (!self.stats_team) {
                        return
                    }
                    let data = self.stats_team.data
                    let html = ''
                    let home_data
                    let visit_data
                    home_data = data.host
                    visit_data = data.guest
                    if (!data) {
                        // 无数据 隐藏球队统计
                        $teamStats.hide()
                        $teamStats.prev().hide()
                        return
                    } else {
                        $teamStats.show()
                        $teamStats.prev().show()
                    }
                    let typeName = {
                        '投篮命中率': 'field_rate',
                        '得分/篮板': 'score_board',
                        '三分命中率': 'three_rate',
                        '罚球命中率': 'free_rate', /* '快攻/内线得分': 'fp_points', */
                        /* '技术/恶意犯规': 'fouls',
                         '六犯/被逐出场': 'diq_ejt', */
                        '最大领先分': 'biggest',
                        '得分': 'score',
                        '篮板': 'board'
                    }

                    let $teamStatsContentTeam = $teamStats.find('.content-team')
                    $teamStatsContentTeam.children().each(function(index) {
                        if (index !== 0) {
                            $(this).remove()
                        }
                    })
                    // 整理数据
                    for (let q in typeName) {
                        if (q === '得分/篮板') {
                            home_data.score = {}
                            visit_data.score = {}
                            home_data.board = {}
                            visit_data.board = {}
                            home_data.score.points = home_data[typeName[q]].points.split('/')[0]
                            visit_data.score.points = visit_data[typeName[q]].points.split('/')[0]
                            home_data.board.points = home_data[typeName[q]].points.split('/')[1]
                            visit_data.board.points = visit_data[typeName[q]].points.split('/')[1]
                        }
                    }
                    // 输出数据
                    for (let q in typeName) {
                        if (typeof home_data[typeName[q]] === 'undefined' || q === '得分/篮板') {
                            continue
                        }
                        let max = home_data[typeName[q]].points / 1 + visit_data[typeName[q]].points / 1
                        if (home_data[typeName[q]].points === 0 && visit_data[typeName[q]].points === 0) {
                            max = 1
                        }
                        if (that.type === 'NBA') {
                            if (('' + home_data[typeName[q]].points).indexOf('%') >= 0) {
                                $teamStatsContentTeam.append(`
<div class="row">
    <div class="num">${visit_data[typeName[q]].points}</div>
    <div class="m">
        <div class="line ${home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 'l' : 's'}"><span style="width:${visit_data[typeName[q]].points}"></span></div>
        <div class="text">${q}</div> 
        <div class="line ${home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 's' : 'l'}"><span style="width:${home_data[typeName[q]].points}"></span></div> 
    </div>
    <div class="num">${home_data[typeName[q]].points}</div>
</div>`)
                            } else {
                                $teamStatsContentTeam.append(`
<div class="row">
    <div class="num">${visit_data[typeName[q]].points}</div>
    <div class="m">
        <div class="line ${home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 'l' : 's'}"><span style="width:${visit_data[typeName[q]].points / max * 100 + '%'}"></span></div>
        <div class="text">${q}</div> 
        <div class="line ${home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 's' : 'l'}"><span style="width:${home_data[typeName[q]].points / max * 100 + '%'}"></span></div> 
    </div>
    <div class="num">${home_data[typeName[q]].points}</div>
</div>`)
                            }
                        } else {
                            if (('' + home_data[typeName[q]].points).indexOf('%') >= 0) {
                                $teamStatsContentTeam.append('<div class="row"><div class="num">' + home_data[typeName[q]].points + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]].points + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].points.replace('%', '') / 1 > visit_data[typeName[q]].points.replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]].points + '"></span></div>' + ' </div>' + '<div class="num">' + visit_data[typeName[q]].points + '</div></div>')
                            } else {
                                $teamStatsContentTeam.append('<div class="row"><div class="num">' + home_data[typeName[q]].points + '</div>' + ' <div class="m">' + '<div class="line ' + (home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 's' : 'l') + '"><span style="width:' + home_data[typeName[q]].points / max * 100 + '%' + '"></span></div>' + '<div class="text">' + q + '</div>' + ' <div class="line ' + (home_data[typeName[q]].points / 1 > visit_data[typeName[q]].points / 1 ? 'l' : 's') + '"><span style="width:' + visit_data[typeName[q]].points / max * 100 + '%' + '"></span></div>' + ' </div>' + '<div class="num">' + visit_data[typeName[q]].points + '</div></div>')
                            }
                        }
                    }
                    $teamStats.find('.content-team').append(html)
                }
            }, // 比赛双方信息图标队伍 比赛时间 菜单
            score: function(result, that) {
                let $zhiboMenu = $('#zhiboMenu')
                let redirect = _util_.getUrlParam('redirect')
                let html = ''
                // 判断参数 有data就切换到数据栏目
                let tab = _util_.getUrlParam('tab')
                //top图片使用篮球 足球 其他的
                if (result.tplv001 === '篮球') {
                    $zhiboHeadTop.addClass('lanqiu')
                } else if (result.tplv001 === '足球') {
                    $zhiboHeadTop.addClass('zuqiu')
                }
                if (result.saishi_id === '900002') {
                    that.type = 'NBA'
                } else {
                    that.type = 'other'
                }
                html += `<a href="javascript:;" class="${!tab ? 'active' : ''}" suffix="btype=live_details&subtype=live&idx=0" style="${result.ismatched === '-1' ? 'display:none' : ''}">图文直播</a>`
                html += `<a href="javascript:;" class="${tab === 'saikuang' || (result.ismatched === '-1' && !tab) ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0">资讯</a>`
                html += `<a href="javascript:;" class="${tab === 'liaotianshi' ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0">聊天室</a>`
                html += `<a href="javascript:;" class="${tab === 'shuju' ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0">数据</a>`
                if (qid === 'dfttapp') {
                    let agent = navigator.userAgent.toLowerCase()
                    if (agent.indexOf('android') >= 0) {
                        html += `<a href="javascript:;" class="${tab === 'fangan' ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0">方案</a>`
                    }
                } else {
                    html += `<a href="javascript:;" class="${tab === 'fangan' ? 'active' : ''}" suffix="btype=live_details&subtype=data&idx=0">方案</a>`
                }
                $zhiboMenu.html(html)
                let $zhibo_body = $('.zhibo_body')
                let $zhiboDataContent = $zhibo_body.children('.zhibo-data-content')
                if (redirect === 'dftth5' || redirect === 'app') {
                    that.loadMatchNews(result)
                } else {
                    that.loadJijin(result)
                    that.loadMatchNews(result)
                }
                /* else if (redirect === 'app') {
                    $zhiboDataContent.eq(1).html(`<ul><li>
                                            <div class="text-ts">
                                                <p>暂无数据</p>
                                            </div>
                                        </li></ul>`)
                    $loading.hide()
                } */
                //加载聊天室
                that.loadChat(result)
                if (tab === 'shuju') {
                    $zhiboDataContent.hide()
                    $zhiboDataContent.eq(3).show()
                    that.isZhiboTab = false
                    //console.log(that.flag)
                } else if (tab === 'saikuang') {
                    $zhiboDataContent.hide()
                    $zhiboDataContent.eq(1).show()
                    that.isZhiboTab = false
                } else if (tab === 'liaotianshi') {
                    $zhiboDataContent.hide()
                    $zhiboDataContent.eq(2).show()
                    that.isZhiboTab = false
                } else if (tab === 'fangan') {
                    $zhiboDataContent.hide()
                    $zhiboDataContent.eq(4).show()
                    that.isZhiboTab = false
                    that.isFanganTab = true
                }
                //直播信号
                if (result.ismatched !== '1') {
                    $headScore.append(`<div class="btn-zhibo">视频直播</div>`)
                    $headScore.on('click', '.btn-zhibo', function() {
                        /*function md5(string) {
                            function md5_RotateLeft(lValue, iShiftBits) {
                                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
                            }

                            function md5_AddUnsigned(lX, lY) {
                                var lX4,
                                    lY4,
                                    lX8,
                                    lY8,
                                    lResult
                                lX8 = (lX & 0x80000000)
                                lY8 = (lY & 0x80000000)
                                lX4 = (lX & 0x40000000)
                                lY4 = (lY & 0x40000000)
                                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
                                if (lX4 & lY4) {
                                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
                                }
                                if (lX4 | lY4) {
                                    if (lResult & 0x40000000) {
                                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
                                    } else {
                                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
                                    }
                                } else {
                                    return (lResult ^ lX8 ^ lY8)
                                }
                            }

                            function md5_F(x, y, z) {
                                return (x & y) | ((~x) & z)
                            }

                            function md5_G(x, y, z) {
                                return (x & z) | (y & (~z))
                            }

                            function md5_H(x, y, z) {
                                return (x ^ y ^ z)
                            }

                            function md5_I(x, y, z) {
                                return (y ^ (x | (~z)))
                            }

                            function md5_FF(a, b, c, d, x, s, ac) {
                                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac))
                                return md5_AddUnsigned(md5_RotateLeft(a, s), b)
                            }

                            function md5_GG(a, b, c, d, x, s, ac) {
                                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac))
                                return md5_AddUnsigned(md5_RotateLeft(a, s), b)
                            }

                            function md5_HH(a, b, c, d, x, s, ac) {
                                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac))
                                return md5_AddUnsigned(md5_RotateLeft(a, s), b)
                            }

                            function md5_II(a, b, c, d, x, s, ac) {
                                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac))
                                return md5_AddUnsigned(md5_RotateLeft(a, s), b)
                            }

                            function md5_ConvertToWordArray(string) {
                                var lWordCount
                                var lMessageLength = string.length
                                var lNumberOfWords_temp1 = lMessageLength + 8
                                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64
                                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16
                                var lWordArray = Array(lNumberOfWords - 1)
                                var lBytePosition = 0
                                var lByteCount = 0
                                while (lByteCount < lMessageLength) {
                                    lWordCount = (lByteCount - (lByteCount % 4)) / 4
                                    lBytePosition = (lByteCount % 4) * 8
                                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
                                    lByteCount++
                                }
                                lWordCount = (lByteCount - (lByteCount % 4)) / 4
                                lBytePosition = (lByteCount % 4) * 8
                                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
                                lWordArray[lNumberOfWords - 2] = lMessageLength << 3
                                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
                                return lWordArray
                            }

                            function md5_WordToHex(lValue) {
                                var WordToHexValue = '',
                                    WordToHexValue_temp = '',
                                    lByte,
                                    lCount
                                for (lCount = 0; lCount <= 3; lCount++) {
                                    lByte = (lValue >>> (lCount * 8)) & 255
                                    WordToHexValue_temp = '0' + lByte.toString(16)
                                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
                                }
                                return WordToHexValue
                            }

                            function md5_Utf8Encode(string) {
                                string = string.replace(/\r\n/g, '\n')
                                var utftext = ''
                                for (var n = 0; n < string.length; n++) {
                                    var c = string.charCodeAt(n)
                                    if (c < 128) {
                                        utftext += String.fromCharCode(c)
                                    } else if ((c > 127) && (c < 2048)) {
                                        utftext += String.fromCharCode((c >> 6) | 192)
                                        utftext += String.fromCharCode((c & 63) | 128)
                                    } else {
                                        utftext += String.fromCharCode((c >> 12) | 224)
                                        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                                        utftext += String.fromCharCode((c & 63) | 128)
                                    }
                                }
                                return utftext
                            }var x = Array()
                            var k,
                                AA,
                                BB,
                                CC,
                                DD,
                                a,
                                b,
                                c,
                                d
                            var S11 = 7,
                                S12 = 12,
                                S13 = 17,
                                S14 = 22
                            var S21 = 5,
                                S22 = 9,
                                S23 = 14,
                                S24 = 20
                            var S31 = 4,
                                S32 = 11,
                                S33 = 16,
                                S34 = 23
                            var S41 = 6,
                                S42 = 10,
                                S43 = 15,
                                S44 = 21
                            string = md5_Utf8Encode(string)
                            x = md5_ConvertToWordArray(string)
                            a = 0x67452301
                            b = 0xEFCDAB89
                            c = 0x98BADCFE
                            d = 0x10325476
                            for (k = 0; k < x.length; k += 16) {
                                AA = a
                                BB = b
                                CC = c
                                DD = d
                                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
                                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
                                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
                                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
                                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
                                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
                                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
                                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
                                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
                                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
                                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
                                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
                                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
                                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
                                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
                                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
                                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
                                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
                                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
                                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
                                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
                                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453)
                                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
                                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
                                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
                                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
                                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
                                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
                                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
                                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
                                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
                                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
                                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
                                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
                                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
                                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
                                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
                                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
                                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
                                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
                                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
                                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
                                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
                                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
                                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
                                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
                                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
                                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
                                a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244)
                                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
                                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
                                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
                                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
                                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
                                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
                                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
                                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
                                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
                                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314)
                                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
                                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
                                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
                                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
                                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
                                a = md5_AddUnsigned(a, AA)
                                b = md5_AddUnsigned(b, BB)
                                c = md5_AddUnsigned(c, CC)
                                d = md5_AddUnsigned(d, DD)
                            }
                            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase()
                        }*/
                        let html = ''
                        if (result.zhiboinfozh.length) {
                            result.zhiboinfozh.forEach(function(item) {
                                let title = item.title
                                let url = item.url
                                if (item.hascopyright === '1') {
                                        item.zhibolius.forEach(function(item) {
                                            /*if (title.indexOf('CCTV5') > -1) {
                                                let nwtime = ('' + new Date().getTime()).substring(0, 10)
                                                let sign = md5('fungolive' + nwtime)
                                                item.url += '&nwtime=' + nwtime + '&sign=' + sign
                                            }*/
                                            if (item.url.indexOf('.m3u8') > -1) {
                                                html += `<li><a href="javascript:;" data-url="${item.url}" class="living">${title} <span>${item.title}</span></a></li>`
                                            }
                                        })
                                } else {
                                    html += `<li><a href="${url}" class="" target="_blank">${title} </a></li>`
                                }
                            })
                            $body.append(`<div class="popup" id="popup">
                            <div class="message">
                                <ul>
                                    ${html}
                                    <li>
                                        取消
                                    </li>
                                </ul>
                            </div>
                        </div>`)
                        } else {
                            $body.append(`<div class="popup" id="popup">
                            <div class="message">
                                <ul>
                                    <li>
                                        <a href="javascript:;" class="down-app">CCTV5 <span>App高清直播</span></a>
                                    </li>
                                    <li class="down-app">
                                        <a href="javascript:;"  class="down-app">东方体育 <span>打开app</span></a>
                                    </li>
                                    <li class="down-app">
                                        取消
                                    </li>
                                </ul>
                            </div>
                        </div>`)
                        }
                    })
                } else {
                    $bigBox.addClass('small-box')
                    $headScore.append(`<div class="btn-end">已结束</div>`)
                }
                $body.on('click', '.popup li:last-child', function() {
                    $('#popup').remove()
                })
                $body.on('click', '.popup', function() {
                    $('#popup').remove()
                })
                $body.on('click', '.popup li a.down-app', function() {
                    window.location.href = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5dftiyu`
                    /*if (redirect === 'app') {
                        window.location.href = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=touApp`
                    } else if (redirect === 'dftth5') {
                        window.location.href = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=touH5`
                    } else {
                        window.location.href = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5zhitc`
                    }*/
                })
                let $vBox = $('#vBox')
                let $video = $('#J_video')
                $video.attr('poster', '//msports.eastday.com/h5/static/img/73222cee281aa6dd9e28a44d5d6f1fe5.jpg')
                $body.on('click', '.popup li a.living', function() {
                    $vBox.show()
                    let src = $(this).attr('data-url')
                    $video.attr({
                        'src': src,
                        //'poster': poster
                    })
                    $video[0].play()
                })
                $headScore.children('.title').text(`${result.title02} ${result.starttime.substring(5)}`)
                //比赛未开始前的状态
                if (result.ismatched === '-1') {
                    $zhiboDataContent.hide()
                    $zhiboDataContent.eq(1).show()
                    if (tab === 'shuju') {
                        $zhiboDataContent.hide()
                        $zhiboDataContent.eq(3).show()
                        that.isZhiboTab = false
                        //console.log(that.flag)
                    } else if (tab === 'saikuang') {
                        $zhiboDataContent.hide()
                        $zhiboDataContent.eq(1).show()
                        that.isZhiboTab = false
                    } else if (tab === 'liaotianshi') {
                        $zhiboDataContent.hide()
                        $zhiboDataContent.eq(2).show()
                        that.isZhiboTab = false
                    } else if (tab === 'fangan') {
                        $zhiboDataContent.hide()
                        $zhiboDataContent.eq(4).show()
                        that.isZhiboTab = false
                        that.isFanganTab = true
                    }
                    that.isZhiboTab = false
                    $headScore.find('.btn-zhibo').remove()
                    if (qid !== 'dfspiosnull' && qid !== 'dfspadnull') {
                        $headScore.append(`<a href="http://msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5dftiyu"  class="btn-order">预约</a>`)
                    } else {
                        $headScore.append(`<a href="javascript:;"  class="btn-order">未开始</a>`)
                    }
                }
                //头部标题
                if (result.sport_type === '1') {
                    $bigBox.find('.left').remove()
                    $bigBox.find('.right').remove()
                    $headScore.children('.title').text(`${result.starttime.substring(5)}`)
                    $headScore.find('h3').html(`<div class="single" style="">${result.title}</div>`).css({'fontSize': '0.36rem',
                        'marginTop': '0.35rem'})
                    $headScore.css('width', '100%')
                    $zhiboHead.find('.process').remove()
                    if (result.ismatched !== '1') {
                        $headScore.find('h3').append(`<h6 style="color: #dadada;font-size: 0.26rem;font-weight: 400;margin-top: 0.2rem;margin-bottom: 0.1rem">${result.title02}</h6>`)
                    }
                    //$sBox.html(`<div class="single">${result.title}</div>`)
                    return
                }
                that.loadZan(result)
                // 比分
                let $homeScore = $headScore.find('.home-score')
                let $visitScore = $headScore.find('.visit-score')
                if (that.type === 'NBA') {
                    $homeScore.text(result.visit_score / 1 ? result.visit_score : 0)
                    $visitScore.text(result.home_score / 1 ? result.home_score : 0)
                } else {
                    $homeScore.text(result.home_score / 1 ? result.home_score : 0)
                    $visitScore.text(result.visit_score / 1 ? result.visit_score : 0)
                }
                // 对阵双方
                let home_logoname = result.home_logoname ? result.home_logoname : `${config.DIRS.BUILD_FILE.images['logo_default']}`
                let visit_logoname = result.visit_logoname ? result.visit_logoname : `${config.DIRS.BUILD_FILE.images['logo_default']}`
                if (that.type === 'NBA') {
                    $homeLeft.find('.sub1').text(result.visit_team)
                    $homeLeft.find('.sub2 img').attr('src', visit_logoname)
                    $homeRight.find('.sub1').text(result.home_team)
                    $homeRight.find('.sub2 img').attr('src', home_logoname)
                } else {
                    $homeLeft.find('.sub1').text(result.home_team)
                    $homeLeft.find('.sub2 img').attr('src', home_logoname)
                    $homeRight.find('.sub1').text(result.visit_team)
                    $homeRight.find('.sub2 img').attr('src', visit_logoname)
                }
                //$zhiboHeadTeamLogo.eq(0).attr('src', home_logoname)
                //$zhiboHeadTeamLogo.eq(1).attr('src', visit_logoname)
                //$textNum.text(`${result.home_score / 1 ? result.home_score : 0}-${result.visit_score / 1 ? result.visit_score : 0}`)
                if (result.ismatched === '-1') {
                    $textState.text(/*result.starttime.substr(5)*/'未开始')
                    $headScore.find('h3').text('VS')
                } else if (result.ismatched === '0') {
                    $textState.text('直播中')
                } else {
                    $textState.text('完赛')
                }
                // 下方对阵双方图标
                if (that.type === 'NBA') {
                    $('.home-team-logo').attr('src', visit_logoname).next().text(result.visit_team)
                    $('.visit-team-logo').attr('src', home_logoname).next().text(result.home_team)
                } else {
                    $('.home-team-logo').attr('src', home_logoname).next().text(result.home_team)
                    $('.visit-team-logo').attr('src', visit_logoname).next().text(result.visit_team)
                }
            }, // 交锋历史 最近战绩 未来赛程 只加载一次
            loadOnceDate: function(data, that) {
                let $historyData = $('#historyData')
                let $recentRecord = $('#recentRecord')
                let $futureSchedule = $('#futureSchedule')
                if (!data.data.match_history) {
                    return false
                }
                let match_history = data.data.match_history[0]
                let lately_score = data.data.lately_score
                let nextschedule_host = data.data.nextschedule_host
                let nextschedule_visit = data.data.nextschedule_visit
                let html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                // 交锋历史
                match_history.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.game + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.score + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                $historyData.children('table').html(html)
                // 最近战绩
                // 主队的
                if (that.type === 'NBA') {
                    html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                    lately_score[0] && lately_score[0].forEach(function(item) {
                        html += '<tr>'
                        html += '<td>' + item.data + '</td>'
                        html += '<td>' + item.saishi + '</td>'
                        html += '<td>' + item.home_team + '</td>'
                        html += '<td>' + item.score + '</td>'
                        html += '<td>' + item.visit_team + '</td>'
                        html += '</tr>'
                    })
                    // 客队的
                    $recentRecord.children('.visit-team').find('table').html(html)
                    html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                    lately_score[1] && lately_score[1].forEach(function(item) {
                        html += '<tr>'
                        html += '<td>' + item.data + '</td>'
                        html += '<td>' + item.saishi + '</td>'
                        html += '<td>' + item.home_team + '</td>'
                        html += '<td>' + item.score + '</td>'
                        html += '<td>' + item.visit_team + '</td>'
                        html += '</tr>'
                    })
                    $recentRecord.children('.home-team').find('table').html(html)
                } else {
                    html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                    lately_score[0] && lately_score[0].forEach(function(item) {
                        html += '<tr>'
                        html += '<td>' + item.data + '</td>'
                        html += '<td>' + item.saishi + '</td>'
                        html += '<td>' + item.home_team + '</td>'
                        html += '<td>' + item.score + '</td>'
                        html += '<td>' + item.visit_team + '</td>'
                        html += '</tr>'
                    })
                    // 客队的
                    $recentRecord.children('.home-team').find('table').html(html)
                    html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>比分</th> <th>客队</th> </tr>'
                    lately_score[1] && lately_score[1].forEach(function(item) {
                        html += '<tr>'
                        html += '<td>' + item.data + '</td>'
                        html += '<td>' + item.saishi + '</td>'
                        html += '<td>' + item.home_team + '</td>'
                        html += '<td>' + item.score + '</td>'
                        html += '<td>' + item.visit_team + '</td>'
                        html += '</tr>'
                    })
                    $recentRecord.children('.visit-team').find('table').html(html)
                }
                // 战绩计算
                html = ''
                $recentRecord.children('.content-team').find('.row').each(function(index) {
                    if (index !== 0) {
                        $(this).remove()
                    }
                })
                lately_score[2][0][1] !== null && lately_score[2].forEach(function(item, i) {
                    let max = item[1] / 1 + item[4] / 1
                    if (item[1] === 0 && item[4] === 0) {
                        max = 1
                    }
                    if (item[1].indexOf('%') >= 0) {
                        html += '<div class="row">'
                        if (that.type === 'NBA') {
                            html += '<div class="num">' + item[4] + '</div>'
                        } else {
                            html += '<div class="num">' + item[1] + '</div>'
                        }
                        html += '<div class="m">'
                        if (that.type === 'NBA') {
                            html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + item[4] + '"></span></div>'
                            html += '<div class="text">' + item[0] + '</div>'
                            html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + item[1] + '"></span></div>'
                        } else {
                            html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 's' : 'l') + '"><span style="width:' + item[1] + '"></span></div>'
                            html += '<div class="text">' + item[0] + '</div>'
                            html += '<div class="line ' + (item[1].replace('%', '') / 1 > item[4].replace('%', '') / 1 ? 'l' : 's') + '"><span style="width:' + item[4] + '"></span></div>'
                        }
                        html += '</div>'
                        if (that.type === 'NBA') {
                            html += '<div class="num">' + item[1] + '</div>'
                        } else {
                            html += '<div class="num">' + item[4] + '</div>'
                        }
                        html += '</div>'
                    } else {
                        html += '<div class="row">'
                        if (that.type === 'NBA') {
                            html += '<div class="num">' + item[4] + '</div>'
                        } else {
                            html += '<div class="num">' + item[1] + '</div>'
                        }
                        html += '<div class="m">'
                        if (that.type === 'NBA') {
                            html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 'l' : 's') + '"><span style="width:' + item[1] / max * 100 + '%' + '"></span></div>'
                            html += '<div class="text">' + item[0] + '</div>'
                            html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 's' : 'l') + '"><span style="width:' + item[4] / max * 100 + '%' + '"></span></div>'
                        } else {
                            html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 's' : 'l') + '"><span style="width:' + item[1] / max * 100 + '%' + '"></span></div>'
                            html += '<div class="text">' + item[0] + '</div>'
                            html += '<div class="line ' + (item[1] / 1 > item[4] / 1 ? 'l' : 's') + '"><span style="width:' + item[4] / max * 100 + '%' + '"></span></div>'
                        }
                        html += '</div>'
                        if (that.type === 'NBA') {
                            html += '<div class="num">' + item[1] + '</div>'
                        } else {
                            html += '<div class="num">' + item[4] + '</div>'
                        }
                        html += '</div>'
                    }
                })
                $recentRecord.children('.content-team').append(html)
                // 未来赛程
                // 主队的
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th> <th>客队</th> </tr>'
                nextschedule_host.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                if (that.type === 'NBA') {
                    $futureSchedule.children('.visit-team').find('table').html(html)
                } else {
                    $futureSchedule.children('.home-team').find('table').html(html)
                }
                // 客队的
                html = '<tr> <th>日期</th> <th>赛事</th> <th>主队</th><th>客队</th> </tr>'
                nextschedule_visit.forEach(function(item) {
                    html += '<tr>'
                    html += '<td>' + item.data + '</td>'
                    html += '<td>' + item.saishi + '</td>'
                    html += '<td>' + item.home_team + '</td>'
                    html += '<td>' + item.visit_team + '</td>'
                    html += '</tr>'
                })
                if (that.type === 'NBA') {
                    $futureSchedule.children('.home-team').find('table').html(html)
                } else {
                    $futureSchedule.children('.visit-team').find('table').html(html)
                }
            },
            textMessage: function(result, flag, wenziMaxNum) {
                let html = ''
                let str
                let data = result.data
                data = data.reverse()
                let num = $headScore.attr('live_sid') / 1
                let $homeScore = $headScore.find('.home-score')
                let $visitScore = $headScore.find('.visit-score')
                if (flag === 1) { // 下方插入
                    data.forEach(function(item, i) {
                        if (!item.live_text) return
                        if (item.live_sid / 1 > datainit.wenziMaxNum) { // 注 从文字直播的id去获取加载完成之后最大的数字,
                            datainit.wenziMaxNum = item.live_sid / 1
                        }
                        // 比分
                        if (!num) {
                            num = item.live_sid
                        }
                        if (item.live_sid >= num) {
                            // 足球时间不对
                            $headScore.attr('live_sid', num)
                            if (datainit.type === 'NBA') {
                                if (item.visit_score) {
                                    $homeScore.text(item.visit_score)
                                    $visitScore.text(item.home_score)
                                    $livebox.prev().text(`${item.pid_text} ${item.visit_score}-${item.home_score}`)
                                }
                            } else {
                                if (item.visit_score) {
                                    $homeScore.text(item.home_score)
                                    $visitScore.text(item.visit_score)
                                    $livebox.prev().text(`${item.pid_text} ${item.home_score}-${item.visit_score}`)
                                }
                            }
                        }
                        if (item.live_sid % 4 === 0) {
                            if (datainit.type === 'NBA') {
                                str = `<div class="score">${item.visit_score + '-' + item.home_score}</div><div class="time">${item.pid_text}</div>`
                            } else {
                                str = `<div class="score">${item.home_score + '-' + item.visit_score}</div><div class="time">${item.pid_text}</div>`
                            }
                        } else {
                            str = ''
                        }
                        // 文字 style="color:${item.text_color}"
                        html += `<li>
                                <div class="t">
                                    <div class="circle ${datainit.ismatched === 1 && item.live_sid >= datainit.wenziMaxNum ? 'red' : item.live_sid === 1 ? 'blue' : ''}"></div>
                                    ${str}
                                </div>
                                <div class="text-box">
                                    <p>${item.live_text}</p>
                                    ${item.img_url ? `<div href="javascript:;" class="img-url" data-url="${item.img_url}"><img src="${config.DIRS.BUILD_FILE.images['zhibo_zhanwei']}" alt=""/></div>` : ''}
                                </div>
                            </li>`
                    })
                    $livebox.append(html)
                } else { // 上方插入
                    data.forEach(function(item, i) {
                        if (!item.live_text) return
                        if (item.live_sid / 1 > datainit.wenziMaxNum) { // 注 从文字直播的id去获取加载完成之后最大的数字,
                            datainit.wenziMaxNum = item.live_sid / 1
                        }
                        if (item.live_sid <= wenziMaxNum) {

                        } else {
                            // 比分
                            if (!num) {
                                num = item.live_sid
                            }
                            if (item.live_sid >= num) {
                                // 足球时间不对
                                $headScore.attr('live_sid', num)
                                if (datainit.type === 'NBA') {
                                    if (item.visit_score) {
                                        $homeScore.text(item.visit_score)
                                        $visitScore.text(item.home_score)
                                        //$textNum.text(`${item.home_score}-${item.visit_score}`)
                                        $livebox.prev().text(`${item.pid_text} ${item.visit_score}-${item.home_score}`)
                                    }
                                } else {
                                    if (item.visit_score) {
                                        $homeScore.text(item.home_score)
                                        $visitScore.text(item.visit_score)
                                        //$textNum.text(`${item.home_score}-${item.visit_score}`)
                                        $livebox.prev().text(`${item.pid_text} ${item.home_score}-${item.visit_score}`)
                                    }
                                }
                            }
                            if (item.live_sid % 4 === 0) {
                                if (datainit.type === 'NBA') {
                                    str = `<div class="score">${item.visit_score + '-' + item.home_score}</div><div class="time">${item.pid_text}</div>`
                                } else {
                                    str = `<div class="score">${item.home_score + '-' + item.visit_score}</div><div class="time">${item.pid_text}</div>`
                                }
                            } else {
                                str = ''
                            }
                            // 文字style="color:${item.text_color}"
                            html += `<li>
                                <div class="t">
                                    <div class="circle ${datainit.ismatched === 1 && item.live_sid >= num ? 'red' : item.live_sid === 1 ? 'blue' : ''}"></div>
                                     ${str}
                                </div>
                                <div class="text-box">
                                    <p>${item.live_text}</p>
                                    ${item.img_url ? `<div href="javascript:;" class="img-url" data-url="${item.img_url}"><img src="${config.DIRS.BUILD_FILE.images['zhibo_zhanwei']}" alt=""/></div>` : ''}
                                </div>
                            </li>`
                        }
                    })
                    $livebox.prepend(html)
                }
            }
        }, //加载相关新闻资讯 赛况
        loadMatchNews: function(result) {
            let $el = $(`<div class="sec1">
                            <!--<h3 class="name"><span></span>相关资讯</h3>-->
                            <ul></ul>
                        </div>`)
            let idx = 1
            let data = {
                saishi_id: result.saishi_id,
                number: 10,
                teamnames: encodeURI(result.home_team) + ',' + encodeURI(result.visit_team)
            }
            $matchNews.append($el)
            if (typeof result.zhanbao !== 'undefined' && result.zhanbao.url) {
                $el.prepend(` <div class="big-news">
                                <a href="${result.zhanbao.url}?qid=${qid}">
                                <img src="${result.zhanbao.img}" alt="">
                                <div class="i-zhanbao jiao"></div>
                                 <p>${result.zhanbao.title}</p>
                                </a>
</div>`)
            } else if (typeof result.qianzhan !== 'undefined' && result.qianzhan.url) {
                $el.prepend(` <div class="big-news">
                                <a href="${result.qianzhan.url}?qid=${qid}">
                                <img src="${result.qianzhan.img}" alt="">
                                <div class="i-qianzhan jiao"></div>
                                 <p>${result.qianzhan.title}</p>
                                </a>
</div>`)
            }
            $loading.show()
            _util_.makeJsonp(HOST + 'teamRelateNews', data).done(function(result) {
                $loading.hide()
                $el.find('ul').html(produceListHtml(result))
                $el.append(`<div class="no-more" style="margin:0 0 0 -0.24rem;width:7.5rem;">没有更多了~</div>`)
            })

            function produceListHtml(result) {
                let data = result.data
                let html = ''
                data.forEach(function(item) {
                    let length = item.miniimg.length// 判断缩略图的数量
                    if (length < 3 && length >= 1) {
                        html += `<li class="clearfix">
                                    <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=1`}`}" suffix="">
                                        <div class="img">
                                            <img src="${item.miniimg[0].src}" alt=""/>
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source clearfix">
                                                <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
                    } else if (length >= 3) {
                        html += `<li class="clearfix">
                                     <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=1`}`}" suffix="">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img src="${item.miniimg[0].src}" alt="">
                                            <img src="${item.miniimg[1].src}" alt="">
                                            <img src="${item.miniimg[2].src}" alt="">
                                        </div>
                                        <div class="source clearfix">
                                            <div class="l">${item.source}</div>
                                        </div>
                                    </a>
                                </li>`
                    }
                    idx++
                })
                return html
            }
        },
        switchTab: function() { // 直播和数据切换
            let $zhibo_body = $('.zhibo_body')
            //let redirect = _util_.getUrlParam('redirect')
            let that = this
            $zhiboMenu.on('click', 'a', function() {
                let length = $zhiboMenu.children('a').length
                let $zhiboDataContent = $zhibo_body.children('.zhibo-data-content')
                $(this).parent().children().removeClass('active')
                $(this).addClass('active')
                let index = $(this).index()
                $zhiboDataContent.hide()
                if (index === 0) {
                    that.isZhiboTab = true
                } else if (index === (length - 1)) {
                    that.isZhiboTab = false
                    that.isFanganTab = true
                } else {
                    that.isZhiboTab = false
                    that.isFanganTab = false
                }
                if ($(this).attr('href') === 'javascript:;') {
                    $zhiboDataContent.eq(index).show()
                    $body.scrollTop(0)
                    /*if (index === 1 && redirect === 'app') {
                        $zhiboDataContent.eq(index).html(`<ul><li>
                                            <div class="text-ts">
                                                <p>暂无数据</p>
                                            </div>
                                        </li></ul>`)
                    }*/
                }
            })
        },
        viewGif: function() { //点击查看gif图片
            let that = this
            $livebox.on('click', 'li .img-url', function() {
                if (that.type === 'NBA') {
                    window.location.href = $(this).attr('data-url')
                } else {
                    $('body').append(`<div class="pop-up-gif">
                                        <img src="${$(this).attr('data-url')}" alt=""/>
                                        <p>点击关闭动图</p>
                                    </div>`)
                    // 禁止
                    /*document.body.style.overflow = 'hidden';
                    window.addEventListener('touchmove', _preventDefault);*/
                    $('.pop-up-gif').on('click', function() {
                        $(this).remove()
                        // 恢复
                        /*document.body.style.overflow = 'auto';
                         window.removeEventListener('touchmove', _preventDefault);*/
                    })
                }
            })
        },
        loadJijin: function(result) { // 加载录像集锦 点击加载集锦录像
            let that = this
            let data = {
                matchid: that.matchId,
                saishi_id: result.saishi_id,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: DOMAIN
            }
            _util_.makeJsonp(HOST + 'matchvideo', data).done(function(data) {
                (() => {
                    let $el = $(`<div class="sec clearfix">
                                <!--<div class="name">集锦</div>-->
                                <div class="con"><ul></ul></div>
                                <!--<div class="separate-line"></div>-->
                            </div>`)
                    let html = ''
                    let flag1 = true
                    let flag2 = true
                    data.data.forEach(function(item) {
                        let topic = item.topic
                        if (item.videotype === '1') {
                            if (flag1) {
                                html += `<li class="luxiang">集锦</li>`
                                flag1 = false
                            }
                            if (item.videolist.length && item.videolist[0].src.indexOf('.mp4') >= 0) {
                                html += `<li>
                                <a href="javascript:;" data-src="${item.videolist[0].src}" data-poster="${item.miniimg[0].src}">
                                    <p>${topic}</p>
                                </a>
                            </li>`
                            } else {
                                html += `<li>
                                <a href="${item.url}" target="_blank">
                                    <p>${topic}</p>
                                </a>
                            </li>`
                            }
                        }
                    })
                    data.data.forEach(function(item) {
                        let topic = item.topic.substring(12)
                        if (item.videotype === '2') {
                            if (flag2) {
                                html += `<li class="luxiang">录像</li>`
                                flag2 = false
                            }
                            if (item.videolist.length && item.videolist[0].src.indexOf('.mp4') >= 0) {
                                html += `<li>
                                <a href="javascript:;" data-src="${item.videolist[0].src}" data-poster="${item.miniimg[0].src}">
                                    <p>${topic}</p>
                                </a>
                            </li>`
                            } else {
                                html += `<li>
                                <a href="${item.url}" target="_blank">
                                    <p>${topic}</p>
                                </a>
                            </li>`
                            }
                        }
                    })
                    if (html) {
                        $matchNews.prepend($el)
                        $el.find('ul').append(html)
                    }
                })()
            })
            let $vBox = $('#vBox')
            let $video = $('#J_video')
            let $close = $vBox.children('.close')
            $video.attr('src', '')
            $matchNews.on('click', '.sec li a', function() {
                $(this).parent().parent().find('a').removeClass('active')
                $(this).addClass('active')
                let href = $(this).attr('href')
                let src = $(this).attr('data-src')
                let poster = $(this).attr('data-poster')
                if (href === 'javascript:;') {
                    $vBox.show()
                    $video.attr({
                        'src': src,
                        'poster': poster
                    })
                    $video[0].play()
                }
            })
            $video[0].addEventListener('ended', function() {
                $vBox.hide()
                $video[0].pause()
            })
            $close.click(function() {
                $vBox.hide()
                $video[0].pause()
            })
        },
        loadZan: function(result) {
            let $zanNum1 = $('#zanNum1')
            let $zanNum2 = $('#zanNum2')
            let $process = $zhiboHead.find('.process')
            let that = this
            //先请求赞数
            let data = {
                matchid: that.matchId,
                teamid: result.home_team_id + ',' + result.visit_team_id,
                os: os,
                recgid: recgid,
                qid: qid,
                domain: DOMAIN
            }
            _util_.makeJsonp(HOST + 'getdzteam', data).done(function(data) {
                let num1 = data.data[result.home_team_id]
                let num2 = data.data[result.visit_team_id]
                let sum = (num1 + num2) || 1
                if (that.type === 'NBA') {
                    $zanNum1.text(num2 / 1 >= 100000 ? '100000+' : num2)
                    $zanNum2.text(num1 / 1 >= 100000 ? '100000+' : num1)
                    $process.children('.red').css({
                        width: num2 / sum * 100 + '%'
                    })
                    $process.children('.blue').css({
                        width: num1 / sum * 100 + '%'
                    })
                } else {
                    $zanNum1.text(num1 / 1 >= 100000 ? '100000+' : num1)
                    $zanNum2.text(num2 / 1 >= 100000 ? '100000+' : num2)
                    $process.children('.red').css({
                        width: num1 / sum * 100 + '%'
                    })
                    $process.children('.blue').css({
                        width: num2 / sum * 100 + '%'
                    })
                }
            })
            $homeLeft.find('.sub3').click(function() {
                /*if ($(this).find('.zan1').hasClass('active')) {
                    return
                }*/
                $(this).find('.zan1').addClass('active')
                let num = $(this).find('.num').text().replace(/\+/, '') / 1
                $(this).find('.num').text(++num)
                let team_id
                if (that.type === 'NBA') {
                    team_id = result.visit_team_id
                } else {
                    team_id = result.home_team_id
                }
                let data = {
                    matchid: that.matchId,
                    teamid: team_id,
                    os: os,
                    recgid: recgid,
                    qid: qid,
                    domain: DOMAIN
                }
                _util_.makeJsonp(HOST + 'dianzanteam', data).done(function(result) {})
            })
            $homeRight.find('.sub3').click(function() {
                /*if ($(this).find('.zan2').hasClass('active')) {
                    return
                }*/
                $(this).find('.zan2').addClass('active')
                let num = $(this).find('.num').text().replace(/\+/, '') / 1
                $(this).find('.num').text(++num)
                let team_id
                if (that.type === 'NBA') {
                    team_id = result.home_team_id
                } else {
                    team_id = result.visit_team_id
                }
                let data = {
                    matchid: that.matchId,
                    teamid: team_id,
                    os: os,
                    recgid: recgid,
                    qid: qid,
                    domain: DOMAIN
                }
                _util_.makeJsonp(HOST + 'dianzanteam', data).done(function(result) {})
            })
        },
        loadChat: function(result) {
            let that = this
            let data = {
                roomid: appId + result.matchid,
                startoffset: that.startoffset,
                diffoffset: that.diffoffset,
                num: 20,
                asc: 1
            }
            _util_.makeJsonpcallback(CHAT, data).done(function(data) {
                let info = data.info
                let html = ''
                if (!info.length) {
                    $chatRoomUl.html(`<li class="no-comment">暂无评论</li>`)
                } else {
                    info.forEach(function(item, i) {
                        let msg = JSON.parse(item.msg)
                        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
                        if (myreg.test(msg.nickname)) {
                            msg.nickname = msg.nickname.substring(0, 3) + '****' + msg.nickname.substring(7, 11)
                        }
                        html += `<li class="l clearfix"><div class="pic"><img src="${msg.headpic ? msg.headpic : config.DIRS.BUILD_FILE.images['i-logo']}" alt=""></div>
                                    <div class="info">
                                        <p>
                                            <span class="name">${msg.nickname}</span>
                                            <span class="time">${_util_.getSpecialTimeStr(msg.ts)}</span>
                                        </p>
                                        <h3>${msg.msg.text}</h3>
                                    </div>
                                </li>`
                    })
                    $chatRoomUl.append(html)
                }
            })
            /*//初始化第一步
            let playerSocketData = {}
            playerSocketData.nn = ''
            playerSocketData.pic = ''
            playerSocketData.uid = ''
            playerSocketData.isUserConn = false

            function socketInit(host, port, rid, roomkey, ttaccid) {
                playerSocketData.isUserConn = true
                pomelo.disconnect()
                playerSocketData.uid = ttaccid || decodeURIComponent($.parseJSON($.cookie('mylist')).uid)
                playerSocketData.rid = rid
                playerSocketData.roomkey = roomkey
                pomelo.init({
                    host: host,
                    port: port,
                    log: true
                }, function(d) {
                    //window.console.log(d);
                    pomelo.request('gate.gateHandler.queryEntry', {
                        uid: playerSocketData.uid
                    }, function(d) {
                        pomelo.disconnect()
                        playerSocketData.host = d.host
                        playerSocketData.port = d.port
                        sendRequest(d)
                    })
                })
            }

            pomelo.on('disconnect', function(data) {
                //console.log(data)
                if (!playerSocketData.isUserConn) {
                    playerSocketData.failure = '评论失败'
                }
                playerSocketData.isUserConn = false
            })

            //请求进入connector服务器
            function sendRequest(obj) {
                pomelo.init({
                    host: obj.host,
                    port: obj.port,
                    log: true
                }, function(d) {
                    //window.console.log(d);
                    pomelo.request('connector.entryHandler.entry', {
                        app_id: 'dftv',
                        uid: playerSocketData.uid,
                        rid: playerSocketData.rid,
                        ticket: 'ssssssssssssssssssss'
                    }, function(d) {
                        // console.log("请求进入connector服务器:");
                        inRoom()
                    })
                })
            }

            //图文直播第二步 发送图文消息
            function sendChannelMsg(obj) {
                pomelo.request('channel.channelHandler.send', {
                    text: '文字内容',
                    img: ['http://图片地址url'],
                    video: [
                        {
                            'cover': 'http://视频封面图url',
                            'url': 'http://视频文件地址'
                        }
                    ]
                }, function(d) {
                    //console.log("sendChannelMsg");
                    //console.log(d);
                    //console.log("sendChannelMsg");
                })
            }

            //发送图文直播消息 第一步
            function Channelentry(obj) {
                pomelo.request('channel.channelHandler.entry', {
                    channelName: playerSocketData.rid,
                    app_id: 'dftv',
                    nickname: '',
                    headpic: ''
                }, function(d) {
                    // console.log("Channelentry");
                    // console.log(d);
                    if (d.code === '200') {
                        sendChannelMsg({})
                    }
                })
            }

            //用户评论
            function sendMsg(msg, type) {
                pomelo.request('chat.chatHandler.send', {
                    msg: msg,
                    type: type,
                    quanmin_token: '',
                    to: {
                        accid: '',
                        nickname: ''
                    }
                }, function(d) {
                    // console.log(d);
                })
            }

            //进入房间

            function inRoom() {
                pomelo.request('room.roomHandler.entry', {
                    rid: playerSocketData.rid,
                    rowkey: playerSocketData.roomkey,
                    uid: playerSocketData.uid,
                    nn: playerSocketData.nn,
                    lv: 1,
                    headpic: playerSocketData.pic,
                    owner: 0
                }, function(d) {
                    //console.log("进入房间");
                    if (d.limited) playerSocketData.dsssd = d.limited.blacklist
                    //拉黑列表
                    listenEvent()
                    //Channelentry();
                })
            }

            function listenEvent() {
                //onRoomDisband: 房间被解散
                pomelo.on('onRoomDisband', function(data) {
                    //VideoPlayEnd(1)
                })

                //onHostLeave: 主播信号中断
                pomelo.on('onHostLeave', function(data) {
                    //console.log('onHostLeave', data);
                })

                //onHostComeback: 主播信号恢复
                pomelo.on('onHostComeback', function(data) {
                    //console.log('onHostComeback', data);
                })

                pomelo.on('onRoomUserNum', function(data) {
                    $('#top_title').find('.peonum').text(data.all)
                })

                //onUserEnter: 有用户进入房间
                pomelo.on('onUserEnter', function(data) {
                    //console.log("onUserEnter:");
                })

                //聊天消息: onChatMsg
                pomelo.on('onChatMsg', function(data) {
                    if (window.location.href.indexOf('live.html') == -1) {
                        emit(data)
                    }
                })

                //图文直接消息
                pomelo.on('onChannelMsg', function(data) {
                    console.log(data)
                    if (window.location.href.indexOf('live.html') === -1) {
                        addChangeMsg(data)
                    }
                })

                //实时用户禁言
                //uid: 被禁言用户id
                pomelo.on('onForbidden', function(data) {
                    //console.log(data);
                })
                //实时黑名单用户
                pomelo.on('onAddBlack', function(data) {
                    if (window.location.href.indexOf('live.html') == -1) {
                        pullBlack(data)
                    }
                })
                //实时解除黑名单用户
                pomelo.on('onRemoveBlack', function(data) {
                    if (window.location.href.indexOf('live.html') == -1) {
                        RemoveBlack(data)
                    }
                })
            }

            socketInit('106.75.73.67', '3014', '37664', '7375585539342078972')*/
        },
        loadHcList: function(isSroll) { //红彩列表
            let that = this
            let data = {
                matchid: that.hcmatchid,
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN,
                startkey: this.startkey,
                pgNum: this.pgNum,
                pageSize: this.pageSize,
            }
            if (this.startkey === 'end') return
            $loading.show()
            let data2 = {
                hcmatchid: that.hcmatchid,
                os: os,
                uid: recgid,
                qid: qid,
                domain: DOMAIN
            }
            if (isSroll) {
                _util_.makeJsonp(dfsportswap_lottery + 'wap/matchplan', data).done(function(data) {
                that.startkey = data.endkey
                that.pgNum++
                that.flag = true
                $loading.hide()
                let $fanganBox = $zhibo_body.find('.hc-fangan ul').eq(0)
                if (data.data.length) {
                    data.data.forEach(function(item) {
                        if (!item.schemeTitle) {
                            if (item.match_type[0].type === '让球') {
                                item.schemeTitle = '发布让球简介'
                            } else {
                                item.schemeTitle = '发布大小球简介'
                            }
                        }
                        let honghei = ''
                        if (item.honghei === '1') {
                            honghei = 'red'
                        } else if (item.honghei === '2') {
                            honghei = 'black'
                        } else if (item.honghei === '3') {
                            honghei = 'zou'
                        }
                        $fanganBox.append(`<li>
                <a href="http://msports.eastday.com/hc/fa/${item.htmlname}">
                <div class="line_1">
                    <div class="img"><img src="${item.expert.expertImg.replace('http:', 'https:')}" alt=""></div>
                    <div class="info">
                        <b>${item.expert.expertName}</b>
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
                <div class="line_4">
                    <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}发布</div>
                    ${item.status === '3' ? `<div class="end">已结束</div><div class="mark ${honghei}"></div>` : `<div class="yb">${item.price}元宝</div>`}
                </div>
                </a>
            </li>`)
                    })
                } else {
                    $fanganBox.append(`<li class="no-comment" style="text-align: center;border: 0;padding:0.3rem;">无数据...</li>`)
                    that.startkey = 'end'
                }
            })
            } else {
                $.when(_util_.makeJsonp(dfsportswap_lottery + 'wap/matchplan', data), _util_.makeJsonp(dfsportswap_lottery + 'media_forecast', data2)).done(function(data1, data2) {
                    that.startkey = data.endkey
                    that.pgNum++
                    that.flag = true
                    $loading.hide()
                    let tab = _util_.getUrlParam('tab')
                    if (!$('.hc-fangan').length) {
                        if (tab === 'fangan') {
                            $zhibo_body.append('<div class="zhibo-data-content hc-fangan" style=""></div>')
                        } else {
                            $zhibo_body.append('<div class="zhibo-data-content hc-fangan" style="display: none;"></div>')
                        }
                    }
                    let $fangan = $zhibo_body.find('.hc-fangan')

                    if (data1[0].data.length || data2[0].data.length) {
                        if (qid === 'dfsphcad' || qid === 'yqbandroid' || qid === 'dfsphcios' || qid === 'yqbios') {} else {
                            $fangan.append(`<a href="http://msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5dftiyu" suffix="btype=live_details&subtype=open_app_image&idx=0"><div class="down-box">
                                        <div class="row">
                                        <icon></icon>${Math.ceil(Math.random() * 5 + 1)}条赛事独家密料
                                        </div>
                                        <div class="con">
                                            <icon></icon>
                                            <p>打开App立即获取</p>
                                        </div>
                                        </div></a>`)
                        }
                    }
                    if (data1[0].data.length && data2[0].data.length) {
                        $fangan.append(`<div class="fangan-head"><a href="javascript:;" class="active" suffix="btype=live_details&subtype=expert_vip_forecast_btn&idx=0">专家vip方案</a><a href="javascript:;" suffix="btype=live_details&subtype=media_free_forecast_btn&idx=0">媒体免费预测</a></div>`)
                        $('.fangan-head a').click(function() {
                            let index = $(this).index()
                            $(this).parent().children().removeClass('active')
                            $(this).addClass('active')
                            $fangan.find('ul').hide()
                            $fangan.find('ul').eq(index).show()
                        })
                    }
                    $fangan.append(`<ul></ul><ul></ul>`)
                    let $fanganBox = $fangan.find('ul').eq(0)
                    let $fanganBox2 = $fangan.find('ul').eq(1)
                    data1[0].data.forEach(function(item) {
                            if (!item.schemeTitle) {
                                if (item.match_type[0].type === '让球') {
                                    item.schemeTitle = '发布让球简介'
                                } else {
                                    item.schemeTitle = '发布大小球简介'
                                }
                            }
                            let honghei = ''
                            if (item.honghei === '1') {
                                honghei = 'red'
                            } else if (item.honghei === '2') {
                                honghei = 'black'
                            } else if (item.honghei === '3') {
                                honghei = 'zou'
                            }
                            $fanganBox.append(`<li>
                <a href="http://msports.eastday.com/hc/fa/${item.htmlname}">
                <div class="line_1">
                    <div class="img"><img src="${item.expert.expertImg.replace('http:', 'https:')}" alt=""></div>
                    <div class="info">
                        <b>${item.expert.expertName}</b>
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
                <div class="line_4">
                    <div class="time">${_util_.getSpecialTimeStr(new Date(item.publishTime.replace(/-/g, '/')).getTime())}发布</div>
                    ${item.status === '3' ? `<div class="end">已结束</div><div class="mark ${honghei}"></div>` : `<div class="yb">${item.price}元宝</div>`}
                </div>
                </a>
            </li>`)
                        })
                    data2[0].data.forEach(function(item) {
                            $fanganBox2.append(`<li class="free">
    <div class="row clearfix">
    <div class="title">${item.recommend_title}</div>
    <div class="s">${item.recommend_people}</div>
</div>
<p>${item.content}</p>
</li>`)
                        })
                    if (!data1[0].data.length && !data2[0].data.length) {
                        $fanganBox.append(`<li class="no-comment" style="text-align: center;border: 0;padding:0.3rem;">无数据...</li>`)
                        that.startkey = 'end'
                    } else if (!data1[0].data.length && data2[0].data.length) {
                        $fanganBox2.show()
                    } else if (data1[0].data.length && !data2[0].data.length) {
                        $fanganBox.show()
                    } else {
                        $fanganBox.show()
                        $fanganBox2.hide()
                    }
                })
            }
        },
        popupApp() { //点击信件加载下载弹窗
            if (_util_.CookieUtil.get('hasDownloadBox') !== '1' && qid !== 'baiducom' && qid !== 'dfspiosnull' && qid !== 'dfspadnull' && qid !== 'qid10601' && qid !== 'dfttapp') {
                //let redirect = _util_.getUrlParam('redirect')
                let downHref = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5dftiyu`
                let downHref1 = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5dftiyu`
                /*if (redirect === 'app') {
                    downHref = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=touApp`
                } else if (redirect === 'dftth5') {
                    downHref = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=touH5`
                } else {
                    downHref = `//msports.eastday.com/downloadapp.html?qid=${qid}&pagefrom=livepage&from=H5zhitc`
                }*/
                $body.prepend(`<div class="download-box" id="downloadBox">
                            <a href="${downHref}"><div class="logo"></div>
                                <div class="info">
                                    <h3>观看高清流畅直播</h3>
                                    <p>下载东方体育App</p>
                                </div>
                                <a href="${downHref}" class="btn-down">去App</a>
                            <!--<div class="close"></div></a>-->
                        </div>`)
                //礼物按钮
                $body.append(`<a class="gift" href="${downHref1}"></a>`)
            }
            /*let $downloadBox = $('#downloadBox')
            $downloadBox.find('.close').click(function() {
                $downloadBox.hide()
                _util_.CookieUtil.set('hasDownloadBox', '1', 1) //保存一小时
            })*/
        },
        init: function() {
            this.queryMatchState() // 查询比赛状态
            this.onTextScroll() // 注册文字滚动事件
            //this.loadDetailDate() // 自动加统计数据
            this.switchTab() // 切换直播 数据 集锦录像 战报
            this.viewGif()//查看gif播放图
            this.popupApp()//查看gif播放图
        }
    }
    /* global _matchId_:true*/
    let datainit = new Loading(_matchId_)
        //返回顶部
    /*;(function() {
        $body.append(`<div id="goTop"> <div class="top"></div> <div class="back"><a href="${config.HOME_URL}?${`qid=${qid}`}"></a></div> </div>`)
        let $goTop = $('#goTop')
        $goTop.on('click', function() {
            $('html,body').scrollTop(0)
        })
        $(window).on('scroll', function() {
            //出现返回顶部按钮
            if (($(this).scrollTop()) / 100 > 0.9) {
                $goTop.show()
            } else {
                $goTop.hide()
            }
        })
    })()*/
    // 球员统计 阴影遮罩出现
    ;(function() {
        let $playerData = $playerSta.find('.player-data')
        $playerData.scroll(function() {
            if ($(this).scrollLeft() > 0) {
                $(this).prev().addClass('active')
            } else {
                $(this).prev().removeClass('active')
            }
        })
    })()
    //头条种隐藏录像集锦
    ;(() => {
        if (_util_.getUrlParam('redirect') === 'app') {
            $('#goTop').children('.back').hide()
        }
    })()
    //翱翔app
    if (qid === 'qid10459') {
        window.web_idleaf = 999167
        window.is_pinglun = '1'
        window.pl_yrl_onclick = "window.location='action://link_comment?titleurl='+encodeURIComponent('?zhuid=999167&page=1&type=1&yuantie=http://listen.021east.com/2018fwc/entry.html')+'&iscomment='+encodeURIComponent('1')+'&isshare='+encodeURIComponent('1')+'&enabled='+encodeURIComponent('1')+'';"
        window.share = function() {
            window.location = 'action://share?newsurl=' + encodeURIComponent('http://listen.021east.com/2018fwc/entry.html') + '&newsid=' + encodeURIComponent('999167') + '&newstitle=' + encodeURIComponent('东方体育带你激情世界杯') + '&imgurl1=' + encodeURIComponent('http://listen.021east.com/2018fwc/640_1136-2.png') + '&newsdescription=' + encodeURIComponent('东方体育带你激情世界杯') + ''
        }
    }
})
