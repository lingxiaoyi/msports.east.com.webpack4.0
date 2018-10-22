const JA_APP = function (plat) {
    let message
    if (plat) {
        message = function (obj) {
            obj.remainTime = new Date() / 1
            window.JSToNative.postMessage(JSON.stringify(obj))
        }
    } else if (window.webkit) {
        message = function (obj) {
            obj.remainTime = new Date() / 1000
            window.webkit.messageHandlers.JSToNative_iOS.postMessage(obj)
        }
    } else {
        message = function (obj) {
            let callback = window[obj.method] || window[obj.method.replace('get', 'set')]
            callback && callback(false)
        }
    }
    return {
        ClientInfo: function (callback) {
            window.setClientInfo = function (version, oem, qid, imei, machine, plantform, qidwithtime) {
                callback({
                    version: version,
                    oem: oem,
                    qid: qid,
                    imei: imei,
                    machine: machine,
                    plantform: plantform,
                    qidwithtime: qidwithtime
                })
            }
            message({method: 'getClientInfo'})
        },
        UserInfo: function (callback) {
            window.setUserInfo = function (accid, mobile, nick, image, bonus, money) {
                callback({
                    accid: accid,
                    mobile: mobile,
                    nick: nick,
                    image: image,
                    bonus: bonus,
                    money: money
                })
            }
            message({method: 'getUserInfo'})
        },
        LogParameter: function (callback) {
            window.getLogParameter = function (res) {
                if (typeof res === 'string') res = JSON.parse(res)
                callback(res)
            }
            message({method: 'getLogParameter'})
        },
        CallNativeShare: function (data) {
            data.method = 'CallNativeShare'
            message(data)
        },
        ToNewWebPage: function (data) {
            data.method = 'ToNewWebPage'
            message(data)
        },
        ToTaskcenter: function (data) {
            data.method = 'ToTaskcenter'
            message(data)
        },
        webLoadComplete: function (data) {
            data.method = 'webLoadComplete'
            message(data)
        },
        ToViewLogin: function (data) {
            window.webViewDidLoad = function () {
                location.reload()
            }
            data.method = 'goToViewLogin'
            message(data)
        },
        ToTypecode: function (data) {
            data.method = 'ToTypecode'
            message(data)
        },
        copyText: function (data) {
            data.method = 'copyText'
            message(data)
        },
        openH5Pay: function (data) {
            data.method = 'openH5Pay'
            message(data)
        },
        wxReferer: function (data) {
            data.method = 'wxReferer'
            message(data)
        },
        submitInviteCode: function (data, callback) {
            window.submitInviteCode = callback
            data.method = 'submitInviteCode'
            data.f = data.f || '113'
            // data.from = data.from || '75'
            if (!data.qid) {
                if (window.webkit) {
                    data.qid = 'iosyyz_hd11'
                } else {
                    data.qid = 'yyz_hd11'
                }
            }
            message(data)
        },
        openbyh5: function (data) {
            if (!plat) {
                this.ToNewWebPage(data)
                return false
            }
            let O = location.hostname.split('.')
            O.shift()
            data.wxReferer = location.protocol + '//' + O.join('.')
            data.method = 'openH5Pay'
            message(data)
        },
        qidObj: {
            yyz_hd1: 100075,
            yyz_hd1_zj: 100075,
            yyz_hd2: 101075,
            yyz_hd2_zk: 101075,
            yyz_hd3: 102075,
            yyz_hd3_zl: 102075,
            yxtg_cpa01: 103075,
            yxtg_cpa01_zm: 103075,
            yxtg_cpa02: 104075,
            yxtg_cpa02_zn: 104075,
            hcxzz_cpa01: 105075,
            hcxzz_cpa01_zo: 105075,
            hcxzz_cpa02: 106075,
            hcxzz_cpa02_zp: 106075,
            hcxzz_cpa03: 107075,
            hcxzz_cpa03_zq: 107075,
            worldcup: 107075,
        }
    }
}
module.exports = JA_APP(!!window.JSToNative)
