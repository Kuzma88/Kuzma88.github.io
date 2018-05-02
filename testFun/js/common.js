$(function() {

    //E-mail Ajax Send
    $("form").submit(function() {
        var th = $(this);
        $.ajax({
            type: "POST",
            url: "../mail.php",
            data: th.serialize()
        }).done(function() {
            // alert("Thank you!");
            setTimeout(function() {
                $('.popup-form').removeClass('open');
                th.trigger("reset");
            }, 1500);
        });
        return false;
    });

    jQuery.each(jQuery('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function(el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
    });

    $('.callback').click( function () {
        $('.popup-form').toggleClass('open');
    });

    $('ul.tabs__caption').on('click', 'li:not(.active)', function() {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.tabs__text').removeClass('active').eq($(this).index()).addClass('active');
    });

    $(".toggle-menu").click(function () {
        $(this).toggleClass("on");
        $(".mobile-menu").slideToggle(300);
        return false;
    });

});
