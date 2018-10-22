import config from 'configModule'
import _util_ from '../libs/libs.util'
$(() => {
    let {RZAPI} = config.API_URL
    let $body = $('body')
    let soft_type = _util_.getUrlParam('softtype') || 'dongfangtiyu'
    let soft_name = _util_.getUrlParam('softname') || 'DFTYH5'
    let ttloginid = _util_.getUrlParam('ttloginid') || 'null'
    let $J_hot_news = $('#J_hot_news')
    let qid = _util_.getPageQid()//访客qid
    let agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('dftyandroid') >= 0) {
        qid = 'dfspadnull'
    } else if (agent.indexOf('dftyios') >= 0) {
        qid = 'dfspiosnull'
    }
    let uid = _util_.getUid()//访客uid
    let OSType = _util_.getOsType()//操作系统
    let browserType = _util_.browserType()//浏览器
    let refer = _util_.getReferrer()//浏览器
    let pixel = window.screen.width + '*' + window.screen.height//客户端分辨率
    let pgtype = _util_.getUrlParam('pgtype') || 'null'//页面栏目tuijian NBA
    let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let fromUrl = _util_.getUrlParam('fr') || _util_.getUrlParam('from') || document.referrer//来源url
    let iszhiding = _util_.getUrlParam('from') && _util_.getUrlParam('from').indexOf('top') >= 0 ? '1' : 'null'
    let toUrl = ''//转向的url
    let idx = _util_.getUrlParam('idx') || 'null'
    let ishot = _util_.getUrlParam('ishot') || 'null'
    let recommendtype = _util_.getUrlParam('recommendtype') || 'null'
    let pgnum = _util_.getUrlParam('pgnum') || '1'
    let intervaltime = 10 //间隔多久上传一次数据（当前为10s）
    let ggid = 'shuangshiyi_dongfangtiyu_h5_20171020'
    let ime = _util_.getUrlParam('ime') || 'null'
    let position = _util_.getUrlParam('position') || 'null'
    let appqid = _util_.getUrlParam('appqid') || 'null'
    let apptypeid = _util_.getUrlParam('apptypeid') || 'null'
    let ver = _util_.getUrlParam('ver') || 'null'
    let appver = _util_.getUrlParam('appver') || 'null'
    let deviceid = _util_.getUrlParam('deviceid') || 'null'
    qid = (locationUrl.indexOf('/bdmip/') >= 0 ? 'xiongzhanghao' : qid)
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
            /* global _yiji_:true _erji_:true _newstype_:true _ttsanji_:true _tterji_:true _ttyiji_:true*/
            let data = {
                qid: qid,
                uid: uid,
                from: fromUrl,
                to: locationUrl,
                type: _yiji_,
                subtype: _erji_,
                idx: idx,
                remark: 'null',
                os: OSType,
                browser: browserType,
                softtype: soft_type,
                softname: soft_name,
                newstype: _newstype_,
                ver: ver,
                pixel: pixel,
                refer: refer,
                appqid: appqid,
                ttloginid: ttloginid,
                apptypeid: apptypeid,
                appver: appver,
                pgnum: pgnum, //没有做分页
                pgtype: pgtype,
                ime: ime,
                ishot: ishot,
                recommendtype: recommendtype,
                iszhiding: iszhiding,
                ttyiji: typeof _ttyiji_ === 'undefined' ? 'null' : _ttyiji_,
                tterji: typeof _tterji_ === 'undefined' ? 'null' : _tterji_,
                ttsanji: typeof _ttsanji_ === 'undefined' ? 'null' : _ttsanji_,
                position: position,
                deviceid: deviceid
            }
            _util_.makeJsonp(RZAPI.active, data)
            /*if (!$('#baiduhao').length && (qid === 'null' || qid === 'baiducom') && !_util_.CookieUtil.get('hideRedPack')) {
                let data = {
                    platform: 'H5',
                    softtype: soft_type,
                    softname: soft_name,
                    qid: qid,
                    uid: uid,
                    ime: 'null',
                    os: OSType,
                    browser: browserType,
                    pixel: pixel,
                    appqid: 'null',
                    apptypeid: 'null',
                    ver: 'null',
                    ttaccid: 'null',
                    appver: 'null',
                    deviceid: 'null',
                    position: 'null',
                    iswifi: 'null',
                    ggid: ggid,
                    newsurl: locationUrl,
                    ggurl: config.ggUrl.TBURL
                }
                _util_.makeJsonpcallback(config.API_URL.MOPADS.show, data)
            }*/
        }

        loadOnlineApi() {
            let data = {
                url: locationUrl,
                qid: qid,
                uid: uid,
                apptypeid: apptypeid,
                loginid: 'null',
                type: _yiji_,
                subtype: _erji_,
                intervaltime: intervaltime,
                ver: ver,
                os: OSType,
                appqid: appqid,
                ttloginid: ttloginid,
                pgtype: pgtype,
                ime: ime,
                newstype: _newstype_
            }
            //10秒定时去请求传online数据
            setInterval(function() {
                _util_.makeJsonp(RZAPI.online, data)
            }, intervaltime * 1000)
        }

        loadClickApi() {
            $J_hot_news.on('click', '.hn-list a', function() {
                toUrl = $(this).attr('href')
                let {idx = 'null', ishot = 'null', recommendtype = 'null'} = _util_.getSuffixParam($(this).attr('href').split('?')[1])
                idx = $(this).index()
                let data = {
                    qid: qid,
                    uid: uid,
                    from: locationUrl,
                    to: toUrl,
                    type: _yiji_,
                    subtype: _erji_,
                    idx: idx,
                    remark: 'null',
                    os: OSType,
                    browser: browserType,
                    softtype: soft_type,
                    softname: soft_name,
                    newstype: _newstype_,
                    ver: ver,
                    pixel: pixel,
                    refer: refer,
                    appqid: appqid,
                    ttloginid: ttloginid,
                    apptypeid: apptypeid,
                    appver: appver,
                    pgnum: pgnum, //没有做分页
                    ime: ime,
                    ishot: ishot,
                    recommendtype: recommendtype,
                    deviceid: deviceid
                }
                _util_.makeJsonp(RZAPI.onclick, data)
            })
            $body.on('click', 'a[clickbackurl]', reportLog)
            $body.on('click', '#icon-pack', function() {
                let data1 = {
                    platform: 'H5',
                    softtype: soft_type,
                    softname: soft_name,
                    qid: qid,
                    uid: uid,
                    ime: 'null',
                    os: OSType,
                    browser: browserType,
                    pixel: pixel,
                    appqid: 'null',
                    apptypeid: 'null',
                    ver: 'null',
                    ttaccid: 'null',
                    appver: 'null',
                    deviceid: 'null',
                    position: 'null',
                    iswifi: 'null',
                    ggid: ggid,
                    newsurl: locationUrl,
                    ggurl: config.ggUrl.TBURL,
                }
                _util_.makeJsonpcallback(config.API_URL.MOPADS.click, data1)
            })
            function reportLog() {
                let clickbackurl = $(this).attr('clickbackurl')
                $body.append('<img src="' + clickbackurl + '" />')
            }
        }
    }
    new Log()
})
