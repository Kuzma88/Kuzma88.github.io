$(function () {
    // only numbers in year input
    $('#article .left_column input[name="year"]').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        // Allow: home, end, left, right, down, up
                                (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
    // view plus and add photo label
    $('.left_column_add input[name="make"], .left_column_add input[name="title"]').keyup(function () {
        $('#article .right_column .add_photo_wrapper .add_photo_btn').css('display', 'block');
        $('#article .right_column .add_photo_wrapper .add_photo_label').css('display', 'block');
        $('#article .right_column .add_photo_wrapper .add_photo_maxsize').css('display', 'block');
    });
    // emulate btn image upload click
    $('#article .right_column .add_photo_wrapper .add_photo_btn, #article .right_column .add_photo_wrapper .add_photo_label').click(function () {
        var category = '';
        var title = '';
        var make = '';
        var errors = new Array();

        if ($('.left_column input[name="make"]').length === 0) {
            category = $.trim($('.left_column input[name="category"]').val());
            title = $.trim($('.left_column input[name="title"]').val());

            if (category === '') {
                $('.left_column input[name="category"]').prev().addClass('error');
                errors.push('Choose or create category');
            } else {
                $('.left_column input[name="category"]').prev().removeClass('error');
            }

            if (title === '') {
                $('.left_column input[name="title"]').prev().addClass('error');
                errors.push('Enter title first, please.');
            } else {
                $('.left_column input[name="title"]').prev().removeClass('error');
            }
        } else {
            make = $.trim($('.left_column input[name="make"]').val());

            if (make === '') {
                $('.left_column input[name="make"]').prev().addClass('error');
                errors.push('Enter make first, please.');
            } else {
                $('.left_column input[name="make"]').prev().removeClass('error');
            }
        }
        if (errors.length > 0) {
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $('#article .right_column .add_photo_wrapper #foto_upload').trigger('click');
        }

    });
    // visible checkbox in add/edit photo section. Can be only one
    $('.left_column input[name="visible_pz"], .left_column input[name="visible_f"]').change(function () {
        var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
        var visibleF = $('.left_column input[name="visible_f"]').is(':checked');

        if ($(this).attr('name') === 'visible_pz' && visiblePZ) {
            $('.left_column input[name="visible_f"]').prop('checked', false);
        } else if ($(this).attr('name') === 'visible_f' && visibleF) {
            $('.left_column input[name="visible_pz"]').prop('checked', false);
        }
    });
    // add gallery / Step 2
    $('.left_column').on("click", ".btn_add_to_gallery_step2, .btn_add_to_gallery_no_crop", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();

        var cropParam = $('#image_crop').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('imgSrc', $('#image_crop').attr('src'));
        formData.append('galleryId', $('#article .left_column').attr('data-id-gallery'));
        formData.append('photoId', $('#article .left_column').attr('data-id-photo'));
        formData.append('op', 'uploadGallerySecondStep');
        if ($(this).hasClass('btn_add_to_gallery_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxGallery.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        $('#image_crop').cropper("destroy");

                        $('.right_column .images_sortable').append('<li class="second_image_wrapper" data-id="' + data.id + '"><img src="/' + data.image + '" alt=""><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');
                        if (data.roleId === 1 || data.roleId === 2 || data.roleId === 3) {
                            if (typeof $('.right_column .images_sortable .second_image_wrapper_plus').html() === 'undefined') {
                                $('.right_column .images_sortable').append('<li class="second_image_wrapper_plus"><span class="plus">+</span></li>');
                            }
                        } else if (data.type === 'plate') {
                            if (typeof $('.right_column .images_sortable .second_image_wrapper_plus').html() === 'undefined') {
                                $('.right_column .images_sortable').append('<li class="second_image_wrapper_plus"><span class="plus">+</span><span class="add_vehicle">Add vehicle photo</span></li>');
                            }
                        }
                        $('.left_column input[name="copyright"]').prop('disabled', false);

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_gallery_step3">Save</a>');
                        $('#article .left_column').attr('data-id-photo', 0);
                    }
                } else {
                    printDialog('Error crop photo. Try again later.');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // add second photo to gallery
    $('.right_column').on("click", ".second_image_wrapper_plus", function (e) {
        e.preventDefault();
        $('#article .right_column #foto_upload_second').trigger('click');
    });
    $('.right_column').on("click", ".second_image_wrapper_plus_edit", function (e) {
        e.preventDefault();
        $('#article .right_column #foto_upload_second_edit').trigger('click');
    });
    // second step upload second gallery image
    $('.left_column').on("click", ".btn_add_to_gallery_second_step2, .btn_add_to_gallery_second_no_crop", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();

        var cropParam = $('#image_crop').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('imgSrc', $('#image_crop').attr('src'));
        formData.append('galleryId', $('#article .left_column').attr('data-id-gallery'));
        formData.append('photoId', $('#article .left_column').attr('data-id-photo'));
        formData.append('op', 'uploadSecondPhotoGalleryCrop');
        if ($(this).hasClass('btn_add_to_gallery_second_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        var type = $('.left_column select[name="photo_type"]').val();
        formData.append('type_photo', type);

        $.ajax({
            url: "/ajax/ajaxGallery.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        $('#image_crop').cropper("destroy");
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').before('<li class="second_image_wrapper" data-id="' + data.id + '"><img src="/' + data.image + '" alt=""><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');
                        if (typeof $('.right_column .images_sortable .second_image_wrapper_plus').html() === 'undefined') {
                            $('.right_column .images_sortable').append('<li class="second_image_wrapper_plus"><span>+</span></li>');
                        }
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','block');

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_gallery_step3">Save</a>');
                        $('.left_column input[name="copyright"]').prop('disabled', false);
                        $('#article .left_column').attr('data-id-photo', 0);
                    }
                } else {
                    printDialog('Error crop photo. Try again later.');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // second step upload second gallery image - edit mode
    $('.left_column').on("click", ".btn_add_to_gallery_second_step2_edit, .btn_add_to_gallery_second_no_crop_edit", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();
        var galleryId = $('.left_column').attr('data-id-gallery');

        var cropParam = $('#image_main_edit').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('galleryId', galleryId);
        formData.append('imgSrc', $('#image_main_edit').attr('src'));
        formData.append('op', 'uploadSecondPhotoGalleryCropEdit');
        if ($(this).hasClass('btn_add_to_gallery_second_step2_edit')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        var type = $('.left_column select[name="photo_type"]').val();
        formData.append('type_photo', type);

        $.ajax({
            url: "/ajax/ajaxGallery.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        $('#image_main_edit').cropper("destroy");
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').before('<li class="second_image_wrapper" data-id="' + data.id + '"><img src="/' + data.image + '" alt="" data-type_photo="' + type + '"><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');

                        $('.left_column .btn_wrapper a').remove();
                        if ($('.left_column').hasClass('left_column_approve')) {
                            $('.left_column .btn_wrapper').append('<a class="btn btn_save_approve_gallery ">Approve</a>');
                        } else {
                            $('.left_column .btn_wrapper').append('<a class="btn btn_save_edit_gallery">Save</a>');
                        }
                        $('.left_column input[name="copyright"]').prop('disabled', false);
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','block');
                    }
                } else {
                    printDialog('Error crop photo. Try again later.');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // save small description photo
    $('.right_column').on("change", ".add_photo_second_wrapper .second_image_wrapper input", function (e) {
        e.preventDefault();

        var photoId = $(this).closest('li').attr('data-id');
        var smallDesc = $(this).val();

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxGallery.php",
            data: {
                op: 'saveSmallDescription',
                photoId: photoId,
                smallDesc: smallDesc
            },
            success: function (data) {
                if (data !== '') {
                    printDialog(data);
                }
            },
            error: function (jqXHR) {
                printDialog(error200);
            }
        });
    });
    // sortable gallery
    $("ul.images_sortable").sortable({
        items: "li.second_image_wrapper",
        cursor: "move",
        forcePlaceholderSize: true,
        opacity: 0.5,
        stop: function () {
            var sort = new Array();

            $("#article .right_column .add_photo_second_wrapper .second_image_wrapper").each(function (i, elem) {
                sort.push($(elem).attr('data-id'));
            });

            if (sort.length > 1) {
                $.ajax({
                    type: "POST",
                    url: "/ajax/ajaxGallery.php",
                    data: {
                        op: 'sortGallery',
                        sort: sort,
                        galleryId: $('#article .left_column').attr('data-id-gallery')
                    },
                    success: function (data) {
                        if (data !== '') {
                            printDialog(data);
                        } else {
                            $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
                        }
                    },
                    error: function (jqXHR) {
                        printDialog(error200);
                    }
                });
            }
        }
    });
    // add gallery / Step 3 / Save all
    $('.left_column').on("click", ".btn_add_to_gallery_step3", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var desc = tinymce.get('redactor').getContent();
        var visible = 'all';
        var keywords = '';
        var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
        var visibleF = $('.left_column input[name="visible_f"]').is(':checked');
        var typePhoto = $('#article .left_column .input_wrapper select[name="photo_type"]').val();

        if (visiblePZ) {
            visible = 'pz';
        } else if (visibleF) {
            visible = 'friends';
        }

        $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
            keywords += $(elem).html() + ',';
        });
        keywords = keywords.substr(0, keywords.length - 1);

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxGallery.php",
            dataType: "json",
            data: {
                op: 'activateGallery',
                desc: desc,
                visible: visible,
                keywords: keywords,
                typePhoto: typePhoto,
                galleryId: $('#article .left_column').attr('data-id-gallery')
            },
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {

                    var url = window.location.protocol + "//" + window.location.host;
                    if (data.status == 1) {
                        window.location.replace(url + '/' + data.link);
                    } else {
                        $.cookies.set('addGallery', 1, {hoursToLive: 1});
                        window.location.replace(url + '/gallery/' + data.typePath);
                    }
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // close thank add another photo block
    $('.thank_add .fa').click(function () {
        $('.thank_add').slideUp();
    });
    // open gallery slider
    $('#article .right_column .add_photo_wrapper_view img').click(function () {
        var index = $(this).attr('data-id');
        $('#slider').flexslider(index - 1);

        var heightDesc = $('.lSSlideOuter .flexs_desc').outerHeight();
        var heightCarousel = $('.lSSlideOuter #carousel').outerHeight();

        var pageSize = getPageSize();
        var windowHeight = pageSize[3];

        var newSlideHeight = Math.round(windowHeight - heightDesc - heightCarousel - windowHeight * 2 / 100);
        if (heightDesc !== 20) {
            newSlideHeight -= 12;
        }
        $('.lSSlideOuter #slider').css('height', newSlideHeight);
        $('.lSSlideOuter #slider .flex-viewport').css('lineHeight', (newSlideHeight - 10) + 'px');
        $('.lSSlideOuter #slider img').css('maxHeight', newSlideHeight - 10);

        $('.lSSlideOuter').css({
            opacity: 1,
            visibility: 'visible'
        });
    });
    $('#slider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        sync: "#carousel",
        prevText: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
        nextText: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
        after: function(slider){
            var activeNumberBig = $(slider).find(".flex-active-slide").attr("data-id");
            var activeSmallItem = $('#carousel .slides li.flex-active-slide');
            var countSlides = $('#carousel .slides li').length;
            if (countSlides > 4) {
                if (activeSmallItem.attr('data-id') != activeNumberBig) {
                    $('#carousel .slides li').removeClass('flex-active-slide');
                    $('#carousel .slides li[data-id="' + activeNumberBig + '"]').addClass('flex-active-slide');
                }
                if (activeNumberBig == 1) {
                    $('#carousel').flexslider(0);
                } else if (activeNumberBig == countSlides) {
                    $('#carousel').flexslider(countSlides - 1);
                }
            }
        }
    });
    $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        itemWidth: 200,
        itemMargin: 5,
        asNavFor: '#slider',
        prevText: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
        nextText: '<i class="fa fa-caret-right" aria-hidden="true"></i>'
    });
    // close gallery slider
    $('#slider .fa-times').click(function () {
        $('.lSSlideOuter').css({
            opacity: 0,
            visibility: 'hidden'
        });
    });
    // keywords autocomplete
    $('.left_column input[name="keywords"]').autocomplete({
        source: "/ajax/ajaxKeywords.php?type=" + $('.left_column select[name="photo_type"]').val(),
        minLength: 1,
        select: function (event, ui) {
            var keywords = [];
            $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
                keywords.push($.trim($(elem).html()));
            });

            if (keywords.indexOf(ui.item.value) === -1) {
                $('#article .left_column .tag_block .keyword_list').append('<div><span>' + ui.item.value + '</span><i class="fa fa-times" aria-hidden="true"></i></div>');
            }
            setTimeout(function () {
                $('.left_column input[name="keywords"]').val('');
            }, 200);
        }
    });
    $('.left_column input[name="keywords"]').keypress(function (e) {
        if (e.which === 13) { // if enter
            var words = $.trim($(this).val());
            $(this).autocomplete('close');

            if (words !== '') {
                $(this).val('');

                var keywords = [];
                $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
                    keywords.push($.trim($(elem).html()));
                });

                if (words.indexOf(' ') + 1) {
                    var parts = words.split(' ');
                    $.each(parts, function (index, value) {
                        if (keywords.indexOf(words) === -1) {
                            $('#article .left_column .tag_block .keyword_list').append('<div><span>' + value + '</span><i class="fa fa-times" aria-hidden="true"></i></div>');
                        }
                    });
                } else {
                    if (keywords.indexOf(words) === -1) {
                        $('#article .left_column .tag_block .keyword_list').append('<div><span>' + words + '</span><i class="fa fa-times" aria-hidden="true"></i></div>');
                    }
                }
            }
        }
    });
    // make autocomplete
    $('.left_column input[name="make"]').autocomplete({
        source: "/ajax/ajaxMake.php",
        minLength: 1
    });
    // various category autocomplete
    $('.left_column input[name="category"]').autocomplete({
        source: "/ajax/ajaxVariousCategory.php",
        minLength: 0
    }).focus(function () {
        $(this).data("uiAutocomplete").search($(this).val());
    });
    // model autocomplete
    $('.left_column input[name="model"]').autocomplete({
        source: function (request, response) {
            $.getJSON("/ajax/ajaxModel.php", {term: request.term, make: $('.left_column input[name="make"]').val(), type: $('.left_column select[name="photo_type"]').val()}, response);
        },
        minLength: 0
    }).focus(function () {
        $(this).data("uiAutocomplete").search($(this).val());
    });
    // keywords delete
    $('.left_column').on("click", ".tag_block .keyword_list .fa", function () {
        $(this).closest('div').remove();
    });
    // remove main photo open popup. Edit mode
    $('#article .right_column .add_photo_wrapper .remove_main_photo').click(function () {
        $('#popup_remove_photo_overlay').fadeIn(200);
    });
    // close remove photo popup
    $('.popup_remove_photo_no').click(function () {
        $('#popup_remove_photo_overlay').fadeOut(200);
    });
    // remove big photo
    $('.popup_remove_photo_yes').click(function () {
        var qtImagesInGallery = $('#article .right_column .add_photo_second_wrapper .second_image_wrapper').length;
        var galleryId = $('.left_column').attr('data-id-gallery');

        if (qtImagesInGallery === 1) {
            $.ajax({
                type: "POST",
                url: "/ajax/ajaxGallery.php",
                data: {
                    op: 'deleteGallery',
                    galleryId: galleryId
                },
                success: function (data) {
                    var url = window.location.protocol + "//" + window.location.host + '/gallery/plates';
                    window.location.replace(url);
                },
                error: function (jqXHR) {
                    printDialog(error200);
                }
            });
        } else {
            var srcBig = $('#article .right_column_edit .add_photo_wrapper_edit #image_main_edit').attr('src'); // original!!

            if (srcBig.indexOf('?') + 1) {
                var imgSrcArray = srcBig.split('?');
                srcBig = imgSrcArray[0];
            }
            
            $.ajax({
                type: "POST",
                url: "/ajax/ajaxGallery.php",
                data: {
                    op: 'deleteOnePhotoGallery',
                    galleryId: galleryId,
                    srcBig: srcBig
                },
                success: function (data) {
                    $('#popup_remove_photo_overlay').fadeOut(200);
                    if (data === 'er') {
                        printDialog('Error delete photo. Try again later.');
                    } else {
                        // find number preview
                        var srcPreview = '';
                        if (srcBig.indexOf('_original') + 1) {
                            srcPreview = srcBig.replace('original', 'preview');
                        }

                        var numberPreview = 0;
                        $(".images_sortable img").each(function (i, elem) {
                            var baseSrc = '';
                            if ($(elem).attr('src').indexOf('?') + 1) {
                                var allSrc = $(elem).attr('src').split('?');
                                baseSrc = allSrc[0];
                            } else {
                                baseSrc = $(elem).attr('src');
                            }

                            if (baseSrc === srcPreview) {
                                numberPreview = i;
                                return false;
                            }
                        });

                        // remove preview
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper').eq(numberPreview).remove();
                        
                        // replace main photo
                        $('#article .right_column .add_photo_wrapper #image_main_edit').attr('src', '/' + data);
                        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
                    }
                },
                error: function (jqXHR) {
                    $('#popup_remove_photo_overlay').fadeOut(200);
                    printDialog(error200);
                }
            });
        }
    });
    // view mode. Replace big photo from small
    $('.second_image_wrapper_view img').click(function () {
        var newImgPath = $(this).attr('src');
        var numb = $(this).attr('data-id');

        newImgPath = newImgPath.replace('preview', 'original');

        $('#article .right_column .add_photo_wrapper_view img').attr('src', newImgPath).attr('data-id', numb);
    });
    // edit mode. Replace big photo from small
    $('.right_column_edit .add_photo_second_wrapper img').click(function () {
        var newImgPath = $(this).attr('src');
        var newImgType = $(this).attr('data-type_photo');

        newImgPath = newImgPath.replace('preview', 'original');

        $('#article .right_column_edit .add_photo_wrapper_edit #image_main_edit').attr('src', newImgPath);
        $('#article .left_column .input_wrapper select[name="photo_type"]').val(newImgType);
    });
    // delete page gallery
    $('.delete_page_gallery').click(function () {
        $('#popup_remove_gallery_page_overlay').fadeIn(100);
    });
    $('.popup_remove_gallery_page_yes').click(function () {
        var galleryId = $('.left_column').attr('data-id-gallery');

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxGallery.php",
            data: {
                op: 'deleteGallery',
                galleryId: galleryId
            },
            success: function (data) {
                var url = window.location.protocol + "//" + window.location.host + '/gallery/plates';
                window.location.replace(url);
            },
            error: function (jqXHR) {
                printDialog(error200);
            }
        });
    });
    $('.popup_remove_gallery_page_no').click(function () {
        $('#popup_remove_gallery_page_overlay').fadeOut(100);
    });
    // re-upload main photo
    $('.replace_main_photo').click(function () {
        $('#article .right_column .add_photo_wrapper #foto_upload_edit').trigger('click');
    });
    // second step reupload gallery image
    $('.left_column').on("click", ".btn_replace_gallery_second_step2, .btn_replace_gallery_second_no_crop", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();

        var cropParam = $('#image_main_edit').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        var imgCache = $('#image_main_edit').attr('src');
        var imgSrc = $('#image_main_edit').attr('data-old');
        formData.append('imgCache', imgCache);
        formData.append('imgSrc', imgSrc);
        formData.append('op', 'reuploadPhotoGalleryPreview');
        if ($(this).hasClass('btn_replace_gallery_second_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxGallery.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        $('#image_main_edit').cropper("destroy");

                        if (imgSrc.indexOf('?') + 1) {
                            var imgSrcArray = imgSrc.split('?');
                            imgSrc = imgSrcArray[0];
                        }

                        $('#image_main_edit').attr('src', imgSrc + '?' + Math.floor((Math.random() * 100) + 1));
                        // find number preview
                        var numberPreview = 0;
                        $(".images_sortable img").each(function (i, elem) {
                            var baseSrc = '';
                            if ($(elem).attr('src').indexOf('?') + 1) {
                                var allSrc = $(elem).attr('src').split('?');
                                baseSrc = allSrc[0];
                            } else {
                                baseSrc = $(elem).attr('src');
                            }

                            if (baseSrc === imgCache) {
                                numberPreview = i;
                                return false;
                            }
                        });

                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper').eq(numberPreview).find('img').attr('src', data.image + '?' + Math.floor((Math.random() * 100) + 1));

                        $('.left_column .btn_wrapper a').remove();
                        if ($('.left_column').hasClass('left_column_approve')) {
                            $('.left_column .btn_wrapper').append('<a class="btn btn_save_approve_gallery ">Approve</a>');
                        } else {
                            $('.left_column .btn_wrapper').append('<a class="btn btn_save_edit_gallery">Save</a>');
                        }

                        $('.left_column input[name="copyright"]').prop('disabled', false);
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','block');
                    }
                } else {
                    printDialog('Error crop photo. Try again later.');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // update no-active btn save edit gallery to active btn
    $('.left_column_edit input[type="text"]').keyup(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
    });
    $('#article .left_column .tag_block .keyword_list div .fa').click(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
    });
    $('.left_column_edit input[type="checkbox"]').change(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
    });
    $('.right_column_edit .second_image_wrapper input').keyup(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
    });
    $('.left_column_edit select').change(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');

        var newType = $(this).val();
        var curImgSrcBig = $('#image_main_edit').attr('src');
        var curImgSrcPreview = curImgSrcBig.replace('original', 'preview');

        // disable ?
        if (curImgSrcPreview.indexOf('?') + 1) {
            curImgSrcPreview = curImgSrcPreview.split('?');
            curImgSrcPreview = curImgSrcPreview[0];
        }

        var numberPreview = 0;
        $(".images_sortable img").each(function (i, elem) {
            var baseSrc = '';
            if ($(elem).attr('src').indexOf('?') + 1) {
                var allSrc = $(elem).attr('src').split('?');
                baseSrc = allSrc[0];
            } else {
                baseSrc = $(elem).attr('src');
            }

            if (baseSrc === curImgSrcPreview) {
                numberPreview = i;
                return false;
            }
        });

        $('#article .right_column_edit .add_photo_second_wrapper .second_image_wrapper').eq(numberPreview).find('img').attr('data-type_photo', newType);
    });
    // save edit gallery
    $('.left_column').on("click", ".btn_save_edit_gallery", function (e) {
        e.preventDefault();

        if ($(this).hasClass('btn_no_active')) {
            return false;
        } else {
            var errors = new Array();
            var make = '';
            var model = '';
            var year = '';
            var copyright = 1;
            var category = '';
            var title = '';
            var pattern = new RegExp(/^[А-ЯЄІЇЁа-яєіїёA-Za-z0-9\-\/\=\+\(\)\.\'\,\"\&\: ]+$/);

            if ($('.left_column input[name="make"]').length === 0) {
                category = $.trim($('.left_column input[name="category"]').val());
                title = $.trim($('.left_column input[name="title"]').val());

                if (category === '') {
                    $('.left_column input[name="category"]').prev().addClass('error');
                    errors.push('Choose or create category');
                } else {
                    $('.left_column input[name="category"]').prev().removeClass('error');
                }

                if (title === '') {
                    $('.left_column input[name="title"]').prev().addClass('error');
                    errors.push('Enter the title');
                } else {
                    $('.left_column input[name="title"]').prev().removeClass('error');
                }

                if ((!pattern.test(category) && category !== '') || (!pattern.test(title) && title !== '')) {
                    errors.push('Only English/Ukrainian/Russian letters allowed');
                }
            } else {
                make = $.trim($('.left_column input[name="make"]').val());
                model = $.trim($('.left_column input[name="model"]').val());
                year = $.trim($('.left_column input[name="year"]').val());
                copyright = $('.left_column input[name="copyright"]').is(':checked');
                copyright = (copyright) ? 0 : 1;

                if (make === '') {
                    $('.left_column input[name="make"]').prev().addClass('error');
                    errors.push('Enter the make');
                } else {
                    $('.left_column input[name="make"]').prev().removeClass('error');
                }

                if ((!pattern.test(make) || (!pattern.test(model)) && model !== '')) {
                    errors.push('Only English/Ukrainian/Russian letters allowed');
                }
            }

            var desc = tinymce.get('redactor').getContent();
            var visible = 'all';
            var keywords = '';
            var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
            var visibleF = $('.left_column input[name="visible_f"]').is(':checked');
            var photosType = {};

            if (visiblePZ) {
                visible = 'pz';
            } else if (visibleF) {
                visible = 'friends';
            }

            $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
                keywords += $(elem).html() + ',';
            });
            keywords = keywords.substr(0, keywords.length - 1);

            var galleryId = $('.left_column').attr('data-id-gallery');

            $("#article .right_column .add_photo_second_wrapper .second_image_wrapper").each(function (i, elem) {
                var id = $(elem).attr('data-id');
                var typePhoho = $(elem).children('img').attr('data-type_photo');

                photosType[id] = typePhoho;
            });

            if (errors.length > 0) {
                var printEr = '';
                for (i = 0; i < errors.length; i++) {
                    printEr += errors[i] + '<br>';
                }
                printDialog(printEr);
            } else {
                var formData = new FormData();
                formData.append('op', 'updateGallery');
                formData.append('make', make);
                formData.append('model', model);
                formData.append('year', year);
                formData.append('galleryId', galleryId);
                formData.append('desc', desc);
                formData.append('visible', visible);
                formData.append('copyright', copyright);
                formData.append('keywords', keywords);
                formData.append('category', category);
                formData.append('title', title);
                formData.append('photosType', JSON.stringify(photosType));

                $.ajax({
                    url: "/ajax/ajaxGallery.php",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (data) {
                        $('#loader').css('display', 'none');
                        if (data !== '') {
                            if (data.error) {
                                printDialog(data.error);
                            } else {
                                var url = window.location.protocol + "//" + window.location.host;
                                if (data.status == 1) {
                                    window.location.replace(url + '/' + data.link);
                                } else {
                                    window.location.replace(url + '/gallery/plates');
                                }
                            }
                        } else {
                            printDialog('Error update gallery. Try again later');
                        }
                    },
                    error: function (jqXHR) {
                        $('#loader').css('display', 'none');
                        printDialog(error200);
                    }
                });
            }
        }
    });
    // approve edit gallery
    $('.left_column').on("click", ".btn_save_approve_gallery", function (e) {
        e.preventDefault();

        var typePhoto = $('.left_column select[name="photo_type"]').val();
        var make = $.trim($('.left_column input[name="make"]').val());
        var model = $.trim($('.left_column input[name="model"]').val());
        var desc = tinymce.get('redactor').getContent();
        var year = $.trim($('.left_column input[name="year"]').val());
        var visible = 'all';
        var copyright = $('.left_column input[name="copyright"]').is(':checked');
        var keywords = '';
        var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
        var visibleF = $('.left_column input[name="visible_f"]').is(':checked');
        var photosType = {};

        if (visiblePZ) {
            visible = 'pz';
        } else if (visibleF) {
            visible = 'friends';
        }

        copyright = (copyright) ? 0 : 1;

        $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
            keywords += $(elem).html() + ',';
        });
        keywords = keywords.substr(0, keywords.length - 1);

        var galleryId = $('.left_column').attr('data-id-gallery');

        $("#article .right_column .add_photo_second_wrapper .second_image_wrapper").each(function (i, elem) {
            var id = $(elem).attr('data-id');
            var typePhoho = $(elem).children('img').attr('data-type_photo');

            photosType[id] = typePhoho;
        });

        var formData = new FormData();
        formData.append('op', 'approveGallery');
        formData.append('make', make);
        formData.append('model', model);
        formData.append('year', year);
        formData.append('galleryId', galleryId);
        formData.append('desc', desc);
        formData.append('visible', visible);
        formData.append('copyright', copyright);
        formData.append('keywords', keywords);
        formData.append('photosType', JSON.stringify(photosType));

        $.ajax({
            url: "/ajax/ajaxGallery.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        var url = window.location.protocol + "//" + window.location.host;
                        window.location.replace(url + '/' + data.link);
                    }
                } else {
                    printDialog('Error update gallery. Try again later');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // insert cursor to input when click on pencil
    $('.add_photo_second_wrapper').on("click", ".fa-pencil", function (e) {
        e.preventDefault();

        $(this).prev().focus();
    });
});
// valid image upload
function uploadGalleryImageFirstStep(uploadId) {
    var errors = new Array();
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();
    var type = $('.left_column select[name="photo_type"]').val();
    var make = '';
    var model = '';
    var year = '';
    var copyright = 1;
    var pattern = new RegExp(/^[А-ЯЄІЇЁа-яєіїёA-Za-z0-9\-\/\=\+\(\)\.\'\,\"\&\: ]+$/);
    var category = '';
    var title = '';

    if ($('.left_column input[name="make"]').length === 0) {
        category = $.trim($('.left_column input[name="category"]').val());
        title = $.trim($('.left_column input[name="title"]').val());

        if (category === '') {
            $('.left_column input[name="category"]').prev().addClass('error');
            errors.push('Choose or create category');
        } else {
            $('.left_column input[name="category"]').prev().removeClass('error');
        }

        if (title === '') {
            $('.left_column input[name="title"]').prev().addClass('error');
            errors.push('Enter title first, please.');
        } else {
            $('.left_column input[name="title"]').prev().removeClass('error');
        }

        if ((!pattern.test(category) && category !== '') || (!pattern.test(title) && title !== '')) {
            errors.push('Only English/Ukrainian/Russian letters allowed');
        }
    } else {
        make = $.trim($('.left_column input[name="make"]').val());
        model = $.trim($('.left_column input[name="model"]').val());
        year = $.trim($('.left_column input[name="year"]').val());
        copyright = $('.left_column input[name="copyright"]').is(':checked');
        copyright = (copyright) ? 0 : 1;

        if (make === '') {
            $('.left_column input[name="make"]').prev().addClass('error');
            errors.push('Enter make first, please.');
        } else {
            $('.left_column input[name="make"]').prev().removeClass('error');
        }

        if ((!pattern.test(make) || (!pattern.test(model)) && model !== '')) {
            errors.push('Only English/Ukrainian/Russian letters allowed');
        }
    }

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        errors.push('Mime-type not allowed! Only jpg, jpeg, png.');
        $('#article .right_column .add_photo_wrapper .add_photo_label').addClass('error');
    }
    if (fileSize > maxSize) {
        errors.push(errorMaxSize);
        $('#article .right_column .add_photo_wrapper .add_photo_label').addClass('error');
    }

    if (errors.length > 0) {
        var printEr = '';
        for (i = 0; i < errors.length; i++) {
            printEr += errors[i] + '<br>';
        }
        printDialog(printEr);
        $('#article .right_column .add_photo_wrapper input[type="file"]').prop('value', null);
    } else {
        if (typeof $('#' + uploadId)[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append($('#' + uploadId).attr('name'), $('#' + uploadId)[0].files[0]);

            formData.append('type', type);
            formData.append('make', make);
            formData.append('model', model);
            formData.append('year', year);
            formData.append('copyright', copyright);
            formData.append('category', category);
            formData.append('title', title);
            formData.append('galleryId', $('#article .left_column').attr('data-id-gallery'));
            formData.append('op', 'uploadGalleryImageFirstStep');

            $.ajax({
                url: "/ajax/ajaxGallery.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_wrapper input[type="file"]').prop('value', null);
                    if (data !== '') {
                        if (data.error) {
                            printDialog(data.error);
                        } else {
                            $('#article .right_column .add_photo_wrapper').html('<img src="/' + data.image + '" id="image_crop" alt="">');
                            $('.left_column input[name="make"], .left_column input[name="model"], .left_column input[name="year"], .left_column input[name="copyright"], .left_column input[name="category"], .left_column input[name="title"]').prop('disabled', true);

                            var $image = $('#image_crop');
                            $image.cropper({
                                viewMode: 2,
                                aspectRatio: 1.45 / 1,
                                minCropBoxWidth: 200,
                                minCropBoxHeight: 138,
                                scalable: false,
                                rotatable: false,
                                movable: false,
                                zoomable: false,
                                autoCropArea: 1
                            });

                            // ajax save and go to step 2
                            $('.left_column .btn_wrapper a').remove();
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_gallery_step2">Next</a><a class="btn btn_add_to_gallery_no_crop">No crop</a>');
                            $('#article .left_column').attr('data-id-photo', data.idPhoto);
                        }
                    } else {
                        printDialog('Error upload photo');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_wrapper input[type="file"]').prop('value', null);
                    printDialog(error200);
                }
            });
        }
    }
}
// valid second image upload
function uploadSecondGalleryImageFirstStep(uploadId) {
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        printDialog('Mime-type not allowed! Only jpg, jpeg, png.');
    } else if (fileSize > maxSize) {
        printDialog(errorMaxSize);
    } else {
        if (typeof $('#' + uploadId)[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append($('#' + uploadId).attr('name'), $('#' + uploadId)[0].files[0]);

            if ($('.left_column input[name="make"]').length === 0) {
                var copyright = 1;
            } else {
                var copyright = $('.left_column input[name="copyright"]').is(':checked');
                copyright = (copyright) ? 0 : 1;
            }

            formData.append('op', 'uploadSecondGalleryImageFirstStep');
            formData.append('galleryId', $('#article .left_column').attr('data-id-gallery'));
            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxGallery.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_second_wrapper input[type="file"]').prop('value', null);
                    if (data !== '') {
                        if (data.error) {
                            printDialog(data.error);
                        } else {
                            $('#article .right_column .add_photo_wrapper').html('<img src="/' + data.image + '" id="image_crop" alt="">');
                            $('.left_column .btn_wrapper a').remove();
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_gallery_second_step2">Next</a><a class="btn btn_add_to_gallery_second_no_crop">No crop</a>');
                            if (data.roleId >= 1 && data.roleId <= 4) {
                                if (data.typePath === 'vehicle') {
                                    var newOptions = {
                                        "Vehicle": "vehicle",
                                        "Other": "other"
                                    };
                                } else {
                                    var newOptions = {
                                        "Plate": "plate",
                                        "Vehicle": "vehicle",
                                        "Other": "other"
                                    };
                                }
                                $('select[name="photo_type"]').empty(); // remove old options
                                $.each(newOptions, function (key, value) {
                                    $('select[name="photo_type"]').append($("<option></option>").attr("value", value).text(key));
                                });
                                if (data.typePath === 'plate') {
                                    $('select[name="photo_type"]').val('vehicle');
                                } else {
                                    $('select[name="photo_type"]').val(data.typePath);
                                }
                            } else if (data.typePath === 'plate') {
                                $('select[name="photo_type"]').empty().append($("<option></option>").attr("value", "vehicle").text("vehicle"));
                            }

                            var $image = $('#image_crop');
                            $image.cropper({
                                viewMode: 2,
                                aspectRatio: 1.45 / 1,
                                minCropBoxWidth: 200,
                                minCropBoxHeight: 138,
                                scalable: false,
                                rotatable: false,
                                movable: false,
                                zoomable: false,
                                autoCropArea: 1
                            });
                            $('.left_column input[name="copyright"]').prop('disabled', true);
                            $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','none');
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                            $('#article .left_column').attr('data-id-photo', data.idPhoto);
                        }
                    } else {
                        printDialog('Error upload photo. Try again later');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_second_wrapper input[type="file"]').prop('value', null);
                    printDialog(error200);
                }
            });
        }
    }
}
// valid replace main image upload
function uploadReplaceGalleryImageFirstStep(uploadId) {
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();
    var copyright = 1;

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        printDialog('Mime-type not allowed! Only jpg, jpeg, png.');
        $('#article .right_column .add_photo_wrapper_edit input[type="file"]').prop('value', null);
    } else if (fileSize > maxSize) {
        printDialog(errorMaxSize);
        $('#article .right_column .add_photo_wrapper_edit input[type="file"]').prop('value', null);
    } else {
        if (typeof $('#' + uploadId)[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append($('#' + uploadId).attr('name'), $('#' + uploadId)[0].files[0]);

            if ($('.left_column input[name="make"]').length !== 0) {
                copyright = $('.left_column input[name="copyright"]').is(':checked');
                copyright = (copyright) ? 0 : 1;
            }

            var bigImgSrc = $('#image_main_edit').attr('src'); // original!
            var galleryId = $('.left_column').attr('data-id-gallery');
            formData.append('galleryId', galleryId);
            formData.append('bigImgSrc', bigImgSrc);
            formData.append('op', 'uploadReplaceGalleryImageFirstStep');

            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxGallery.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_wrapper_edit input[type="file"]').prop('value', null);
                    if (data !== '') {
                        if (data.error) {
                            printDialog(data.error);
                        } else {
                            $('#article .right_column #image_main_edit').remove();
                            $('<img src="/' + data.image + '" id="image_main_edit" alt="" data-old="' + bigImgSrc + '">').insertAfter($('#article .right_column .add_photo_wrapper_edit form'));
                            $('.left_column .btn_wrapper a').remove();
                            $('.left_column .btn_wrapper').append('<a class="btn btn_replace_gallery_second_step2">Next</a><a class="btn btn_replace_gallery_second_no_crop">No crop</a>');

                            var $image = $('#image_main_edit');
                            $image.cropper({
                                viewMode: 2,
                                aspectRatio: 1.45 / 1,
                                minCropBoxWidth: 200,
                                minCropBoxHeight: 138,
                                scalable: false,
                                rotatable: false,
                                movable: false,
                                zoomable: false,
                                autoCropArea: 1
                            });

                            // replace img preview
                            if (bigImgSrc.indexOf('?') + 1) {
                                bigImgSrc = bigImgSrc.split('?');
                                bigImgSrc = bigImgSrc[0];
                            }

                            var smallOldSrc = bigImgSrc.replace('original', 'preview');
                            var smallNewSrc = data.image.replace('original', 'preview');

                            var numberPreview = 0;
                            $(".images_sortable img").each(function (i, elem) {
                                var baseSrc = '';
                                if ($(elem).attr('src').indexOf('?') + 1) {
                                    var allSrc = $(elem).attr('src').split('?');
                                    baseSrc = allSrc[0];
                                } else {
                                    baseSrc = $(elem).attr('src');
                                }

                                if (baseSrc === smallOldSrc) {
                                    numberPreview = i;
                                    return false;
                                }
                            });
                            $('#article .right_column .add_photo_second_wrapper .second_image_wrapper').eq(numberPreview).find('img').attr('src', '/' + smallNewSrc + '?' + Math.floor((Math.random() * 100) + 1));

                            $('.left_column input[name="copyright"]').prop('disabled', true);
                            $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','none');
                        }
                    } else {
                        printDialog('Error upload photo. Try again later');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_wrapper_edit input[type="file"]').prop('value', null);
                    printDialog(error200);
                }
            });
        }
    }
}
// valid second image upload
function uploadSecondGalleryImageFirstStepEdit(uploadId) {
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        printDialog('Mime-type not allowed! Only jpg, jpeg, png.');
    } else if (fileSize > maxSize) {
        printDialog(errorMaxSize);
    } else {
        if (typeof $('#' + uploadId)[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append($('#' + uploadId).attr('name'), $('#' + uploadId)[0].files[0]);

            var type = $('.left_column select[name="photo_type"]').val();
            var galleryId = $('.left_column').attr('data-id-gallery');
            formData.append('type', type);
            formData.append('galleryId', galleryId);
            formData.append('op', 'uploadSecondGalleryImageFirstStepEdit');

            var copyright = $('.left_column input[name="copyright"]').is(':checked');
            copyright = (copyright) ? 0 : 1;
            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxGallery.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_second_wrapper input[type="file"]').prop('value', null);
                    if (data !== '') {
                        if (data.error) {
                            printDialog(data.error);
                        } else {
                            $('#article .right_column #image_main_edit').remove();
                            $('<img src="/' + data.image + '" id="image_main_edit" alt="">').insertAfter($('#article .right_column .add_photo_wrapper_edit form'));
                            $('.left_column .btn_wrapper a').remove();
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_gallery_second_step2_edit">Next</a><a class="btn btn_add_to_gallery_second_no_crop_edit">No crop</a>');
                            var newOptions = {
                                "Plate": "plate",
                                "Vehicle": "vehicle",
                                "Other": "other"
                            };
                            $('select[name="photo_type"]').empty(); // remove old options
                            $.each(newOptions, function (key, value) {
                                $('select[name="photo_type"]').append($("<option></option>").attr("value", value).text(key));
                            });
                            if (type === 'plate') {
                                $('select[name="photo_type"]').val('vehicle');
                            } else {
                                $('select[name="photo_type"]').val(type);
                            }

                            var $image = $('#image_main_edit');
                            $image.cropper({
                                viewMode: 2,
                                aspectRatio: 1.45 / 1,
                                minCropBoxWidth: 200,
                                minCropBoxHeight: 138,
                                scalable: false,
                                rotatable: false,
                                movable: false,
                                zoomable: false,
                                autoCropArea: 1
                            });
                        }
                        $('.left_column input[name="copyright"]').prop('disabled', true);
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','none');
                        $('html, body').animate({ scrollTop: 0 }, 'slow');
                    } else {
                        printDialog('Error upload photo. Try again later');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    $('#article .right_column .add_photo_second_wrapper input[type="file"]').prop('value', null);
                    printDialog(error200);
                }
            });
        }
    }
}
// cross-browse page size param
function getPageSize() {
    var xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {
        xScroll = document.body.scrollWidth;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    } else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight) { // Explorer 6 strict mode
        xScroll = document.documentElement.scrollWidth;
        yScroll = document.documentElement.scrollHeight;
    } else { // Explorer Mac...would also work in Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }

    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer
        windowWidth = self.innerWidth;
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }

    // for small pages with total height less then height of the viewport
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }

    // for small pages with total width less then width of the viewport
    if (xScroll < windowWidth) {
        pageWidth = windowWidth;
    } else {
        pageWidth = xScroll;
    }

    return [pageWidth, pageHeight, windowWidth, windowHeight];
}
// responsive gallery viewer
$(window).on('resize orientationchange', viewerResponse);
function viewerResponse()
{
    var heightDesc = $('.lSSlideOuter .flexs_desc').outerHeight();
    var heightCarousel = $('.lSSlideOuter #carousel').outerHeight();

    var pageSize = getPageSize();
    var windowHeight = pageSize[3];

    var newSlideHeight = Math.round(windowHeight - heightDesc - heightCarousel - windowHeight * 2 / 100);
    if (heightDesc !== 20) {
        newSlideHeight -= 12;
    }
    $('.lSSlideOuter #slider').css('height', newSlideHeight);
    $('.lSSlideOuter #slider .flex-viewport').css('lineHeight', (newSlideHeight - 10) + 'px');
    $('.lSSlideOuter #slider img').css('maxHeight', newSlideHeight - 10);
}