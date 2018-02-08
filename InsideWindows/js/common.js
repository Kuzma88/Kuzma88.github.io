$(window).on('load', function () {
    $('#wrap_loader').delay(500).fadeToggle(500);
});

$(function() {

    // jQuery(window).scroll(function() {
    //     // проверка на докрутку до определенного элемента
    //     var scroll_picca =jQuery('.scroll_picca').offset().top;
    //     console.log(scroll_picca) ;// выводим в консоль смещение  элемента пицца
    //     //если мы докрутили до нужного элемента
    //     if (jQuery(this).scrollTop() > scroll_picca) {
    //         // создаем эффекты и анимацию
    //         jQuery(".bottom_float_menu").show();
    //
    //     }else{
    //         jQuery(".bottom_float_menu").hide();
    //
    //     }
    //     // если докрутил до низа страницы
    //     if(jQuery(window).scrollTop()+jQuery(window).height()>=jQuery(document).height()){
    //         jQuery(".bottom_float_menu").hide();
    //     }
    // });

    $(window).paroller();

    $('.video__content').jScrollPane({
        horizontalDragMaxWidth: 46
    });
    $('.info__text-inner').jScrollPane({
        verticalDragMaxHeight: 40
    });

    $(".top-nav").sticky({ topSpacing: 0 });

    $(".slider-top").slick({
        dots: true,
        speed: 600,
        prevArrow: '<button class="slick-prev left-open-icon"></button>',
        nextArrow: '<button class="slick-next right-open-icon"></button>'
    });

    $(".toggle-menu").click(function() {
        $(this).toggleClass("on");
        $(".hidden-menu").slideToggle(200);
        return false;
    });

    "use strict";
    $(function() {
        $(".youtube").each(function() {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<div/>', {'class': 'play play-icon'}));

            $(document).delegate('#'+this.id, 'click', function() {
                // создаем iframe со включенной опцией autoplay
                var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
                if ($(this).data('params')) iframe_url+='&'+$(this).data('params');

                // Высота и ширина iframe должны быть такими же, как и у родительского блока
                var iframe = $('<iframe/>', {'frameborder': '0', 'src': iframe_url, 'width': $(this).width(), 'height': $(this).height() })

                // Заменяем миниатюру HTML5 плеером с YouTube
                $(this).replaceWith(iframe);
            });
        });
    });

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            daysSpan.innerHTML = t.days;
            hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

    var deadline="March 31 2018 00:00:00 GMT+0300"; //for Ukraine
// var deadline = new Date(Date.parse(new Date()) + 20 * 24 * 60 * 60 * 1000); // for endless timer
    initializeClock('timer-block', deadline);



    $(".catalog-slider").not(":first").hide();
    $(".catalog-tabs__item").click(function() {
        $(".catalog-tabs__item").removeClass("active").eq($(this).index()).addClass("active");
        $(".catalog-slider").hide().eq($(this).index()).fadeIn(100);
    }).eq(0).addClass("active");

    $(".catalog-product img").addClass('img-responsive');

    $(".catalog-product .img-small img").click(function() {
        $(this).parents(".catalog-product").find(".img-small img").removeClass("active").eq($(this).index()).addClass("active");
        $(this).parents(".catalog-product").find(".img-big img").hide().eq($(this).index()).fadeIn(0);
    }).eq(0).addClass("active");

    $('.catalog-slider-1').owlCarousel({
        items:4,
        margin:0,
        nav:true,
        loop:false,
        // mouseDrag:false,
        navText: ["<i class='left-open-icon'></i>","<i class='right-open-icon'></i>"],
        smartSpeed:600,
        responsive : {
            1200: {
                items:4
            },
            900: {
                items:3
            },
            600: {
                items:2
            },
            0: {
                items:1
            }
        }
    });

    $('.catalog-slider-2').owlCarousel({
        items:4,
        margin:0,
        nav:true,
        loop:false,
        // mouseDrag:false,
        navText: ["<i class='left-open-icon'></i>","<i class='right-open-icon'></i>"],
        smartSpeed:600,
        responsive : {
            1200: {
                items:4
            },
            900: {
                items:3
            },
            600: {
                items:2
            },
            0: {
                items:1
            }
        }
    });

    $('.catalog-slider-3').owlCarousel({
        items:4,
        margin:0,
        nav:true,
        loop:false,
        // mouseDrag:false,
        navText: ["<i class='left-open-icon'></i>","<i class='right-open-icon'></i>"],
        smartSpeed:600,
        responsive : {
            1200: {
                items:4
            },
            900: {
                items:3
            },
            600: {
                items:2
            },
            0: {
                items:1
            }
        }
    });

    $('.catalog-slider-4').owlCarousel({
        items:4,
        margin:0,
        nav:true,
        loop:false,
        // mouseDrag:false,
        navText: ["<i class='left-open-icon'></i>","<i class='right-open-icon'></i>"],
        smartSpeed:600,
        responsive : {
            1200: {
                items:4
            },
            900: {
                items:3
            },
            600: {
                items:2
            },
            0: {
                items:1
            }
        }
    });


    // $(".popular-slider img").addClass("img-responsive");
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        speed: 100,
        fade: true,
        asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
        speed: 500,
        prevArrow: '<button class="slick-prev left-open-icon"></button>',
        nextArrow: '<button class="slick-next right-open-icon"></button>',
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: false,
        centerMode: true,
        focusOnSelect: true
    });

});
function initMap() {
    var myMap = new google.maps.Map(document.getElementById('footer-map'), {
        zoom: 13,
        center: {lat: 50.436, lng: 30.549}
    });

    addMarker({
        coordinates: {lat: 50.420, lng: 30.471},
        image: 'img/map-marker.png',
        info: '<h4>Маркер 1</h4>'
    });
    addMarker({
        coordinates: {lat: 50.425, lng: 30.523},
        image: 'img/map-marker.png',
        info: '<h4>Маркер 2</h4>'
    });
    addMarker({
        coordinates: {lat: 50.451, lng: 30.590},
        image: 'img/map-marker.png',
        info: '<h4>Маркер 3</h4>'
    });

    function addMarker(properties) {
        var marker = new google.maps.Marker({
            position: properties.coordinates,
            map: myMap
        });
        if(properties.image){
            marker.setIcon(properties.image)
        }
        if(properties.info){
            var InfoWindow = new google.maps.InfoWindow({
                content: properties.info
            });
            marker.addListener('click', function () {
                InfoWindow.open(myMap, marker)
            });
        }
    }
    var styles = [{
        "featureType": "poi.business",
        "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.arterial", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road.highway", "stylers": [ { "color": "#7bab61" }, { "visibility": "simplified" } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "off" } ] } ];
    myMap.setOptions({styles: styles});
}