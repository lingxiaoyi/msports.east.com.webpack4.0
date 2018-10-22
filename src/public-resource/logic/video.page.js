import 'pages/video/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
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
    let $video = $('#J_video')
    let $related = $('#J_related')
    let $listWrap = $('<div class="related-cnt"></div>')
    //let $commend = $('#J_commend')
    let bufferedNum = 0
    let $moreVideoLoading = $('<div class="loading"><div class="spinner"><div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div></div><p class="txt">更多视频加载中</p></div>')
    let onlineHz = 10 // 在线日志记录频率(单位：秒；10s一次)
    $related.after($moreVideoLoading)
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    if (qid === 'dfspiosnull' || qid === 'dfspadnull' || qid === 'wxspadnull' || qid === 'wxspiosnull' || qid === 'qid10601' || qid === 'qid10456' || qid === 'qid10457' || qid === 'baiducom') {} else {
        $('.content .video-title').before(`<a class="video-tip" href="http://msports.eastday.com/downloadapp.html?qid=dftysp&from=H5dftiyu" id="J_video_tip"><p>打开东方体育客户端，体验三倍流畅度 ＞ </p></a>`)
    }
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
    function generateGgDom() {
        $ggVideo = $('<div id="J_gg_video" class="gg-video"><div class="gg"></div><a id="J_gg_close_video" class="gg-close-video">关闭广告</a></div>')
        $ggVideo.appendTo($video.parents('.video-wrap'))
        $ggCloseVideo = $ggVideo.find('#J_gg_close_video')
    }
    /**
     * 加载视频广告
     * @return {[type]} [description]
     */
    function loadGg(ggId) {
        if (ggId) {
            let $ggWrap = $ggVideo.children('.gg')
            // 非反屏蔽广告
            // if(new RegExp(/^u\d{7}/).test(ggId)) {
            let div = document.createElement('div')
            let script1 = document.createElement('script')
            let script2 = document.createElement('script')
            div.id = 'bdUserDefInlay_' + ggId
            script1.type = 'text/javascript'
            script1.innerHTML = 'var cpro_id = "' + ggId + '";'
            script2.type = 'text/javascript'
            script2.src = 'https://cpro.baidustatic.com/cpro/ui/cm.js'
            $ggWrap.append(div).append(script1).append(script2)
        }
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
        let clientHeight = $(window).height()
        $(window).on('scroll', function() {
            let scrollTop = $(this).scrollTop()
            let bodyHeight = $('body').height() - 50
            if (qid === 'qid10601' || qid === 'baiducom') {
                scope.pullUpFinished = false
            }
            if (scrollTop + clientHeight >= bodyHeight && scope.pullUpFinished) {
                scope.pullUpFinished = false
                scope.getVideoList()
            }
        })
        //app隐藏标签
        if (qid === 'qid10601' || qid === 'baiducom') {
            $related.prev().remove()
            $related.prev().remove()
            $('.video-title').children('h1').next().remove()
            $('.loading').hide()
        }
        /* 视频事件监听 */
        try {
            scope.addVideoListener()
        } catch (e) {
            console.error('_addOnlineLog has error!', e)
        }
        scope.getVideoList()
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

        $related.on('click', 'a', function() {
            $video[0].pause()
            scope.removeLoading()
        })
        $video.attr('controls', false)
        // 自动缓冲页面
        $video.attr('preload', true)
        $video.attr('autobuffer', true)
        $video.attr('x-webkit-airplay', 'allow')
        /*let mygg = GLOBAL.Et.gg,
                bd = mygg.baidu,
                ggPaster = bd && bd.paster,
                ggThreeup = bd && bd.threeup,
                ggThreedown = bd && bd.threedown,
                ggThree = bd && bd.three,
                t1 = null,
                t2 = null;
        // 视频暂停时展示的广告
        try {
                if (ggPaster) {
                        /!* 生成广告DOM *!/
                        generateGgDom();
                        loadGg(ggPaster);
                        /!* 关闭广告 *!/
                        $ggCloseVideo.on('click', function() {
                                scope.hideGg();
                        });
                }
        } catch (e) {
                console.error('generateGgDom has error!', e);
        }*/
        // 注册dsp广告click日志事件
        /*$('body').on('click', '.gg_link', function(e) {
                e.preventDefault();
                let $this = $(this),
                        advUrl = $this.attr('data-advurl') || $this.attr('href') || '',
                        isclickbackurl = $this.attr('data-isclickbackurl'),
                        clickbackurl = $this.attr('data-clickbackurl'),
                        cbu = (clickbackurl && clickbackurl.split('@@')), // 和后台约定的以@@分割url，如需修改请和后端开发协商
                        cbuLen = cbu.length,
                        ggImg = null,
                        count = 0,
                        i = 0;
                if (Number(isclickbackurl) === 1) {
                        for (i = 0; i < cbuLen; i++) {
                                ggImg = new Image();
                                ggImg.src = cbu[i];
                                ggImg.onerror = function() { // jshint ignore:line
                                        count++;
                                        if (count === cbuLen) {
                                                window.location.href = advUrl;
                                        }
                                };
                                ggImg.onload = function() { // jshint ignore:line
                                        count++;
                                        if (count === cbuLen) {
                                                window.location.href = advUrl;
                                        }
                                };
                        }
                } else {
                        window.location.href = advUrl;
                }
        });*/
        // 视频暂停时展示的广告
        try {
            //console.log(1)
            if (qid === 'tiyu360dhkz' || qid === 'qid02393') {
                /* 生成广告DOM */
                generateGgDom()
                loadGg(_AD_.videoPatchGg[qid])
                /* 关闭广告 */
                $ggCloseVideo.on('click', function() {
                    scope.hideGg()
                })
                if (qid === 'qid02393') {
                    setTimeout(function() {
                        scope.hideGg()
                    }, 10000)
                }
            }
        } catch (e) {
            console.error('generateGgDom has error!', e)
        }
    }
    Video.prototype.getVideoList = function(callback) {
        let scope = this
        /* global _typeCode_:true*/
        $.ajax({
            url: videoUrl,
            data: {
                typecode: _typeCode_,
                startkey: scope.startkey,
                pgnum: scope.pgnum,
                os: scope.os,
                qid: scope.qid,
                recgid: scope.userId,
                url: 'http://' + window.location.host + window.location.pathname,
                domain: 'sports_h5'
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            timeout: 8000,
            success: function(data) {
                if (!data.data.length) {
                    $moreVideoLoading.hide()
                    $related.append('<p style="padding: 0.1rem 0 0.2rem; font-size: 0.24rem; color: #999; text-align: center; margin-top: 0.2rem;">无更多数据了...</p>')
                    return
                }
                scope.generateVideoList(data)
                scope.pullUpFinished = true
                scope.startkey = data.endkey
                scope.pgnum++
            },
            error: function(e) {
                console.error(e)
            },
            complete: function(jqXHR, textStatus) {
                callback && callback()
                if (textStatus === 'timeout') {
                    $related.append('<p style="padding: 0.1rem 0 0.2rem; font-size: 0.24rem; color: #999; text-align: center; margin-top: 0.2rem;">请求超时，请检查网络连接状态或<a href="javascript:location.reload();">刷新页面</a>重试。</p>')
                }
            }
        })
    }
    /**
     * 生成列表
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    Video.prototype.generateVideoList = function(data) {
        let scope = this
        data.data.forEach(function(item, i) {
            if (i === 0 || i === 3 || i === 7 || i === 10) {
                if (scope.index >= 21) return
                let ggid = scope._detailsGg_[scope.index]
                $listWrap.append(`<section style="padding:0 0.24rem;margin-left: -0.24rem;border-bottom: 1px solid #e5e5e5;"class="news-item news-item-video ${ggid}"><div style="" id="${ggid}"></div></section>`)
                _util_.getScript(`//df888.eastday.com/${ggid}.js`, function() {}, $('#' + ggid)[0])
                scope.index++
            }
            $listWrap.append('<section class="news-item news-item-video"><a data-type="" data-subtype="" href="' + item.url + '"><div class="news-wrap clearfix"><div class="txt-wrap fl"><h3>' + item.topic + '</h3> <p><em class="fl"></em><em class="fl" style="padding: 0.04rem 0;">' + item.source + '</em></p></div><div class="img-wrap fr"><img class="lazy" src="' + item.miniimg[0].src + '" alt=""></div></div></a></section>')
            if (i === 9) {
                if (scope.index >= 21) return
                let ggid = scope._detailsGg_[scope.index]
                $listWrap.append(`<section style="padding:0 0.24rem;margin-left: -0.24rem;border-bottom: 1px solid #e5e5e5;"class="news-item news-item-video ${ggid}"><div style="" id="${ggid}"></div></section>`)
                _util_.getScript(`//df888.eastday.com/${ggid}.js`, function() {}, $('#' + ggid)[0])
                scope.index++
            }
        })
        $related.append($listWrap)
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
            $ggCloseVideo && $ggCloseVideo.trigger('click') // jshint ignore: line
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
                // 兼容处理（在小米浏览器上碰到过一次，点击播放就会触发暂停，导致出现广告）
                if (Math.floor($video[0].currentTime * 1000) > 1000 && $video[0].paused) {
                    scope.showGg()
                }
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
    }

    /**
     * 显示广告
     * @return {[type]} [description]
     */
    Video.prototype.showGg = function() {
        if ($ggVideo) {
            $ggVideo.show()
            $video.css({
                width: 1,
                height: 1
            })
        }
    }

    /**
     * 隐藏广告
     * @return {[type]} [description]
     */
    Video.prototype.hideGg = function() {
        if ($ggVideo) {
            $ggVideo.hide()
            $video.css({
                width: '100%',
                height: '100%'
            })
        }
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

    /**
     * 视频信息流中添加广告
     * @param  {[type]} ggid 广告ID
     * @param  {[type]} pos  插入位置
     */
    Video.prototype.loadListGg = function(ggid, pos) {
        if (!ggid) {
            return
        }
        // 分析是5.0广告还是5.0之前的广告
        let reg = new RegExp(/^u[0-9]{7}/)
        let isV5 = !reg.test(ggid)
        let $newsItems = $listWrap.children()
        let len = $newsItems.length
        if (pos >= len) {
            pos = len - 1
        } else if (pos < 0) {
            pos = 0
        } else {
            pos = pos - 1
        }
        if (isV5) {
            $newsItems.eq(pos).after('<section class="gg-item news-gg-img3"><div id="' + ggid + '"></div><div class="line"></div></section>')
            _util_._util_.getScript('https://df888.eastday.com/' + ggid + '.js', function() {}, $('#' + ggid)[0])
        } else {
            let ggConfig = '(window.cpro_mobile_slot = window.cpro_mobile_slot || []).push({id : "' + ggid + '",at:"3", pat:"21", ptLH:"30", tn:"template_inlay_all_mobile_lu_native", rss1:"#F8F8F8", titFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", titFS:"12", rss2:"#000000", ptFS:"17", ptFC:"#000000", ptFF:"%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91", ptFW:"0", conpl:"15", conpr:"15", conpt:"8", conpb:"15", cpro_h:"140", ptn:"1", ptp:"0", itecpl:"10", piw:"0", pih:"0", ptDesc:"2", ptLogo:"0", ptLogoFS:"10", ptLogoBg:"#F8F8F8", ptLogoC:"#999999", ptLogoH:"0", ptLogoW:"0"})'
            $newsItems.eq(pos).after('<section class="gg-item news-gg-img3"><div id="cpro_' + ggid + '"></div><div class="line"></div></section>')
            _util_.createScript(ggConfig, function() {
                _util_._util_.getScript('https://df888.eastday.com/cpro/ui/cm.js', function() {}, $('#cpro_' + ggid)[0])
            }, $('#cpro_' + ggid)[0])
        }
    }

    /**
     * 加载三宫格广告（标题下方）
     * @param  {[type]} ggId [description]
     * @return {[type]}      [description]
     */
    Video.prototype.loadThree = function(ggId) {
        let $content = $('article.content').eq(0)
        $content.after('<section class="gg-item news-gg-img3"><div id="' + ggId + '"></div><div class="line"></div></section>')
        _util_._util_.getScript('https://df888.eastday.com/' + ggId + '.js', function() {}, $('#' + ggId)[0])
    }

    /**
     * 将数据组装成html代码
     * @param  {[type]} dspData dsp广告数据
     * @return {[type]}      [description]
     */
    Video.prototype.generateDsp = function(dspData) {
        let data = dspData ? dspData[0] : {}
        let url = data.url
        let clickbackurl = data.clickbackurl
        let isclickbackurl = data.isclickbackurl
        let showbackurl = data.showbackurl
        let isshowbackurl = data.isshowbackurl
        let imgLen = data.miniimg_size
        let imgArr = data.miniimg
        let topic = data.topic
        let source = data.source
        if (Number(imgLen) === 3) { // 三图
            $('#extra').html('<a href="' + url + '" class="gg_link" data-clickbackurl="' + clickbackurl + '" data-isclickbackurl="' + isclickbackurl + '">' + '<div class="news-wrap clearfix">' + '<h3 class="news-title">' + topic + '</h3>' + '<div class="imgs-wrap clearfix">' + '<div class="img fl"><img src="' + imgArr[0].src + '" class="lazy" /></div>' + '<div class="img fl"><img src="' + imgArr[1].src + '" class="lazy" /></div>' + '<div class="img fl"><img src="' + imgArr[2].src + '" class="lazy" /></div>' + '</div>' + '<p class="tags clearfix">' + '<em class="tag tag-time fl">' + '<i class="tag tag-gg">广告</i>' + '</em>' + '<em class="tag tag-src fr">' + source + '</em>' + '</p>' + '</div>' + '</a>')
        } else {
            $('#extra').html('<a href="' + url + '" class="gg_link" data-clickbackurl="' + clickbackurl + '" data-isclickbackurl="' + isclickbackurl + '">' + '<div class="new-wrap clearfix">' + '<div class="txt-wrap fl">' + '<h3 class="txt-title">' + topic + '</h3>' + '<p class="tags clearfix">' + '<em class="tag tag-time">' + '<i class="tag tag-gg">广告</i>' + '</em>' + '<em class="tag tag-src">' + source + '</em>' + '</p>' + '</div>' + '<div class="img-wrap fr">' + '<img src="' + imgArr[0].src + '" class="lazy">' + '</div>' + '</div>' + '</a>')
        }
        // dsp广告show日志
        if (Number(isshowbackurl) === 1) {
            let sbu = showbackurl.split('@@') // 和后台约定的以@@分割url，如需修改请和后端开发协商
            let sbuLen = sbu.length
            let i = 0
            for (i = 0; i < sbuLen; i++) {
                new Image().src = sbu[i]
            }
        }
    }

    /**
     * 加载dsp广告 无dsp广告时加载百度广告
     * @param  {[type]} data [description]
     * @param  {[type]} ggId [description]
     * @return {[type]}      [description]
     */
    Video.prototype.loadDsp = function(data, ggId) {
        let scope = this
        let $content = $('article.content').eq(0)
        let dspData = data.data
        let dlen = dspData.length
        $content.after('<div id="extra"></div>')
        if (dlen) {
            scope.generateDsp(dspData)
        } else {
            scope.loadThree(ggId)
        }
    }

    /**
     * 获取dsp广告
     * @param  {[type]} ggId [description]
     * @return {[type]}      [description]
     */
    /*Video.prototype.getDsp = function(ggId) {
        let scope = this
        $.ajax({
            url: dspUrl,
            dataType: 'jsonp',
            jsonp: 'jsonpcallback',
            timeout: 3000,
            data: {
                type: $('#J_video').attr('data-type') || 'toutiao',
                qid: scope.qid,
                uid: scope.userId,
                os: _util_.getOsType(),
                thisurl: 'http://' + window.location.host + window.location.pathname,
                pgnum: 1,
                adnum: 1,
                adtype: 23,
                dspver: '1.0.1',
                softtype: 'news',
                softname: 'eastday_wapnews',
                newstype: 'ad',
                browser_type: _util_.getBrowserType(),
                pixel: window.screen.width + '*' + window.screen.height,
                fr_url: 'http://' + window.location.host + window.location.pathname
            },
            success: function(data) {
                scope.loadDsp(data, ggId)
            },
            error: function() {
                scope.loadThree(ggId)
            }
        })
    }*/
    new Video()
    if (qid === 'qid10601') {
        document.title = '\u200E'
        let title = $('.video-title h1').text()
        let url = window.location.host + window.location.pathname
        let urlNum = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'))
        let ttaccid = _util_.getUrlParam('ttaccid') || 'null'
        let apptypeid = _util_.getUrlParam('apptypeid') || 'null'
        let obj = {
            'method': 'webLoadComplete',
            'title': title,
            'desc': title.substring(0, 40),
            'imgurl': $video.attr('poster') || 'http://mini.eastday.com/toutiaoh5/img/share-logo.png', // 分享缩略图,
            'xcximgurl': $video.attr('poster') || 'http://mini.eastday.com/toutiaoh5/img/xcx-logo.png',
            'shareurl': window.location.href,
            'articleH': $('body').height(),
            'smallappshare': `pages/news/ndetails/ndetails?url=${urlNum}&type=${_sportsType_}&ac=${ttaccid}&f=xq1&apptypeid=${apptypeid}&qid=sharexcx`,
        }
        console.log(`pages/news/ndetails/ndetails?url=${urlNum}&type=${_sportsType_}&ac=${ttaccid}&f=xq1&apptypeid=${apptypeid}&qid=sharexcx`)
        if (_util_.getOsType().indexOf('Android') > -1) {
            window.NewsDetail.webLoadComplete(JSON.stringify(obj))
        } else {
            window.webkit.messageHandlers.JSToNative_iOS.postMessage(obj)
        }
    }
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
