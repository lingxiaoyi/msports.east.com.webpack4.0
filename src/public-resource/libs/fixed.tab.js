import config from 'configDir/common.config'
let {ROOT_URL_HC} = config
let util = {
    //下方tab栏目
    fixedTabs(num, islogin) {
        return `<div class="tab-btns">
    <ul class="clearfix">
        <li class="${num === 1 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}index.html">
                <icon></icon>
                <p>首页</p>
            </a>
        </li>
        <li  class="${num === 2 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}saishi.html">
            <icon></icon>
            <p>赛程</p>
            </a>
        </li>
        <li  class="${num === 3 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}hc/index.html">
            <icon></icon>
            <p>发现</p>
            </a>
        </li>
        <li  class="${num === 4 ? 'active' : ''}">
            <a href="${ROOT_URL_HC}all_data.html?datatype=t&classtype=nba">
            <icon></icon>
            <p>数据</p>
            </a>
        </li>
        <li  class="${num === 5 ? 'active' : ''}">
            <a href="${islogin ? `${ROOT_URL_HC}hc/personal.html` : `${ROOT_URL_HC}hc/login.html`}">
                <icon></icon>
                <p>我的</p>
            </a>
        </li>
    </ul>
</div>`
    }
}

module.exports = util
