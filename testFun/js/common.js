$(function() {

    // $(".content-info").paroller();

    // if ( $(window).width() > 1024 ) {
    //     $(".advantages__item").each(function(index) {
    //         var ths = $(this);
    //         setInterval(function() {
    //             ths.addClass('animated fadeInUp');
    //         }, 300*index);
    //     });
    // }

    // $(".advantages__item").each(function(index) {
    //     var ths = $(this);
    //     setInterval(function() {
    //         ths.addClass("on");
    //     }, 300*index);
    // });

    new WOW().init();

    $('.callback').click( function () {
        $('.popup-form').toggleClass('open');
    });

    $('.open-sub-menu').click( function() {
        $(this).parents('li').find('ul').slideToggle(0);
    });

    $('ul.tabs__caption').on('click', 'li:not(.active)', function() {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__text').removeClass('active').eq($(this).index()).addClass('active');
    });

    $(".toggle-menu").click(function () {
        $(this).toggleClass("on");
        $(".main-menu").slideToggle(300);
        return false;
    });

    jQuery.each(jQuery('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function(el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
    });

});
