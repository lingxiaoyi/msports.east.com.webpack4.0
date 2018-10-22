import './style.scss'
import '../../public-resource/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import _util_ from '../../public-resource/libs/libs.util'
$(() => {
    try {
        typeof FastClick === 'undefined' || FastClick.attach(document.body)
    } catch (e) {
        console.error(e)
    }
    let version = '1.1.1' //首页版本号
    console.log(version)
    let {HOST, HOST_DSP_LIST, ORDER_API, HOME_LUNBO_API} = config.API_URL
    let {DOMAIN} = config
    let _domain_ = DOMAIN
    let qid = _util_.getPageQid()
    let $body = $('body')
    /*if (qid !== 'dfsphcios' && qid !== 'dfsphcad') {
        $body.prepend(`<header class="info_header">
    <i class="back">返回</i><h3>购买协议</h3>
</header>`)
        $('.info_header .back').click(function() {
            window.history.go(-1)
        })
    }*/
})
