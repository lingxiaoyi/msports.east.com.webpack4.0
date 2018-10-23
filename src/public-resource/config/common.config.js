const buildFileConfig = require('configDir/build-file.config')
const moduleExports = {
    DIRS: {
        BUILD_FILE: buildFileConfig
    },

    PAGE_ROOT_PATH: '../../',

    DOMAIN: 'dfsports_h5',

    VERSION: '1.1.6' //版本号  用来区分版本上线
}
console.log(moduleExports.VERSION)
/* global isOnlinepro:true isTestpro:true*/ // 由于ESLint会检测没有定义的变量，因此需要这一个`global`注释声明IS_PRODUCTION是一个全局变量(当然在本例中并不是)来规避warning
if (isOnlinepro) { //首页地址
    moduleExports.HOME_URL = '//msports.eastday.com/'
    moduleExports.NAV_URL = '/'
    moduleExports.wap_url = '//msports.eastday.com/hc/recharge.html'
    //moduleExports.ROOT_URL = '/'
    moduleExports.ROOT_URL_HC = '/'
    moduleExports.ROOT_URL_HC_detail = 'http://msports.eastday.com/hc/fa/'
} else if (isTestpro) {
    moduleExports.HOME_URL = '//test-msports.dftoutiao.com/msports.east.com/build/html/'
    moduleExports.NAV_URL = ''
    moduleExports.wap_url = '//test-msports.dftoutiao.com/msports.east.com/build/html/hc/recharge.html'
    moduleExports.ROOT_URL_HC = '//test-msports.dftoutiao.com/msports.east.com/build/html/'
    moduleExports.ROOT_URL_HC_detail = '//test-msports.dftoutiao.com/msports.east.com/build/html/hc/fa/'
} else {
    moduleExports.HOME_URL = '/'
    moduleExports.NAV_URL = ''
    moduleExports.wap_url = '//test-msports.dftoutiao.com/msports.east.com/build/html/hc/recharge.html'
    //moduleExports.ROOT_URL = 'http://172.20.6.219:8080/html/'
    moduleExports.ROOT_URL_HC = '/html/'
    moduleExports.ROOT_URL_HC_detail = 'http://msports.eastday.com/hc/fa/'
    moduleExports.ROOT_URL_HC_detail = '//test-msports.dftoutiao.com/msports.east.com/build/html/hc/fa/'
}

if (isOnlinepro) { // 本项目所用的所有接口
    let HCHOST = '//sportsu.dftoutiao.com'
    moduleExports.API_URL = {
        HOST: '//dfsports_h5.dftoutiao.com/dfsports_h5/',
        HOST_LIVE: '//dfsportslive.dftoutiao.com/dfsports/',
        HOST_DSP_LIST: '//dftyttd.dftoutiao.com/partner/list',
        HOST_DSP_DETAIL: '//dftyttd.dftoutiao.com/partner/detail',
        HOME_LUNBO_API: '//msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: '//dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        VIDEO_LOG: '//dfsportsapplog.dftoutiao.com/dfsportsapplog/videoact',
        RZAPI: {
            active: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/active',
            onclick: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/onclick',
            online: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/online'
        },
        MOPADS: {
            show: '//sportlog.shaqm.com/mopstatistical/bdshow',
            click: '//sportlog.shaqm.com/mopstatistical/bdclick',
        },
        QUERYIP: '//cid.shaqm.com/soft/jt',
        CHAT: '//api.mv.dftoutiao.com/liveshow/getbarrageinfo',
        COMMENTREPLY: '//dftycomment.dftoutiao.com/comment/api/dfty/h5/',
        PLAYOFFNBA: '//dfsports_h5.dftoutiao.com/dfsports_h5/playoffNBA',
        GETSERVERTS: '//sportsu.dftoutiao.com/u/app/timestamps',
        HCAPI: {
            youhuiquan: `${HCHOST}/u/youhuiquan/youhuiquan/`,
            buy: `${HCHOST}/u/order/buy/`,
            wx_payed: `${HCHOST}/u/pay/wx_payed`,
            recharge: `${HCHOST}/u/order/recharge/`,
            payed: `${HCHOST}/u/order/payed/`,
            user_yuanbao: `${HCHOST}/u/yuanbao/user_yuanbao/`,
            order_list: `${HCHOST}/u/order/order_list/`,
            plan_content: `${HCHOST}/u/plan/plan_content/`, //详情
            yqb_plan_content_audit: `${HCHOST}/yqb/ios_audit/yqb_plan_content_audit`, //详情
            yqb_plan_content: `${HCHOST}/yqb/plan/yqb_plan_content/`, //详情
            get_user_yuanbao: `${HCHOST}/u/yuanbao/get_user_yuanbao/`, //实时获取用户元宝和金币接口
            get_yuanbao_list: `${HCHOST}/u/yuanbao/user_yuanbao/`, //获取用户元宝明细
            h5_recharge: `${HCHOST}/u/order/h5_recharge/`, //H5支付宝支付
            recharge_wxpay: `${HCHOST}/u/order/recharge_wxpay/`, //H5微信支付
            get_coupon_list: `${HCHOST}/u/youhuiquan/youhuiquan/`, //获取用户优惠券列表
            has_libao: `${HCHOST}/u/youhuiquan/has_libao/`, //用户是否领过优惠券活动
            get_libao: `${HCHOST}/u/youhuiquan/get_libao/`, //获取礼包
            get_order_list: `${HCHOST}/u/order/order_list/`, // 我的订单
            dfsportswap_lottery: '//hongcaiwap.dftoutiao.com/dfsportswap_lottery/',
            experts_guanzhu: `${HCHOST}/u/expert/guanzhu`,
            getgzexpert: `${HCHOST}/dfsportspc_lottery_h5/careexpert`,
            mygetgzexpert: `${HCHOST}/dfsportspc_lottery_h5/getgzexpert`, //已关注的专家列表
            gzexpertup: `${HCHOST}/dfsportswap_lottery/gzexpertup`, //已关注的专家方案
            freescheme: '//hongcaiwap.dftoutiao.com/dfsportswap_lottery/wap/freescheme', //免费专家方案
            scupinfo: `${HCHOST}/dfsportswap_lottery/wap/scupinfo/`, //免费和关注专家方案数
            get_new_msg: `${HCHOST}/u/feednotice/get_new_msg`, //最新反馈信息、系统通知
            get_notice: `${HCHOST}/u/feednotice/get_notice`, //系统通知
            reply_list: `${HCHOST}/u/feednotice/reply_list`, //获取用户反馈及回复
            get_quan_info: `${HCHOST}/u/youhuiquan/get_quan_info`, //获取优惠券状态信息
            get_quan: `${HCHOST}/u/youhuiquan/get_quan`, //领取优惠券`
            ten_yhq_info: `${HCHOST}/u/youhuiquan/ten_yhq_info`, //活动状态10.1优惠券`
            get_ten_yhq: `${HCHOST}/u/youhuiquan/get_ten_yhq`, //活动状态10.1优惠券`
        },
        HCAPIORDER: {
            generate_plan_order: `${HCHOST}/u/new_order/generate_plan_order`, //预生成订单
            buy: `${HCHOST}/u/new_order/buy`,
            tt_login: `${HCHOST}/u/login/silent_login`, //头条用户登录
            recharge: '//sportsu.dftoutiao.com/u/new_order/recharge',
            query: '//sportsu.dftoutiao.com/u/new_order/query',
            recharge_wxpay: '//sportsu.dftoutiao.com/u/new_order/recharge_wxpay',
            wx_payed: '//sportsu.dftoutiao.com/u/new_order/wx_payed',
            get_order_list: '//sportsu.dftoutiao.com/u/new_order/get_order_list',
            cancel_order: `//sportsu.dftoutiao.com/u/new_order/cancel_order`,
        },
        JCAPI: {
            user_info: 'https://world-cup.dftoutiao.com/index/world_cup/user_info',
            guessing: 'https://world-cup.dftoutiao.com/index/world_cup/guessing ',
            award: 'https://world-cup.dftoutiao.com/index/world_cup/award',
            get_user_info: 'https://world-cup.dftoutiao.com/index/world_cup/user_info',
            get_match_bet: '//dfsportsjc.dftoutiao.com/bet/betting/get_match_bet', //获取赛事关联竞猜
            get_corn_list: '//dfsportsjc.dftoutiao.com/bet/betting/get_corn_list', //获取投注金币列表
            buy: '//dfsportsjc.dftoutiao.com/bet/pay/buy', //用户参与竞猜接口
            get_user_bet: '//dfsportsjc.dftoutiao.com/bet/betting/get_user_bet', //用户订单列表
            get_share_message: '//dfsportsjc.dftoutiao.com/bet/betting/get_share_message',
        },
        ty_JCAPI: {
            get_match_bet: `${HCHOST}/bet/betting/get_match_bet`, //获取赛事关联竞猜
            get_corn_list: `${HCHOST}/bet/betting/get_corn_list`, //获取投注金币列表
            buy: `${HCHOST}/bet/pay/buy`, //用户参与竞猜接口
            get_user_bet: `${HCHOST}/bet/betting/get_user_bet`, //用户订单列表
            get_share_message: `${HCHOST}/bet/betting/get_share_message`,
            tywa_buy: `${HCHOST}/bet/pay/sports_wx_buy`, //体育五星购买
            pay_award: `${HCHOST}/bet/award/pay_award`, //发钱
            bind: `${HCHOST}/bet/award/bind`, //绑定
            get_bind_info: `${HCHOST}/bet/award/get_bind_info`, //获取绑定支付宝
        },
        userLogin: { //用户登录
            by_code: `${HCHOST}/u/login/by_code/`, //验证码登录
            by_pass: `${HCHOST}/u/login/index/`, //密码登录
            get_code: `${HCHOST}/u/code/send/`, //获取验证码(1:注册 2:修改密码)
            reset_pass: `${HCHOST}/u/password/change/` //重置密码
        },
        WORLDCUPINDEX: '//msports.eastday.com/data/app/app_zhuanti_shijiebei.js',
        // WORLDCUPINDEX: '//172.18.254.39:2020/data/app/app_zhuanti_shijiebei.js',
        SEARCHNEW: '//dftysearch.dftoutiao.com/search_sports/searchnews',
        GroupStage: '//dfsports_h5.dftoutiao.com/dfsports_h5/worldCupGroup',
        COUNTRY: '//sports.eastday.com/data/zhuanti/worldcup/'
    }
} else if (isTestpro) {
    let HCHOST = '//test-sportsu.dftoutiao.com'
    moduleExports.API_URL = {
        HOST: '//117.50.1.220/dfsports_h5/', // //117.50.1.220
        HOST_LIVE: '//117.50.1.220/dfsports/', //172.18.250.87:8381/dfsports/
        HOST_DSP_LIST: '//106.75.98.65/partner/list',
        HOST_DSP_DETAIL: '//106.75.98.65/partner/detail',
        HOME_LUNBO_API: '//msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: '//dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        VIDEO_LOG: '//172.18.250.87:8381/dfsportsapplog/videoact',
        RZAPI: {
            active: '//172.18.250.87:8380/dfsportsdatah5/active',
            onclick: '//172.18.250.87:8380/dfsportsdatah5/onclick',
            online: '//172.18.250.87:8380/dfsportsdatah5/online'
        },
        MOPADS: {
            show: '//123.59.60.170/mopads/show',
            click: '//123.59.60.170/mopads/click',
        },
        QUERYIP: '//cid.shaqm.com/soft/jt',
        CHAT: '//test.mv.dftoutiao.com/liveshow/getbarrageinfo',
        COMMENTREPLY: '//106.75.6.212/comment/api/dfty/h5/',
        PLAYOFFNBA: '//117.50.1.220/dfsports/playoffNBA',
        GETSERVERTS: '//sportsu.dftoutiao.com/u/app/timestamps',
        HCAPI: {
            youhuiquan: `${HCHOST}/u/youhuiquan/youhuiquan/`,
            buy: `${HCHOST}/u/order/buy/`,
            wx_payed: `${HCHOST}/u/order/wx_payed/`,
            recharge: `${HCHOST}/u/order/recharge/`,
            payed: `${HCHOST}/u/order/payed/`,
            user_yuanbao: `${HCHOST}/u/yuanbao/user_yuanbao/`,
            order_list: `${HCHOST}/u/order/order_list/`,
            plan_content: `${HCHOST}/u/plan/plan_content/`, //详情
            yqb_plan_content_audit: `${HCHOST}/yqb/ios_audit/yqb_plan_content_audit`, //详情
            yqb_plan_content: `${HCHOST}/yqb/plan/yqb_plan_content/`, //详情
            get_user_yuanbao: `${HCHOST}/u/yuanbao/get_user_yuanbao/`, //实时获取用户元宝和金币接口
            get_yuanbao_list: `${HCHOST}/u/yuanbao/user_yuanbao/`, //获取用户元宝明细
            h5_recharge: `${HCHOST}/u/order/h5_recharge/`, //H5支付宝支付
            recharge_wxpay: `${HCHOST}/u/order/recharge_wxpay/`, //H5微信支付
            get_coupon_list: `${HCHOST}/u/youhuiquan/youhuiquan/`, //获取用户优惠券列表
            has_libao: `${HCHOST}/u/youhuiquan/has_libao/`, //用户是否领过优惠券活动
            get_libao: `${HCHOST}/u/youhuiquan/get_libao/`, //获取礼包
            get_order_list: `${HCHOST}/u/order/order_list/`, // 我的订单
            dfsportswap_lottery: `//172.18.254.42:8080/dfsportswap_lottery/`, //117.50.1.220
            experts_guanzhu: `${HCHOST}/u/expert/guanzhu`,
            getgzexpert: `${HCHOST}/dfsportspc_lottery_h5/careexpert`, //查询列表是否关注
            mygetgzexpert: `${HCHOST}/dfsportspc_lottery_h5/getgzexpert`, //已关注的专家列表
            gzexpertup: `${HCHOST}/dfsportswap_lottery/gzexpertup`, //已关注的专家方案
            freescheme: '//117.50.1.220/dfsportswap_lottery/wap/freescheme', //免费专家方案
            // scupinfo: '//117.50.1.220/dfsportswap_lottery/app/scupinfo/' //免费和关注专家方案数
            scupinfo: `${HCHOST}/dfsportswap_lottery/wap/scupinfo/`, //免费和关注专家方案数
            get_new_msg: `${HCHOST}/u/feednotice/get_new_msg`, //最新反馈信息、系统通知
            get_notice: `${HCHOST}/u/feednotice/get_notice`, //系统通知
            reply_list: `${HCHOST}/u/feednotice/reply_list`, //获取用户反馈及回复
            get_quan_info: `${HCHOST}/u/youhuiquan/get_quan_info`, //获取优惠券状态信息
            get_quan: `${HCHOST}/u/youhuiquan/get_quan`, //领取优惠券`
            ten_yhq_info: `${HCHOST}/u/youhuiquan/ten_yhq_info`, //活动状态10.1优惠券`
            get_ten_yhq: `${HCHOST}/u/youhuiquan/get_ten_yhq`, //活动状态10.1优惠券`
        },
        HCAPIORDER: {
            generate_plan_order: `${HCHOST}/u/new_order/generate_plan_order`, //预生成订单
            buy: `${HCHOST}/u/new_order/buy`,
            tt_login: `${HCHOST}/u/login/silent_login`, //头条用户登录
            recharge: `${HCHOST}/u/new_order/recharge`,
            query: `${HCHOST}/u/new_order/query`,
            recharge_wxpay: `${HCHOST}/u/new_order/recharge_wxpay`,
            wx_payed: `${HCHOST}/u/new_order/wx_payed`,
            get_order_list: `${HCHOST}/u/new_order/get_order_list`,
            cancel_order: `${HCHOST}/u/new_order/cancel_order`,
        },
        JCAPI: {
            get_match_bet: `${HCHOST}/bet/betting/get_match_bet`, //获取赛事关联竞猜
            get_corn_list: `${HCHOST}/bet/betting/get_corn_list`, //获取投注金币列表
            buy: `${HCHOST}/bet/pay/buy`, //用户参与竞猜接口
            get_user_bet: `${HCHOST}/bet/betting/get_user_bet`, //用户订单列表
            user_info: '//test-world-cup.dftoutiao.com/index/world_cup/user_info',
            guessing: '//test-world-cup.dftoutiao.com/index/world_cup/guessing ',
            award: '//test-world-cup.dftoutiao.com/index/world_cup/award',
            get_share_message: `${HCHOST}/bet/betting/get_share_message`,
            get_user_info: '//test-world-cup.dftoutiao.com/index/world_cup/user_info',
        }, // 竞猜接口
        userLogin: { //用户登录
            by_code: `${HCHOST}/u/login/by_code/`, //验证码登录
            by_pass: `${HCHOST}/u/login/index/`, //密码登录
            get_code: `${HCHOST}/u/code/send/`, //获取验证码(1:注册 2:修改密码)
            reset_pass: `${HCHOST}/u/password/change/` //重置密码
        },
        WORLDCUPINDEX: '//msports.eastday.com/data/app/app_zhuanti_shijiebei.js',
        SEARCHNEW: '//dftysearch.dftoutiao.com/search_sports/searchnews',
        GroupStage: '//dfsports_h5.dftoutiao.com/dfsports_h5/worldCupGroup',
        COUNTRY: '//sports.eastday.com/data/zhuanti/worldcup/'
    }
} else {
    let HCHOST = '//test-sportsu.dftoutiao.com'
    moduleExports.API_URL = {
        HOST: '//117.50.1.220/dfsports_h5/', // //117.50.1.220
        HOST_LIVE: '//117.50.1.220/dfsports/', //172.18.250.87:8381/dfsports/
        HOST_DSP_LIST: '//106.75.98.65/partner/list',
        HOST_DSP_DETAIL: '//106.75.98.65/partner/detail',
        HOME_LUNBO_API: '//msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: '//dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        VIDEO_LOG: '//172.18.250.87:8381/dfsportsapplog/videoact',
        RZAPI: {
            active: '//172.18.250.87:8380/dfsportsdatah5/active',
            onclick: '//172.18.250.87:8380/dfsportsdatah5/onclick',
            online: '//172.18.250.87:8380/dfsportsdatah5/online'
        },
        MOPADS: {
            show: '//123.59.60.170/mopads/show',
            click: '//123.59.60.170/mopads/click',
        },
        QUERYIP: '//cid.shaqm.com/soft/jt',
        CHAT: '//test.mv.dftoutiao.com/liveshow/getbarrageinfo',
        COMMENTREPLY: '//106.75.6.212/comment/api/dfty/h5/',
        PLAYOFFNBA: '//117.50.1.220/dfsports/playoffNBA',
        GETSERVERTS: '//sportsu.dftoutiao.com/u/app/timestamps',
        HCAPI: {
            youhuiquan: `${HCHOST}/u/youhuiquan/youhuiquan/`,
            buy: `${HCHOST}/u/order/buy/`,
            wx_payed: `${HCHOST}/u/order/wx_payed/`,
            recharge: `${HCHOST}/u/order/recharge/`,
            payed: `${HCHOST}/u/order/payed/`,
            user_yuanbao: `${HCHOST}/u/yuanbao/user_yuanbao/`,
            order_list: `${HCHOST}/u/order/order_list/`,
            plan_content: `${HCHOST}/u/plan/plan_content/`, //详情
            yqb_plan_content_audit: `${HCHOST}/yqb/ios_audit/yqb_plan_content_audit`, //详情
            yqb_plan_content: `${HCHOST}/yqb/plan/yqb_plan_content/`, //详情
            get_user_yuanbao: `${HCHOST}/u/yuanbao/get_user_yuanbao/`, //实时获取用户元宝和金币接口
            get_yuanbao_list: `${HCHOST}/u/yuanbao/user_yuanbao/`, //获取用户元宝明细
            h5_recharge: `${HCHOST}/u/order/h5_recharge/`, //H5支付宝支付
            recharge_wxpay: `${HCHOST}/u/order/recharge_wxpay/`, //H5微信支付
            get_coupon_list: `${HCHOST}/u/youhuiquan/youhuiquan/`, //获取用户优惠券列表
            has_libao: `${HCHOST}/u/youhuiquan/has_libao/`, //用户是否领过优惠券活动
            get_libao: `${HCHOST}/u/youhuiquan/get_libao/`, //获取礼包
            get_order_list: `${HCHOST}/u/order/order_list/`, // 我的订单
            dfsportswap_lottery: `http://172.18.254.42:8080/dfsportswap_lottery/`, //117.50.1.220
            experts_guanzhu: `${HCHOST}/u/expert/guanzhu`,
            getgzexpert: `${HCHOST}/dfsportspc_lottery_h5/careexpert`, //查询列表是否关注
            mygetgzexpert: `${HCHOST}/dfsportspc_lottery_h5/getgzexpert`, //已关注的专家列表
            gzexpertup: `${HCHOST}/dfsportswap_lottery/gzexpertup`, //已关注的专家方案
            freescheme: '//117.50.1.220/dfsportswap_lottery/wap/freescheme', //免费专家方案
            // scupinfo: '//117.50.1.220/dfsportswap_lottery/app/scupinfo/' //免费和关注专家方案数
            scupinfo: `${HCHOST}/dfsportswap_lottery/wap/scupinfo/`, //免费和关注专家方案数
            get_new_msg: `${HCHOST}/u/feednotice/get_new_msg`, //最新反馈信息、系统通知
            get_notice: `${HCHOST}/u/feednotice/get_notice`, //系统通知
            reply_list: `${HCHOST}/u/feednotice/reply_list`, //获取用户反馈及回复
            get_quan_info: `${HCHOST}/u/youhuiquan/get_quan_info`, //获取优惠券状态信息
            get_quan: `${HCHOST}/u/youhuiquan/get_quan`, //领取优惠券`,
            ten_yhq_info: `${HCHOST}/u/youhuiquan/ten_yhq_info`, //活动状态10.1优惠券`
            get_ten_yhq: `${HCHOST}/u/youhuiquan/get_ten_yhq`, //活动状态10.1优惠券`
        },
        HCAPIORDER: {
            generate_plan_order: `${HCHOST}/u/new_order/generate_plan_order`, //预生成订单
            buy: `${HCHOST}/u/new_order/buy`,
            tt_login: `${HCHOST}/u/login/silent_login`, //头条用户登录
            recharge: `${HCHOST}/u/new_order/recharge`,
            query: `${HCHOST}/u/new_order/query`,
            recharge_wxpay: `${HCHOST}/u/new_order/recharge_wxpay`,
            wx_payed: `${HCHOST}/u/new_order/wx_payed`,
            get_order_list: `${HCHOST}/u/new_order/get_order_list`,
            cancel_order: `${HCHOST}/u/new_order/cancel_order`,
        },
        JCAPI: {
            get_match_bet: `${HCHOST}/bet/betting/get_match_bet`, //获取赛事关联竞猜
            get_corn_list: `${HCHOST}/bet/betting/get_corn_list`, //获取投注金币列表
            buy: `${HCHOST}/bet/pay/buy`, //用户参与竞猜接口
            get_user_bet: `${HCHOST}/bet/betting/get_user_bet`, //用户订单列表
            user_info: '//test-world-cup.dftoutiao.com/index/world_cup/user_info',
            guessing: '//test-world-cup.dftoutiao.com/index/world_cup/guessing ',
            award: '//test-world-cup.dftoutiao.com/index/world_cup/award',
            get_share_message: `${HCHOST}/bet/betting/get_share_message`,
            get_user_info: '//test-world-cup.dftoutiao.com/index/world_cup/user_info',
        }, // 竞猜接口
        userLogin: { //用户登录
            by_code: `${HCHOST}/u/login/by_code/`, //验证码登录
            by_pass: `${HCHOST}/u/login/index/`, //密码登录
            get_code: `${HCHOST}/u/code/send/`, //获取验证码(1:注册 2:修改密码)
            reset_pass: `${HCHOST}/u/password/change/` //重置密码
        },
        WORLDCUPINDEX: '//msports.eastday.com/data/app/app_zhuanti_shijiebei.js',
        SEARCHNEW: '//dftysearch.dftoutiao.com/search_sports/searchnews',
        GroupStage: '//dfsports_h5.dftoutiao.com/dfsports_h5/worldCupGroup',
        COUNTRY: '//sports.eastday.com/data/zhuanti/worldcup/'
    }
    HCHOST = '//sportsu.dftoutiao.com'
    moduleExports.API_URL1 = {
        HOST: '//dfsports_h5.dftoutiao.com/dfsports_h5/',
        HOST_LIVE: '//dfsportslive.dftoutiao.com/dfsports/',
        HOST_DSP_LIST: '//dftyttd.dftoutiao.com/partner/list',
        HOST_DSP_DETAIL: '//dftyttd.dftoutiao.com/partner/detail',
        HOME_LUNBO_API: '//msports.eastday.com/json/msponts/home_lunbo.json',
        ORDER_API: '//dfty.dftoutiao.com/index.php/Home/WechatOrder/yuyue?system_id=9&machid=',
        VIDEO_LOG: '//dfsportsapplog.dftoutiao.com/dfsportsapplog/videoact',
        RZAPI: {
            active: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/active',
            onclick: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/onclick',
            online: '//dfsportsdatapc.dftoutiao.com/dfsportsdatah5/online'
        },
        MOPADS: {
            show: '//sportlog.shaqm.com/mopstatistical/bdshow',
            click: '//sportlog.shaqm.com/mopstatistical/bdclick',
        },
        QUERYIP: '//cid.shaqm.com/soft/jt',
        CHAT: '//api.mv.dftoutiao.com/liveshow/getbarrageinfo',
        COMMENTREPLY: '//dftycomment.dftoutiao.com/comment/api/dfty/h5/',
        PLAYOFFNBA: '//dfsports_h5.dftoutiao.com/dfsports_h5/playoffNBA',
        GETSERVERTS: '//sportsu.dftoutiao.com/u/app/timestamps',
        HCAPI: {
            youhuiquan: `${HCHOST}/u/youhuiquan/youhuiquan/`,
            buy: `${HCHOST}/u/order/buy/`,
            wx_payed: `${HCHOST}/u/pay/wx_payed`,
            recharge: `${HCHOST}/u/order/recharge/`,
            payed: `${HCHOST}/u/order/payed/`,
            user_yuanbao: `${HCHOST}/u/yuanbao/user_yuanbao/`,
            order_list: `${HCHOST}/u/order/order_list/`,
            plan_content: `${HCHOST}/u/plan/plan_content/`, //详情
            yqb_plan_content: `${HCHOST}/yqb/plan/yqb_plan_content/`, //详情
            yqb_plan_content_audit: `${HCHOST}/yqb/ios_audit/yqb_plan_content_audit`, //详情
            get_user_yuanbao: `${HCHOST}/u/yuanbao/get_user_yuanbao/`, //实时获取用户元宝和金币接口
            get_yuanbao_list: `${HCHOST}/u/yuanbao/user_yuanbao/`, //获取用户元宝明细
            h5_recharge: `${HCHOST}/u/order/h5_recharge/`, //H5支付宝支付
            recharge_wxpay: `${HCHOST}/u/order/recharge_wxpay/`, //H5微信支付
            get_coupon_list: `${HCHOST}/u/youhuiquan/youhuiquan/`, //获取用户优惠券列表
            has_libao: `${HCHOST}/u/youhuiquan/has_libao/`, //用户是否领过优惠券活动
            get_libao: `${HCHOST}/u/youhuiquan/get_libao/`, //获取礼包
            get_order_list: `${HCHOST}/u/order/order_list/`, // 我的订单
            dfsportswap_lottery: '//hongcaiwap.dftoutiao.com/dfsportswap_lottery/',
            experts_guanzhu: `${HCHOST}/u/expert/guanzhu`,
            getgzexpert: `${HCHOST}/dfsportspc_lottery_h5/careexpert`,
            mygetgzexpert: `${HCHOST}/dfsportspc_lottery_h5/getgzexpert`, //已关注的专家列表
            gzexpertup: `${HCHOST}/dfsportswap_lottery/gzexpertup`, //已关注的专家方案
            freescheme: '//hongcaiwap.dftoutiao.com/dfsportswap_lottery/wap/freescheme', //免费专家方案
            scupinfo: `${HCHOST}/dfsportswap_lottery/wap/scupinfo/`, //免费和关注专家方案数
            get_new_msg: `${HCHOST}/u/feednotice/get_new_msg`, //最新反馈信息、系统通知
            get_notice: `${HCHOST}/u/feednotice/get_notice`, //系统通知
            reply_list: `${HCHOST}/u/feednotice/reply_list`, //获取用户反馈及回复
            get_quan_info: `${HCHOST}/u/youhuiquan/get_quan_info`, //获取优惠券状态信息
            get_quan: `${HCHOST}/u/youhuiquan/get_quan`, //领取优惠券`
            ten_yhq_info: `${HCHOST}/u/youhuiquan/ten_yhq_info`, //活动状态10.1优惠券`
            get_ten_yhq: `${HCHOST}/u/youhuiquan/get_ten_yhq`, //活动状态10.1优惠券`
        },
        HCAPIORDER: {
            generate_plan_order: `${HCHOST}/u/new_order/generate_plan_order`, //预生成订单
            buy: `${HCHOST}/u/new_order/buy`,
            tt_login: `${HCHOST}/u/login/silent_login`, //头条用户登录
            recharge: '//sportsu.dftoutiao.com/u/new_order/recharge',
            query: '//sportsu.dftoutiao.com/u/new_order/query',
            recharge_wxpay: '//sportsu.dftoutiao.com/u/new_order/recharge_wxpay',
            wx_payed: '//sportsu.dftoutiao.com/u/new_order/wx_payed',
            get_order_list: '//sportsu.dftoutiao.com/u/new_order/get_order_list',
            cancel_order: `//sportsu.dftoutiao.com/u/new_order/cancel_order`,
        },
        JCAPI: {
            user_info: 'https://world-cup.dftoutiao.com/index/world_cup/user_info',
            guessing: 'https://world-cup.dftoutiao.com/index/world_cup/guessing ',
            award: 'https://world-cup.dftoutiao.com/index/world_cup/award',
            get_user_info: 'https://world-cup.dftoutiao.com/index/world_cup/user_info',
            get_match_bet: '//dfsportsjc.dftoutiao.com/bet/betting/get_match_bet', //获取赛事关联竞猜
            get_corn_list: '//dfsportsjc.dftoutiao.com/bet/betting/get_corn_list', //获取投注金币列表
            buy: '//dfsportsjc.dftoutiao.com/bet/pay/buy', //用户参与竞猜接口
            get_user_bet: '//dfsportsjc.dftoutiao.com/bet/betting/get_user_bet', //用户订单列表
            get_share_message: '//dfsportsjc.dftoutiao.com/bet/betting/get_share_message',
        },
        ty_JCAPI: {
            get_match_bet: `${HCHOST}/bet/betting/get_match_bet`, //获取赛事关联竞猜
            get_corn_list: `${HCHOST}/bet/betting/get_corn_list`, //获取投注金币列表
            buy: `${HCHOST}/bet/pay/buy`, //用户参与竞猜接口
            get_user_bet: `${HCHOST}/bet/betting/get_user_bet`, //用户订单列表
            get_share_message: `${HCHOST}/bet/betting/get_share_message`,
            tywa_buy: `${HCHOST}/bet/pay/sports_wx_buy`, //体育五星购买
            pay_award: `${HCHOST}/bet/award/pay_award`, //发钱
            bind: `${HCHOST}/bet/award/bind`, //绑定
            get_bind_info: `${HCHOST}/bet/award/get_bind_info`, //获取绑定支付宝
        },
        userLogin: { //用户登录
            by_code: `${HCHOST}/u/login/by_code/`, //验证码登录
            by_pass: `${HCHOST}/u/login/index/`, //密码登录
            get_code: `${HCHOST}/u/code/send/`, //获取验证码(1:注册 2:修改密码)
            reset_pass: `${HCHOST}/u/password/change/` //重置密码
        },
        WORLDCUPINDEX: '//msports.eastday.com/data/app/app_zhuanti_shijiebei.js',
        // WORLDCUPINDEX: '//172.18.254.39:2020/data/app/app_zhuanti_shijiebei.js',
        SEARCHNEW: '//dftysearch.dftoutiao.com/search_sports/searchnews',
        GroupStage: '//dfsports_h5.dftoutiao.com/dfsports_h5/worldCupGroup',
        COUNTRY: '//sports.eastday.com/data/zhuanti/worldcup/'
    }
}
let ggUrl = {//淘宝双11优惠券链接
    noraml: {
        TBURL: '//union-click.jd.com/jdc?e=0&p=AyIHVCtaJQMiQwpDBUoyS0IQWhkeHAxeUQQHCllHGAdFBwtXRkBLGFh0Sxp0BUIQcnVhfRdAWWJLWQMjWjJFB0d9CgUDSldGTkpCHklfIn9TXStRBHJuN149aFUbGS1EIklxdkFZFzUWAxIBSRtbCQITFlUfUBEHGQNVK1sUBBQGXRpaEgciBVEYXhELEwVUK2sVAyJMOxprFQMUAFwdWRUKFjdVH1sUABMGUBNbFQEaN1IrD0VAV1IFU18WAyI3ZStrJQMiBg%3D%3D&t=W1dCFFlQCxxLA0pHRE5XDVULR0VAVlUZVhg6XAphVwxQPGJxaEUOGSxcSRZxFHILEFdoWEtDBEBWWxgMXgdI',
        TKL: '【支付宝】年终红包再加10亿！现在领取还有机会获得惊喜红包哦！长按复制此消息，打开最新版支付宝就能领取！DcMolP629M',
    },
    jhs: {
        TBURL: '//s.click.taobao.com/t?e=m%3D2%26s%3DCA%2Bg7FHEgGccQipKwQzePCperVdZeJviEViQ0P1Vf2kguMN8XjClAiUHgMl7Wuvix7bNo7qkY%2F38miGwwECqlbRxohsRsziPsuwTn7kuFXCXVj8MiSBzHAune%2BSK2%2FEQFbpSCl1%2BmsLkxFiXT%2FI5kYaDjw%2FF04D86lg1ChOkjYhSP3C9a2i3m3EqY%2Bakgpmw',
        TKL: '￥q9J90g3MTd8￥'
    }
}
/*let month = new Date().getMonth() + 1
let day = new Date().getDate()
if (month === 10) {
    if (day % 2 === 0) {
        moduleExports.ggUrl = ggUrl.noraml
    } else {
        moduleExports.ggUrl = ggUrl.jhs
    }
} else {
    if (day % 2 === 0) {
        moduleExports.ggUrl = ggUrl.jhs
    } else {
        moduleExports.ggUrl = ggUrl.noraml
    }
}*/
moduleExports.ggUrl = ggUrl.noraml
module.exports = moduleExports
