$(function () {

    // accordion
    $('.info_accordion .acc_body').hide();
    $('.info_accordion .acc_head .down_up_btn').click(function() {
        var findArticle = $(this).parents('.acc_head').next();
        var findWrapper = $(this).parents('.acc_head').closest('.info_accordion');
        if (findArticle.is(':visible')) {
            findArticle.slideUp('300');
            $(this).removeClass('up');
        }
        else {
            findWrapper.find('.acc_body').slideUp('300');
            findWrapper.find('.down_up_btn').removeClass('up');
            findArticle.slideDown('300');
            $(this).addClass('up');
        }
    });

    // contacts tabs
    $('ul.tabs_caption').on('click', 'li:not(.active)', function() {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('.contacts_tabs').find('.tabs_content').removeClass('active').eq($(this).index()).addClass('active');
    });

    // textarea autoresize
    jQuery.each(jQuery('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function(el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
    });
});
