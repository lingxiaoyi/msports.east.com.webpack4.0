import './style.scss'
import 'public/logic/log'
import FastClick from 'fastclick'
import config from 'configModule'
import hcUtil from '../../../public-resource/libs/hc.common'
import _util_ from '../../../public-resource/libs/libs.util'
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
    hcUtil.appendInfoHeader(qid, '购买协议')
})
