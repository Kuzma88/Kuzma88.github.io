$(function() {


    if(document.documentElement.clientWidth > 800) {
        $('.product-list').jScrollPane();
    }
    if(document.documentElement.clientWidth < 480) {
        $(".main-page .application .h2").click(function() {
            $(this).toggleClass("open-btn");
            $(this).parent().find(".main-form").toggleClass("main-form-open");
            return false;
        });
    }

    // $(window).resize(function() {
    //     if(document.documentElement.clientWidth > 1200) {
    //
    //     }
    // });

    $('select').styler();

    $(".toggle-menu").click(function() {
        $(this).toggleClass("on");
        $(".mobile-menu").slideToggle(300);
        return false;
    });

    $(".jq-selectbox").click(function() {
        $(this).find(".jq-selectbox__select").toggleClass("open-btn");
        return false;
    });

    //main-fprm
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

    jQuery.each(jQuery('textarea[data-autoresize]'), function() {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function(el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
    });

    //sliders
    $('.delivery-slider').slick({
        arrow: false,
        dots: false,
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev left-open-icon"></button>',
        nextArrow: '<button class="slick-next right-open-icon"></button>',
        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 4,
                    arrow: true,
                    dots: true
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 3,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    dots: true
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });

    $('.product-slider').slick({
        arrow: true,
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        margin: 5,
        prevArrow: '<button class="slick-prev left-open-icon"></button>',
        nextArrow: '<button class="slick-next right-open-icon"></button>'
    });

    $("a[href='#popup-form']").magnificPopup({
        mainClass: 'my-mfp-zoom-in',
        removalDelay: 300,
        type: 'inline'
    });

});
