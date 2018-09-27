$(function () {
    $('.slider').slick({
        dots: true,
        infinite: false,
        fade: true,
        speed: 0,
        draggable: false,
        prevArrow: $('.slick-prev'),
        nextArrow: $('.slick-next'),
        appendDots: $('.slick-dots-wrap')
    });

    document.querySelectorAll(".slide-title").forEach(div => div.innerHTML = div.innerHTML.split("").map(ch => `<span>${ch}</span>`).join(""));

    if ($(window).width() > 768) {
        $('.slick-active .slide-img').addClass('show');

        function slideAnim() {
            var $target = $('.slick-active .slide-title span');
            var hold = 50;

            $('.slick-slide .slide-title span').removeClass('show');
            $.each($target,function(i,t){
                var $this = $(t);
                setTimeout(function(){ $this.addClass('show'); },i*hold);
            });

            setTimeout(function(){
                $('.slick-active .right-content').addClass('show');
                $('.slick-navigation').addClass('show');
            },$target.length*hold + 100);
        }
        slideAnim();

        $(".slider").on("afterChange", function(){
            $('.slick-slide .slide-img').removeClass('show');
            $('.slick-active .slide-img').addClass('show');
            $('.slick-slide .right-content').removeClass('show');
            $('.slick-navigation').removeClass('show');

            slideAnim();
        });
    }



});
