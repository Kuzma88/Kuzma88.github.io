$(function() {

    //mobile menu
    $(".toggle-menu").click(function() {
        $(this).toggleClass("on");
        $(".hidden-menu").slideToggle(200);
        return false;
    });

    //scroll by anchor
    $('a[href^="#"]').click(function(){
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top + 31
        }, 1000);
        return false;
    });

    var navLi = $('.main-menu__item');

    $('.tracked').waypoint(function(){

        var hash = $(this.element).attr('id');

        console.log("hash: ", hash);
        navLi.removeClass("active").find("[href$='#" + hash + "']").parent().addClass('active');
    }, {
        offset: '-30px'
    });

    //sliders
    $(".main-slider").slick({
        dots: true,
        speed: 2000,
        prevArrow: '<button class="slick-prev angle-left-icon"></button>',
        nextArrow: '<button class="slick-next angle-right-icon"></button>',
        autoplay: true,
        autoplaySpeed: 10000
    });

    $(".products__slider").slick({
        dots: true,
        speed: 1500,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: 2,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    rows: 1,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });


    //skills animation
    $(".skills").waypoint(function() {
        $(".photoshop").LineProgressbar({
            percentage: 74,
            radius: '0px',
            height: '3px',
            width: '100%',
            fillBackgroundColor: '#009dda',
            backgroundColor: '#FFF',
            duration: 2000
        });
        $(".htmlcss").LineProgressbar({
            percentage: 90,
            radius: '0px',
            height: '3px',
            width: '100%',
            fillBackgroundColor: '#009dda',
            backgroundColor: '#FFF',
            duration: 2500
        });
        $(".javascript").LineProgressbar({
            percentage: 69,
            radius: '0px',
            height: '3px',
            width: '100%',
            fillBackgroundColor: '#009dda',
            backgroundColor: '#FFF',
            duration: 3000
        });
        $(".wordpress").LineProgressbar({
            percentage: 92,
            radius: '0px',
            height: '3px',
            width: '100%',
            fillBackgroundColor: '#009dda',
            backgroundColor: '#FFF',
            duration: 3500
        });
        this.destroy()
    }, {
        offset : "70%"
    });

    //E-mail Ajax Send
    $(".main-form").submit(function() {
        var th = $(this);
        $.ajax({
            type: "POST",
            url: "../mail.php",
            data: th.serialize()
        }).done(function() {
            alert("Thank you!");
            setTimeout(function() {
                // Done Functions
                th.trigger("reset");
            }, 1000);
        });
        return false;
    });

    //textarea noresize
    jQuery.each(jQuery('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function(el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
    });



});

//google map
function initMap() {
    var myMap = new google.maps.Map(document.getElementById('contact-map'), {
        zoom: 16,
        center: {lat: 49.844, lng: 24.026}
    });
}