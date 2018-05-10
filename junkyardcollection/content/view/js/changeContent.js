$(function () {
    error200 = 'Unexpected server error or the file is corrupted and cannot be uploaded.';
    errorMaxSize = "The file is too large!<br>Maximum file size is 500 Kb. The sum of image width and height shouldn't exceed 2000 pixels.";
    maxSize = 512000; // 500kb
    
    // close popup
    $('.popup_cancel').click(function () {
        closePopup();
    });
    // upload avatar
    $('#popup').on("click", ".popup_save_avatar", function () {
        if (typeof $('#avatar_upload')[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append('avatar', $('#avatar_upload')[0].files[0]);
            formData.append('login', $('#article .user_header .user_name').html());
            formData.append('op', 'uploadAvatarFirstStep');

            $.ajax({
                url: "/ajax/ajax.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    $('#loader').css('display', 'none');
                    closePopup();
                    if (data !== '') {
                        if (data.indexOf('cache') + 1) {
                            $('#avatarCropPopup').html('<img src="/' + data + '" id="avatarCropImagePopup" alt="">');
                            var $image = $('#avatarCropPopup img');
                            $image.cropper({
                                viewMode: 2,
                                aspectRatio: 1 / 1,
                                minCropBoxWidth: 64,
                                minCropBoxHeight: 64,
                                scalable: false,
                                rotatable: false,
                                movable: false,
                                zoomable: false,
                                autoCropArea: 0.4
                            });
                            $('#popup_avatar_overlay').css('display', 'block');
                        } else {
                            printDialog(data);
                        }
                    } else {
                        printDialog('Error upload photo. Try again later');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        } else {
            printDialog('Please choose an avatar.');
        }
    });
    // second step upload avatar. Crop avatar
    $('#popup_avatar_overlay .popup_save_avatar_crop').click(function () {
        $('#loader').css('display', 'block');
        var cropParam = $('#avatarCropImagePopup').cropper("getData");

        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'uploadAvatarSecondStep',
                cropX: cropParam.x,
                cropY: cropParam.y,
                cropWidth: cropParam.width,
                cropHeight: cropParam.height,
                login: $('#article .user_header .user_name').html()
            },
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    if (data.indexOf('site/users') + 1) {
                        $('#popup_avatar_overlay').fadeOut(100);
                        $('#popup_avatar_overlay .popup_content').html('');
                        $('#article .user_header .user_avatar img').attr('src', '/' + data);
                    } else {
                        printDialog(data);
                    }
                } else {
                    printDialog('No found ajax file');
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // close avatar popup on second step
    $('#popup_avatar_overlay').on("click", ".popup_cancel", function () {
        $('#popup_avatar_overlay').css('display','none');
        $('#avatarCropPopup').html('');
    });
    // colorpicker panel color
    $('.change_panel_color').ColorPicker({
        onBeforeShow: function () {
            $(this).ColorPickerSetColor($('.change_panel_color').attr('data-color'));
        },
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $('.change_panel_color').css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'changePanelColor',
                    color: '#' + hex
                },
                success: function () {
                    location.reload();
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // colorpicker btn color
    $('.change_btn_color').ColorPicker({
        onBeforeShow: function () {
            $(this).ColorPickerSetColor($('.change_btn_color').attr('data-color'));
        },
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $('.change_btn_color').css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'changeBtnColor',
                    color: '#' + hex
                },
                success: function () {
                    location.reload();
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // colorpicker other admin color
    $('.change_other_admin_color').ColorPicker({
        onBeforeShow: function () {
            $(this).ColorPickerSetColor($('.change_other_admin_color').attr('data-color'));
        },
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $('.change_other_admin_color').css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'changeOtherAdminColor',
                    color: '#' + hex
                },
                success: function () {
                    location.reload();
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // colorpicker default panel color
    $('.change_default_panel_color').ColorPicker({
        onBeforeShow: function () {
            $(this).ColorPickerSetColor($('.change_default_panel_color').attr('data-color'));
        },
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $('.change_default_panel_color').css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'changeDefaultPanelColor',
                    color: '#' + hex
                },
                success: function () {
                    location.reload();
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // colorpicker default btn color
    $('.change_default_btn_color').ColorPicker({
        onBeforeShow: function () {
            $(this).ColorPickerSetColor($('.change_default_btn_color').attr('data-color'));
        },
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onSubmit: function (hsb, hex, rgb, el) {
            $('.change_default_btn_color').css('backgroundColor', '#' + hex);
            $(el).ColorPickerHide();
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'changeDefaultBtnColor',
                    color: '#' + hex
                },
                success: function () {
                    location.reload();
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // view save user data btn
    $('#article .user_content .input_wrapper input').keyup(function () {
        $('#article .user_content .save_user_data').css('display', 'block');
        $('#article .user_content .send_admin_data').css('display', 'block');
    });
    // save user data
    $('#article .user_content .save_user_data').click(function () {
        var mail = $('#article .user_content .input_wrapper input[name="mail"]').val();
        var mail2 = $('#article .user_content .input_wrapper input[name="mail2"]').val();
        var password = $.trim($('#article .user_content .input_wrapper input[name="password"]').val());
        var password2 = $.trim($('#article .user_content .input_wrapper input[name="password2"]').val());
        var website = $('#article .user_content .input_wrapper input[name="website"]').val();
        var skype = $('#article .user_content .input_wrapper input[name="skype"]').val();
        var facebook = $('#article .user_content .input_wrapper input[name="facebook"]').val();
        var vkontakte = $('#article .user_content .input_wrapper input[name="vkontakte"]').val();
        var errors = new Array();

        if (mail === '') {
            errors.push('Field "Mail" is required!');
        }
        if (!isValidMail(mail) || (!isValidMail(mail2) && mail2 !== '')) {
            errors.push('Please enter correct email!');
        }
        if (password !== password2 && (password !== '' || password2 !== '')) {
            errors.push('Passwords don\'t match');
        }

        if (errors.length > 0) {
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'saveUserData',
                    mail: mail,
                    mail2: mail2,
                    password: password,
                    website: website,
                    skype: skype,
                    facebook: facebook,
                    vkontakte: vkontakte
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data !== '') {
                        printDialog(data);
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // send admin data
    $('#article .user_content .send_admin_data').click(function () {
        var mail = $('#article .user_content .input_wrapper input[name="mail"]').val();
        var mail2 = $('#article .user_content .input_wrapper input[name="mail2"]').val();
        var password = $('#article .user_content .input_wrapper input[name="password"]').val();
        var password2 = $('#article .user_content .input_wrapper input[name="password2"]').val();
        var errors = new Array();

        if (mail === '') {
            errors.push('Field "Mail" is required!');
        }
        if (!isValidMail(mail) || (!isValidMail(mail2) && mail2 !== '')) {
            errors.push('Please enter correct email!');
        }

        if (password !== '' || password2 !== '') {
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'updateAdminDataNoAccess'
                },
                success: function (data) {},
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        } else {
            if (errors.length > 0) {
                var printEr = '';
                for (i = 0; i < errors.length; i++) {
                    printEr += errors[i] + '<br>';
                }
                printDialog(printEr);
            } else {
                $('#loader').css('display', 'block');
                $.ajax({
                    type: "POST",
                    url: "/ajax/ajax.php",
                    data: {
                        op: 'sendAdminData',
                        mail: mail,
                        mail2: mail2
                    },
                    success: function (data) {
                        $('#loader').css('display', 'none');
                        if (data === '1') {
                            printDialog('A secret code was sent to the mail.');
                        } else {
                            printDialog('Error send mail! Try again later.');
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
    // view save admin data btn
    $('#article .user_content input[name="facebook"]').keyup(function () {
        var val = $(this).val();
        if ((val.split("-").length - 1) === 5 && val.length === 9) {
            $('#article .user_content .save_admin_data').css('display', 'block');
        }
    });
    // save admin data
    $('#article .user_content .save_admin_data').click(function () {
        var mail = $('#article .user_content .input_wrapper input[name="mail"]').val();
        var mail2 = $('#article .user_content .input_wrapper input[name="mail2"]').val();
        var trash = $('#article .user_content .input_wrapper input[name="trash_mail"]').val();
        var trash2 = $('#article .user_content .input_wrapper input[name="trash_mail2"]').val();
        var jcMail = $.trim($('#article .user_content .input_wrapper input[name="jc_mail"]').val());
        var reportMail = $.trim($('#article .user_content .input_wrapper input[name="report_mail"]').val());
        var facebook = $('#article .user_content .input_wrapper input[name="facebook"]').val();
        var defaultGalleryPlatesKeywords = $.trim($('#article .user_content .input_wrapper input[name="default_gallery_plates_keywords"]').val());
        var defaultGalleryVehiclesKeywords = $.trim($('#article .user_content .input_wrapper input[name="default_gallery_vehicles_keywords"]').val());
        var galleryPlatesDesc = $.trim($('#article .user_content .input_wrapper input[name="gallery_plates_description"]').val());
        var galleryVehiclesDesc = $.trim($('#article .user_content .input_wrapper input[name="gallery_vehicles_description"]').val());
        var galleryVariousDesc = $.trim($('#article .user_content .input_wrapper input[name="gallery_various_description"]').val());
        var homeDesc = $.trim($('#article .user_content .input_wrapper input[name="home_description"]').val());
        var literatureDesc = $.trim($('#article .user_content .input_wrapper input[name="literature_description"]').val());
        var shopDesc = $.trim($('#article .user_content .input_wrapper input[name="shop_description"]').val());
        var infoDesc = $.trim($('#article .user_content .input_wrapper input[name="info_description"]').val());
        var collectionDesc = $.trim($('#article .user_content .input_wrapper input[name="collection_description"]').val());
        var defaultLiteratureKeywords = $.trim($('#article .user_content .input_wrapper input[name="default_literature_keywords"]').val());
        var errors = new Array();

        if (mail === '') {
            errors.push('Field "email" is required!');
        }
        if (!isValidMail(mail) || (!isValidMail(mail2) && mail2 !== '') || (!isValidMail(jcMail) && jcMail !== '') || (!isValidMail(reportMail) && reportMail !== '')) {
            errors.push('Please enter correct email!');
        }
        if (trash !== trash2 && (trash !== '' || trash2 !== '')) {
            errors.push("Passwords don't match");
        }

        if (errors.length > 0) {
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $('#loader').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'saveAdminData',
                    mail: mail,
                    mail2: mail2,
                    trash: trash,
                    jcMail: jcMail,
                    reportMail: reportMail,
                    facebook: facebook,
                    defaultGalleryPlatesKeywords: defaultGalleryPlatesKeywords,
                    defaultGalleryVehiclesKeywords: defaultGalleryVehiclesKeywords,
                    defaultLiteratureKeywords: defaultLiteratureKeywords,
                    galleryPlatesDesc: galleryPlatesDesc,
                    galleryVehiclesDesc: galleryVehiclesDesc,
                    galleryVariousDesc: galleryVariousDesc,
                    homeDesc: homeDesc,
                    literatureDesc: literatureDesc,
                    shopDesc: shopDesc,
                    infoDesc: infoDesc,
                    collectionDesc: collectionDesc
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data !== '') {
                        printDialog(data);
                    } else {
                        $('#article .user_content .input_wrapper input[name="facebook"]').val('');
                        $('#article .user_content .send_admin_data').css('display', 'none');
                        $('#article .user_content .save_admin_data').css('display', 'none');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // view/hide save other user btn
    $('#article .user_content select[name="user_role"]').change(function () {
        viewOtherBtn();

        if ($(this).val() === '3') {
            viewModeratorBlock(1);
        } else {
            viewModeratorBlock(0);
        }
    });
    $('#article .user_content .input_wrapper input.input_edit_by_admin').keyup(function () {
        viewOtherBtn();
    });
    $('#article .user_content .moderator_stat input[type="checkbox"]').change(function () {
        viewOtherBtn();
    });
    // view/hide save other user btn function
    function viewOtherBtn() {
        $('#article .user_content .save_other_user').css('display', 'block');
    }
    // view/hide moderator stat block
    function viewModeratorBlock(view) {
        if (view == 1) {
            $('#article .user_content .moderator_stat').css('display', 'block');
        } else {
            $('#article .user_content .moderator_stat').css('display', 'none');
        }
    }
    // save user data by other user
    $('#article .user_content .save_other_user').click(function () {
        var mail = $('#article .user_content .input_wrapper input[name="mail"]').val();
        var mail2 = $('#article .user_content .input_wrapper input[name="mail2"]').val();
        var website = $('#article .user_content .input_wrapper input[name="website"]').val();
        var skype = $('#article .user_content .input_wrapper input[name="skype"]').val();
        var facebook = $('#article .user_content .input_wrapper input[name="facebook"]').val();
        var vkontakte = $('#article .user_content .input_wrapper input[name="vkontakte"]').val();
        var userRole = $('#article .user_content select[name="user_role"]').val();
        var variousAccess = $('#article .user_content .stat_item_transparent input[name="various_access"]').is(':checked');
        var variousAccessSave = 0;
        var literatureAccess = $('#article .user_content .stat_item_transparent input[name="literature_access"]').is(':checked');
        var literatureAccessSave = 0;
        var login = $('#article .user_header .user_name').html();
        var errors = new Array();

        if (mail === '') {
            errors.push('Field "Mail" is required!');
        }
        if (!isValidMail(mail) || (!isValidMail(mail2) && mail2 !== '')) {
            errors.push('Please enter correct email!');
        }

        if (errors.length > 0) {
            var printEr = '';
            for (i = 0; i < errors.length; i++) {
                printEr += errors[i] + '<br>';
            }
            printDialog(printEr);
        } else {
            $('#loader').css('display', 'block');
            if (variousAccess) {
                variousAccessSave = 1;
            }
            if (literatureAccess) {
                literatureAccessSave = 1;
            }
            $.ajax({
                type: "POST",
                url: "/ajax/ajax.php",
                data: {
                    op: 'saveUserDataByAdmin',
                    mail: mail,
                    mail2: mail2,
                    website: website,
                    skype: skype,
                    facebook: facebook,
                    vkontakte: vkontakte,
                    userRole: userRole,
                    variousAccess: variousAccessSave,
                    literatureAccess: literatureAccessSave,
                    login: login
                },
                success: function (data) {
                    $('#loader').css('display', 'none');
                    if (data !== '') {
                        printDialog(data);
                    } else {
                        $('#article .user_content .save_other_user').css('display', 'none');
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        }
    });
    // block user by login
    $('#article .user_content .block_user').click(function () {
        $('#loader').css('display', 'block');

        var blockText = $(this).html();
        var newStatus = 1;
        if (blockText === 'Block') {
            newStatus = 2;
        }
        var login = $('#article .user_header .user_name').html();

        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'blockUser',
                newStatus: newStatus,
                login: login
            },
            success: function (data) {
                $('#loader').css('display', 'none');
                if (data !== '') {
                    printDialog(data);
                } else {
                    if (newStatus === 1) {
                        $('#article .user_content .block_user').html('Block');
                        $('#article .user_header .user_activity_square').css('backgroundColor', '#d2cfc7');
                    } else if (newStatus === 2) {
                        $('#article .user_content .block_user').html('Unblock');
                        $('#article .user_header .user_activity_square').css('backgroundColor', 'black');
                    }
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // upload logo
    $('#popup').on("click", ".popup_save_logo", function () {
        if (typeof $('#logo_upload')[0].files[0] !== "undefined") {
            $('#loader').css('display', 'block');
            var formData = new FormData();
            formData.append('logo', $('#logo_upload')[0].files[0]);
            formData.append('op', 'uploadLogo');

            $.ajax({
                url: "/ajax/ajax.php",
                type: "POST",
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    closePopup();
                    if (data !== 'ok') {
                        $('#loader').css('display', 'none');
                        printDialog(data);
                    } else {
                        location.reload();
                    }
                },
                error: function (jqXHR) {
                    $('#loader').css('display', 'none');
                    printDialog(error200);
                }
            });
        } else {
            printDialog('Please choose logo.');
        }
    });
    // save header social
    $('#popup').on("click", ".popup_save_header_social", function () {
        $('#loader').css('display', 'block');
        var formData = new FormData();
        if (typeof $('#header_social_upload')[0].files[0] !== "undefined") {
            formData.append('img', $('#header_social_upload')[0].files[0]);
        }
        var id = $('#popup .popup_content label').attr('data-id');
        if (typeof id === 'undefined') {
            id = 0;
        }
        formData.append('link', $('.header_social_url').val());
        formData.append('id', id);
        formData.append('op', 'saveHeaderSocial');

        $.ajax({
            url: "/ajax/ajax.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                closePopup();
                if (data !== 'ok') {
                    $('#loader').css('display', 'none');
                    printDialog(data);
                } else {
                    location.reload();
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // save popup text
    $('#popup').on("click", ".popup_save_text", function () {
        $('#loader').css('display', 'block');
        var formData = new FormData();
        formData.append('field', $('#popup .popup_content textarea').attr('field'));
        formData.append('table', $('#popup .popup_content textarea').attr('table'));
        formData.append('value', $('#popup .popup_content textarea').val());
        formData.append('id', $('#popup .popup_content textarea').attr('id'));
        formData.append('op', 'savePopupText');

        $.ajax({
            url: "/ajax/ajax.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                closePopup();
                if (data !== 'ok') {
                    $('#loader').css('display', 'none');
                    printDialog(data);
                } else {
                    location.reload();
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
    // update gallery social checkbox
    $('.left_column .social_item_edit input[type="checkbox"]').change(function () {
        var visible = $(this).is(':checked');
        visible = (visible) ? 1 : 0;
        var id = $(this).attr('data-id');

        $.ajax({
            type: "POST",
            url: "/ajax/ajax.php",
            data: {
                op: 'editGallerySocial',
                id: id,
                visible: visible
            },
            success: function (data) {
                if (data !== 'ok') {
                    printDialog(data);
                }
            },
            error: function (jqXHR) {
                printDialog(error200);
            }
        });
    });
    // save gallery social
    $('#popup').on("click", ".popup_save_gallery_social", function () {
        $('#loader').css('display', 'block');
        var formData = new FormData();
        if (typeof $('#gallery_social_upload')[0].files[0] !== "undefined") {
            formData.append('img', $('#gallery_social_upload')[0].files[0]);
        }
        if (typeof $('#gallery_social_upload_hover')[0].files[0] !== "undefined") {
            formData.append('img_hover', $('#gallery_social_upload_hover')[0].files[0]);
        }
        var id = $('#popup .popup_content table').attr('data-id');
        if (typeof id === 'undefined') {
            id = 0;
        }
        formData.append('id', id);
        formData.append('op', 'updateGallerySocial');

        $.ajax({
            url: "/ajax/ajax.php",
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                closePopup();
                if (data !== 'ok') {
                    $('#loader').css('display', 'none');
                    printDialog(data);
                } else {
                    location.reload();
                }
            },
            error: function (jqXHR) {
                $('#loader').css('display', 'none');
                printDialog(error200);
            }
        });
    });
});

// insert same html to popup
function insertChangeContentFormHtml(typeInsert) {
    var top = $('#' + typeInsert).offset().top;
    var left = $('#' + typeInsert).offset().left + 20;
    var height = $('#' + typeInsert).outerHeight();
    var top1 = $('#popup').offset().top - height;
    var newTop = top + height;

    if (top === top1) {
        closePopup();
    } else {
        if (typeInsert === 'change_avatar' || typeInsert === 'change_avatar_other_user') {
            $('#popup .popup_header').html('Change avatar');
            $('#popup .popup_content').html('<form action="" method="POST" enctype="multipart/form-data"><input id="avatar_upload" name="avatar" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_avatar');
        } else if (typeInsert === 'logo_change') {
            $('#popup').css('position', 'fixed');
            $('#popup .popup_header').html('Change logo (width not more 195 pt)');
            $('#popup .popup_content').html('<form action="" method="POST" enctype="multipart/form-data"><input id="logo_upload" name="logo" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_logo');
        } else if (typeInsert.indexOf('header_social') + 1) {
            left -= 300;
            top -= 10;
            newTop = top + height;
            $('#popup').css('position', 'fixed');
            $('#popup .popup_header').html('Change social group');
            $('#popup .popup_content').html('<label style="width: 100%;text-align: center;display: block;" data-id="' + $('#' + typeInsert).attr('data-id') + '">The group will be displayed to users<br> if the link is specified</label><table style="font-size: 14px;width: 100%;margin: 5px 0;"><tr><td>Link:</td><td><input type="text" placeholder="Group url" class="header_social_url" value="' + $('#' + typeInsert).attr('data-url') + '" style="width: 100%;" /></td></tr><tr><td colspan="2">New image (23x23 pt):</td></tr><tr><td colspan="2"><form action="" method="POST" enctype="multipart/form-data"><input id="header_social_upload" name="header_social" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form></td></tr></table>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_header_social');
        } else if (typeInsert === 'new_social_header') {
            left -= 300;
            top -= 10;
            newTop = top + height;
            $('#popup').css('position', 'fixed');
            $('#popup .popup_header').html('Add social group');
            $('#popup .popup_content').html('<label style="width: 100%;text-align: center;display: block;">The group will be displayed to users<br> if the link is specified</label><table style="font-size: 14px;width: 100%;margin: 5px 0;"><tr><td>Link:</td><td><input type="text" placeholder="Group url" class="header_social_url" value="" style="width: 100%;" /></td></tr><tr><td colspan="2">New image (23x23 pt):</td></tr><tr><td colspan="2"><form action="" method="POST" enctype="multipart/form-data"><input id="header_social_upload" name="header_social" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form></td></tr></table>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_header_social');
        } else if (typeInsert === 'change_register_text') {
            $('#popup .popup_header').html('Change register text');
            $('#popup .popup_content').html('<textarea table="settings" field="value" id="3" style="width:100%;font-size: 14px;line-height: 18px;height: 100px;">' + $('#' + typeInsert).html() + '</textarea>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_text');
        } else if (typeInsert === 'change_register_btn') {
            $('#popup .popup_header').html('Change register button');
            $('#popup .popup_content').html('<textarea table="settings" field="value" id="4" style="width:100%;font-size: 14px;line-height: 18px;height: 26px;">' + $('#' + typeInsert).html() + '</textarea>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_text');
        } else if (typeInsert === 'change_login_text') {
            $('#popup .popup_header').html('Change login text');
            $('#popup .popup_content').html('<textarea table="settings" field="value" id="5" style="width:100%;font-size: 14px;line-height: 18px;height: 26px;">' + $('#' + typeInsert).html() + '</textarea>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_text');
        } else if (typeInsert === 'rules_title_change') {
            $('#popup .popup_header').html('Change rules title');
            $('#popup .popup_content').html('<textarea table="settings" field="value" id="1" style="width:100%;font-size: 14px;line-height: 18px;height: 26px;">' + $('#' + typeInsert).html() + '</textarea>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_text');
        } else if (typeInsert === 'rules_text_change') {
            top = 200;
            height = 0;
            var scrollTop = $(window).scrollTop();
            newTop = top + height + scrollTop;
            $('#popup').css('position', 'fixed');
            $('#popup .popup_header').html('Change rules text');
            $('#popup .popup_content').html('<textarea table="settings" field="value" id="2" style="width:800px;font-size: 14px;line-height: 18px;height: 200px;">' + $('#' + typeInsert).html() + '</textarea>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_text');
        } else if (typeInsert.indexOf('social_gallery') + 1) {
            $('#popup .popup_header').html('Update social gallery');
            $('#popup .popup_content').html('<table style="font-size: 14px;width: 100%;" data-id="' + $('#' + typeInsert).next().attr('data-id') + '"><tr><td colspan="2">New image (19x19 pt):</td></tr><tr><td colspan="2"><form action="" method="POST" enctype="multipart/form-data"><input id="gallery_social_upload" name="gallery_social" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form></td></tr><tr><td colspan="2">New hover image (19x19 pt):</td></tr><tr><td colspan="2"><form action="" method="POST" enctype="multipart/form-data"><input id="gallery_social_upload_hover" name="gallery_social_hover" type="file" accept=".png, .jpg, .jpeg" onchange="validateImage(this.id);" /></form></td></tr></table>');
            $('.popup_save').removeClass().addClass('popup_save').addClass('popup_save_gallery_social');
        }

        $('#popup').fadeIn(100).offset({top: newTop, left: left});
    }
}