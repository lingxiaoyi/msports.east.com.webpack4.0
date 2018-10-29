import 'pages/query-tag/style.scss'
import 'public/libs/log.js'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from 'public/libs/libs.util'
import _AD_ from 'public/libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST} = config.API_URL
    let {DOMAIN} = config
    let domain = DOMAIN
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let _newsGg_ = _AD_.detailList[qid].concat(_AD_.indexNoChannel)
    //let locationUrl = 'http://' + window.location.host + window.location.pathname//当前url
    let $secNewsList = $('#secNewsList')
    let $J_loading = $('#J_loading')
    let pullUpFinished = false
    let startkey = '' // 用来拉取分页
    let newkey = '' // 用来拉取分页
    let pgnum = 1
    let index = 0
    let idx = 1
    $('#head .tag span').text(_util_.getUrlParam('name'))
    if (qid === 'dfspiosnull' || qid === 'dfspadnull' || qid === 'wxspadnull' || qid === 'wxspiosnull') {
        $('.crumbs').remove()
    }
    loadNewsList(0)
    $(window).scroll(function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList(0)
        }
    })

    function loadNewsList(start) {
        let typecode
        typecode = _util_.getUrlParam('typecode') || '900232'
        let data = {
            type: '',
            typecode: typecode,
            startkey: startkey,
            newkey: newkey,
            pgnum: pgnum,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }
        $J_loading.show() // 数据加载样式
        _util_.makeJsonp(HOST + 'newspool', data).done(function(result) {
            $J_loading.hide()
            if (!result.data.length) {
                $('#noMore').remove()
                $secNewsList.children('ul').append('<li id="noMore" class="clearfix">无更多数据了</li>')
                return
            }
            startkey = result.endkey
            newkey = result.newkey
            $secNewsList.children('ul').append(produceListHtml(result, start))
            pgnum++
            pullUpFinished = true
        }).done(function(result) {
            if (!result.data.length) {
                return
            }
            for (let i = 2; i >= 0; i--) {
                let value = $(`#ggModule${index - 3 + i}`).children().attr('id')
                _util_.getScript('//df888.eastday.com/' + value + '.js', function() {
                }, $('#' + value)[0])
            }
        })
    }

    function produceListHtml(result, start) {
        let data = result.data
        let html = ''
        data.forEach(function(item, i) {
            let length = item.miniimg.length// 判断缩略图的数量
            if (i >= start) {
                if (length < 3 && length >= 1) {
                    html += `<li class="clearfix">
										<a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}`}`}" suffix="">
											<div class="img">
												<img src="${item.miniimg[0].src}" alt="${item.miniimg[0].alt}"/>
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
										 <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}`}`}" suffix="">
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
                // 广告位置
                if (i === 1 || i === 3 || i === 6) {
                    html += `<li id="ggModule${index}"  class="clearfix gg" ><div id="${_newsGg_[index]}"></div></li>`
                    index++
                }
            }
            idx++
        })
        return html
    }
})
