import 'pages/zhibo_jmh/style.scss'
import FastClick from 'fastclick'
import config from 'configModule'
import './log.js'
import _util_ from '../libs/libs.util'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let {HOST} = config.API_URL
    let {DOMAIN} = config
    // 赛程
    let $body = $('body')
    $body.append('<div id="J_loading" class="loading" style="display: none;"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div> <p class="txt">数据加载中</p> </div>')
    let $J_loading = $('#J_loading')
    let $head = $('#indexNew .main .head')
    let $teamImg = $head.find('.img img')
    let $teamP = $head.find('.sub1 p')
    let $info = $head.find('.info')
    let $J_video = $('#J_video')
    const _os_ = _util_.getOsType()
    const _recgid_ = _util_.getUid()
    let _qid_ = _util_.getPageQid()
    class EastSport {
        constructor() {
            this.matchid = _util_.getUrlParam('matchid') || '1521804900000887397'
            this.init()
        }

        init() {
            let that = this
            that.loadMatchInfo()
            $J_video[0].play()
            setInterval(function() {
                that.loadMatchInfo()
            }, 10000)
        }

        loadMatchInfo() {
            let data = {
                matchid: this.matchid
            }
            let that = this
            _util_.makeJsonp(HOST + 'matchinfo', data).done(function(result) {
                result = result.data
                that.loadHeadHtml(result)//填充头部数据
            })
        }
        /*<h3><i></i>18 : 20 : 45</h3>*/
        loadHeadHtml(result) {
            $teamImg.eq(0).attr('src', result.home_logoname)
            $teamImg.eq(1).attr('src', result.visit_logoname)
            $teamP.eq(0).text(result.home_team)
            $teamP.eq(1).text(result.visit_team)
            if (result.ismatched === '-1') {
                $info.html(`
            <h6>${result.title02}</h6>
            <h2>${result.starttime.substr(5).replace('-', '月').replace(' ', '日 ') + '开始'}</h2>
            `)
            } else {
                $info.html(`
            <h6>${result.title02}</h6>
            <h2>${result.home_score + '-' + result.visit_score}</h2>
            `)
            }
        }
    }

    new EastSport()

    // dateText日期格式化 页面独有的方法
    function formatDateText(starts) {
        $dateText.text(new Date(starts).format('MM-dd') + ' 至 ' + new Date(starts + 24 * 60 * 60 * 1000).format('MM-dd')).data('data-timestamp', starts)
    }
})
