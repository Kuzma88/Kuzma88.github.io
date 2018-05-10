$(function () {
    // literature category autocomplete
    $('.left_column input[name="category_literature"]').autocomplete({
        source: "/ajax/ajaxLiteratureCategory.php",
        minLength: 0,
        select: function (event, ui) {
            if ($.trim($('.left_column_add input[name="make_literature"]').val()) !== '') {
                $('#article .right_column .add_photo_wrapper .add_photo_btn').css('display', 'block');
                $('#article .right_column .add_photo_wrapper .add_photo_label').css('display', 'block');
            }
        }
    }).focus(function () {
        $(this).data("uiAutocomplete").search($(this).val());
    });
    // literature make autocomplete
    $('.left_column input[name="make_literature"]').autocomplete({
        source: function (request, response) {
            $.getJSON("/ajax/ajaxMakeLiterature.php", {term: request.term, category: $('.left_column input[name="category_literature"]').val()}, response);
        },
        minLength: 0
    }).focus(function () {
        $(this).data("uiAutocomplete").search($(this).val());
    });
    // literature model autocomplete
    $('.left_column input[name="model_literature"]').autocomplete({
        source: function (request, response) {
            $.getJSON("/ajax/ajaxModelLiterature.php", {term: request.term, category: $('.left_column input[name="category_literature"]').val(), make: $('.left_column input[name="make_literature"]').val()}, response);
        },
        minLength: 0
    }).focus(function () {
        $(this).data("uiAutocomplete").search($(this).val());
    });
    // view plus and add photo label
    $('.left_column_add input[name="make_literature"], .left_column_add input[name="category_literature"]').keyup(function () {
        var make = $.trim($('.left_column_add input[name="make_literature"]').val());
        var category = $.trim($('.left_column_add input[name="category_literature"]').val());
        
        if (make !== '' && category !== '') {
            $('#article .right_column .add_photo_wrapper .add_photo_btn_literature').css('display', 'block');
            $('#article .right_column .add_photo_wrapper .add_photo_label_literature').css('display', 'block');
        }
    });
    // emulate btn image upload click
    $('#article .right_column .add_photo_wrapper .add_photo_btn_literature, #article .right_column .add_photo_wrapper .add_photo_label_literature').click(function () {
        var category = $.trim($('.left_column input[name="category_literature"]').val());
        var make = $.trim($('.left_column input[name="make_literature"]').val());
        var errors = new Array();

        if (category === '') {
            $('.left_column input[name="category_literature"]').prev().addClass('error');
            errors.push('Choose or create category');
        } else {
            $('.left_column input[name="category_literature"]').prev().removeClass('error');
        }
    
        if (make === '') {
            $('.left_column input[name="make_literature"]').prev().addClass('error');
            errors.push('Enter make first, please.');
        } else {
            $('.left_column input[name="make_literature"]').prev().removeClass('error');
        }
        
        if (errors.length > 0) {
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $('#article .right_column .add_photo_wrapper #foto_upload_literature').trigger('click');
        }
    });
    // add literature / Step 2
    $('.left_column').on("click", ".btn_add_to_literature_step2, .btn_add_to_literature_no_crop", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();

        var cropParam = $('#image_crop').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('imgSrc', $('#image_crop').attr('src'));
        formData.append('literatureId', $('#article .left_column').attr('data-id-literature'));
        formData.append('photoId', $('#article .left_column').attr('data-id-photo'));
        formData.append('op', 'uploadLiteratureSecondStep');
        if ($(this).hasClass('btn_add_to_literature_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxLiterature.php",
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

                        $('.right_column .images_sortable_literature').append('<li class="second_image_wrapper_literature" data-id="' + data.id + '"><img src="/' + data.image + '" alt=""><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');
                        if (typeof $('.right_column .images_sortable_literature .second_image_wrapper_plus').html() === 'undefined') {
                            $('.right_column .images_sortable_literature').append('<li class="second_image_wrapper_plus"><span class="plus">+</span></li>');
                        }
                        $('.left_column input[name="copyright"]').prop('disabled', false);

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_literature_step3">Save</a>');
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
    // second step upload second literature image
    $('.left_column').on("click", ".btn_add_to_literature_second_step2, .btn_add_to_literature_second_no_crop", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();

        var cropParam = $('#image_crop').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('imgSrc', $('#image_crop').attr('src'));
        formData.append('literatureId', $('#article .left_column').attr('data-id-literature'));
        formData.append('photoId', $('#article .left_column').attr('data-id-photo'));
        formData.append('op', 'uploadSecondPhotoLiteratureCrop');
        if ($(this).hasClass('btn_add_to_literature_second_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxLiterature.php",
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
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').before('<li class="second_image_wrapper_literature" data-id="' + data.id + '"><img src="/' + data.image + '" alt=""><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');
                        if (typeof $('.right_column .images_sortable_literature .second_image_wrapper_plus').html() === 'undefined') {
                            $('.right_column .images_sortable_literature').append('<li class="second_image_wrapper_plus"><span>+</span></li>');
                        }
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').css('display','block');

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_literature_step3">Save</a>');
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
    // save small description photo
    $('.right_column').on("change", ".add_photo_second_wrapper .second_image_wrapper_literature input", function (e) {
        e.preventDefault();

        var photoId = $(this).closest('li').attr('data-id');
        var smallDesc = $(this).val();

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxLiterature.php",
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
    $("ul.images_sortable_literature").sortable({
        items: "li.second_image_wrapper_literature",
        cursor: "move",
        forcePlaceholderSize: true,
        opacity: 0.5,
        stop: function () {
            var sort = new Array();

            $("#article .right_column .add_photo_second_wrapper .second_image_wrapper_literature").each(function (i, elem) {
                sort.push($(elem).attr('data-id'));
            });

            if (sort.length > 1) {
                $.ajax({
                    type: "POST",
                    url: "/ajax/ajaxLiterature.php",
                    data: {
                        op: 'sortLiterature',
                        sort: sort,
                        literatureId: $('#article .left_column').attr('data-id-literature')
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
    // add literature / Step 3 / Save all
    $('.left_column').on("click", ".btn_add_to_literature_step3", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var desc = tinymce.get('redactor').getContent();
        var visible = 'all';
        var keywords = '';
        var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
        var visibleF = $('.left_column input[name="visible_f"]').is(':checked');

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
            url: "/ajax/ajaxLiterature.php",
            dataType: "json",
            data: {
                op: 'activateLiterature',
                desc: desc,
                visible: visible,
                keywords: keywords,
                literatureId: $('#article .left_column').attr('data-id-literature')
            },
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    var url = window.location.protocol + "//" + window.location.host;
                    window.location.replace(url + '/' + data.link);
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // second step reupload literature image
    $('.left_column').on("click", ".btn_replace_literature_second_step2, .btn_replace_literature_second_no_crop", function (e) {
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
        formData.append('op', 'reuploadPhotoLiteraturePreview');
        if ($(this).hasClass('btn_replace_literature_second_step2')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxLiterature.php",
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
                        $(".images_sortable_literature img").each(function (i, elem) {
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

                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_literature').eq(numberPreview).find('img').attr('src', data.image + '?' + Math.floor((Math.random() * 100) + 1));

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_save_edit_literature">Save</a>');

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
    // second step upload second literature image - edit mode
    $('.left_column').on("click", ".btn_add_to_literature_second_step2_edit, .btn_add_to_literature_second_no_crop_edit", function (e) {
        e.preventDefault();
        $('#loader').css('display', 'block');

        var formData = new FormData();
        var literatureId = $('.left_column').attr('data-id-literature');

        var cropParam = $('#image_main_edit').cropper("getData");
        formData.append('cropX', cropParam.x);
        formData.append('cropY', cropParam.y);
        formData.append('cropWidth', cropParam.width);
        formData.append('cropHeight', cropParam.height);

        formData.append('literatureId', literatureId);
        formData.append('imgSrc', $('#image_main_edit').attr('src'));
        formData.append('op', 'uploadSecondPhotoLiteratureCropEdit');
        if ($(this).hasClass('btn_add_to_literature_second_step2_edit')) {
            formData.append('action', 'crop');
        } else {
            formData.append('action', 'resize');
        }

        $.ajax({
            url: "/ajax/ajaxLiterature.php",
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
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_plus').before('<li class="second_image_wrapper" data-id="' + data.id + '"><img src="/' + data.image + '" alt=""><input type="text" maxlength="24"><i class="fa fa-pencil" aria-hidden="true"></i></li>');

                        $('.left_column .btn_wrapper a').remove();
                        $('.left_column .btn_wrapper').append('<a class="btn btn_save_edit_literature">Save</a>');
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
    // save edit literature
    $('.left_column').on("click", ".btn_save_edit_literature", function (e) {
        e.preventDefault();

        if ($(this).hasClass('btn_no_active')) {
            return false;
        } else {
            var errors = new Array();
            var make = $.trim($('.left_column input[name="make_literature"]').val());
            var model = $.trim($('.left_column input[name="model_literature"]').val());
            var year = $.trim($('.left_column input[name="year"]').val());
            var copyright = 1;
            var pattern = new RegExp(/^[А-ЯЄІЇЁа-яєіїёA-Za-z0-9\-\/\=\+\(\)\.\'\,\"\&\: ]+$/);
            var category = $.trim($('.left_column input[name="category_literature"]').val());

            if (category === '') {
                $('.left_column input[name="category_literature"]').prev().addClass('error');
                errors.push('Choose or create category');
            } else {
                $('.left_column input[name="category_literature"]').prev().removeClass('error');
            }
            
            if (make === '') {
                $('.left_column input[name="make_literature"]').prev().addClass('error');
                errors.push('Enter make first, please.');
            } else {
                $('.left_column input[name="make_literature"]').prev().removeClass('error');
            }
            
            if ((!pattern.test(category) && category !== '') || (!pattern.test(make) && make !== '')) {
                errors.push('Only English/Ukrainian/Russian letters allowed');
            }

            var desc = tinymce.get('redactor').getContent();
            var visible = 'all';
            var keywords = '';
            var visiblePZ = $('.left_column input[name="visible_pz"]').is(':checked');
            var visibleF = $('.left_column input[name="visible_f"]').is(':checked');

            if (visiblePZ) {
                visible = 'pz';
            } else if (visibleF) {
                visible = 'friends';
            }

            $('.left_column .tag_block .keyword_list span').each(function (i, elem) {
                keywords += $(elem).html() + ',';
            });
            keywords = keywords.substr(0, keywords.length - 1);

            var literatureId = $('.left_column').attr('data-id-literature');

            if (errors.length > 0) {
                var printEr = '';
                for (i = 0; i < errors.length; i++) {
                    printEr += errors[i] + '<br>';
                }
                printDialog(printEr);
            } else {
                var formData = new FormData();
                formData.append('op', 'updateLiterature');
                formData.append('make', make);
                formData.append('model', model);
                formData.append('year', year);
                formData.append('literatureId', literatureId);
                formData.append('desc', desc);
                formData.append('visible', visible);
                formData.append('copyright', copyright);
                formData.append('keywords', keywords);
                formData.append('category', category);

                $.ajax({
                    url: "/ajax/ajaxLiterature.php",
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
            }
        }
    });
    // delete page literature
    $('.delete_page_literature').click(function () {
        $('#popup_remove_literature_page_overlay').fadeIn(100);
    });
    $('.popup_remove_literature_page_yes').click(function () {
        var literatureId = $('.left_column').attr('data-id-literature');

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxLiterature.php",
            data: {
                op: 'deleteLiterature',
                literatureId: literatureId
            },
            success: function (data) {
                var url = window.location.protocol + "//" + window.location.host + '/literature';
                window.location.replace(url);
            },
            error: function (jqXHR) {
                printDialog(error200);
            }
        });
    });
    $('.popup_remove_literature_page_no').click(function () {
        $('#popup_remove_literature_page_overlay').fadeOut(100);
    });
    // remove main photo open popup. Edit mode
    $('#article .right_column .add_photo_wrapper .remove_main_photo_literature').click(function () {
        $('#popup_remove_photo_overlay_literature').fadeIn(200);
    });
    // close remove photo popup
    $('.popup_remove_photo_no_literature').click(function () {
        $('#popup_remove_photo_overlay_literature').fadeOut(200);
    });
    // remove big photo
    $('.popup_remove_photo_yes_literature').click(function () {
        var qtImagesInLiterature = $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_literature').length;
        var literatureId = $('.left_column').attr('data-id-literature');

        if (qtImagesInLiterature === 1) {
            $.ajax({
                type: "POST",
                url: "/ajax/ajaxLiterature.php",
                data: {
                    op: 'deleteLiterature',
                    literatureId: literatureId
                },
                success: function (data) {
                    var url = window.location.protocol + "//" + window.location.host + '/literature';
                    window.location.replace(url);
                },
                error: function (jqXHR) {
                    printDialog(error200);
                }
            });
        } else {
            var srcBig = $('#article .right_column_edit .add_photo_wrapper_edit #image_main_edit').attr('src');

            if (srcBig.indexOf('?') + 1) {
                var imgSrcArray = srcBig.split('?');
                srcBig = imgSrcArray[0];
            }
            
            $.ajax({
                type: "POST",
                url: "/ajax/ajaxLiterature.php",
                data: {
                    op: 'deleteOnePhotoLiterature',
                    literatureId: literatureId,
                    srcBig: srcBig
                },
                success: function (data) {
                    $('#popup_remove_photo_overlay_literature').fadeOut(200);
                    if (data === 'er') {
                        printDialog('Error delete photo. Try again later.');
                    } else {
                        // find number preview
                        var srcPreview = '';
                        if (srcBig.indexOf('_original') + 1) {
                            srcPreview = srcBig.replace('original', 'preview');
                        }

                        var numberPreview = 0;
                        $(".images_sortable_literature img").each(function (i, elem) {
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
                        $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_literature').eq(numberPreview).remove();
                        
                        // replace main photo
                        $('#article .right_column .add_photo_wrapper #image_main_edit').attr('src', '/' + data);
                        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
                    }
                },
                error: function (jqXHR) {
                    $('#popup_remove_photo_overlay_literature').fadeOut(200);
                    printDialog(error200);
                }
            });
        }
    });
    // add files. Add mode
    $('.add_file_literature').click(function(){
        $('#article .right_column #file_upload_literature').trigger('click');
    });
    // remove literature file
    $('.right_column').on("click", ".files_literature .remove_literature_file", function () {
        var _this = $(this);
        var fileId = $(this).closest('.file_wrapper').attr('data-id');

        $.ajax({
            type: "POST",
            url: "/ajax/ajaxLiterature.php",
            data: {
                op: 'deleteLiteratureFile',
                fileId: fileId
            },
            success: function (data) {
                $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
                _this.closest('.file_wrapper').remove();
            },
            error: function (jqXHR) {
                printDialog(error200);
            }
        });
    });
    // download file
    $('#article .right_column .files_view div.file_wrapper').click(function(){
        var filename = $(this).attr('data-filename');
        var filepath = $(this).attr('data-filepath');

        window.location.href = "/content/view/download.php?filename=" + filename + '&filepath=' + filepath;
    });
    // update no-active btn save edit gallery to active btn
    $('.right_column_edit .second_image_wrapper_literature input').keyup(function () {
        $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');
    });
});
// valid image upload
function uploadLiteratureImageFirstStep(uploadId) {
    var errors = new Array();
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();
    var make = $.trim($('.left_column input[name="make_literature"]').val());
    var model = $.trim($('.left_column input[name="model_literature"]').val());
    var year = $.trim($('.left_column input[name="year"]').val());
    var copyright = 1;
    var pattern = new RegExp(/^[А-ЯЄІЇЁа-яєіїёA-Za-z0-9\-\/\=\+\(\)\.\'\,\"\&\: ]+$/);
    var category = $.trim($('.left_column input[name="category_literature"]').val());
    
    if (category === '') {
        $('.left_column input[name="category_literature"]').prev().addClass('error');
        errors.push('Choose or create category');
    } else {
        $('.left_column input[name="category_literature"]').prev().removeClass('error');
    }
    
    if (make === '') {
        $('.left_column input[name="make_literature"]').prev().addClass('error');
        errors.push('Enter make first, please.');
    } else {
        $('.left_column input[name="make_literature"]').prev().removeClass('error');
    }
    
    if ((!pattern.test(category) && category !== '') || (!pattern.test(make) && make !== '')) {
        errors.push('Only English/Ukrainian/Russian letters allowed');
    }

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        errors.push('Mime-type not allowed! Only jpg, jpeg, png.');
        $('#article .right_column .add_photo_wrapper .add_photo_label_literature').addClass('error');
    }
    if (fileSize > maxSize) {
        errors.push('Maximum file size 5MB');
        $('#article .right_column .add_photo_wrapper .add_photo_label_literature').addClass('error');
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

            formData.append('make', make);
            formData.append('model', model);
            formData.append('year', year);
            formData.append('copyright', copyright);
            formData.append('category', category);
            formData.append('literatureId', $('#article .left_column').attr('data-id-literature'));
            formData.append('op', 'uploadLiteratureImageFirstStep');

            $.ajax({
                url: "/ajax/ajaxLiterature.php",
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
                            $('.left_column input[name="make_literature"], .left_column input[name="model_literature"], .left_column input[name="year"], .left_column input[name="copyright"], .left_column input[name="category_literature"]').prop('disabled', true);

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
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_literature_step2">Next</a><a class="btn btn_add_to_literature_no_crop">No crop</a>');
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
function uploadSecondLiteratureImageFirstStep(uploadId) {
    var fileName = document.getElementById(uploadId).value.replace(/\\/g, '/').replace(/.*\//, '');
    var fileSize = document.getElementById(uploadId).files[0].size;
    var dimension = fileName.split('.').pop().toLowerCase();

    if (dimension !== 'jpg' && dimension !== 'jpeg' && dimension !== 'png') {
        printDialog('Mime-type not allowed! Only jpg, jpeg, png.');
    } else if (fileSize > maxSize) {
        printDialog('Maximum file size 5MB');
    } else {
        if (typeof $('#' + uploadId)[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append($('#' + uploadId).attr('name'), $('#' + uploadId)[0].files[0]);

            var copyright = $('.left_column input[name="copyright"]').is(':checked');
            copyright = (copyright) ? 0 : 1;

            formData.append('op', 'uploadSecondLiteratureImageFirstStep');
            formData.append('literatureId', $('#article .left_column').attr('data-id-literature'));
            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxLiterature.php",
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
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_literature_second_step2">Next</a><a class="btn btn_add_to_literature_second_no_crop">No crop</a>');

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
function uploadReplaceLiteratureImageFirstStep(uploadId) {
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

            copyright = $('.left_column input[name="copyright"]').is(':checked');
            copyright = (copyright) ? 0 : 1;

            var bigImgSrc = $('#image_main_edit').attr('src'); // original!
            var literatureId = $('.left_column').attr('data-id-literature');
            formData.append('literatureId', literatureId);
            formData.append('bigImgSrc', bigImgSrc);
            formData.append('op', 'uploadReplaceLiteratureImageFirstStep');
            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxLiterature.php",
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
                            $('.left_column .btn_wrapper').append('<a class="btn btn_replace_literature_second_step2">Next</a><a class="btn btn_replace_literature_second_no_crop">No crop</a>');

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
                            $(".images_sortable_literature img").each(function (i, elem) {
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
                            $('#article .right_column .add_photo_second_wrapper .second_image_wrapper_literature').eq(numberPreview).find('img').attr('src', '/' + smallNewSrc + '?' + Math.floor((Math.random() * 100) + 1));

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
function uploadSecondLiteratureImageFirstStepEdit(uploadId) {
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

            var literatureId = $('.left_column').attr('data-id-literature');
            formData.append('literatureId', literatureId);
            formData.append('op', 'uploadSecondLiteratureImageFirstStepEdit');

            var copyright = $('.left_column input[name="copyright"]').is(':checked');
            copyright = (copyright) ? 0 : 1;
            formData.append('copyright', copyright);

            $.ajax({
                url: "/ajax/ajaxLiterature.php",
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
                            $('.left_column .btn_wrapper').append('<a class="btn btn_add_to_literature_second_step2_edit">Next</a><a class="btn btn_add_to_literature_second_no_crop_edit">No crop</a>');

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
// upload file. Add mode
function downloadFileLiterature(uploadId) {
    $('#loader').css('display','block');
    var formData = new FormData();
    if (typeof $('#'+uploadId)[0].files[0] !== "undefined") {
        formData.append($('#'+uploadId).attr('name'), $('#'+uploadId)[0].files[0]);
        formData.append('op', 'downloadFile');
        formData.append('literatureId', $('.left_column').attr('data-id-literature'));

        $.ajax({
            url: "/ajax/ajaxLiterature.php",
            type: "POST",
            dataType : "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(data) {
                $('#loader').css('display','none');
                $('#article .right_column .add_files_wrapper input[type="file"]').prop('value', null);
                $('#article .left_column a.btn.btn_no_active').removeClass('btn_no_active');

                if (data !== '') {
                    if (data.error) {
                        printDialog(data.error);
                    } else {
                        $('.files_literature').append(data.success);
                    }
                } else {
                    printDialog('Error upload file. Try again later');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                $('#article .right_column .add_files_wrapper input[type="file"]').prop('value', null);
                printDialog(error200);
            }
        });
    } else {
        $('#loader').css('display','none');
    }
}