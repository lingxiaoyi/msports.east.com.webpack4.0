; (function ($, undefined) {
    var document = window.document, docElem = document.documentElement,
        origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

    function anim(el, speed, opacity, scale, callback) {
        if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
        var props = { opacity: opacity }
        if (scale) {
            props.scale = scale
            el.css($.fx.cssPrefix + 'transform-origin', '0 0')
        }
        return el.animate(props, speed, null, callback);
    }

    function hide(el, speed, scale, callback) {
        return anim(el, speed, 0, scale, function () {
            origHide.call($(this))
            callback && callback.call(this)
        })
    }

    $.fn.show = function (speed, callback) {
        origShow.call(this)
        //不是很理解作者的想法，如果这里继续执行下去，所有调用zepto原生show事件的元素，都会被这个事件覆盖，并且透明度都为被设为1...
        if (speed === undefined) return origShow.call(this) // 原版为：if (speed === undefined) speed = 0
        else this.css('opacity', 0)
        return anim(this, speed, 1, '1,1', callback)
    }

    $.fn.hide = function (speed, callback) {
        if (speed === undefined) return origHide.call(this)
        else return hide(this, speed, '0,0', callback)
    }

    $.fn.toggle = function (speed, callback) {
        if (speed === undefined || typeof speed == 'boolean')
            return origToggle.call(this, speed)
        else return this.each(function () {
            var el = $(this)
            el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
        })
    }

    $.fn.fadeTo = function (speed, opacity, callback) {
        return anim(this, speed, opacity, null, callback)
    }

    $.fn.fadeIn = function (speed, callback) {
        var target = this.css('opacity')
        if (target > 0) this.css('opacity', 0)
        else target = 1
        return origShow.call(this).fadeTo(speed, target, callback)
    }

    $.fn.fadeOut = function (speed, callback) {
        return hide(this, speed, null, callback)
    }

    $.fn.fadeToggle = function (speed, callback) {
        return this.each(function () {
            var el = $(this)
            el[
                (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
                ](speed, callback)
        })
    }

    $.fn.slideDown = function (speed, callback) {
        //获取元素position
        var position = this.css('position');
        this.show().css({
            position: 'absolute',
            visibility: 'hidden'
        });
        $('html,body').css({
            overflow: 'hidden',
            height: '100%'
        });
        //获取元素高度
        var height = this.height() === 0 ? $(window).height() : this.height();

        //-------通过伸缩元素高度实现动画-------
        //return this.css({
        //    position: position,
        //    visibility: 'visible',
        //    overflow: 'auto',
        //    height: 0
        //}).animate({ height: height, top: $(window).scrollTop() }, speed, null, callback);

        //-------通过移动元素相对位置实现动画-------
        return this.css({
            top: -height,
            left: 0,
            position: position,
            visibility: 'visible',
            overflow: 'auto'
        }).animate({ top: $(window).scrollTop() }, speed, null, callback);
    };

    $.fn.slideUp = function (speed, callback) {
        //获取元素position
        var position = this.css('position');
        this.show().css({
            position: 'absolute',
            visibility: 'auto'
        });
        $('html,body').css({
            overflow: '',
            height: ''
        });
        //获取元素高度
        var height = this.height();
        //-------通过伸缩元素高度实现动画-------
        //return this.css({
        //    position: position,
        //    visibility: 'visible',
        //    overflow: 'hidden',
        //    height: height
        //}).animate({ height: 0 }, speed, null, callback);

        //-------通过移动元素相对位置实现动画-------
        return this.css({
            left: 0,
            position: position,
            visibility: 'visible',
            overflow: 'auto'
        }).animate({ top: -height }, speed, null, callback);
    };

    $.fn.slideRight = function (speed, callback) {
        //获取元素position
        var position = this.css('position');
        this.show().css({
            position: 'absolute',
            visibility: 'hidden'
        });
        $('html,body').css({
            overflow: 'hidden',
            height: '100%'
        });
        //获取元素宽度
        var width = this.width() === 0 ? $(window).width() : this.width();

        //-------通过伸缩元素宽度实现动画-------
        //return this.css({
        //    top: $(window).scrollTop(),
        //    width: 0,
        //    position: position,
        //    visibility: 'visible',
        //    overflow: 'auto'
        //}).animate({ width: width }, speed, null, callback);

        //-------通过移动元素相对位置实现动画-------
        return this.css({
            top: $(window).scrollTop(),
            left: -width,
            position: position,
            visibility: 'visible',
            overflow: 'auto',
        }).animate({ left: 0 }, speed, null, callback);
    };

    $.fn.slideLeft = function (speed, callback) {
        //获取元素position
        var position = this.css('position');
        this.show().css({
            position: 'absolute',
            visibility: 'hidden'
        });
        $('html,body').css({
            overflow: '',
            height: ''
        });
        //获取元素宽度
        var width = this.width();
        //-------通过伸缩元素宽度实现动画-------
        //return this.css({
        //    top: 0,
        //    position: position,
        //    visibility: 'visible',
        //    overflow: 'auto'
        //}).animate({ width: 0 }, speed, null, callback);

        //-------通过移动元素相对位置实现动画-------
        return this.css({
            top: 0,
            position: position,
            visibility: 'visible',
            overflow: 'auto'
        }).animate({ left: -width }, speed, null, callback);
    };
})(Zepto)