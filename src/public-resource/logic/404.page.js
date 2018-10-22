import 'pages/404/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import './log.js'
import _util_ from '../libs/libs.util'
import _AD_ from '../libs/ad.channel'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    //定义需要传入接口的值
    let {HOST} = config.API_URL
    let {DOMAIN} = config
    let domain = DOMAIN
    let os = _util_.getOsType()
    let recgid = _util_.getUid()
    let qid = _util_.getPageQid()
    let pullUpFinished = true
    let pgnum = 1
    let idx = 1
    let index = 0
    let $loading = `<div id="J_loading" class="loading">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                    <p class="txt">数据加载中</p>
                </div>`
    let $J_hn_list = $('.sec-news-list')
    $J_hn_list.after($loading)
    let $J_loading = $('#J_loading')
    qid = _AD_.detailList[qid] ? qid : 'null' //查看广告渠道里有没有这个id没有就是null
    let _newsGg_ = _AD_.indexGg[qid].concat(_AD_.indexNoChannel)
    loadNewsList()
    $(window).on('scroll', function() {
        let $liveboxHeight = $('body').height()
        let clientHeight = $(this).height()
        let $liveboxScrollTop = $(this).scrollTop()
        if ($liveboxScrollTop + clientHeight >= $liveboxHeight && pullUpFinished) {
            pullUpFinished = false
            loadNewsList()
        }
    })

    function loadNewsList() {
        if (pgnum >= 6) {
            $J_hn_list.append('<li style="text-align: center"><a href="javascript:;">没有更多数据了..</a></li>')
            $J_loading.hide()
            return
        }
        let data = {
            pgnum: pgnum,
            os: os,
            recgid: recgid,
            qid: qid,
            domain: domain
        }
        $J_loading.show()
        return _util_.makeJsonp(HOST + 'newsforerr', data).done(function(result) {
            if (!result.length) {
                $J_hn_list.append('<li style="text-align: center"><a href="javascript:;">没有更多数据了..</a></li>')
                $J_loading.hide()
                return
            }
            $J_hn_list.append(produceListHtml(result))
            pullUpFinished = true
            pgnum++
        }).done(function(result) {
            if (!result.length) {
                return
            }
            for (let i = 2; i >= 0; i--) {
                let value = $(`#ggModule${index - 3 + i}`).children().attr('id')
                _util_.getScript('//df888.eastday.com/' + value + '.js', function() {
                }, $('#' + value)[0])
            }
        })
    }

    function produceListHtml(result) {
        let html = ''
        result.forEach(function(item, i) {
            let length = item.miniimg.length// 判断缩略图的数量
            if (length < 3 && length >= 1) {
                html += `<li class="clearfix">
                                    <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}`}`}" suffix="">
                                        <div class="img">
                                            <img class="lazy" src="${item.miniimg[0].src}"/>
                                        </div>
                                        <div class="info">
                                            <div class="title">${item.topic}</div>
                                            <div class="source clearfix">
                                                ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>`
            } else if (length >= 3) {
                html += `<li class="clearfix">
                                     <a href="${`${item.url}?${`qid=${qid}&ishot=${item.ishot}&recommendtype=${item.recommendtype}&idx=${idx}&pgnum=${pgnum}`}`}" suffix="btype=news_details&subtype=hotnews&idx=0">
                                        <div class="title">${item.topic}</div>
                                        <div class="imgs">
                                            <img class="lazy" src="${item.miniimg[0].src}">
                                            <img class="lazy" src="${item.miniimg[1].src}">
                                            <img class="lazy" src="${item.miniimg[2].src}">
                                        </div>
                                        <div class="source clearfix">
                                            ${item.iszhiding === 1 && i === 0 ? '<div class="tag-zd">置顶</div>' : ''}
                                            <div class="l">${item.source}</div>
                                        </div>
                                    </a>
                                </li>`
            }
            // 广告位置
            if (i === 1 || i === 3 || i === 6) {
                html += `<li id="ggModule${index}" class="clearfix gg" ><div id="${_newsGg_[index]}"></div></li>`
                index++
            }
            idx++
        })
        return html
    }
})
