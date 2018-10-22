import 'pages/detail_wb/style.scss'
$(() => {
    let $body = $('body')
    class ObjWb {
        constructor() {
            this.init()
        }
        init() {
            this.switchPraise()
        }
        switchPraise() {
            $body.on('click', '.commentZan', function() {
                let num = $(this).children('span').text() / 1
                if (!$(this).children('i').hasClass('active')) {
                    $(this).children('span').text(++num)
                    $(this).children('i').addClass('active')
                }
            })
            $body.on('click', '.J_expand', function() {
                $(this).prev().removeClass('comment-content-maxheight')
                $(this).remove()
            })
        }
    }
    new ObjWb()
})
