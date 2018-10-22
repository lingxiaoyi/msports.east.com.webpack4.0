// 和jquery或zepto

module.exports = (function () {

    class circleChart {
        constructor() {
            this.ctxdata = {}
        }
        set(option) {
            if (!option.jqDom.append) throw Error('元素非指定(Jquery,zepto)对象类型')
            let jqDom = option.jqDom, draw = $(`<canvas></canvas>`), domId = ''
            if (jqDom.selector.indexOf('#') === 0) {
                domId = jqDom.selector.replace('#', '')
            } else {
                throw Error('请使用ID选择器或使用唯一ID选择元素')
            }
            if (this.ctxdata.domId) {
                this.drawcircle(this.ctxdata.domId, option)
                return false
            }
            draw.css({
                width: option.sideL,
                height: option.sideL
            })
            jqDom.append(draw)
            let canvas = draw[0]
            canvas.width = option.sideL * 2
            canvas.height = option.sideL * 2
            // 获得 CanvasRenderingContext2D 对象
            let ctx = canvas.getContext('2d')
            this.ctxdata.domId = ctx
            this.drawcircle(this.ctxdata.domId, option)
        }

        drawcircle(ctx, option) {
            // 设置 起点
            ctx.clearRect(0, 0, option.sideL * 2, option.sideL * 2)
            if (!option.e && !option.s) {
                return false
            }
            ctx.lineWidth = option.borderw * 2
            ctx.lineCap = 'round'
            ctx.strokeStyle = option.color
            ctx.beginPath()
            ctx.arc(option.sideL, option.sideL, option.r * 2, option.s * Math.PI / 180, option.e * Math.PI / 180)
            ctx.stroke()
            ctx.closePath()
        }
    }

    let Chart = new circleChart()

    let circle = function (option) {
        Chart.set(option)
    }

    return circle
})()
