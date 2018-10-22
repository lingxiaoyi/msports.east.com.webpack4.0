import 'zepto/src/deferred'
import 'zepto/src/callbacks'

let util = {// 工具函数
    makeJson(url, data) {
        return $.ajax({
            type: 'POST',
            data: data,
            url: url,
            dataType: 'json',
        })
    },
    makeJsonp(url, data) {
        return $.ajax({
            type: 'POST',
            data: data,
            url: url,
            dataType: 'jsonp',
            jsonp: 'callback'
        })
    },
    makeJsonpCallbackOther(url, data) {
        return $.ajax({
            type: 'POST',
            data: data,
            url: url,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'callback'
        })
    },
    makeJsonpcallback(url, data) {
        return $.ajax({
            type: 'POST',
            data: data,
            url: url,
            dataType: 'jsonp',
            jsonp: 'jsonpcallback'
        })
    },
    makeGet(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'jsonp',
            jsonp: 'jsonpcallback'
        })
    },
    makeJsonAjax(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'json'
        })
    },
    makeJsonpAjax(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'jsonp'
        })
    },
    makecallback(url, data) {
        return $.ajax({
            type: 'GET',
            data: data,
            url: url,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'jsonpcallback'
        })
    },
    getUrlParam(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg) // 匹配目标参数
        if (r !== null) return decodeURI(r[2])
        return null // 返回参数值
    },
    getScript(url, callback, element) {
        let head = document.getElementsByTagName('head')[0]
        let js = document.createElement('script')

        js.setAttribute('type', 'text/javascript')
        js.setAttribute('src', url)
        if (element) {
            element.appendChild(js)
        } else {
            head.appendChild(js)
        }
        // 执行回调
        let callbackFn = function () {
            if (typeof callback === 'function') {
                callback()
            }
        }

        if (document.all) { // IE
            js.onreadystatechange = function () {
                if (js.readyState === 'loaded' || js.readyState === 'complete') {
                    callbackFn()
                }
            }
        } else {
            js.onload = function () {
                callbackFn()
            }
        }
    },
    dynamicScript(url, attribute, element) {
        let head = document.getElementsByTagName('head')[0]
        let js = document.createElement('script')
        js.setAttribute('type', 'text/javascript')
        js.setAttribute('src', url)
        js.setAttribute('smua', attribute)
        if (element) {
            element.appendChild(js)
        } else {
            head.appendChild(js)
        }
    },
    CookieUtil: {
        /**
         * 设置cookie
         * @param name 名称
         * @param value 值
         * @param expires 有效时间（单位：小时）（可选） 默认：空
         */
        set: function (name, value, expires, domain) {
            let expTimes = expires ? (Number(expires) * 60 * 60 * 1000) : '' // 毫秒(24 * 60 * 60 * 1000)
            let expDate = new Date()
            expDate.setTime(expDate.getTime() + expTimes)
            let expString = expires ? ' ;expires=' + expDate.toUTCString() : ''
            let pathString = ' ; path=/'
            domain = domain || ''
            let dm = '; domain=' + domain
            document.cookie = name + '=' + encodeURI(value) + expString + pathString + dm
        },
        /**
         * 读cookie
         * @param name
         */
        get: function (name) {
            let cookieStr = '; ' + document.cookie + '; '
            let index = cookieStr.indexOf('; ' + name + '=')
            if (index !== -1) {
                let s = cookieStr.substring(index + name.length + 3, cookieStr.length)
                return decodeURI(s.substring(0, s.indexOf('; ')))
            } else {
                return null
            }
        },
        /**
         * 删除cookie
         * @param name
         */
        del: function (name) {
            this.set(name, 'null', -1)
        }
    },
    isWeiXin() {
        let ua = window.navigator.userAgent
        if (ua.indexOf('MicroMessenger') > -1) {
            return true
        } else {
            return false
        }
    },
    computedWidth(arr, num) { // 计算宽度 用于计算导航栏下划线位置
        let width = 0
        for (let i = 0; i < Object.keys(arr).length; i++) {
            if (i >= num) {
                break
            } else {
                width += arr[Object.keys(arr)[i]]
            }
        }
        return width
    },
    getOsType() {
        let agent = navigator.userAgent.toLowerCase()
        let os_type = ''
        let version
        if (/android/i.test(navigator.userAgent)) {
            let index = agent.indexOf('android')
            version = agent.substr(index + 8, 3)
            os_type = 'Android ' + version
        }
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            let index = agent.indexOf('os')
            version = agent.substr(index + 3, 3)
            os_type = 'iOS ' + version
        }
        if (/Linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent) && !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            os_type = 'Linux'
        }
        if (/windows|win32/i.test(navigator.userAgent)) {
            os_type = 'windows32'
        }
        if (/windows|win64/i.test(navigator.userAgent)) {
            os_type = 'windows64'
        }
        return os_type
    },
    browserType() {
        let agent = navigator.userAgent.toLowerCase()
        let browser_type = ''
        if (agent.indexOf('msie') > 0) {
            browser_type = 'IE'
        }
        if (agent.indexOf('firefox') > 0) {
            browser_type = 'firefox'
        }
        if (agent.indexOf('chrome') > 0 && agent.indexOf('mb2345browser') < 0 && agent.indexOf('360 aphone browser') < 0) {
            browser_type = 'chrome'
        }
        if (agent.indexOf('360 aphone browser') > 0 || agent.indexOf('qhbrowser') > 0) {
            browser_type = '360'
        }
        if (agent.indexOf('ucbrowser') > 0) {
            browser_type = 'UC'
        }
        if (agent.indexOf('micromessenger') > 0) {
            browser_type = 'WeChat'
        }
        if ((agent.indexOf('mqqbrowser') > 0 || agent.indexOf('qq') > 0) && agent.indexOf('micromessenger') < 0) {
            browser_type = 'QQ'
        }
        if (agent.indexOf('miuibrowser') > 0) {
            browser_type = 'MIUI'
        }
        if (agent.indexOf('mb2345browser') > 0) {
            browser_type = '2345'
        }
        if (agent.indexOf('sogoumobilebrowser') > 0) {
            browser_type = 'sogou'
        }
        if (agent.indexOf('liebaofast') > 0) {
            browser_type = 'liebao'
        }
        if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0 && agent.indexOf('ucbrowser') < 0 && agent.indexOf('micromessenger') < 0 && agent.indexOf('mqqbrowser') < 0 && agent.indexOf('miuibrowser') < 0 && agent.indexOf('mb2345browser') < 0 && agent.indexOf('sogoumobilebrowser') < 0 && agent.indexOf('liebaofast') < 0 && agent.indexOf('qhbrowser') < 0) {
            browser_type = 'safari'
        }
        return browser_type
    },
    getReferrer() {
        /**
         * Javascript获取页面来源(referer)
         * @from http://www.au92.com/archives/javascript-get-referer.html
         * @return {[type]} [description]
         */
        let referrer = ''
        try {
            referrer = window.top.document.referrer
        } catch (e) {
            if (window.parent) {
                try {
                    referrer = window.parent.document.referrer
                } catch (e2) {
                    referrer = ''
                }
            }
        }
        if (referrer === '') {
            referrer = document.referrer
        }
        return referrer
    },
    getPageQid() {
        let qid = util.getUrlParam('qid')
        let specialChannel
        if (qid) {
            util.CookieUtil.set('tyh5qid', qid)
        } else {
            // 通过搜索引擎进入的（渠道处理）
            specialChannel = [
                {
                    referer: 'baidu.com',
                    qid: 'baiducom'
                },
                {
                    referer: 'baiducontent.com',
                    qid: 'baiducom'
                },
                {referer: 'so.com', qid: '360so'},
                /*{referer: 'sogou.com', qid: 'sogoucom'},
                {referer: 'sm.cn', qid: 'smcn'},
                {referer: 'm.tq1.uodoo.com', qid: 'smcn'} */
            ]
            for (let i = 0; i < specialChannel.length; i++) {
                if (util.getReferrer() && util.getReferrer().indexOf(specialChannel[i].referer) !== -1) {
                    util.CookieUtil.set('tyh5qid', specialChannel[i].qid)// 这个值为baiducom
                    break
                }
            }
        }
        qid = util.CookieUtil.get('tyh5qid')
        if (!qid) {
            qid = 'null'
        }
        let agent = navigator.userAgent.toLowerCase()
        let url = window.location.href
        if (agent.indexOf('dftyandroid') >= 0) {
            if (url.indexOf('/hc/') >= 0) {
                qid = 'dfsphcad'
            } else {
                qid = 'dfspadnull'
            }
        } else if (agent.indexOf('dftyios') >= 0) {
            if (url.indexOf('/hc/') >= 0) {
                qid = 'dfsphcios'
            } else {
                qid = 'dfspiosnull'
            }
        } else if (agent.indexOf('yqbios') >= 0) {
            if (url.indexOf('/hc/') >= 0) {
                qid = 'yqbios'
            } else {
                qid = 'dfspiosnull'
            }
        } else if (agent.indexOf('yqbandroid') >= 0) {
            if (url.indexOf('/hc/') >= 0) {
                qid = 'yqbandroid'
            } else {
                qid = 'dfspadnull'
            }
        }
        return qid
    },
    getUid() {
        let uid = util.CookieUtil.get('user_id')
        if (!uid) {
            uid = (+new Date()) + Math.random().toString(10).substring(2, 6)
            util.CookieUtil.set('user_id', uid, 365, 'eastday.com')
        }
        return uid
    },
    formatTimeToMatch(currentServerTime, startTime) {
        let timestamp = Date.parse(startTime.replace(/-/g, '/'))
        let date = new Date(timestamp).format('MM月dd日')
        let time = startTime.substring(11)
        let todayTime = new Date(new Date(currentServerTime / 1).format('yyyy/MM/dd')).getTime()//今天12点的时间戳大小
        let chazhi = (new Date(timestamp).getTime() - todayTime) / (24 * 60 * 60 * 1000)
        if (chazhi >= 0 && chazhi < 1) {
            return time + '开始'
        } else if (chazhi >= 1 && chazhi < 2) {
            return '明天' + time
        } else if (chazhi >= 2 && chazhi < 3) {
            return '后天' + time
        } else {
            return date
        }
    },
    formatDuring(mss) {
        /*let days = parseInt(mss / (1000 * 60 * 60 * 24))
        let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))*/
        let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
        let seconds = parseInt((mss % (1000 * 60)) / 1000)
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        return minutes + ':' + seconds
    },
    formatDateToWeek(date) {
        let weekDay = [
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六'
        ]
        return date.format('MM-dd') + ' ' + weekDay[date.getDay()]
    },
    getSpecialTimeStr(str) {
        function timeToString(t, splitStr) {
            return dateToString(timeToDate(t), splitStr)
        }

        function timeToDate(t) {
            return new Date(t)
        }

        function dateToString(d, splitStr) {
            let month = (d.getMonth() + 1).toString()
            let day = d.getDate().toString()
            let h = d.getHours().toString()
            let m = d.getMinutes().toString()
            month = month.length > 1 ? month : ('0' + month)
            day = day.length > 1 ? day : ('0' + day)
            h = h.length > 1 ? h : ('0' + h)
            m = m.length > 1 ? m : ('0' + m)
            // let str = year + '-' + month + '-' + day + ' ' + h + ':' + m; // yyyy-MM-dd HH:mm
            let str = month + '-' + day + ' ' + h + ':' + m // MM-dd HH:mm
            if (splitStr) {
                str = str.replace(/-/g, splitStr)
            }
            return str
        }

        let targetTime = str / 1
        if (!targetTime) {
            return false
        }
        let currentTime = new Date().getTime()
        let tdoa = Number(currentTime - targetTime)
        let dayTime = 24 * 60 * 60 * 1000 // 1天
        let hourTime = 60 * 60 * 1000 // 1小时
        let minuteTime = 60 * 1000 // 1分钟

        if (tdoa >= dayTime) { // 天
            let h = tdoa / dayTime
            if (h > 2) {
                return timeToString(targetTime)
            } else if (h > 1) {
                return '前天'
            } else {
                return '昨天'
            }
        } else if (tdoa >= hourTime) { // 小时
            return Math.floor(tdoa / hourTime) + '小时前'
        } else if (tdoa >= minuteTime) {
            return Math.floor(tdoa / minuteTime) + '分钟前'
        } else {
            return '最新'
            // return Math.floor(tdoa / 1000) + '秒前';
        }
    },
    getpgtype() {
        if ($('#livebox').length) { //文字直播
            return 1
        } else if ($('#J_article').length) { //新闻
            return 0
        } else { //其他
            return 2
        }
    },
    getSuffixParam(str) {
        if (!str) return {}
        str = str.split('&')
        let obj = {}
        for (let v of str) {
            let s = v.split('=')
            obj[s[0]] = s[1]
        }
        return obj
    },
    unique(arr) { //数组去重
        let res = []
        let json = {}
        for (let i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i])
                json[arr[i]] = 1
            }
        }
        return res
    },
    isDateBetween(startDateString, endDateString) {
        let timestamp = new Date().getTime()
        if (timestamp - new Date(startDateString).getTime() >= 0 && (new Date(endDateString).getTime() - timestamp >= 0)) {
            return true
        } else {
            return false
        }
    },
    time_range(beginTime, endTime) {
        var strb = beginTime.split(':')
        if (strb.length !== 2) {
            return false
        }

        var stre = endTime.split(':')
        if (stre.length !== 2) {
            return false
        }

        var b = new Date()
        var e = new Date()
        var n = new Date()

        b.setHours(strb[0])
        b.setMinutes(strb[1])
        e.setHours(stre[0])
        e.setMinutes(stre[1])

        if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
            return true
        } else {
            return false
        }
    },
}

module.exports = util
