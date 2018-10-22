import './style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../public-resource/libs/libs.util'
import _AD_ from '../../public-resource/libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST, VIDEO_LOG, RZAPI} = config.API_URL
    let logUrl = RZAPI.active
    let onlineUrl = RZAPI.online
    let videoUrl = HOST + 'detailvideo'
    let version = '1.0.1' //内页版本号  用来区分版本上线
    console.log(version)
    let $ggCloseVideo = null
    let $ggVideo = null
    let $loading = null
    let $videoBox = $('.video-box')
    let $video = $('#J_video')
    let $J_play_btn = $('#J_play_btn')
    let $listWrap = $('<div class="related-cnt"></div>')
    //let $commend = $('#J_commend')
    let bufferedNum = 0
    let onlineHz = 10 // 在线日志记录频率(单位：秒；10s一次)
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    $('header').hide()
    let Base64 = {

        // private property
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        // public method for encoding
        encode: function(input) {
            let output = ''
            let chr1,
                chr2,
                chr3,
                enc1,
                enc2,
                enc3,
                enc4
            let i = 0

            input = Base64._utf8_encode(input)

            while (i < input.length) {
                chr1 = input.charCodeAt(i++)
                chr2 = input.charCodeAt(i++)
                chr3 = input.charCodeAt(i++)

                enc1 = chr1 >> 2
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
                enc4 = chr3 & 63

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64
                } else if (isNaN(chr3)) {
                    enc4 = 64
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
            }

            return output
        },

        // public method for decoding
        decode: function(input) {
            let output = ''
            let chr1,
                chr2,
                chr3
            let enc1,
                enc2,
                enc3,
                enc4
            let i = 0

            input = input.replace(/[^A-Za-z0-9+/=]/g, '')

            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++))
                enc2 = this._keyStr.indexOf(input.charAt(i++))
                enc3 = this._keyStr.indexOf(input.charAt(i++))
                enc4 = this._keyStr.indexOf(input.charAt(i++))

                chr1 = (enc1 << 2) | (enc2 >> 4)
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
                chr3 = ((enc3 & 3) << 6) | enc4

                output = output + String.fromCharCode(chr1)

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2)
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3)
                }
            }

            output = Base64._utf8_decode(output)

            return output
        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, '\n')
            let utftext = ''

            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n)

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
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            let string = ''
            let i = 0
            let c = 0
            let c2 = 0
            let c3 = 0
            while (i < utftext.length) {
                c = utftext.charCodeAt(i)

                if (c < 128) {
                    string += String.fromCharCode(c)
                    i++
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1)
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1)
                    c3 = utftext.charCodeAt(i + 2)
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                    i += 3
                }
            }

            return string
        }

    }
    let rootVideo = $video.attr('src')
    let advVideo = decodeURIComponent(_util_.getUrlParam('advVideo'))
    let advJump = decodeURIComponent(_util_.getUrlParam('advJump'))
    let showNetTip = _util_.getUrlParam('showNetTip')
    let videoState = 0 //1为广告   0为正常视频
    let canJump = false // 可以跳
    if (showNetTip === '1') {
        $videoBox.prepend(`<div class="tips">您正在使用移动网络播放，继续播放将产生流量费用,点击继续播放再放</div>`)
    }
    function Video() {
        this.qid = qid
        this.userId = _util_.getUid()
        this.browserType = _util_.browserType()
        this.os = _util_.getOsType()
        this.pgnum = 1
        this.pullUpFinished = true
        this.index = 4 //广告id
        this._detailsGg_ = _AD_.detailList[qid].concat(_AD_.detailNoChannel)
        this.init()
    }
    Video.prototype.init = function() {
        let scope = this
        //先播放广告
        if (advVideo && advVideo !== 'null') {
            $video.attr('src', advVideo)
            $video[0].controls = false
            videoState = 1
            //let $iframe = $(window.parent.document).find('#iframe')
            //$video.width($iframe[0].clientWidth)
            //$video.height($iframe[0].clientHeight)
            //$video[0].play()
        }
        /* 视频事件监听 */
        try {
            scope.addVideoListener()
        } catch (e) {
            console.error('_addOnlineLog has error!', e)
        }
        /* 日志信息 */
        try {
            // 发送日志信息
            scope._addLog()
            // 在线日志
            scope._addOnlineLog()
            setInterval(function() {
                scope._addOnlineLog()
            }, onlineHz * 1000)
        } catch (e) {
            console.error('_addOnlineLog has error!', e)
        }

        $J_play_btn.on('click', function() {
            if ($(this).hasClass('pause')) {
                //$video.attr('src', advVideo)
                //$video[0].controls = true
                $video[0].play()
                $(this).removeClass('pause')
                canJump = false
                $videoBox.find('.tips').remove()
            } else {
                $(this).addClass('pause')
                $video[0].pause()
                canJump = true
            }
        })
        //$video[0].controls = false
    }
    /**
     * 发送视频操作日志
     * @param  {String} param 必需 - 参数(qid,uid,os,browserType,url,duration,playingTime,currentTime,action)
     */
    Video.prototype.sendVideoLog = function(param) {
        if (!param) {
            return
        }
        $.ajax({
            url: VIDEO_LOG,
            data: {
                param: Base64.encode(param)
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function() {},
            error: function() {}
        })
    }

    Video.prototype.showLoading = function() {
        $loading = $('<div class="video-loading"><div class="img"></div><div class="ball-beat"><div></div> <div></div> <div></div></div></div>')
        $loading.appendTo($video.parents('.video-wrap'))
    }

    Video.prototype.removeLoading = function() {
        $loading && $loading.remove()
    }

    Video.prototype.play = function() {
        let scope = this
        let end = scope.getEnd()
        let video = $video[0]
        if (bufferedNum >= 3 && end <= 0.01) {
            video.play()
            bufferedNum = 0
            scope.removeLoading()
        } else if (end <= 5) {
            if (!$loading) {
                scope.showLoading()
            }
            setTimeout(function() {
                scope.play()
                bufferedNum++
            }, 1000)
        } else {
            scope.removeLoading()
            video.play()
        }
    }

    Video.prototype.getEnd = function() {
        let video = $video[0]
        let end = 0
        try {
            end = video.buffered.end(0) || 0
            end = parseInt(end * 1000 + 1, 10) / 1000
        } catch (e) {}
        return end
    }

    /**
     * video事件监听
     * @return {[type]}        [description]
     */
    Video.prototype.addVideoListener = function() {
        let scope = this
        //视频iframe加载完成
        $video.one('canplay', function() {
            if (videoState) {
                /*if (window.parent.onIframeLoad) {
                    window.parent.onIframeLoad()
                }*/
                var dataJson = {
                    event: 'onIframeLoad',
                    data: ''
                }
                window.parent.postMessage(JSON.stringify(dataJson), '*')
            }
        })
        //开始播放
        $video.one('play', function() {
            scope.showLoading()
            let timer = setInterval(function() {
                let video = $video[0]
                // 当播放了100ms之后再移除loading动画，否则显示loading动画
                if (Math.floor(video.currentTime * 1000) < 100) {
                    return
                }
                scope.removeLoading()
                clearInterval(timer)
            }, 200)
            if (videoState) {
                //$video.before(`<a href="${advJump}" target="_blank"></a>`)
                /*if (window.parent.onAdvStart) {
                    window.parent.onAdvStart()
                }*/
                var dataJson = {
                    event: 'onAdvStart',
                    data: ''
                }
                try {
                    window.parent.postMessage(JSON.stringify(dataJson), '*')
                } catch (e) {
                    console.log(e)
                }

                $video[0].controls = false
                //点击广告
                $J_play_btn.on('click', function() {
                    if (videoState && canJump && advJump !== 'null') {
                        let dataJson = {
                            event: 'onAdvClick',
                            data: ''
                        }
                        try {
                            window.parent.postMessage(JSON.stringify(dataJson), '*')
                        } catch (e) {
                            console.log(e)
                        }
                        //window.parent.open(advJump)
                        console.log(advJump)
                        /*if (window.parent.onAdvClick) {
                            window.parent.onAdvClick()
                        }*/
                    }
                })
            } else {
                $video[0].controls = true
                let dataJson = {
                    event: 'onVideoStart',
                    data: ''
                }
                window.parent.postMessage(JSON.stringify(dataJson), '*')
            }
        })

        // 播放事件
        $video.on('playing', function(event) {
            try {
                let $vd = $(event.target)
                let video = $vd[0]
                let src = video.currentSrc
                let duration = video.duration ? Math.floor(video.duration * 1000) : $vd.attr('data-duration')
                let idx = $vd.attr('data-idx')
                let videoType = $vd.attr('data-type')
                let playingTime = $vd.attr('data-playingTime') ? $vd.attr('data-playingTime') : 'null'
                let currentTime = Math.floor(video.currentTime * 1000) // 当前播放时间位置
                let locationUrl = 'http://' + window.location.host + window.location.pathname //当前url
                let param = scope.qid + '\t' + scope.userId + '\t' + 'dongfangtiyu' + '\t' + 'DFTYH5' + '\t' + 'null' + '\t' + videoType + '\t' + scope.os + '\t' + (idx || 'null') + '\t' + scope.browserType + '\t' + src + '\t' + duration + '\t' + playingTime + '\t' + currentTime + '\t' + 'play' + '\t' + 'detailpg' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + locationUrl
                // 用于记录实际播放时长（很重要）利用了先触发start再触发timeupdate的这个规则来更新开始计时时间.
                $vd.attr('data-updateTime', +new Date())
                scope.sendVideoLog(param)
            } catch (e) {
                console.error('Event playing has error!!!', e)
            }
        })
        // 暂停事件
        $video.on('pause', function(event) {
            try {
                let $vd = $(event.target)
                let video = $vd[0]
                let src = video.currentSrc
                let duration = video.duration ? Math.floor(video.duration * 1000) : $vd.attr('data-duration')
                let idx = $vd.attr('data-idx')
                let videoType = $vd.attr('data-type')
                let playingTime = $vd.attr('data-playingTime') ? $vd.attr('data-playingTime') : 'null'
                let currentTime = Math.floor(video.currentTime * 1000) // 当前播放时间位置
                let locationUrl = 'http://' + window.location.host + window.location.pathname //当前url
                let param = scope.qid + '\t' + scope.userId + '\t' + 'dongfangtiyu' + '\t' + 'DFTYH5' + '\t' + 'null' + '\t' + videoType + '\t' + scope.os + '\t' + (idx || 'null') + '\t' + scope.browserType + '\t' + src + '\t' + duration + '\t' + playingTime + '\t' + currentTime + '\t' + 'pause' + '\t' + 'detailpg' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + 'null' + '\t' + locationUrl
                scope.sendVideoLog(param)
            } catch (e) {
                console.error('Event pause has error!!!', e)
            }
        })
        // 播放时间更新事件（记录实际播放时间）
        $video.on('timeupdate', function(event) {
            try {
                let $vd = $(event.target)
                let updateTime = parseInt($vd.attr('data-updateTime'), 10) || (+new Date())
                let playingTime = parseInt($vd.attr('data-playingTime'), 10) || 0
                let now = +new Date()
                // 播放时间
                playingTime = playingTime + now - updateTime
                $vd.attr('data-playingTime', playingTime)
                $vd.attr('data-updateTime', now)
            } catch (e) {
                console.error('Event timeupdate has error!!!', e)
            }
        })
        //视频iframe加载完成

        //播放结束
        $video.on('ended', function(event) {
            if (videoState) {
                let dataJson = {
                    event: 'onAdvEnd',
                    data: ''
                }
                window.parent.postMessage(JSON.stringify(dataJson), '*')
                $J_play_btn.remove()
                //$video.prev().remove()
                //播放正常视频
                $video.attr('src', rootVideo)
                $video[0].controls = true
                videoState = 0
                $video[0].play()
            } else {
                let dataJson = {
                    event: 'onVideoEnd',
                    data: ''
                }
                window.parent.postMessage(JSON.stringify(dataJson), '*')
            }
        })

        //错误
        $video.on('error', function(msg) {
           /* if (window.parent.onVideoError) {
                window.parent.onVideoError(msg)
            }*/
            let dataJson = {
                event: 'onVideoError',
                data: msg
            }
            window.parent.postMessage(JSON.stringify(dataJson), '*')
        })
    }
    /**
     * 添加日志
     */
    Video.prototype._addLog = function() {
        let scope = this
        // 发送操作信息
        $.ajax({
            url: logUrl,
            data: {
                'qid': scope.qid || 'null',
                'uid': scope.userId || 'null',
                'from': _util_.getUrlParam('fr') || 'null',
                'to': 'http://' + window.location.host + window.location.pathname,
                type: _yiji_,
                subtype: _erji_,
                idx: 0,
                remark: 'null',
                'os': scope.os || 'null',
                'browser': scope.browserType || 'null',
                softtype: 'null',
                softname: 'null',
                newstype: _newstype_,
                ver: 'null',
                'pixel': window.screen.width + '*' + window.screen.height,
                refer: _util_.getReferrer() || 'null',
                appqid: 'null',
                ttloginid: 'null',
                apptypeid: 'null',
                appver: 'null',
                pgnum: 1, //没有做分页
                pgtype: 2,
                ime: 'null'/*,
                ishot: ishot,
                recommendtype: recommendtype*/
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function() {},
            error: function() {
                console.error(arguments)
            }
        })
    }

    /**
     * 收集在线日志
     */
    Video.prototype._addOnlineLog = function() {
        let scope = this
        /* global _yiji_:true _erji_:true _newstype_:true*/
        $.ajax({
            url: onlineUrl,
            data: {
                url: 'http://' + window.location.host + window.location.pathname,
                qid: scope.qid,
                uid: scope.userId,
                apptypeid: 'null',
                loginid: 'null',
                type: _yiji_,
                subtype: _erji_,
                intervaltime: onlineHz,
                ver: 'null',
                os: scope.os || 'null',
                appqid: 'null',
                ttloginid: 'null',
                pgtype: 2,
                ime: 'null',
                newstype: _newstype_
            },
            dataType: 'jsonp',
            jsonp: 'callback'
        })
    }
    new Video()
})
