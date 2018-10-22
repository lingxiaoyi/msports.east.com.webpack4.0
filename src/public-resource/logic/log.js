import config from 'configModule'
import _util_ from '../libs/libs.util'
import JS_APP from 'public/libs/JC.JS_APP'
$(() => {
    let {RZAPI} = config.API_URL
    let $body = $('body')
    let soft_type = 'dongfangtiyu'
    let soft_name = 'DFTYH5'
    let u_id = _util_.getUid()//访客uid
    let qid = _util_.getPageQid()//访客uid
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfspadnull'
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfspiosnull'
    }
    let OSType = _util_.getOsType()//操作系统
    let browserType = _util_.browserType()//浏览器
    //let _vbb = 'null'//版本号
    let remark = 'null'//备注信息
    let idx = 'null'//新闻链接位置
    let btype = 'null'//大类
    let subtype = 'null'//子类
    let newstype = 'null'//新闻类别
    //let pageNo = 'null'//页数
    //let appqid = 'null'//App渠道号url上追加的appqid
    let ttloginid = 'null'//App端分享新闻时url上追加的ttloginid
    let apptypeid = 'null'//App端的软件类别url上追加的apptypeid
    //let appver = 'null'// App版本（010209）url上追加的appver
    let ttaccid = 'null'//App端分享新闻时url上追加的ttaccid
    let from = _util_.getUrlParam('from') || _util_.getUrlParam('fr') || _util_.getReferrer()//浏览器
    let pixel = window.screen.width + '*' + window.screen.height//客户端分辨率
    let pgtype = _util_.getUrlParam('pgtype') || 'null'//页面栏目tuijian NBA
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let to = ''//转向的url
    let intervaltime = 10 //间隔多久上传一次数据 当前为10s
    class Log {
        constructor() {
            this.init()
        }

        init() {
            this.loadActiveApi()
            this.loadOnlineApi()
            this.loadClickApi()
        }

        loadActiveApi() {
            /*let param = '?qid=' + qid + '&uid=' + u_id + '&from=' + from + '&to=' + locationUrl + '&type=' + btype + '&subtype=' + subtype + '&idx=' + idx + '&remark=' + remark + '&os=' + OSType + '&browser=' + browserType + '&softtype=' + soft_type + '&softname=' + soft_name + '&newstype=' + newstype + '&pixel=' + pixel + '&ver=' + _vbb + '&appqid=' + appqid + '&ttloginid=' + ttloginid + '&apptypeid=' + apptypeid + '&appver=' + appver + '&pgnum=' + pageNo + '&pgtype=' + pgtype*/
            let data = {
                qid: qid,
                uid: u_id,
                from: from,
                to: locationUrl,
                type: btype,
                subtype: subtype,
                idx: idx,
                remark: remark,
                os: OSType,
                browser: browserType,
                softtype: soft_type,
                softname: soft_name,
                newstype: newstype,
                pixel: pixel,
                ver: 'null',
                appqid: 'null',
                ttloginid: 'null',
                apptypeid: 'null',
                appver: 'null',
                pgnum: 1, //没有做分页
                pgtype: pgtype
            }
            _util_.makeJsonp(RZAPI.active, data)
        }

        loadOnlineApi() {
            /*let param = '?qid=' + qid + '&uid=' + u_id + '&url=' + locationUrl + '&apptypeid=' + apptypeid + '&loginid=' + ttaccid + '&loginid=' + ttaccid + '&type=' + btype + '&subtype=' + subtype + '&intervaltime=' + intervaltime + '&ver=' + _vbb + '&os=' + OSType + '&appqid=' + appqid + '&ttloginid=' + ttloginid + '&pgtype=' + pgtype*/
            let data = {
                qid: qid,
                uid: u_id,
                url: locationUrl,
                apptypeid: apptypeid,
                loginid: ttaccid,
                type: btype,
                subtype: subtype,
                intervaltime: intervaltime,
                ver: 'null',
                os: OSType,
                appqid: 'null',
                ttloginid: ttloginid,
                pgtype: pgtype
            }
            //10秒定时去请求传online数据
            setInterval(function() {
                _util_.makeJsonp(RZAPI.online, data)
            }, intervaltime * 1000)
        }

        loadClickApi() {
            //a suffix 新闻点击日志
            $body.on('click', 'a[suffix]', function() {
                let suffix = $(this).attr('suffix')
                if (!suffix) {
                    to = $(this).attr('href')
                    idx = $(this).index()
                } else if (suffix.indexOf('top') >= 0) {
                    from = $(this).attr('suffix')
                    to = $(this).attr('href')
                } else {
                    from = $(this).attr('suffix')
                    idx = $(this).parent().index()
                    to = $(this).attr('href')
                }
                to = $(this).attr('href')
                idx = $(this).index()
                //带live的链接不放入阅读历史记录里
                if (to.indexOf('live') === -1) {
                    let urlNum = to.substring(to.lastIndexOf('/') + 1, to.indexOf('.html'))
                    let indexType = _util_.getSuffixParam(to.split('?')[1]).dataType
                    let singleHistoryUrlArr = _util_.CookieUtil.get(`historyUrlArr${indexType}`)
                    //单独栏目的阅读历史记录
                    if (!singleHistoryUrlArr) {
                        singleHistoryUrlArr = []
                    } else {
                        singleHistoryUrlArr = singleHistoryUrlArr.split(',')
                    }
                    if (singleHistoryUrlArr.length >= 3) {
                        singleHistoryUrlArr.shift()
                    }
                    singleHistoryUrlArr.push(urlNum)
                    singleHistoryUrlArr = _util_.unique(singleHistoryUrlArr)
                    singleHistoryUrlArr = singleHistoryUrlArr.join(',')
                    _util_.CookieUtil.set(`historyUrlArr${indexType}`, singleHistoryUrlArr)
                }
                let data = {
                    qid: qid,
                    uid: u_id,
                    from: from,
                    to: to,
                    type: btype,
                    subtype: subtype,
                    idx: idx,
                    remark: remark,
                    os: OSType,
                    browser: browserType,
                    softtype: soft_type,
                    softname: soft_name,
                    newstype: newstype,
                    pixel: pixel,
                    ver: 'null',
                    appqid: 'null',
                    ttloginid: 'null',
                    apptypeid: 'null',
                    appver: 'null',
                    pgnum: 1, //没有做分页
                    pgtype: pgtype
                }
                _util_.makeJsonp(RZAPI.onclick, data).done(function(a) {})
            })
            //首页导航条 轮播图 比赛推荐 置顶新闻 查看全部热门比赛 点击日志
            if ($('#mainSection').length) {
                let $headNav = $('#headNav')
                let $headNavLi = $headNav.find('.nav-new ul li')
                $headNavLi.click(function() {
                    to = $(this).attr('data-type')
                    if (from === to) return
                    let data = {
                        qid: qid,
                        uid: u_id,
                        from: from,
                        to: to,
                        type: btype,
                        subtype: subtype,
                        idx: idx,
                        remark: remark,
                        os: OSType,
                        browser: browserType,
                        softtype: soft_type,
                        softname: soft_name,
                        newstype: newstype,
                        pixel: pixel,
                        ver: 'null',
                        appqid: 'null',
                        ttloginid: 'null',
                        apptypeid: 'null',
                        appver: 'null',
                        pgnum: 1, //没有做分页
                        pgtype: pgtype
                    }
                    _util_.makeJsonp(RZAPI.onclick, data)
                    //active 日志
                    let data1 = {
                        qid: qid,
                        uid: u_id,
                        from: from,
                        to: to,
                        type: btype,
                        subtype: subtype,
                        idx: idx,
                        remark: remark,
                        os: OSType,
                        browser: browserType,
                        softtype: soft_type,
                        softname: soft_name,
                        newstype: newstype,
                        pixel: pixel,
                        ver: 'null',
                        appqid: 'null',
                        ttloginid: 'null',
                        apptypeid: 'null',
                        appver: 'null',
                        pgnum: 1, //没有做分页
                        pgtype: pgtype
                    }
                    _util_.makeJsonp(RZAPI.active, data1)
                    from = to
                })
            }
            //dsp广告日志
            $body.on('click', 'a[clickbackurl]', reportLog)

            function reportLog() {
                let clickbackurl = $(this).attr('clickbackurl')
                $body.append('<img src="' + clickbackurl + '" />')
            }
        }
    }

    new Log()
})
