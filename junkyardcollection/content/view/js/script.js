$(function () {
    // scroll top
    $('.back_to_top').click(function () {
        $('html, body').animate({scrollTop: 0}, 200);
        return false;
    });
    // open website rules
    $('#article .register_wrapper .register_text .site_rules').click(function () {
        newW(1200, 500, '/documents/rules.php');
    });
    // validate register form
    $('#article .register_wrapper form input[type="submit"]').click(function () {
        $('#loader').css('display', 'block');

        var _form = $(this).closest('form');
        var captcha = $.trim($('input[name="keystring"]').val());
        var errors = new Array();
        $('#article .register_wrapper .error').html('');

        // rules
        if (!_form.find('input[type="checkbox"]').is(':checked')) {
            errors.push('Please confirm you have read the rules');
        }
        // text fields
        var login = $.trim(_form.find('input[name="login"]').val());
        var mail = $.trim(_form.find('input[name="mail"]').val());
        var pass = $.trim(_form.find('input[name="pass"]').val());
        var pass1 = $.trim(_form.find('input[name="pass1"]').val());

        if (login === '' || mail === '' || pass === '' || pass1 === '' || captcha === '') {
            errors.push('Please fill in all fields!');
        }
        if (login !== '') {
            var pattern = new RegExp(/^[a-zA-Z0-9_-]+$/);
            if (!pattern.test(login)) {
                errors.push('Only latin letters, numbers and symbols \'_\', \'-\' for login');
            }
        }
        if (!isValidMail(mail)) {
            errors.push('Please enter correct email!');
        }
        if (pass !== pass1) {
            errors.push('Passwords don\'t match');
        }

        // if this login not isset
        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'loginFree',
                login: login,
                captcha: captcha
            },
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    errors.push(data);
                }

                if (errors.length > 0) {
                    var printEr = '';
                    for (i = 0; i < errors.length; i++) {
                        printEr += errors[i] + '<br>';
                    }
                    printDialog(printEr);
                } else {
                    _form.submit();
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });

        return false;
    });
    // check/uncheck register rules checkbox
    $('#article .register_wrapper form .item input[type="checkbox"]').change(function () {
        if ($(this).is(':checked')) {
            $(this).closest('form').find('input[type="submit"]').removeClass('btn_no_active');
        } else {
            $(this).closest('form').find('input[type="submit"]').addClass('btn_no_active');
        }
    });
    // logged user
    viewAuthCaptcha = 0;
    $('#article .login_wrapper #login_form input[type="submit"]').click(function () {
        $('#loader').css('display', 'block');

        var _form = $(this).closest('form');
        var errors = new Array();

        // text fields
        var login = $.trim(_form.find('input[name="login"]').val());
        var pass = $.trim(_form.find('input[name="pass"]').val());
        var captcha = $.trim(_form.find('input[name="keystring"]').val());

        if (viewAuthCaptcha === 0) {
            viewAuthCaptcha = 1;
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'getCaptcha'
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    $('#login_form input[type="submit"]').parent().before(data);
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'loginUser',
                    login: login,
                    pass: pass,
                    captcha: captcha
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data !== '' && data !== 'admin' && data !== 'user') {
                        errors.push(data);
                        var printEr = '';
                        for (i = 0; i < errors.length; i++) {
                            printEr += errors[i] + '<br>';
                        }
                        printDialog(printEr);
                    } else if (data === 'admin') {
                        $('#popup_secret .popup_content').html('<input name="code" type="text" />');
                        $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_code_login');

                        $('#popup_secret_overlay').fadeIn(100);
                    } else if (data === 'user') {
                        var newUrl = window.location.protocol + "//" + window.location.host;
                        window.location.replace(newUrl);
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }

        return false;
    });
    // forgot pass
    $('#article .login_wrapper #forgot_form input[type="submit"]').click(function () {
        $('#loader').css('display', 'block');

        var _form = $(this).closest('form');
        var errors = new Array();

        // text fields
        var mail = $.trim(_form.find('input[name="mail"]').val());
        var captcha = $.trim($('input[name="keystring"]').val());

        if (!isValidMail(mail)) {
            errors.push('Please enter correct email!');
        }
        if (captcha === '') {
           errors.push('Wrong anti-spam answer');
        }

        if (errors.length > 0) {
            $('#loader').css('display', 'none');
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'forgotPass',
                    mail: mail,
                    captcha: captcha
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data === '') {
                        printDialog('Letter with instructions sent to the specified mail.');
                    } else {
                        printDialog(data);
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }

        return false;
    });
    // admin enter secret code
    $('#popup_secret_overlay').on("click", ".popup_save_code_login", function () {
        var code = $.trim($('#popup_secret input[name="code"]').val());

        if (code === '') {
            printDialog('Please enter code');
        } else {
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'adminEnterSecretCode',
                    code: code
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data !== '') {
                        printDialog(data);
                    } else {
                        var newUrl = window.location.protocol + "//" + window.location.host;
                        window.location.replace(newUrl);
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // wysiwyg redactor
    tinymce.init({
        selector: '#redactor',
        branding: false,
        menubar: false,
        external_plugins: {
            spoiler: '/plugin/spoiler/plugin.js'
        },
        toolbar: 'bold italic underline | forecolor | link unlink | removeformat | spoiler-add spoiler-remove | code',
        plugins: "link textcolor spoiler code",
        content_css: "/content/view/css/mycontent.css",
        relative_urls : 0,
        remove_script_host : 0,
        setup: function (ed) {
            /* toggle all labels that have the attr 'tinymce' */
            ed.on('init', function () {
                if (ed.getContent() !== '') {
                    $('label[for="redactor"]').hide();
                }

                $(ed.getDoc()).contents().find('body').focus(function () {
                    $('label[for="redactor"]').hide();
                });

                $(ed.getDoc()).contents().find('body').blur(function () {
                    if (ed.getContent() === '') {
                        $('label[for="redactor"]').show();
                    }
                });

                $('label[for="redactor"]').click(function () {
                    $(this).hide();
                    $(ed.getDoc()).contents().find('body').focus();
                });
            });

            ed.on('change', function(e) {
                $('#article .left_column_edit a.btn.btn_no_active').removeClass('btn_no_active');
            });
            ed.on('keyup', function(e) {
                $('#article .left_column_edit a.btn.btn_no_active').removeClass('btn_no_active');
            });
        }
    });
    // toggle spoiler
    $('.spoiler-toggle').click(function(){
        $(this).next().slideToggle();
    });
    // change home view mode
    $('.nav_wrapper .bottom .left #subsections ul.subsections_home li').click(function(){
        $('#loader').css('display','block');
        var clickElem = $(this).html();
        var viewP = ($('.nav_wrapper .bottom .left #subsections ul.subsections_home li.viewP').hasClass('active')) ? 1 : 0;
        var viewZ = ($('.nav_wrapper .bottom .left #subsections ul.subsections_home li.viewZ').hasClass('active')) ? 1 : 0;
        var viewAll = ($('.nav_wrapper .bottom .left #subsections ul.subsections_home li.viewAll').hasClass('active')) ? 1 : 0;
        var viewNotApprove = 0;
        $(this).toggleClass('active');

        if (clickElem === 'P') {
            if (viewP === 1) {
                viewP = 0;

                if (viewZ === 0) {
                    viewAll = 1;
                }
            } else {
                viewP = 1;
                viewAll = 0;
            }
        } else if (clickElem === 'Z') {
            if (viewZ === 1) {
                viewZ = 0;

                if (viewP === 0) {
                    viewAll = 1;
                }
            } else {
                viewZ = 1;
                viewAll = 0;
            }
        } else if (clickElem === 'All') {
            viewP = 0;
            viewZ = 0;
            viewAll = 1;
        } else {
            viewP = 0;
            viewZ = 0;
            viewAll = 1;
            viewNotApprove = ($('.nav_wrapper .bottom .left #subsections ul.subsections_home li.viewNotApprove').hasClass('active')) ? 1 : 0;
        }

        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'changeVisibleMode',
                viewP: viewP,
                viewZ: viewZ,
                viewAll: viewAll,
                viewNotApprove: viewNotApprove
            },
            success: function (data) {
                if (data !== '') {
                    printDialog(data);
                } else {
                    // var url = window.location.protocol + "//" + window.location.host;
                    // window.location.replace(url);

                    window.location.replace(window.location.pathname);
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display','none');
                printDialog(error200);
            }
        });
    });
    // admin mode
    $('header .admin_mode').click(function(){
        $('#loader').css('display','block');

        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'adminMode'
            },
            success: function (data) {
                if (data !== '') {
                    $('#loader').css('display','none');
                    printDialog(data);
                } else {
                    location.reload();
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display','none');
                printDialog(error200);
            }
        });
    });
    // view auth captcha if login and pass not empty
    $('#login_form input[name="login"], #login_form input[name="pass"]').focus(function(){
        if ($('#login_form input[name="keystring"]').length === 0 && viewAuthCaptcha === 0) {
            viewAuthCaptcha = 1;

            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'getCaptcha'
                },
                success: function (data) {
                    $('#login_form input[type="submit"]').parent().before(data);
                },
                error: function (jqXHR) {
                    printDialog(error200);
                }
            });
        }
    });
    // refresh auth captcha
    $('#article').on("click", ".refresh_login_captcha", function (e) {
        e.preventDefault();

        var id = Math.floor(Math.random()*1000000);
        $(this).prev().attr('src', '/plugin/kcaptcha/index.php?PHPSESSID=' + id);
    });
    // view forgot captcha if mail not empty
    $('#forgot_form input[name="mail"]').focus(function(){
        if ($('#forgot_form input[name="keystring"]').length === 0) {
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'getCaptcha'
                },
                success: function (data) {
                    $('#forgot_form input[type="submit"]').parent().before(data);
                },
                error: function (jqXHR) {
                    printDialog(error200);
                }
            });
        }
    });
    // close slider onclick inside container
    $(document).mouseup(function (e){
        var div = $('.lSSlideOuter #slider');
        var div2 = $('.lSSlideOuter .flexs_desc');
        var div3 = $('.lSSlideOuter #carousel');
        if (!div.is(e.target) && div.has(e.target).length === 0 &&
            !div2.is(e.target) && div2.has(e.target).length === 0 &&
            !div3.is(e.target) && div3.has(e.target).length === 0) {
            $('.lSSlideOuter').css({
                opacity: 0,
                visibility: 'hidden'
            });
        }
    });
});
// scroll top btn visible
$(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
        $('.back_to_top').fadeIn(200);
    } else {
        $('.back_to_top').fadeOut(200);
    }
});
// valid mail
function isValidMail(mail) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(mail);
}
// open new window
function newW(width, height, url) {
    var width = width;
    var height = height;
    var url = url;
    var leftPx = (screen.availWidth - width) / 2;
    var topPx = 5;
    var params = "top=" + topPx + ",left=" + leftPx + ",Toolbar=0,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=1,Resizable=0,Width=" + width + ",Height=" + height;
    var w = window.open(url, "newWindow", params);
    w.focus();
    return true;
}
// view jquery-ui modal
function printDialog(text) {
    $("#dialog p").html(text);
    $("#dialog").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}
// validate upload image by elem id
function validateImage(uploadId) {
    var fileSize = document.getElementById(uploadId).files[0].size;
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var dimension = fileName.split('.').pop().toLowerCase();

    if (fileSize > maxSize) {
        printDialog(errorMaxSize);
        $('#' + uploadId).prop('value', null);
    } else if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        printDialog('Mime-type not allowed! Only jpg, jpeg, png. Select another file or optimize an existing file');
        $('#' + uploadId).prop('value', null);
    }
}
// close popup
function closePopup() {
    $('#popup').css({
        position: 'absolute',
        display: 'none'
    });
    setTimeout(function () {
        $('#popup .popup_header').html('Change content');
        $('#popup .popup_content').html('');
        $('.popup_save').removeClass().addClass('popup_save');
    }, 110);
}