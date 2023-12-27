/*added by jignesh joshi (895721) for common feedback*/
/*global $, jQuery*/
var fm = (function ($) {

    'use strict';

    var fm_options_arr = {},
        supportsTransitions = false;

    function eventTargetFixUp(pEvent) {
        if (pEvent.target === undefined) {
            pEvent.target = pEvent.srcElement;
        }
        return pEvent;
    }

    function getFmOptions(event, position) {
        var className,
            selector;
        event = eventTargetFixUp(event);
        if ($(event.target).closest(".feedback_trigger").length === 1) {
            className = $(event.target).closest(".feedback_trigger")[0].className;
        } else if ($(event.target).closest(".feedback_content").length === 1) {
            className = $(event.target).closest(".feedback_content")[0].className;
        } else {
            if (position === undefined) {
                position = 'left-top';
            }
            className = position;
        }

        if (className.indexOf('left-top') !== -1) {
            selector = 'left-top';
        } else if (className.indexOf('left-bottom') !== -1) {
            selector = 'left-bottom';
        } else if (className.indexOf('right-top') !== -1) {
            selector = 'right-top';
        } else if (className.indexOf('right-bottom') !== -1) {
            selector = 'right-bottom';
        }
        return fm_options_arr[selector];
    }

    function triggerAction(event, position) {
        var animation_show = {},
            animation_hide = {},
            $fm_trigger,
            $fm_content;

        event = eventTargetFixUp(event);
        animation_show.marginLeft = "+=380px";
        animation_hide.marginLeft = "-=380px";

        /*if (fm.getFmOptions(event, position).position.indexOf("right-") !== -1) {
       animation_show.marginRight = "+=380px";
            animation_hide.marginRight = "-=380px";
        }*/

        $fm_trigger = $(event.target).closest(".feedback_trigger");
        if ($fm_trigger.length === 1) {
            $fm_content = $fm_trigger.next();
              /*$("#res").css({
                "color": "white",
                "background-color": "#98bf21",
                "font-family": "Arial",
                "font-size": "20px",
                "padding": "5px"
            });*/
        } else {
            $fm_content = $(event.target).closest(".feedback_content");
            $fm_trigger = $fm_content.prev();
        }
        if ($fm_content.length === 0 || $fm_trigger.length === 0) {
            if (position === undefined) {
                position = 'left-top';
            }
            $fm_content = $('.' + position).closest(".feedback_content");
            $fm_trigger = $fm_content.prev();
        }

        if ($fm_trigger.hasClass("feedback_trigger_closed")) {
            if (supportsTransitions === true) {
                $fm_trigger.removeClass("feedback_trigger_closed");
                $fm_content.removeClass("feedback_content_closed");
            } else {
                $fm_trigger.add($fm_content).animate(
                    animation_show,
                    150,
                    function () {
                        $fm_trigger.removeClass("feedback_trigger_closed");
                        $fm_content.removeClass("feedback_content_closed");
                    }
                );
            }
        } else {
            //first add the closed class so double (which will trigger closeFeedback function) click wont try to hide the form twice
            $fm_trigger.addClass("feedback_trigger_closed");
            $fm_content.addClass("feedback_content_closed");
            if (supportsTransitions === false) {
                $fm_trigger.add($fm_content).animate(
                    animation_hide,
                    150
                );
            }
        }
    }

    function closeFeedback(event) {  
        event = eventTargetFixUp(event);
        if (($(".feedback_content").length === 1 && $(".feedback_content").hasClass("feedback_content_closed")) ||
                $(event.target).closest('.feedback_content').length === 1) {
            return;
        }

        var animation_hide = {},
            option,
            $fm_trigger,
            $fm_content;

        for (option in fm_options_arr) {
            if (fm_options_arr.hasOwnProperty(option)) {

                $fm_content = $('.' + option).closest(".feedback_content");
                $fm_trigger = $fm_content.prev();

                if (!$fm_trigger.hasClass("feedback_trigger_closed")) {
                    if (supportsTransitions === true) {
                        $fm_trigger.addClass("feedback_trigger_closed");
                        $fm_content.addClass("feedback_content_closed");
                    } else {
                        if (option.indexOf("left-") !== -1) {
                            animation_hide.marginLeft = "-=380px";
                        } /*else {
                            animation_hide.marginRight = "-=380px";
                        }*/
                        if (!$fm_trigger.hasClass("feedback_kurama")) {
                            $fm_trigger.addClass("feedback_kurama");
                            $fm_trigger.add($fm_content).animate(
                                animation_hide,
                                150,
                                function () {
                                    var $fm_trigger,
                                        $fm_content;
                                    $fm_trigger = $(this);
                                    $fm_content = $fm_trigger.next();
                                    $fm_trigger.removeClass("feedback_kurama");
                                    $fm_trigger.addClass("feedback_trigger_closed");
                                    $fm_content.addClass("feedback_content_closed");
                                }
                            );
                        }
                    }
                }
            }
        }
    }

    function emailValid(str) {
        var lastAtPos = str.lastIndexOf('@');
        return (lastAtPos < (str.length - 1) && lastAtPos > 0 && str.indexOf('@@') === -1 && str.length > 2);
    }

    function validateFeedbackForm(event, position) {
        event = eventTargetFixUp(event);
        var $fm_content = $(event.target).closest(".feedback_content"),
            fm_options = getFmOptions(event, position);
        /*if ((fm_options.name_required === true && $fm_content.find(".feedback_name").val() === "") ||
                ((fm_options.email_required === true && $fm_content.find(".feedback_email").val() === "") || (fm_options.email_required === true && emailValid($fm_content.find(".feedback_email").val()) === false)) ||
                (fm_options.message_required === true && $fm_content.find(".feedback_message").val() === "") ||
                (fm_options.radio_button_list_required === true && $fm_content.find("input[name=feedback-radio]:checked").val() === undefined)|| ValidateAndSubmit()) */
        if (((fm_options.radio_button_list_required === true && $fm_content.find("input[name=feedback-radio]:checked").val() === undefined))||($fm_content.find(".feedback_me_form input[name=feedback-radio]:checked").val() != 'yes' && $fm_content.find(".feedback_message").val() === "")) 
        {
            $('#err_msg').text("Please fill all the details");
            return false;
        }
        
        if($("meta[name='_frmHomePage']").attr("content")=="from_home" && ValidateAndSubmit()==false)
        {
        	$('#err_msg').text("Please fill all the details");
            return false;
        }
       
        return true;

    }
    /*added by jignesh joshi (895721) for google recatcha validation start*/
    function ValidateAndSubmit() {
        var v=$('#gRecaptchaResponseHome').val();
        if (v == '' || v == undefined) {
            return false;
        }
        
        return true;
    }
    /*added by jignesh joshi (895721) for google recatcha validation end*/
    function checkPatternFieldsOk(event, position) {
        var $patternFields = $("." + position + " [pattern]"),
            form_valid = true,
            i;

        if ($patternFields.length > 0) {
            for (i = 0; i < $patternFields.length; i++) {
                form_valid = !$patternFields[i].validity.patternMismatch;
                if (form_valid === false) {
                    break;
                }
            }
        }
        return form_valid;
    }

    function checkRequiredFieldsOk(event, position) {
        var $reqFields = $("." + position + " [required]"),
            form_valid = true;

        if ($reqFields.length > 0) {
            form_valid = validateFeedbackForm(event, position);
        }
        return form_valid;
    }

    function applyCloseOnClickOutside() {
        var jqVersion = $().jquery.split(".");
        jqVersion[0] = +jqVersion[0];
        jqVersion[1] = +jqVersion[1];
        if (jqVersion[0] > 1 || (jqVersion[0] === 1 && jqVersion[1] >= 7)) {
            $(document).on("click", document, function (event) {
                closeFeedback(event);
            });
        } else {
            $(document).delegate("body", document, function (event) {
                closeFeedback(event);
            });
        }
    }

    function appendFeedbackToBody(fm_options) { 
        var form_html = "",
            iframe_html = "",
            jQueryUIClasses1 = "",
            jQueryUIClasses2 = "",
            jQueryUIClasses3 = "",
            jQueryUIClasses4 = "",
            email_html = "",
            email_feedback_content_class = "",
            radio_button_list_html = "",
            radio_button_list_class = "",
            fm_class = " fm_clean ",
            jquery_class = "",
            bootstrap_class = "",
            bootstrap_btn = "",
            bootstrap_hero_unit = "",

            name_pattern = fm_options.name_pattern === "" ? "" : "pattern=\"" + fm_options.name_pattern + "\"",

            name_required = fm_options.name_required ? "required" : "",
            email_required = fm_options.email_required ? "required" : "",
            message_required = fm_options.message_required ? "required" : "",
            radio_button_list_required = fm_options.radio_button_list_required ? "required" : "",

            name_asterisk  = fm_options.name_required && fm_options.show_asterisk_for_required ? "<span class=\"required_asterisk\">*</span>" : "",
            email_asterisk  = fm_options.email_required && fm_options.show_asterisk_for_required ? "<span class=\"required_asterisk\">*</span>" : "",
            message_asterisk  = fm_options.message_required && fm_options.show_asterisk_for_required ? "<span class=\"required_asterisk\">*</span>" : "",
            radio_button_list_asterisk = fm_options.radio_button_list_required && fm_options.show_asterisk_for_required ? "<span class=\"required_asterisk\">*</span>" : "";

        if (fm_options.bootstrap === true) {
            bootstrap_class = " fm_bootstrap ";
            bootstrap_btn = " btn btn-primary ";
            bootstrap_hero_unit = " hero-unit ";

            fm_class = "";
            jquery_class = "";
        }

        if (fm_options.jQueryUI === true) {
            jquery_class = " fm_jquery ";
            jQueryUIClasses1 = " ui-widget-header ui-corner-all ui-helper-clearfix ";
            jQueryUIClasses2 = " ui-dialog ui-widget ui-widget-content ui-corner-all ";
            jQueryUIClasses3 = " ui-dialog-titlebar ";
            jQueryUIClasses4 = " ui-dialog-title ";

            fm_class = "";
            bootstrap_class = "";
            bootstrap_hero_unit = "";
            bootstrap_btn = "";

        }

        if (fm_options.show_radio_button_list === true) {
            radio_button_list_html = "<li><div class=\"radio_button_list_title_wrapper\"><div class=\"radio_button_list_title\">" + fm_options.radio_button_list_title + radio_button_list_asterisk + "</div></div><div class=\"radio_button_list_wrapper\">";
            radio_button_list_html += "    <div class=\"radio_button_wrapper\">";
            radio_button_list_html += "        <input value=\"1\" type=\"radio\" name=\"feedback_radio\" class=\"feedback_radio_1\" " + radio_button_list_required + "\/>";
            radio_button_list_html += "        <label for=\"feedback_radio_1\">" + fm_options.radio_button_list_labels[0] + "<\/label>";
            radio_button_list_html += "    <\/div>";
            radio_button_list_html += "    <div class=\"radio_button_wrapper\">";
            radio_button_list_html += "        <input value=\"2\" type=\"radio\" name=\"feedback_radio\" class=\"feedback_radio_2\"\/>";
            radio_button_list_html += "        <label for=\"feedback_radio_2\">" + fm_options.radio_button_list_labels[1] + "<\/label>";
            radio_button_list_html += "    <\/div>";
            radio_button_list_html += "    <div class=\"radio_button_wrapper\">";
            radio_button_list_html += "        <input value=\"3\" type=\"radio\" name=\"feedback_radio\" class=\"feedback_radio_3\"\/>";
            radio_button_list_html += "        <label for=\"feedback_radio_3\">" + fm_options.radio_button_list_labels[2] + "<\/label>";
            radio_button_list_html += "    <\/div>";
            radio_button_list_html += "    <div class=\"radio_button_wrapper\">";
            radio_button_list_html += "        <input value=\"4\" type=\"radio\" name=\"feedback_radio\" class=\"feedback_radio_4\"\/>";
            radio_button_list_html += "        <label for=\"feedback_radio_4\">" + fm_options.radio_button_list_labels[3] + "<\/label>";
            radio_button_list_html += "    <\/div>";
            radio_button_list_html += "    <div class=\"radio_button_wrapper\">";
            radio_button_list_html += "        <input value=\"5\" type=\"radio\" name=\"feedback_radio\" class=\"feedback_radio_5\"\/>";
            radio_button_list_html += "        <label for=\"feedback_radio_5\">" + fm_options.radio_button_list_labels[4] + "<\/label>";
            radio_button_list_html += "    <\/div>";
            radio_button_list_html += "<\/div></li>";

            radio_button_list_class = " radio_button_list_present";
        }

        if (fm_options.show_email === true) {
            email_html = '<li>  <label for="feedback_email">' + fm_options.email_label + '</label> ' + email_asterisk + ' <input type="email" class="feedback_email" ' + email_required + ' placeholder="' + fm_options.email_placeholder + '"></input> </li>';
            email_feedback_content_class = " email_present";
        }

        if (fm_options.show_form === true) {
            form_html = '<form class="feedback_me_form" id="feedbackForm" name="feedbackForm">'
            	+'<label id="sucmsg" style="color:green !important;text-align:center;font-size: medium;margin-left: 12px;display:none;">Feedback successfully sent</label>'
            	+'<label id="failmsg" style="color:red !important;text-align:center;font-size: medium;margin-left: 12px;display:none">Some data is not filled properly. Please verify the data.</label>'
                +   '<ul>'
                +    	 '<li> <input type="hidden" id="fb_screen_nm" value="" name="fb_screen_nm" /> </li>'
                +       '<li> <label class="feedbacklbl" for="feedback_name" id="feedbacklbl">' + fm_options.radio_label + '</label> ' + name_asterisk +  '</li>'
                
                +       '<li style="display:inline"> <input type="radio" id="feedback_yes" name="feedback-radio" value="yes" class="" onclick="showDiv();" /> &nbsp; <label class="feedbacklbl" for="feedback_yes"> ' + fm_options.radio_label_yes + '  </label> ' + name_asterisk + '   </li>'      
                                                                                                                                                 
                +       '<li style="display:inline"> <input type="radio"  id="feedback_no" name="feedback-radio" value="no" class="" onclick="showDiv();"/> &nbsp; <label class="feedbacklbl" for="feedback_no"> ' + fm_options.radio_label_no + ' </label> ' + name_asterisk + ' </li>'
                
                +       '<li style="display:inline"> <input type="radio" id="feedback_yesBut" name="feedback-radio" value="yesBut" class="" onclick="showDiv();"/> &nbsp; <label class="feedbacklbl" for="feedback_yesBut">' + fm_options.radio_label_yes_but + ' </label> ' + name_asterisk + ' </li>'
                
                +       '<li style="margin-top: 1px;"><textarea rows="4" cols="50" maxlength="2000" id="message" name="message" class="feedback_message" ' + ' placeholder="' + fm_options.message_placeholder + '"></textarea> </li>'
				
				+        '<li> <span class="msg_alert" for="message_alert" id="msg_alert">' + fm_options.message_alert + '</span> </li>'
                    
                +       '<li > <label for="feedback_captcha"> </label> <div id="GoReCaptcha"></div> </li>'
                +       '<li style="text-align:center;margin-top:10px;">   <input type="button" style="font-size:small" id="submit" value="'+ fm_options.submit_label +'" onclick="if(CmnRecaptchaFlag === 1 && CmnRecaptchaFlag_FeedBack == 1){myFeedBackSubmit(event,\'' + fm_options.position + '\');}else{fm.sendFeedback(event,\'' + fm_options.position + '\');}" class="feedback_submit ' + bootstrap_btn + '"> </li>'
                +        '<li style="text-align:center;"><span id="err_msg" style="color:#C00;font-size:small;"></span></li>'
                        
                +   '</ul>'
                +   '</form>';
        }
        if (fm_options.iframe_url !== undefined) {
            iframe_html = '<iframe name="feedback_me_frame" class="feedback_me_frame" frameborder="0" src="' + fm_options.iframe_url + '"></iframe>';
        }

        $('body').append('<div onclick="fm.stopPropagation(event);fm.triggerAction(event,\'' + fm_options.position + '\');" class="feedback_trigger feedbackTrExt feedback_trigger_closed ' + fm_options.position + jQueryUIClasses1 + fm_class + jquery_class + bootstrap_class + bootstrap_hero_unit + '">'
                +   '<span class="feedback_trigger_text">' + fm_options.trigger_label
                +   '</span></div>');

        $('body').append('<div class="feedback_content feedbackCont feedback_content_closed ' + fm_options.position + email_feedback_content_class + radio_button_list_class + jQueryUIClasses2 + fm_class + jquery_class + bootstrap_class + bootstrap_hero_unit + '">'
                            + '<div class="feedback_title feedbackHead ' + jQueryUIClasses1 + jQueryUIClasses3 + '">'
                            +   '<span class="' + jQueryUIClasses4 + '">' + fm_options.title_label + '</span>'
                            + '<div id="clsbtn" onclick="fm.stopPropagation(event);fm.triggerAction(event,\'' + fm_options.position + '\');" class="close_div' + fm_options.position + jQueryUIClasses1 + fm_class + jquery_class + bootstrap_class + bootstrap_hero_unit + '">' 
                            +   '<label class="close_text"style="float: right;padding: 1px 6px;background-color: #E66A6A;margin-top: -25px;color: white;border-radius: 2px;">X</label></div>'
                            + '</div>'
                            +  form_html
                            +  iframe_html 
                            +  fm_options.custom_html
                        + '</div>');

        /*if (fm_options.jQueryUI === true) {
            $('.feedback_submit').button({
                icons: {
                    primary: 'ui-icon-mail-closed'
                }
            });
        }*/

        if (fm_options.close_on_click_outside === true) {
            applyCloseOnClickOutside();
        }

        //prevent form submit (needed for validation)
        $('.feedback_me_form').submit(function (event) {
            var valid=true;
            valid=validateInput();
            if(valid==true)
            {
                event.preventDefault();
            }
        });
    }
        function stopPropagation(evt) {
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }

    function slideBack(fm_options, $fm_trigger, $fm_content) {
        var animation_hide = {};
        animation_hide.marginLeft = "-=380px";
        /*if (fm_options.position.indexOf("right-") !== -1) {
            animation_hide.marginRight = "-=380px";
        }*/

        if (supportsTransitions === true) {
            $fm_trigger.addClass("feedback_trigger_closed");
            $fm_content.addClass("feedback_content_closed");
        } else {
            $fm_trigger.add($fm_content).animate(
                animation_hide,
                150,
                function () {
                    $fm_trigger.addClass("feedback_trigger_closed");
                }
            );
        }
    }
    function clearInputs(event) {
        event = eventTargetFixUp(event);
        var $fm_content = $(event.target).closest(".feedback_content");
        $fm_content.find(".feedback_name").val("");
        $('#res').val("");
        if($("meta[name='_frmHomePage']").attr("content")=="from_home" && ValidateAndSubmit()==true)
        {
        	grecaptcha.reset(feedBack);
        	//document.getElementById("gRecaptchaResponseHome").value='';
        	$("#message").attr("style","display:none");
        	$("#msg_alert").attr("style","display:none");
            return true;
        }
		$("#message").attr("style","display:none");
    	$("#msg_alert").attr("style","display:none");
        $fm_content.find(".feedback_message").val("");
        $fm_content.find(".feedback_email").val("");
        $fm_content.find(".feedback_me_form input[name=feedback_radio]").prop('checked', false);
    }

    function sendFeedback(event, position) {
        var checkValid = checkRequiredFieldsOk(event, position),
            form_valid = validateFeedbackForm(event, position),
            checkPattern = checkPatternFieldsOk(event, position),
            dataArray,
            $fm_trigger,
            $fm_content,
            fm_options = getFmOptions(event, position);
        event = eventTargetFixUp(event);
        if (checkValid === false || checkPattern === false ||form_valid === false) {
            stopPropagation(event);
            return;
        }
        if($("meta[name='_frmHomePage']").attr("content")!="from_home")
        {
        	if($("#menuCode").val() === undefined)
        	{
        		document.getElementById("fb_screen_nm").value = "";
        	}
        	else
        	{
        		document.getElementById("fb_screen_nm").value =$("#menuCode").val();
        	}
        }
        
        $fm_content = $(event.target).closest(".feedback_content");
        $fm_trigger = $(event.target).closest(".feedback_content").prev();

        if (fm_options.delayed_close === true) {
            $fm_content.find('.feedback_submit').text(fm_options.delayed_options.sending);
        }
        
		var recaptchaValue = "";
        if(document.getElementById("gRecaptchaResponseHome") != null)
        	{
        	recaptchaValue = document.getElementById("gRecaptchaResponseHome").value;
        	}
			
        dataArray = {
            name: $fm_content.find(".feedback_name").val(),
            message: $fm_content.find(".feedback_message").val(),
            email: $fm_content.find(".feedback_email").val(),
            radio_list_value: $fm_content.find(".feedback_me_form input[name=feedback-radio]:checked").val(),
            radio_value_ud: $('input[name="feedback-radio"]:checked', '.feedback_me_form').val(),
            cke_gresponse:recaptchaValue,
            menuCode:document.getElementById("fb_screen_nm").value
        };
  
        dataArray = $.extend(fm_options.custom_params, dataArray);
        var token = $("meta[name='_csrf']").attr("content");
        var url = fm_options.feedback_url;
        var URL = url+"&_csrf="+token;
        $.ajax({
            type: 'POST',
            url: URL,
            data: dataArray,
            dataType : 'xml',
            beforeSend: function (xhr) {
                if ($.ajaxSettings.hasOwnProperty('beforeSend')) {
                    $.ajaxSettings.beforeSend();
                }
                if (fm_options.delayed_close === false) {
                    slideBack(fm_options, $fm_trigger, $fm_content);
                }
            },
            success: function (data, textStatus, XmlHttpRequest) {
            	var response = $(data).text();
            	if(response=="success")
            		{
            			$('#sucmsg').css('display','');
            			setTimeout(function() {$('#sucmsg').css('display','none');}, 5000);
            		}else if(response=="fail"){
            			$('#failmsg').css('display','');
            			setTimeout(function() {$('#failmsg').css('display','none');}, 5000);
            		}
            	
            	$('input[name="feedback-radio"]').attr('checked', false);
                $('#err_msg').text("");
                $('#message').val("");  
               /* $('#res').text("");
                grecaptcha.reset();*/
                fm.clearInputs(event);
                if (fm_options.delayed_close === true) {
                    if (fm_options.delayed_options.custom_html_success === undefined) {
                        if (fm_options.delayed_options.success_color !== undefined) {
                            st = ' style="background-color:' + fm_options.delayxed_options.success_color + '" ';
                        }
                        $fm_content.find('.feedback_submit').text(fm_options.submit_label);
                        setTimeout(function () {var animation_hide = {}; animation_hide.marginLeft = "-=380px";
                            /*if (fm_options.position.indexOf("right-") !== -1) {
                                animation_hide.marginRight = "-=380px";
                            }*/

                            if (supportsTransitions === true) {
                                $fm_trigger.addClass("feedback_trigger_closed");
                                $fm_content.addClass("feedback_content_closed");
                            } else {
                                $fm_trigger.add($fm_content).animate(
                                    animation_hide,
                                    150,
                                    function () {
                                        $fm_trigger.addClass("feedback_trigger_closed");
                                    }
                                );
                            }
                         }, 5000);
                        
                        setTimeout(function () {$(".feedback-delayed-dlg").fadeOut(function () { $(this).remove(); }); }, fm_options.delayed_options.delay_success_milliseconds);
                    } else {
                        $fm_content.find('.feedback_submit').text(fm_options.submit_label);
                       slideBack(fm_options, $fm_trigger, $fm_content);
                        $("body").append('<div class="feedback-delayed-custom-dlg success" onclick="fm.stopPropagation(event);">' + fm_options.delayed_options.custom_html_success + '</div>');
                        setTimeout(function () {$(".feedback-delayed-custom-dlg").fadeOut(function () { $(this).remove(); }); }, fm_options.delayed_options.delay_success_milliseconds);
                    }
                }
            },
            error: function (ob, errStr) {
				if(errStr === "parsererror")
            		{
            			$('#failmsg').css('display','');
            			setTimeout(function() {$('#failmsg').css('display','none');}, 5000);
            		}
            	$('input[name="feedback-radio"]').attr('checked', false);
                $('#err_msg').text("");
                $('#message').val("");
            	fm.clearInputs(event);
                if (fm_options.delayed_close === true) {
                    if (fm_options.delayed_options.custom_html_fail === undefined) {
                        if (fm_options.delayed_options.fail_color !== undefined) {
                            st = ' style="background-color:' + fm_options.delayed_options.fail_color + '" ';
                        }
                        $fm_content.find('.feedback_submit').text(fm_options.submit_label);
                        setTimeout(function () { var animation_hide = {}; animation_hide.marginLeft = "-=380px";
                            /*if (fm_options.position.indexOf("right-") !== -1) {
                                animation_hide.marginRight = "-=380px";
                            }*/

                            if (supportsTransitions === true) {
                                $fm_trigger.addClass("feedback_trigger_closed");
                                $fm_content.addClass("feedback_content_closed");
                            } else {
                                $fm_trigger.add($fm_content).animate(
                                    animation_hide,
                                    150,
                                    function () {
                                        $fm_trigger.addClass("feedback_trigger_closed");
                                    }
                                );
                            }
                         }, 5000);
                        
                        setTimeout(function () {$(".feedback-delayed-dlg").fadeOut(function () { $(this).remove(); }); }, fm_options.delayed_options.delay_success_milliseconds);
                } else {
                    console.log("Failed to send feedback (please double check your feedback_url parameter)");
                }
			   }
            }
        });
        
    }
    function closeFeedbackDelayedDlg() {
        $(".feedback-delayed-dlg").fadeOut();
    }

    function detectTransitionSupport() {
        var be = document.body || document.documentElement,
            style = be.style,
            p = 'transition',
            vendors,
            i;
        if (typeof style[p] === 'string') {
            supportsTransitions = true;
            return;
        }

        vendors = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (i = 0; i < vendors.length; i++) {
            if (typeof style[vendors[i] + p] === 'string') {
                supportsTransitions = true;
                return;
            }
        }
        supportsTransitions = false;
        return;
    }
    

    function init(options) {

        var default_options = {
            feedback_url : "",
            position : "left-top",
            jQueryUI : false,
            bootstrap : false,
            show_email : false,
            show_radio_button_list : false,
            close_on_click_outside: true,
            name_label : "Name",
            radio_label :"Was this page helpful in finding what you need?",
            email_label : "Email",
            radio_label_yes : "Yes",
            radio_label_no : "No",
            radio_label_yes_but : "Yes, but",
            message_label : "Message",
            radio_button_list_labels : ["1", "2", "3", "4", "5"],
            radio_button_list_title : "How would you rate my site?",
            name_placeholder : "",
            email_placeholder : "",
            message_placeholder : "Your comments...",
			message_alert : "(Max. 2000 characters)",
            name_pattern : "",
            name_required : false,
            email_required : false,
            message_required : false,
            radio_button_list_required : false,
            show_asterisk_for_required : false,
            submit_label : "Send",
            title_label : "Website Feedback",
            trigger_label : "Website Feedback",
            custom_params : {},
            iframe_url : undefined,
            show_form: true,
            custom_html : "",
            delayed_close : true,
            delayed_options : {
                delay_success_milliseconds : 2000,
                delay_fail_milliseconds : 2000,
                sending : "Sending...",
                send_fail : "Sending failed.",
                fail_color : undefined,
                success_color : undefined,
                custom_html_success: undefined,
                custom_html_fail: undefined
            }
        },
            tmp_options,
            tmp_delayed_options;

        tmp_delayed_options = $.extend(default_options.delayed_options, options.delayed_options);

        tmp_options = $.extend(default_options, options);
        tmp_options.delayed_options = tmp_delayed_options;

        fm_options_arr[tmp_options.position] = tmp_options;

        appendFeedbackToBody(tmp_options);

        detectTransitionSupport(tmp_options);
    }

    return {
        init : init,
        sendFeedback : sendFeedback,
        getFmOptions : getFmOptions,
        triggerAction : triggerAction,
        stopPropagation : stopPropagation,
        clearInputs : clearInputs,
        closeFeedbackDelayedDlg : closeFeedbackDelayedDlg
    };

}(jQuery));


function showDiv()
{   
    var value = $("input[type='radio'][name='feedback-radio']:checked").val();
    if (value == 'yes')
    {
        $("#label").attr("style","display:none");
        $("#message").attr("style","display:none");
		$("#msg_alert").attr("style","display:none");
    }
    else if (value == 'no')
    {
        $("#label").attr("style","display:block");
        $("#message").attr("style","display:block");
		$("#msg_alert").attr("style","display:block ");
    }
    else if (value == 'yesBut')
    {
        $("#label").attr("style","display:block");
        $("#message").attr("style","display:block");
		$("#msg_alert").attr("style","display:block");
    }
}

var verifyCallback = function(response) {
    document.getElementById("gRecaptchaResponseHome").value=response;
    };
    

function validateInput(){
    flag=true;
    if ($('input[name="feedback-radio"]:checked', '.feedback_me_form').val()== ('no') || $('input[name="feedback-radio"]:checked', '.feedback_me_form').val()== ('yesBut') || $('input[name="feedback-radio"]:checked', '.feedback_me_form').val()== ('yes'))
    {
        if ($('input[name="feedback-radio"]:checked', '.feedback_me_form').val()== ('no') || $('input[name="feedback-radio"]:checked', '.feedback_me_form').val()== ('yesBut'))
         {
            if ($.trim($('#message').val()).length > 0)
            {
                flag = true;
            }
            else
                {
                    alert('Please provide your feedback');
                    $("#message").focus();
                    flag = false;
                }               
         }
        
        return flag;
    }
}
var feedBackCaptcha=false;
var CmnRecaptchaFlag = '';
var CmnRecaptchaFlag_FeedBack = '';
//var CmnRecaptchaFlag = document.getElementById('CmnRecaptchaFlag').value;
//var CmnRecaptchaFlag_FeedBack = document.getElementById('CmnRecaptchaFlag_FeedBack').value;

if(CmnRecaptchaFlag == 1 && CmnRecaptchaFlag_FeedBack == 1){
	function verifyFeedBackCaptcha(event, position)
	{
		if(feedBackCaptcha==true){
			
			//fm.stopPropagation(event);
			fm.sendFeedback(event, position);
		}
		/*else{
			//alert("Fail");
			//setTimeout(verifyFeedBackCaptcha(event,position),1000);
			setInterval(function(){ verifyFeedBackCaptcha }, 3000);
		}*/
	}
}

/*jQuery.noConflict();*/
/*added by jignesh joshi (895721) for common feedback end*/